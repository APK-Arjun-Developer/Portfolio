export type SectionType = 'heading' | 'subheading' | 'paragraph' | 'code' | 'list' | 'callout';

export interface ArticleSection {
  type: SectionType;
  content?: string;
  language?: string;
  items?: string[];
}

export interface Article {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  tags: string[];
  excerpt: string;
  sections: ArticleSection[];
}

export const articles: Article[] = [
  {
    slug: 'multi-tenant-architecture-aspnet-core',
    title: 'Multi-Tenant Architecture in ASP.NET Core',
    date: 'June 2026',
    readTime: '8 min read',
    tags: ['ASP.NET Core', 'Architecture', 'SaaS', 'EF Core'],
    excerpt:
      'How to design a clean multi-tenant system with per-tenant database isolation using EF Core global query filters and middleware-based tenant resolution.',
    sections: [
      {
        type: 'paragraph',
        content:
          'Every SaaS application eventually faces the same question: how do you serve multiple customers from a single codebase while keeping their data completely isolated? The wrong answer — discovered too late — is "we\'ll add a TenantId column everywhere and filter manually." This post walks through the approach I used: middleware-resolved tenant context flowing through EF Core global query filters.',
      },
      {
        type: 'heading',
        content: 'Three Isolation Strategies',
      },
      {
        type: 'list',
        items: [
          'Separate database per tenant — strongest isolation, highest cost. Each tenant gets their own SQL Server database. Simple to reason about, expensive to operate at scale.',
          'Shared database, separate schema — medium isolation. Each tenant gets their own set of tables within one database. Complicates migrations significantly.',
          'Shared database, shared schema with TenantId — lowest cost, highest risk. All tenants share tables; every query must filter by TenantId. One missing WHERE clause leaks all tenant data.',
        ],
      },
      {
        type: 'paragraph',
        content:
          'I chose a hybrid: separate connection strings per tenant resolved at runtime, with EF Core global query filters as an additional safety net. This gives you hard database-level isolation without the operational overhead of fully separate SQL Server instances.',
      },
      {
        type: 'heading',
        content: 'Step 1 — The Tenant Context',
      },
      {
        type: 'paragraph',
        content:
          'First, define an interface that represents the current tenant within a request scope. Keeping it as an interface makes it trivially mockable in tests.',
      },
      {
        type: 'code',
        language: 'csharp',
        content: `public interface ITenantContext
{
    string TenantId { get; }
    string ConnectionString { get; }
    bool IsResolved { get; }
}

public sealed class TenantContext : ITenantContext
{
    public string TenantId { get; private set; } = string.Empty;
    public string ConnectionString { get; private set; } = string.Empty;
    public bool IsResolved { get; private set; }

    public void Resolve(string tenantId, string connectionString)
    {
        TenantId = tenantId;
        ConnectionString = connectionString;
        IsResolved = true;
    }
}`,
      },
      {
        type: 'heading',
        content: 'Step 2 — The Middleware',
      },
      {
        type: 'paragraph',
        content:
          'Middleware runs before any controller or service touches the request. We resolve the tenant here — from the subdomain, with a header fallback for local development — then populate ITenantContext so every downstream service can read it from DI.',
      },
      {
        type: 'code',
        language: 'csharp',
        content: `public class TenantMiddleware(
    RequestDelegate next,
    ITenantStore tenantStore)
{
    public async Task InvokeAsync(HttpContext context, TenantContext tenantContext)
    {
        var slug = ResolveSlug(context);

        if (string.IsNullOrEmpty(slug))
        {
            context.Response.StatusCode = 400;
            await context.Response.WriteAsync("Tenant could not be resolved.");
            return;
        }

        var tenant = await tenantStore.GetBySlugAsync(slug);
        if (tenant is null)
        {
            context.Response.StatusCode = 404;
            await context.Response.WriteAsync($"Tenant '{slug}' not found.");
            return;
        }

        tenantContext.Resolve(tenant.Id, tenant.ConnectionString);
        await next(context);
    }

    private static string? ResolveSlug(HttpContext context)
    {
        // Try subdomain first: tenant-a.yoursaas.com -> "tenant-a"
        var host = context.Request.Host.Host;
        var parts = host.Split('.');
        if (parts.Length >= 3) return parts[0];

        // Fallback: X-Tenant-ID header (useful for local dev / Postman)
        return context.Request.Headers["X-Tenant-ID"].FirstOrDefault();
    }
}`,
      },
      {
        type: 'heading',
        content: 'Step 3 — The DbContext',
      },
      {
        type: 'paragraph',
        content:
          'The DbContext reads the connection string from ITenantContext. It also registers a global query filter on every entity that implements ITenantEntity — so even if a developer forgets to add a WHERE clause, EF Core adds it automatically.',
      },
      {
        type: 'code',
        language: 'csharp',
        content: `public class AppDbContext(
    ITenantContext tenantContext,
    DbContextOptions<AppDbContext> options) : DbContext(options)
{
    protected override void OnConfiguring(DbContextOptionsBuilder builder)
    {
        if (!builder.IsConfigured)
            builder.UseSqlServer(tenantContext.ConnectionString);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Apply global query filter to every entity that is tenant-aware
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(ITenantEntity).IsAssignableFrom(entityType.ClrType))
            {
                var tenantId = tenantContext.TenantId;
                modelBuilder.Entity(entityType.ClrType)
                    .HasQueryFilter(e =>
                        EF.Property<string>(e, "TenantId") == tenantId);
            }
        }
    }
}`,
      },
      {
        type: 'heading',
        content: 'Step 4 — DI Registration',
      },
      {
        type: 'code',
        language: 'csharp',
        content: `builder.Services.AddScoped<TenantContext>();
builder.Services.AddScoped<ITenantContext>(sp => sp.GetRequiredService<TenantContext>());
builder.Services.AddDbContext<AppDbContext>(options => { /* no connection string here */ });

// In the middleware pipeline — must be early, before auth
app.UseMiddleware<TenantMiddleware>();
app.UseAuthentication();
app.UseAuthorization();`,
      },
      {
        type: 'callout',
        content:
          'Key insight: TenantContext is registered as Scoped, which means one instance per HTTP request. The middleware calls Resolve() on it early; every downstream service reads the same already-resolved instance. This is why a static or ThreadLocal context would break under async — Scoped DI handles the async context propagation correctly.',
      },
      {
        type: 'heading',
        content: 'Handling Migrations',
      },
      {
        type: 'paragraph',
        content:
          'With per-tenant databases, you cannot run dotnet ef database update once. You need a migration service that iterates every registered tenant and applies pending migrations at startup — protected by a distributed lock to prevent concurrent runs in a scaled deployment.',
      },
      {
        type: 'code',
        language: 'csharp',
        content: `public class MigrationService(
    ITenantStore tenantStore,
    IServiceScopeFactory scopeFactory,
    ILogger<MigrationService> logger) : IHostedService
{
    public async Task StartAsync(CancellationToken ct)
    {
        var tenants = await tenantStore.GetAllAsync(ct);

        foreach (var tenant in tenants)
        {
            using var scope = scopeFactory.CreateScope();
            var ctx = scope.ServiceProvider.GetRequiredService<TenantContext>();
            ctx.Resolve(tenant.Id, tenant.ConnectionString);

            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            await db.Database.MigrateAsync(ct);

            logger.LogInformation("Migrated tenant {TenantId}", tenant.Id);
        }
    }

    public Task StopAsync(CancellationToken ct) => Task.CompletedTask;
}`,
      },
      {
        type: 'heading',
        content: 'Key Takeaways',
      },
      {
        type: 'list',
        items: [
          'Resolve tenant identity in middleware — before any business logic runs. Never pass TenantId as a method parameter through your domain layer.',
          'EF Core global query filters are your safety net. Even if a query is written without a tenant filter, the global filter applies automatically.',
          'Use a Scoped DI service for tenant context — it propagates correctly through async code. Static or ThreadLocal storage does not.',
          'Separate connection strings give you hard database-level isolation. The additional cost of separate databases is often worth the security guarantee.',
          'Automate migrations across tenants with a hosted service at startup, protected by a distributed lock in multi-instance deployments.',
        ],
      },
    ],
  },

  {
    slug: 'rbac-implementation-guide',
    title: 'RBAC Implementation Guide: Beyond Simple Roles',
    date: 'June 2026',
    readTime: '7 min read',
    tags: ['ASP.NET Core', 'Security', 'Authorization', 'RBAC'],
    excerpt:
      'Building a fully dynamic permission system that supports resource-level access control without hardcoding roles into your codebase.',
    sections: [
      {
        type: 'paragraph',
        content:
          'Most applications start with a simple role check: [Authorize(Roles = "Admin")]. It works for day one. Then the business asks: "Can editors publish but not delete?" Now you need Admin, Editor, and Viewer roles — each with a different subset of the same operations. The roles proliferate, the if/else checks multiply, and you deploy a code change every time permissions need adjusting. There\'s a better model.',
      },
      {
        type: 'heading',
        content: 'The Permission Model',
      },
      {
        type: 'paragraph',
        content:
          'Instead of hardcoded roles, model permissions as (Resource, Action) pairs stored in the database. A Role is just a named collection of permissions. This means new resource types and new actions require zero code changes — only a database row.',
      },
      {
        type: 'code',
        language: 'csharp',
        content: `// Permissions are data, not enum values
public class Permission
{
    public int Id { get; set; }
    public string Resource { get; set; } = string.Empty;  // "Invoice"
    public string Action   { get; set; } = string.Empty;  // "Delete"
}

public class Role
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int? ParentRoleId { get; set; }  // for hierarchy
    public Role? ParentRole { get; set; }
    public ICollection<Permission> Permissions { get; set; } = [];
}

public class UserRole
{
    public string UserId { get; set; } = string.Empty;
    public int RoleId { get; set; }
}`,
      },
      {
        type: 'heading',
        content: 'The Authorization Handler',
      },
      {
        type: 'paragraph',
        content:
          'ASP.NET Core\'s policy system is the right integration point. Define a requirement that carries the resource and action strings, then implement IAuthorizationHandler to evaluate it. The handler reads the user\'s resolved permission set from cache and checks membership.',
      },
      {
        type: 'code',
        language: 'csharp',
        content: `public record PermissionRequirement(string Resource, string Action)
    : IAuthorizationRequirement;

public class PermissionAuthorizationHandler(
    IPermissionService permissionService,
    IAuditLogger auditLogger)
    : AuthorizationHandler<PermissionRequirement>
{
    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        PermissionRequirement requirement)
    {
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null) return;

        var permissions = await permissionService.GetForUserAsync(userId);
        var granted = permissions.Contains((requirement.Resource, requirement.Action));

        await auditLogger.LogAsync(userId, requirement.Resource,
            requirement.Action, granted);

        if (granted)
            context.Succeed(requirement);
        else
            context.Fail();
    }
}`,
      },
      {
        type: 'heading',
        content: 'Permission Caching',
      },
      {
        type: 'paragraph',
        content:
          'Authorization runs on every request. Hitting the database every time is too slow. Cache the resolved permission set per user — and evict explicitly on role change, not just on TTL expiry. Waiting 5 minutes after revoking access is a security gap you do not want.',
      },
      {
        type: 'code',
        language: 'csharp',
        content: `public class PermissionService(
    AppDbContext db,
    IMemoryCache cache) : IPermissionService
{
    private static string CacheKey(string userId) => $"perms:{userId}";

    public async Task<HashSet<(string Resource, string Action)>> GetForUserAsync(
        string userId)
    {
        if (cache.TryGetValue(CacheKey(userId), out HashSet<(string, string)>? cached))
            return cached!;

        // Resolve: walk role hierarchy, union all permissions
        var permissions = await db.UserRoles
            .Where(ur => ur.UserId == userId)
            .SelectMany(ur => GetRoleWithAncestors(ur.RoleId))
            .SelectMany(r => r.Permissions)
            .Select(p => (p.Resource, p.Action))
            .Distinct()
            .ToHashSetAsync();

        cache.Set(CacheKey(userId), permissions,
            TimeSpan.FromMinutes(5));

        return permissions;
    }

    // Call this after any role assignment change
    public void InvalidateUser(string userId) =>
        cache.Remove(CacheKey(userId));
}`,
      },
      {
        type: 'heading',
        content: 'Registering Policies at Startup',
      },
      {
        type: 'paragraph',
        content:
          'You can register all known policies at startup, or use a dynamic policy provider to create them on demand. The dynamic approach means you never need to update Program.cs when a new resource type is added.',
      },
      {
        type: 'code',
        language: 'csharp',
        content: `// Dynamic policy provider — creates any "Resource:Action" policy on demand
public class PermissionPolicyProvider(IOptions<AuthorizationOptions> options)
    : IAuthorizationPolicyProvider
{
    private readonly DefaultAuthorizationPolicyProvider _fallback = new(options);

    public Task<AuthorizationPolicy?> GetPolicyAsync(string policyName)
    {
        var parts = policyName.Split(':');
        if (parts.Length == 2)
        {
            var policy = new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .AddRequirements(new PermissionRequirement(parts[0], parts[1]))
                .Build();
            return Task.FromResult<AuthorizationPolicy?>(policy);
        }
        return _fallback.GetPolicyAsync(policyName);
    }

    public Task<AuthorizationPolicy> GetDefaultPolicyAsync() =>
        _fallback.GetDefaultPolicyAsync();

    public Task<AuthorizationPolicy?> GetFallbackPolicyAsync() =>
        _fallback.GetFallbackPolicyAsync();
}

// Usage on a controller action — no code change needed for new resources
[Authorize(Policy = "Invoice:Delete")]
public IActionResult DeleteInvoice(int id) { ... }`,
      },
      {
        type: 'callout',
        content:
          'The dynamic policy provider is the key piece that makes this system zero-maintenance. Any string in the form "Resource:Action" becomes a valid policy automatically — no registration required. New resource types ship with only the data migration, not a code change.',
      },
      {
        type: 'heading',
        content: 'Role Hierarchy',
      },
      {
        type: 'paragraph',
        content:
          'If roles form a hierarchy (SuperAdmin inherits Admin inherits Editor), resolve the full ancestor chain before computing permissions. Run a cycle check on save to prevent circular graphs.',
      },
      {
        type: 'code',
        language: 'csharp',
        content: `private IEnumerable<Role> GetRoleWithAncestors(int roleId)
{
    var visited = new HashSet<int>();
    var queue = new Queue<int>();
    queue.Enqueue(roleId);

    while (queue.Count > 0)
    {
        var id = queue.Dequeue();
        if (!visited.Add(id)) continue;  // cycle guard

        var role = db.Roles
            .Include(r => r.Permissions)
            .FirstOrDefault(r => r.Id == id);

        if (role is null) continue;
        yield return role;

        if (role.ParentRoleId.HasValue)
            queue.Enqueue(role.ParentRoleId.Value);
    }
}`,
      },
      {
        type: 'heading',
        content: 'Key Takeaways',
      },
      {
        type: 'list',
        items: [
          'Model permissions as (Resource, Action) string pairs in the database — not as C# enum values. New permissions require no code deploy.',
          'Use ASP.NET Core\'s IAuthorizationHandler and IAuthorizationPolicyProvider for clean integration. Business logic stays free of permission checks.',
          'Cache the resolved permission set per user as a HashSet. O(1) lookups, 5-minute TTL, explicit eviction on role change.',
          'Separate role hierarchy resolution from permission lookup. Flatten the ancestor tree at cache-fill time so the hot path is a single HashSet.Contains().',
          'Always audit both grants and denials. Denied access events are often more valuable for security monitoring than successful ones.',
        ],
      },
    ],
  },

  {
    slug: 'building-dynamic-forms-react-json-schema',
    title: 'Building Dynamic Forms with React and JSON Schema',
    date: 'June 2026',
    readTime: '6 min read',
    tags: ['React', 'TypeScript', 'NPM', 'Open Source'],
    excerpt:
      'How I built and published a zero-boilerplate form generation package on NPM — design decisions, bundle optimization, and the escape-hatch renderer API.',
    sections: [
      {
        type: 'paragraph',
        content:
          'Enterprise applications render a lot of forms. Registration forms, settings panels, admin dashboards, filter drawers. Most of them have the same structure: fetch a config, render inputs, validate on change, submit. Writing this by hand for each form is repetitive, error-prone, and — worst of all — produces slightly inconsistent UX across the application. I built a package to eliminate the boilerplate entirely.',
      },
      {
        type: 'heading',
        content: 'The Schema Design',
      },
      {
        type: 'paragraph',
        content:
          'The schema is a plain JSON object — serializable, storable in a database, returnable from an API. Each field has a name, type, optional validation rules, and an optional visibleWhen condition.',
      },
      {
        type: 'code',
        language: 'typescript',
        content: `interface FieldSchema {
  name: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox';
  label?: string;
  required?: boolean;
  options?: string[];               // for select fields
  visibleWhen?: {                   // conditional visibility
    field: string;
    eq: unknown;
  };
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;               // regex string
    min?: number;
    max?: number;
  };
}

interface FormSchema {
  fields: FieldSchema[];
}`,
      },
      {
        type: 'heading',
        content: 'The Form State Hook',
      },
      {
        type: 'paragraph',
        content:
          'All form state lives in a single hook. It tracks values, errors, and which fields have been touched. Validation runs per-field on change and across all fields on submit. The hook returns everything the renderer needs.',
      },
      {
        type: 'code',
        language: 'typescript',
        content: `function useFormState(schema: FormSchema) {
  const [values, setValues]  = useState<Record<string, unknown>>({});
  const [errors, setErrors]  = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (field: FieldSchema, value: unknown): string => {
    if (field.required && !value) return \`\${field.label ?? field.name} is required\`;
    if (field.validation?.minLength && typeof value === 'string'
        && value.length < field.validation.minLength)
      return \`Minimum \${field.validation.minLength} characters\`;
    if (field.validation?.pattern && typeof value === 'string'
        && !new RegExp(field.validation.pattern).test(value))
      return 'Invalid format';
    return '';
  };

  const handleChange = (name: string, value: unknown) => {
    const field = schema.fields.find(f => f.name === name)!;
    setValues(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: validateField(field, value) }));
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    for (const field of schema.fields) {
      const err = validateField(field, values[field.name]);
      if (err) newErrors[field.name] = err;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { values, errors, touched, handleChange, validate };
}`,
      },
      {
        type: 'heading',
        content: 'The Renderer Lookup',
      },
      {
        type: 'paragraph',
        content:
          'The key design decision is the renderer lookup order. We check for a consumer-supplied override by field name first, then by field type, then fall back to the built-in default. This means you can override a single specific field without affecting all fields of that type.',
      },
      {
        type: 'code',
        language: 'typescript',
        content: `interface SchemaFormProps {
  schema: FormSchema;
  onSubmit: (values: Record<string, unknown>) => void;
  renderers?: Record<string, ComponentType<FieldRendererProps>>;
}

export function SchemaForm({ schema, onSubmit, renderers = {} }: SchemaFormProps) {
  const { values, errors, touched, handleChange, validate } = useFormState(schema);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(values);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {schema.fields.map(field => {
        // Conditional visibility
        if (field.visibleWhen) {
          const { field: depField, eq } = field.visibleWhen;
          if (values[depField] !== eq) return null;
        }

        // Renderer lookup: name override → type override → built-in default
        const Renderer =
          renderers[field.name] ??
          renderers[field.type] ??
          builtInRenderers[field.type] ??
          DefaultTextField;

        return (
          <FieldWrapper
            key={field.name}
            label={field.label ?? field.name}
            required={field.required}
            error={touched[field.name] ? errors[field.name] : ''}
          >
            <Renderer
              schema={field}
              value={values[field.name] ?? ''}
              onChange={(val) => handleChange(field.name, val)}
              error={touched[field.name] ? errors[field.name] : ''}
            />
          </FieldWrapper>
        );
      })}
      <Button type="submit" variant="contained">Submit</Button>
    </Box>
  );
}`,
      },
      {
        type: 'callout',
        content:
          'FieldWrapper owns label rendering, required asterisk, and error message display. Any custom renderer the consumer plugs in gets all of this for free — it only needs to render the input itself and call onChange. This prevents custom renderers from silently skipping error display.',
      },
      {
        type: 'heading',
        content: 'Publishing to NPM — Bundle Size',
      },
      {
        type: 'paragraph',
        content:
          'The biggest mistake a component library can make is bundling React and MUI. Consumers already have these — bundling them again creates version conflicts and inflates the package size. Vite library mode + peerDependencies solves this.',
      },
      {
        type: 'code',
        language: 'typescript',
        content: `// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [react(), dts({ include: ['src'] })],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // Never bundle these — the consumer provides them
      external: ['react', 'react-dom', '@mui/material', '@emotion/react', '@emotion/styled'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});`,
      },
      {
        type: 'code',
        language: 'json',
        content: `// package.json — peerDependencies tell npm what the consumer must provide
{
  "peerDependencies": {
    "react": ">=18",
    "@mui/material": ">=5"
  },
  "devDependencies": {
    "react": "^18.0.0",
    "@mui/material": "^6.0.0"
  },
  "main":   "./dist/index.cjs",
  "module": "./dist/index.js",
  "types":  "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  }
}`,
      },
      {
        type: 'heading',
        content: 'Consumer Usage',
      },
      {
        type: 'code',
        language: 'typescript',
        content: `import { SchemaForm } from 'mui-schema-form-builder';

const schema = {
  fields: [
    { name: 'email',    type: 'email',    required: true },
    { name: 'role',     type: 'select',   options: ['admin', 'user'] },
    { name: 'bio',      type: 'textarea',
      visibleWhen: { field: 'role', eq: 'admin' } },
  ],
};

// Override just the email field with a custom component
function MyForm() {
  return (
    <SchemaForm
      schema={schema}
      onSubmit={(values) => api.save(values)}
      renderers={{ email: MyEmailWithAvatar }}
    />
  );
}`,
      },
      {
        type: 'heading',
        content: 'Key Takeaways',
      },
      {
        type: 'list',
        items: [
          'Keep schema as plain JSON — storable in a database, returnable from an API, version-controllable. No JSX in the schema.',
          'Use peerDependencies for React and MUI. Never bundle framework code — it causes version conflicts and doubles the install size.',
          'Renderer lookup by field name then field type gives consumers two levels of customization without breaking the schema contract.',
          'Validation must live outside renderers. If renderers own validation, a custom renderer can silently bypass it.',
          'FieldWrapper centralizes label, required mark, and error display. Custom renderers get this for free — they only handle input rendering.',
        ],
      },
    ],
  },
];
