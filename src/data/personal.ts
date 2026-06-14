export const personal = {
  name: 'Arjun P',
  role: 'Full Stack Developer',
  email: 'arjun.p@techbumbles.com',
  github: 'https://github.com/APK-Arjun-Developer',
  linkedin: 'https://www.linkedin.com/in/arjun-prakash-full-stack-developer',
  resumeUrl: '/resume.pdf',
  formspreeId: 'xqeogbbw',
  available: true,
  summary:
    'Full Stack Developer with experience building scalable web and mobile applications using React, Node.js, and .NET Core. Passionate about clean architecture, multi-role SaaS platforms, and end-to-end product delivery.',
};

export const skills = {
  backend: ['Node.js', '.NET Core', 'C#', 'REST APIs'],
  frontend: ['React', 'React Native', 'JavaScript', 'HTML', 'CSS'],
  databases: ['PostgreSQL', 'MySQL', 'MongoDB', 'SQLite', 'SQL Server'],
  tools: ['Git'],
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
  category?: 'personal' | 'company';
  role?: string;
  companyName?: string;
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
    github: 'https://github.com/APK-Arjun-Developer/MultiTenantPlatform',
    demo: 'https://multi-tenant-api.runasp.net',
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
    github: 'https://github.com/APK-Arjun-Developer/AeroFuelHub.Web',
    demo: 'https://aerofuelhub.runasp.net',
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
    github: 'https://github.com/APK-Arjun-Developer/mui-schema-form-builder',
    npm: 'https://www.npmjs.com/package/mui-schema-form-builder',
    demo: 'https://apk-arjun-developer.github.io/mui-schema-form-builder',
  },
  {
    id: 'runzo',
    title: 'Runzo – Food Delivery & Catering',
    tagline: 'Multi-role food delivery platform with a live rider bidding system',
    description:
      'A comprehensive food delivery management app supporting customers, restaurants, and delivery riders. Riders bid on delivery jobs with their own price; customers accept or reject offers in real time, creating a competitive and transparent delivery marketplace.',
    overview:
      'Most food delivery apps assign riders automatically — Runzo flips that model. Riders see available orders and submit bids with their offered price. Customers compare bids and pick the rider they want. This required a real-time event pipeline to push bid events instantly across all parties and a reliable state machine to prevent double-acceptance of bids.',
    features: [
      'Multi-role platform: customers, restaurants, and delivery riders',
      'Live rider bidding — riders set delivery price, customers accept or reject',
      'Real-time order and bid status updates across all roles',
      'Restaurant menu management and order orchestration',
      'Catering and bulk order booking support',
    ],
    techStack: ['React', 'Node.js', '.NET Core', 'PostgreSQL'],
    challenges: [
      {
        problem: 'Bid events needed to reach all parties instantly without manual refresh.',
        solution: 'Used WebSocket connections scoped per order so all active participants — customer, restaurant, and bidding riders — receive live push updates as bid state changes.',
      },
      {
        problem: 'Multiple riders could accept the same order simultaneously, causing duplicate assignments.',
        solution: 'Implemented a database-level bid state machine with optimistic locking so only the first accepted bid transitions to CONFIRMED; subsequent accepts are rejected atomically.',
      },
    ],
    architecture: {
      diagram: `
  Customer / Restaurant / Rider (React)
           │
           │  REST + WebSocket
           ▼
  ┌─────────────────────────┐
  │    Node.js API Gateway  │
  │  + .NET Core Services   │
  └────────────┬────────────┘
               │
  ┌────────────▼────────────┐
  │   PostgreSQL Database   │
  │  Orders / Bids / Users  │
  └─────────────────────────┘`,
      explanation:
        'The Node.js gateway handles WebSocket connections and routes REST calls to .NET Core service modules. PostgreSQL stores orders, bids, and user profiles. The bid state machine lives in the .NET Core layer and enforces atomic transitions, while the Node.js layer fans out WebSocket events to all connected clients on each state change.',
    },
    github: '',
    demo: null,
    category: 'company',
    role: 'Full Stack Developer',
    companyName: 'Techbumbles Software Solutions',
  },
  {
    id: 'dr-carrot',
    title: 'Dr.Carrot – Hospital Management SaaS',
    tagline: 'Role-based hospital platform for appointments, records, and billing',
    description:
      'A responsive hospital management SaaS with dedicated dashboards for hospitals, doctors, receptionists, and patients. Centralises appointments, medical records, prescriptions, billing, and queue management in one platform.',
    overview:
      'Hospital workflows span multiple roles with very different information needs — a receptionist managing walk-in queues has nothing in common with a doctor reviewing prescriptions. Dr.Carrot delivers a unified data model with role-aware frontend views, so every user sees exactly what they need without seeing what they should not.',
    features: [
      'Role-based dashboards for hospitals, doctors, receptionists, and patients',
      'Appointment scheduling and real-time queue management',
      'Medical records, prescriptions, and billing in one platform',
      'Responsive layout optimised for desktop and tablet use at reception desks',
      'REST API integration across all modules for consistent data flow',
    ],
    techStack: ['React.js', 'JavaScript', 'HTML', 'CSS', 'REST APIs'],
    challenges: [
      {
        problem: 'Four distinct roles needed completely different views of the same underlying data without duplicating component logic.',
        solution: 'Built a role-aware layout layer that injects role-specific dashboard configurations into a shared component set, keeping UI logic DRY while delivering a tailored experience per role.',
      },
      {
        problem: 'Queue status had to stay current across all receptionist and doctor screens without requiring manual refresh.',
        solution: 'Implemented a polling strategy with optimistic UI updates — the frontend applies expected state changes immediately and reconciles with the server response, keeping visible latency near zero.',
      },
    ],
    architecture: {
      diagram: `
  Patient / Doctor / Receptionist / Admin
           │  (React SPA — role-aware routing)
           │
           │  REST API
           ▼
  ┌─────────────────────────┐
  │     Backend API Layer   │
  └────────────┬────────────┘
               │
  ┌────────────▼────────────┐
  │        Database         │
  │ Appointments / Records  │
  │ Billing / Prescriptions │
  └─────────────────────────┘`,
      explanation:
        'A single React SPA serves all roles. On login, the role claim from the API determines which layout and route set the user receives. All data flows through a shared REST API; the frontend never bypasses it to read data directly. Polling keeps queue and appointment states in sync across concurrent sessions.',
    },
    github: '',
    demo: null,
    category: 'company',
    role: 'Frontend Developer',
    companyName: 'Techbumbles Software Solutions',
  },
  {
    id: 'autohive',
    title: 'AutoHive – Parking Management SaaS',
    tagline: 'Multi-role parking operations with real-time slot monitoring and billing',
    description:
      'A full-stack parking management SaaS for users, operators, and admins. Handles vehicle entry/exit tracking, slot allocation, automated billing by vehicle type and duration, and live monitoring across multiple parking facilities.',
    overview:
      'Managing a parking facility involves real-time coordination across physical entry/exit points, billing, and capacity monitoring. AutoHive digitises this end-to-end — from the moment a vehicle enters to the moment it pays and leaves — and gives operators a live dashboard to track every slot across every facility they manage.',
    features: [
      'Multi-role access: users, operators, and admins with separate dashboards',
      'Real-time parking slot availability and vehicle entry/exit tracking',
      'Automated billing based on vehicle type and duration',
      'Admin dashboard for cross-facility monitoring and reporting',
      'Slot pre-booking and reservation management',
    ],
    techStack: ['React', 'Node.js', '.NET Core', 'MySQL'],
    challenges: [
      {
        problem: 'Concurrent booking requests for the same slot from different users could result in double-allocation.',
        solution: 'Applied pessimistic row-level locking on slot records during the reservation transaction so concurrent requests are serialised at the database level, not the application layer.',
      },
      {
        problem: 'Operators needed live visibility into entry/exit events without polling the page manually.',
        solution: 'Used server-sent events to push vehicle entry/exit updates directly to the operator console as they occur, keeping the live feed current with no browser refresh.',
      },
    ],
    architecture: {
      diagram: `
  Users / Operators / Admins (React)
           │
           │  REST + SSE
           ▼
  ┌─────────────────────────┐
  │   Node.js + .NET Core   │
  │   Entry/Exit / Billing  │
  │   Slot Allocation API   │
  └────────────┬────────────┘
               │
  ┌────────────▼────────────┐
  │     MySQL Database      │
  │ Slots / Vehicles /      │
  │ Bookings / Payments     │
  └─────────────────────────┘`,
      explanation:
        'Node.js handles the real-time SSE connections and fast event routing; .NET Core services own the business logic for slot allocation, billing calculations, and cross-facility reporting. MySQL stores all operational data. Pessimistic locks on slot rows ensure allocation integrity under concurrent load.',
    },
    github: '',
    demo: null,
    category: 'company',
    role: 'Full Stack Developer',
    companyName: 'PM Square Soft Services',
  },
];
