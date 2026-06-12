export const personal = {
  name: 'Arjun P',
  role: 'Full Stack Developer',
  email: 'arjun.p@techbumbles.com',
  github: 'https://github.com/arjunp',
  linkedin: 'https://linkedin.com/in/arjunp',
  resumeUrl: '/resume.pdf',
  // Get a free endpoint at formspree.io → New Form → copy the ID here
  // Leave empty to fall back to a mailto: link
  formspreeId: '',
  available: true,
  summary:
    'Full Stack Developer specializing in ASP.NET Core, React, and scalable cloud-ready architectures. Passionate about multi-tenant systems, clean code, and developer tooling.',
};

export const skills = {
  backend: ['ASP.NET Core', 'Entity Framework Core', 'SQL Server', 'REST APIs', 'SignalR'],
  frontend: ['React', 'TypeScript', 'Material UI', 'Vite', 'Redux'],
  architecture: ['Multi-Tenant Systems', 'RBAC', 'Clean Architecture', 'Microservices'],
  devops: ['Docker', 'GitHub Actions', 'Azure', 'Vercel'],
};

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  overview: string;
  features: string[];
  techStack: string[];
  challenges: { problem: string; solution: string }[];
  architecture: { diagram: string; explanation: string };
  github: string;
  npm?: string;
  demo: string | null;
}

export const projects: Project[] = [
  {
    id: 'multi-tenant-api',
    title: 'Multi-Tenant ASP.NET Core API',
    tagline: 'Scalable SaaS backend with full tenant isolation',
    description:
      'A production-ready multi-tenant API built with ASP.NET Core featuring per-tenant database isolation, JWT authentication, and a clean domain-driven architecture.',
    overview:
      'SaaS applications need to serve multiple customers (tenants) from a single codebase while keeping their data completely isolated. Naïve implementations either use one database per tenant (expensive) or a shared schema with tenant IDs (risky if filters are missed). This project implements a clean middle ground: middleware-resolved tenant context flowing through a scoped EF Core DbContext with global query filters, so no business logic ever touches raw tenant IDs.',
    features: [
      'Per-tenant database isolation via connection string switching',
      'JWT + Refresh token authentication with sliding expiry',
      'Tenant-aware middleware pipeline resolving from subdomain or header',
      'EF Core global query filters — zero chance of cross-tenant data leaks',
      'Swagger UI with per-tenant Bearer token support',
      'Clean Architecture: Domain / Application / Infrastructure / API layers',
    ],
    techStack: ['ASP.NET Core 8', 'Entity Framework Core 8', 'SQL Server', 'JWT', 'Docker', 'Swagger / OpenAPI'],
    challenges: [
      {
        problem: 'Tenant resolution must happen before any DbContext is created, but ASP.NET Core DI creates scoped services lazily.',
        solution: 'Implemented a TenantMiddleware that resolves the tenant early in the pipeline and stores it in a singleton-backed ITenantContext, which the DbContext reads from its constructor.',
      },
      {
        problem: 'Global query filters added to every entity — but some admin endpoints need to query across tenants.',
        solution: 'Used a per-request ITenantFilter flag that disables global filters inside admin-scoped operations, exposed only through internal service interfaces not accessible to normal controllers.',
      },
      {
        problem: 'Running migrations for multiple tenant databases without downtime.',
        solution: 'Built a MigrationService that iterates registered tenants and applies pending migrations in sequence during app startup, with a distributed lock to prevent concurrent runs in scaled deployments.',
      },
    ],
    architecture: {
      diagram: `
┌──────────────────────────────────────────────────────────┐
│                     Client Request                        │
│           Host: tenant-a.yoursaas.com/api/...            │
└───────────────────────────┬──────────────────────────────┘
                            │
                ┌───────────▼────────────┐
                │    TenantMiddleware    │
                │  resolves slug from    │
                │  subdomain or header   │
                └───────────┬────────────┘
                            │
                ┌───────────▼────────────┐
                │     TenantContext      │  (scoped)
                │   TenantId = "a"       │
                │   ConnectionString     │
                └───────────┬────────────┘
                            │
           ┌────────────────┼────────────────┐
           │                │                │
  ┌────────▼───────┐ ┌──────▼──────┐ ┌──────▼──────┐
  │  AuthService   │ │ AppDbContext │ │  Domain     │
  │  JWT + Refresh │ │ GlobalFilter │ │  Services   │
  └────────────────┘ │ WHERE        │ └─────────────┘
                     │ TenantId='a' │
                     └──────┬───────┘
                            │
              ┌─────────────▼─────────────┐
              │   Tenant A — SQL Server   │
              └───────────────────────────┘`,
      explanation:
        'The TenantMiddleware runs first in the pipeline, resolves the tenant from the subdomain (or X-Tenant-ID header as fallback), and populates a scoped ITenantContext. The AppDbContext reads the connection string and applies a global query filter from that context, so every query is automatically tenant-scoped. Auth, domain services, and repositories all operate within the same scope — tenant identity flows through DI, never through method parameters.',
    },
    github: 'https://github.com/arjunp/multi-tenant-api',
    demo: null,
  },
  {
    id: 'rbac-mvc',
    title: 'RBAC ASP.NET Core MVC Application',
    tagline: 'Fine-grained role and permission management',
    description:
      'An ASP.NET Core MVC app implementing a fully dynamic Role-Based Access Control system with resource-level permissions, role hierarchy, and audit logging.',
    overview:
      'Most apps start with simple role checks ("is admin?") that quickly become unmaintainable. When the business asks "can this user edit invoices but not delete them?" — hardcoded roles break down. This project implements a fully dynamic RBAC system where roles and permissions are data, not code. Any resource-action pair can be defined at runtime, roles can be assigned to users, and all authorization decisions are policy-driven through ASP.NET Core\'s IAuthorizationHandler.',
    features: [
      'Dynamic role and permission management via admin dashboard',
      'Resource-level permission checks (e.g. Invoice:Read, Invoice:Delete)',
      'Policy-based authorization using custom IAuthorizationHandler',
      'Permission caching per user with role-change invalidation',
      'Full audit log of access grants and denials',
      'Role hierarchy — child roles inherit parent permissions',
    ],
    techStack: ['ASP.NET Core MVC 8', 'Entity Framework Core', 'SQL Server', 'IMemoryCache', 'Bootstrap 5'],
    challenges: [
      {
        problem: 'Authorization checks happen on every request, hitting the database for permission lookups would be too slow.',
        solution: 'Cached the resolved permission set per user (keyed by UserId) in IMemoryCache with a 5-minute TTL. On role assignment or removal, the affected user\'s cache entry is explicitly evicted.',
      },
      {
        problem: 'Designing a permission schema flexible enough to support any future resource type without schema migrations.',
        solution: 'Modelled permissions as (Resource: string, Action: string) pairs stored in a Permissions table. New resource types are just new rows — no code changes required.',
      },
      {
        problem: 'Role hierarchy: child roles should inherit parent permissions but the inheritance must not create circular graphs.',
        solution: 'On role save, a depth-first cycle check runs before committing. Permission resolution walks the ancestry tree and unions all permission sets.',
      },
    ],
    architecture: {
      diagram: `
  HTTP Request
       │
       ▼
[AuthenticationMiddleware]
       │  JWT validated → ClaimsPrincipal set
       ▼
[AuthorizationMiddleware]
       │
       │  [Authorize(Policy = "Invoice:Edit")]
       ▼
[PermissionAuthorizationHandler]
       │
       ├─── Read from IMemoryCache
       │       ├── HIT  → set of (Resource,Action)
       │       └── MISS → query DB (UserRoles → RolePermissions)
       │                  → cache result for 5 min
       │
       ├── Does set contain "Invoice:Edit"?
       │       ├── YES → context.Succeed()  → Controller runs
       │       └── NO  → context.Fail()     → 403 Forbidden
       │
       ▼
[AuditLogger]  (ActionFilter)
  logs: user, resource, action, allow/deny, timestamp`,
      explanation:
        'Authorization policies are registered at startup as "Resource:Action" strings. On each request the PermissionAuthorizationHandler reads the user\'s resolved permission set from cache (falling back to the DB on miss), checks membership, and either succeeds or fails the context. An ActionFilter writes an audit record after the authorization decision regardless of outcome.',
    },
    github: 'https://github.com/arjunp/rbac-mvc',
    demo: null,
  },
  {
    id: 'schema-form-builder',
    title: 'React MUI Schema Form Builder',
    tagline: 'NPM package: JSON schema → production-ready forms',
    description:
      'A published NPM package that converts JSON schema definitions into fully validated, accessible Material UI forms — zero boilerplate for the consumer.',
    overview:
      'Enterprise apps often render dozens of similar forms that share the same structure: fetch a config from an API, render fields, validate, submit. Doing this by hand for each form is repetitive and error-prone. This package lets you describe a form in JSON and get a fully validated, accessible MUI form with one component. The escape-hatch custom renderer API means you are never locked in — any field can be overridden without touching the schema.',
    features: [
      'JSON schema definition → MUI form with zero boilerplate',
      'Built-in field-level validation with inline error messages',
      'Conditional field visibility based on other field values',
      'Custom renderer injection per field type or field name',
      'TypeScript-first: full type inference on schema and form values',
      'Peer-dep only: ships no MUI or React, uses yours',
    ],
    techStack: ['React 18', 'TypeScript 5', 'Material UI v6', 'Vite (library mode)', 'NPM', 'Vitest'],
    challenges: [
      {
        problem: 'Bundle size: the package must not ship its own MUI or React, but it still needs type safety against them.',
        solution: 'Declared @mui/material and react as peerDependencies and devDependencies only. Vite library mode externalizes them at build time. Published bundle is < 12 KB gzipped.',
      },
      {
        problem: 'Custom renderers need to override a field without breaking the schema contract or losing validation.',
        solution: 'Designed a FieldRendererContext that passes the raw schema field, current value, onChange, and error state to any custom renderer. The renderer is responsible for display only — validation still runs against the schema.',
      },
      {
        problem: 'Conditional visibility ("show field B only when field A equals X") requires reactive evaluation on every value change.',
        solution: 'Each field\'s "visibleWhen" is evaluated by a pure function against the current form values object on every render. No subscriptions or side effects — React re-renders propagate visibility changes naturally.',
      },
    ],
    architecture: {
      diagram: `
Consumer code
─────────────────────────────────────────
  const schema = {
    fields: [
      { name: "email",    type: "email",
        required: true },
      { name: "role",     type: "select",
        options: ["admin","user"] },
      { name: "bio",      type: "textarea",
        visibleWhen: { field:"role", eq:"admin" } },
    ]
  };

  <SchemaForm
    schema={schema}
    onSubmit={(values) => save(values)}
    renderers={{ email: MyEmailInput }}
  />

─────────────────────────────────────────
Package internals
─────────────────────────────────────────
  SchemaForm
    │
    ├── useFormState(schema)
    │     ├── values: Record<string, unknown>
    │     ├── errors: Record<string, string>
    │     └── validate() → runs per-field rules
    │
    └── schema.fields.map(field =>
          ├── evalVisibility(field, values) → show/hide
          ├── renderers[field.type] ?? DefaultField
          └── <FieldWrapper error={errors[field.name]}>
                <FieldComponent ... />
              </FieldWrapper>
        )`,
      explanation:
        'SchemaForm owns all state via a single useFormState hook. On each field change it re-evaluates visibility rules and re-validates. The renderer lookup checks the consumer-supplied renderers map first, then falls back to built-in field components. FieldWrapper owns error display so custom renderers get error handling for free.',
    },
    github: 'https://github.com/arjunp/mui-schema-form-builder',
    npm: 'https://www.npmjs.com/package/mui-schema-form-builder',
    demo: null,
  },
];
