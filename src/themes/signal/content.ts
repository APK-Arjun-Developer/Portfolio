import { getYearsExperience } from '../../data/personal';
import type { HeadlinePart } from './components/SplitHeadline';

/*
 * Presentation copy for the Signal theme. Facts are restated from src/data/personal.ts —
 * nothing here introduces new claims.
 */

export const headline: HeadlinePart[] = [
  { text: 'I build SaaS platforms where every tenant sees' },
  { text: 'only its own data.', accent: true },
];

export const heroFacts = [
  { value: getYearsExperience(), label: 'Years Experience' },
  { value: '2', label: 'Companies' },
  { value: '1', label: 'NPM Package' },
];

export const skillGroups: { title: string; summary: string; items: string[] }[] = [
  {
    title: 'Frontend engineering',
    summary: 'Typed React apps, permission-driven UI, reusable components.',
    items: [
      'React',
      'TypeScript',
      'Redux Toolkit / RTK Query',
      'React Router',
      'MUI',
      'React Hook Form + Zod',
    ],
  },
  {
    title: 'Backend & APIs',
    summary: 'REST APIs with authentication, RBAC and multi-tenancy.',
    items: ['ASP.NET Core', '.NET', 'Node.js', 'REST APIs', 'JWT auth', 'ASP.NET Core Identity'],
  },
  {
    title: 'Data & persistence',
    summary: 'Relational modelling, query filters, migrations.',
    items: ['Entity Framework Core', 'SQL Server', 'PostgreSQL', 'MySQL', 'SQLite'],
  },
  {
    title: 'Architecture, tooling & delivery',
    summary: 'Layered architecture, packaging and CI/CD.',
    items: [
      'Clean / layered architecture',
      'npm package publishing (tsup)',
      'Vitest',
      'Storybook',
      'CI/CD',
      'Git',
    ],
  },
];

export interface Flow {
  caption: string;
  nodes: string[];
  /** Index of the node that carries the project's key idea. */
  focus: number;
}

/** Simplified request / data flow per project, drawn from each case study's own text. */
export const flows: Record<string, Flow> = {
  'multi-tenant-api': {
    caption: 'Request path',
    nodes: [
      'JWT · user_id, tenant_id, role_id',
      'TenantMiddleware',
      'PermissionService · cached',
      'EF Core global query filter',
      'SQL Server',
    ],
    focus: 3,
  },
  'multi-tenant-app': {
    caption: 'Permission-driven UI',
    nodes: [
      'GET /auth/me → permissions',
      'PermissionGuard · usePermission()',
      'RTK Query base query',
      'X-Tenant-Id · mutex refresh on 401',
      '.NET 10 API',
    ],
    focus: 3,
  },
  aerofuelhub: {
    caption: 'Role-scoped reads',
    nodes: [
      'ASP.NET Core Identity role',
      'FuelTransactionService scoped query',
      'Soft-delete query filter',
      'SQL Server',
      'QuestPDF invoice · ClosedXML export',
    ],
    focus: 1,
  },
  'schema-form-builder': {
    caption: 'Schema to form',
    nodes: [
      'FieldConfig[] + Zod schema',
      'FormBuilder',
      'Field registry · registerFieldType()',
      'Memoised MUI fields',
      'Typed onSubmit',
    ],
    focus: 2,
  },
  'food-delivery': {
    caption: 'Bid lifecycle',
    nodes: [
      'Customer · Restaurant · Rider',
      'WebSocket per order',
      'Bid state machine',
      'PostgreSQL',
    ],
    focus: 2,
  },
  'dr-carrot': {
    caption: 'Role-aware views',
    nodes: [
      'Hospital · Doctor · Receptionist · Patient',
      'Role dashboard config',
      'Shared component set',
      'REST APIs',
    ],
    focus: 1,
  },
  autohive: {
    caption: 'Slot lifecycle',
    nodes: [
      'Vehicle entry / exit',
      'Slot reservation · row lock',
      'Server-sent events',
      'Operator console',
    ],
    focus: 1,
  },
};
