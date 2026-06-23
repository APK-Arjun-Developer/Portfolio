export const personal = {
  name: 'Arjun Prakash',
  role: 'Full Stack Developer',
  email: 'apkarjundeveloper@gmail.com',
  github: 'https://github.com/APK-Arjun-Developer',
  linkedin: 'https://www.linkedin.com/in/arjun-prakash-full-stack-developer',
  resumeUrl: '/resume.pdf',
  summary:
    'Full Stack Developer with experience building scalable web applications using React, Node.js, and .NET Core. Passionate about clean architecture, multi-role SaaS platforms, and end-to-end product delivery.',
};

export const skills = {
  backend: ['Node.js', '.NET Core', 'REST APIs'],
  frontend: ['React', 'JavaScript', 'HTML', 'CSS'],
  databases: ['PostgreSQL', 'MySQL', 'SQL Server', 'SQLite'],
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
      'A production-ready multi-tenant SaaS API built with ASP.NET Core on .NET 10, featuring shared-database tenant isolation via EF Core global query filters, JWT authentication with per-request permission checks, and a clean Domain/Application/Infrastructure/API architecture.',
    overview:
      "SaaS applications need to serve multiple customers (tenants) from a single codebase while keeping their data completely isolated. A naive shared-schema approach — a TenantId column filtered manually in every query — is risky: one missed `.Where(x => x.TenantId == id)` and tenant A can read tenant B's data. This project closes that gap by resolving the tenant from the caller's JWT on every request and enforcing it through EF Core global query filters applied to every tenant-scoped entity, so isolation is structural rather than something a developer has to remember.",
    features: [
      'Shared-database multi-tenancy enforced by EF Core global query filters — every tenant-scoped entity is filtered by the JWT tenant claim automatically, with no per-query filtering code to forget',
      'JWT access + refresh tokens (HttpOnly cookie or Bearer), with permissions checked fresh on every request — revoking a role takes effect immediately instead of waiting for the token to expire',
      'Granular, data-driven RBAC: PascalCase Resource.Action permissions (e.g. Products.Create), System vs Tenant-scoped roles, cached per-role with TTL invalidation',
      'Token-based onboarding & invitation flow — transactional tenant + admin user creation, self-service password reset, and account setup via hashed single-use tokens',
      'Resilient email delivery: MailKit SMTP client wrapped in Polly retry policies, 7 responsive HTML templates, dedicated SMTP health check',
      'Production hardening: rate-limited auth endpoints, security headers, CORS allow-listing, and CI/CD that auto-bumps the semantic version and deploys via FTPS with a post-deploy health-check smoke test',
    ],
    techStack: [
      '.NET 10',
      'ASP.NET Core',
      'Entity Framework Core 10',
      'SQL Server',
      'JWT',
      'Serilog',
      'MailKit + Polly',
      'Swagger / OpenAPI',
    ],
    challenges: [
      {
        problem:
          'Tenant filtering needed to be impossible to forget — a single missed TenantId filter would leak data across tenants.',
        solution:
          'Built a generic EF Core global query filter, applied via reflection to every entity implementing ITenantEntity + IAuditableEntity at model-build time, sourced from a scoped ICurrentTenantService populated from the JWT tenant_id claim by TenantMiddleware — isolation lives in one place, not in every query.',
      },
      {
        problem:
          'Baking permissions into the JWT would make them stale: revoking a role would not take effect until the token expired, and the token would balloon as permission sets grew.',
        solution:
          "Kept permissions out of the JWT entirely — it only carries user_id, tenant_id, and role_id(s). Every request resolves the caller's current permission set through a cached PermissionService (TTL-based, invalidated on role change), so access changes apply on the very next request.",
      },
      {
        problem:
          'One Identity schema needed to support both a system-level SuperAdmin (no tenant) and tenant-scoped admins/users without hardcoded role-name checks leaking into controllers.',
        solution:
          "Added a RoleScope enum (System vs Tenant) and ASP.NET Core authorization policies (SystemAdminOnly, TenantAdminOrAbove, AuthenticatedTenantUser) that assert on claims and scope instead of string role names, keeping the SuperAdmin's tenant_id = Guid.Empty sentinel contained to one place.",
      },
    ],
    github: 'https://github.com/APK-Arjun-Developer/MultiTenantPlatform',
    demo: 'https://multi-tenant-api.runasp.net',
  },
  {
    id: 'aerofuelhub',
    title: 'AeroFuel Hub',
    tagline: 'Aviation fuel operations platform with role-scoped data access',
    description:
      'An ASP.NET Core MVC application for managing aviation fuel transactions end-to-end — role-based dashboards for admins, airlines, fuel suppliers, and ground coordinators, with PDF invoicing and Excel reporting built in.',
    overview:
      "An aviation fuel transaction touches four very different stakeholders: an admin who needs the full picture, the airline being billed, the fuel company supplying it, and the airport coordinator handling it on the ground. Most apps would solve this with separate views or tables per stakeholder; AeroFuel Hub keeps a single FuelTransaction table and ApplicationUser model, and scopes every read through one service-layer query built from the caller's ASP.NET Core Identity role and the airline/fuel-company/airport linked to their account — so each dashboard, history list, invoice, and export sees exactly its own slice of the data.",
    features: [
      'Role-based dashboards for Admin, AirlineExecutive, FuelSupplyExecutive, and FuelCoordinator, secured with ASP.NET Core Identity roles',
      "Fuel transaction lifecycle: create, paginated search/history, details, and soft-delete, all automatically scoped to the caller's airline, fuel company, or airport",
      'Per-transaction PDF invoice generation via QuestPDF, and Excel report export via ClosedXML',
      'Master data management for airlines, aircraft, airports, and fuel companies, with aircraft-to-airline ownership validation on transaction create',
      'Automatic EF Core migrations and seed data (roles, admin user, demo users per role, master data) on application startup for fast onboarding',
      'Soft-delete strategy for transactions via an EF Core global query filter, preserving DeletedAt/DeletedBy audit fields instead of hard-deleting records',
    ],
    techStack: [
      '.NET 10',
      'ASP.NET Core MVC',
      'Entity Framework Core 10',
      'SQL Server',
      'ASP.NET Core Identity',
      'QuestPDF',
      'ClosedXML',
      'Bootstrap 5 / AdminLTE',
    ],
    challenges: [
      {
        problem:
          "Four roles query the same FuelTransaction table but must only see their own slice — Admin sees everything, an AirlineExecutive only their airline's transactions, a FuelSupplyExecutive only their company's, a FuelCoordinator only their airport's.",
        solution:
          "Centralized the scoping in one place: FuelTransactionService.GetFilteredTransactionsQueryAsync reads the caller's roles and applies the matching filter (AirlineId / FuelCompanyId / AirportId, sourced from fields on ApplicationUser) before history, details, invoice, or export queries run — every read path goes through the same guarded entry point instead of repeating the filter logic.",
      },
      {
        problem:
          'Transaction numbers needed to be unique and human-readable, but concurrent creates could collide on the unique index under load.',
        solution:
          'Generated numbers as a timestamp plus random suffix (FT-yyyyMMddHHmmss-XXXXXX) and wrapped the insert in a retry loop (up to 3 attempts) that catches the DbUpdateException from a collision and regenerates, rather than relying on a database sequence.',
      },
      {
        problem:
          'Deleting a fuel transaction needed to be reversible and auditable — financial records should never simply disappear.',
        solution:
          'Modelled deletion as soft-delete: an EF Core global query filter (HasQueryFilter(x => !x.IsDeleted)) hides deleted rows from every query automatically, while IsDeleted/DeletedAt/DeletedBy fields keep the row and its audit trail intact in the database.',
      },
    ],
    github: 'https://github.com/APK-Arjun-Developer/AeroFuelHub.Web',
    demo: 'https://aerofuelhub.runasp.net',
  },
  {
    id: 'schema-form-builder',
    title: 'React MUI Schema Form Builder',
    tagline: 'NPM package: schema-driven, type-safe MUI forms with Zod + React Hook Form',
    description:
      'A published NPM package that turns a field-config array and a Zod schema into a fully validated, accessible Material UI form — typed end-to-end from schema to onSubmit, with no manual register calls.',
    overview:
      'Enterprise apps often render dozens of forms that share the same shape: define fields, validate, submit, repeat. This package replaces that boilerplate with one FormBuilder component driven by a FieldConfig array and a Zod schema (or any react-hook-form Resolver), so submit data is fully typed without writing a single register call by hand. Beyond the basics it covers the cases real forms hit in practice — conditional fields that do not cause sibling re-renders, debounced async autocomplete, array fields and multi-step wizards, a read-only display mode, and an extensible field registry for any input type the library does not ship out of the box.',
    features: [
      'Zero-boilerplate forms: one fields array plus one Zod schema produces a validated MUI form with no manual register calls',
      'Full type inference: onSubmit data is typed end-to-end from the Zod schema, or from a custom react-hook-form Resolver for other validators',
      'Conditional fields (visibleIf) that opt into form-state subscriptions individually — fields without a visibility rule never re-render when a sibling field changes',
      'Async autocomplete with built-in 300ms debounce and stale-response protection',
      'Extensible field registry via registerFieldType() — plug in any custom field type (e.g. MUI DatePicker as an optional peer dependency) without forking the library',
      'Array fields, field sections, a multi-step FormWizard, a read-only rendering mode, and overridable i18n labels',
      'Optional react-window virtualization for 50+ field forms; ships no MUI, React, or form library of its own — all are peer dependencies',
    ],
    techStack: [
      'React 18/19',
      'TypeScript 5.8',
      'Material UI (v5–v9)',
      'React Hook Form',
      'Zod',
      'tsup',
      'Vitest',
      'Storybook',
    ],
    challenges: [
      {
        problem:
          "The package must not ship its own MUI, React, or form libraries, yet still needs full type safety against them during development — and optional features like react-window or MUI's DatePicker shouldn't force every consumer to install them.",
        solution:
          'Declared @mui/material, react, react-hook-form, @hookform/resolvers, and zod as peerDependencies (mirrored as devDependencies for local builds and tests). The tsup build externalizes all of them, plus react-window and the MUI date-picker packages, which are optional peer dependencies only needed when those specific features are used.',
      },
      {
        problem:
          "Some consumers need a field type the library does not ship — most commonly a MUI DatePicker, which pulls in @mui/x-date-pickers as an extra dependency the library can't assume is installed.",
        solution:
          'Built a module-level field registry mapping a type string to a render component, exposed via registerFieldType(type, Component). Consumers call it once at startup to add their own renderer for any FieldConfig.type; the DatePicker type ships unregistered by default via a createDatePickerInput() factory, keeping the optional dependency opt-in rather than bundled.',
      },
      {
        problem:
          'Conditional visibility needs to re-evaluate on every relevant form value change without making every field in the form re-render whenever any sibling field changes.',
        solution:
          "Each field calls react-hook-form's useWatch with `disabled: !fieldConfig.visibleIf` — only fields that declare a visibleIf rule subscribe to form-wide value changes, and every field is wrapped in React.memo, so a 50-field form does not re-render in full on every keystroke.",
      },
    ],
    github: 'https://github.com/APK-Arjun-Developer/mui-schema-form-builder',
    npm: 'https://www.npmjs.com/package/mui-schema-form-builder',
    demo: 'https://apk-arjun-developer.github.io/mui-schema-form-builder',
  },
  {
    id: 'food-delivery',
    title: 'Food Delivery & Catering',
    tagline: 'Multi-role food delivery platform with a live rider bidding system',
    description:
      'A comprehensive food delivery management app supporting customers, restaurants, and delivery riders. Riders bid on delivery jobs with their own price; customers accept or reject offers in real time, creating a competitive and transparent delivery marketplace.',
    overview:
      'Most food delivery apps assign riders automatically — Flips that model. Riders see available orders and submit bids with their offered price. Customers compare bids and pick the rider they want. This required a real-time event pipeline to push bid events instantly across all parties and a reliable state machine to prevent double-acceptance of bids.',
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
        solution:
          'Used WebSocket connections scoped per order so all active participants — customer, restaurant, and bidding riders — receive live push updates as bid state changes.',
      },
      {
        problem:
          'Multiple riders could accept the same order simultaneously, causing duplicate assignments.',
        solution:
          'Implemented a database-level bid state machine with optimistic locking so only the first accepted bid transitions to CONFIRMED; subsequent accepts are rejected atomically.',
      },
    ],
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
        problem:
          'Four distinct roles needed completely different views of the same underlying data without duplicating component logic.',
        solution:
          'Built a role-aware layout layer that injects role-specific dashboard configurations into a shared component set, keeping UI logic DRY while delivering a tailored experience per role.',
      },
      {
        problem:
          'Queue status had to stay current across all receptionist and doctor screens without requiring manual refresh.',
        solution:
          'Implemented a polling strategy with optimistic UI updates — the frontend applies expected state changes immediately and reconciles with the server response, keeping visible latency near zero.',
      },
    ],
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
        problem:
          'Concurrent booking requests for the same slot from different users could result in double-allocation.',
        solution:
          'Applied pessimistic row-level locking on slot records during the reservation transaction so concurrent requests are serialised at the database level, not the application layer.',
      },
      {
        problem:
          'Operators needed live visibility into entry/exit events without polling the page manually.',
        solution:
          'Used server-sent events to push vehicle entry/exit updates directly to the operator console as they occur, keeping the live feed current with no browser refresh.',
      },
    ],
    github: '',
    demo: null,
    category: 'company',
    role: 'Full Stack Developer',
    companyName: 'PM Square Soft Services',
  },
];
