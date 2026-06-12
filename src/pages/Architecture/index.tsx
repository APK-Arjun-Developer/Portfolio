import { useState } from 'react';
import {
  Box, Grid, Paper, Typography, Stack, Dialog, DialogContent,
  IconButton, Chip, Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import FadeIn from '../../components/ui/FadeIn';
import SectionTitle from '../../components/ui/SectionTitle';

interface Diagram {
  id: string;
  title: string;
  tag: string;
  tagColor: string;
  summary: string;
  diagram: string;
  explanation: string;
  decisions: { label: string; rationale: string }[];
}

const diagrams: Diagram[] = [
  {
    id: 'multi-tenant',
    title: 'Multi-Tenant Architecture',
    tag: 'SaaS / Backend',
    tagColor: '#64ffda',
    summary:
      'Tenant resolution at the HTTP pipeline level. Per-tenant database isolation via EF Core global query filters and connection string switching — zero cross-tenant data leaks.',
    diagram: `
┌──────────────────────────────────────────────────────┐
│                    Client Request                     │
│           Host: tenant-a.yoursaas.com                │
└───────────────────────┬──────────────────────────────┘
                        │
            ┌───────────▼────────────┐
            │    TenantMiddleware    │  pipeline position: 1
            │  subdomain → slug      │
            │  header fallback       │
            └───────────┬────────────┘
                        │
            ┌───────────▼────────────┐
            │   ITenantContext       │  scoped service
            │   TenantId  = "a"      │
            │   ConnString = "..."   │
            └───────────┬────────────┘
                        │
         ┌──────────────┼──────────────┐
         │              │              │
┌────────▼────────┐  ┌──▼──────────┐  ┌▼──────────────┐
│  JwtMiddleware  │  │ AppDbContext │  │ Domain Layer  │
│  validates JWT  │  │ ─────────── │  │ no tenant IDs │
│  sets Principal │  │ GlobalFilter│  │ in signatures │
└─────────────────┘  │ WHERE       │  └───────────────┘
                     │ TenantId='a'│
                     └──────┬──────┘
                            │
              ┌─────────────▼──────────────┐
              │   Tenant A — SQL Server    │
              │   (isolated connection)    │
              └────────────────────────────┘`,
    explanation:
      'TenantMiddleware runs first, resolves the tenant from the subdomain (falling back to an X-Tenant-ID header), and populates a scoped ITenantContext. AppDbContext reads the connection string from that context and applies a global query filter on every entity — so no query can ever touch another tenant\'s rows. Domain services and repositories receive tenant identity through DI, never through method parameters, keeping the domain model clean.',
    decisions: [
      {
        label: 'Scoped ITenantContext over static/ambient context',
        rationale:
          'A static or ThreadLocal context breaks under async/await and parallel requests. A scoped DI service is request-safe and testable.',
      },
      {
        label: 'Global query filters over per-repository WHERE clauses',
        rationale:
          'Manual WHERE clauses in every repository are a forgotten-filter waiting to happen. Global filters are applied automatically by EF Core — impossible to skip accidentally.',
      },
      {
        label: 'Connection string switching over shared schema with TenantId column',
        rationale:
          'Shared schema is cheaper but one missing filter exposes all tenant data. Separate connections provide hard isolation at the database level.',
      },
    ],
  },
  {
    id: 'jwt-auth',
    title: 'JWT Authentication Flow',
    tag: 'Security / Auth',
    tagColor: '#bd34fe',
    summary:
      'Stateless JWT authentication with sliding refresh tokens. Access tokens are short-lived; refresh tokens are rotated on use and stored hashed server-side.',
    diagram: `
  ┌─────────┐         ┌──────────────────┐        ┌──────────┐
  │  Client │         │   Auth Endpoint   │        │    DB    │
  └────┬────┘         └────────┬─────────┘        └────┬─────┘
       │                       │                        │
       │  POST /auth/login     │                        │
       │  { email, password }  │                        │
       │──────────────────────►│                        │
       │                       │  SELECT user WHERE     │
       │                       │  email = ?             │
       │                       │───────────────────────►│
       │                       │  { hash, roles }       │
       │                       │◄───────────────────────│
       │                       │                        │
       │                       │  verify bcrypt hash    │
       │                       │  sign AccessToken(15m) │
       │                       │  sign RefreshToken(7d) │
       │                       │  store hash(refresh)   │
       │                       │───────────────────────►│
       │  200 { access, refresh} │                      │
       │◄──────────────────────│                        │
       │                       │                        │
       │  GET /api/data        │                        │
       │  Authorization: Bearer│                        │
       │──────────────────────►│                        │
       │                       │  verify JWT sig        │
       │                       │  check expiry          │
       │  200 { data }         │                        │
       │◄──────────────────────│                        │
       │                       │                        │
       │  POST /auth/refresh   │                        │
       │  { refreshToken }     │                        │
       │──────────────────────►│                        │
       │                       │  hash(token) in DB?    │
       │                       │───────────────────────►│
       │                       │  delete old token      │
       │                       │  store new hash        │
       │                       │───────────────────────►│
       │  200 { newAccess,     │                        │
       │        newRefresh }   │                        │
       │◄──────────────────────│                        │`,
    explanation:
      'Access tokens are signed JWTs valid for 15 minutes — short enough that a stolen token expires quickly. Refresh tokens are opaque random strings stored as bcrypt hashes in the database, valid for 7 days. On each refresh the old token is deleted and a new one issued (rotation), so a stolen refresh token can only be used once before it becomes invalid. No session state is stored server-side for the access token path.',
    decisions: [
      {
        label: 'Store refresh tokens hashed, not plaintext',
        rationale:
          'If the token table is compromised, hashed tokens cannot be replayed. The client holds the plaintext; the server only stores proof of it.',
      },
      {
        label: 'Rotate refresh tokens on every use',
        rationale:
          'Rotation means a stolen refresh token is invalidated the moment the legitimate user next refreshes. Without rotation a leaked token is valid for its full TTL.',
      },
      {
        label: '15-minute access token TTL',
        rationale:
          'Short enough to limit exposure of a leaked token; long enough to avoid unnecessary refreshes on every API call during normal use.',
      },
    ],
  },
  {
    id: 'rbac',
    title: 'RBAC Authorization Flow',
    tag: 'Security / Permissions',
    tagColor: '#f7c948',
    summary:
      'Dynamic policy-based authorization. Permissions are data (Resource:Action pairs), cached per user, and evaluated by a custom IAuthorizationHandler — no hardcoded role checks in business logic.',
    diagram: `
  Incoming Request
        │
        ▼
  [AuthenticationMiddleware]
        │  validates JWT → sets ClaimsPrincipal
        ▼
  [AuthorizationMiddleware]
        │
        │  controller action has:
        │  [Authorize(Policy = "Invoice:Edit")]
        │
        ▼
  [PermissionAuthorizationHandler]
        │
        ├─ read UserId from ClaimsPrincipal
        │
        ├─ IMemoryCache.TryGet("perms:{UserId}")
        │       │
        │       ├── HIT  ─────────────────────────────────┐
        │       │                                         │
        │       └── MISS                                  │
        │             │                                   │
        │             ▼                                   │
        │       DB query:                                 │
        │       UserRoles → Roles → RolePermissions       │
        │       → union + walk role hierarchy             │
        │             │                                   │
        │             ▼                                   │
        │       cache Set("perms:{UserId}", ttl=5min)     │
        │             │                                   ▼
        │             └──────────────► HashSet<Permission>
        │
        ├─ contains "Invoice:Edit" ?
        │       ├── YES → context.Succeed()
        │       └── NO  → context.Fail() → 403
        │
        ▼
  [AuditLogFilter]  (ActionFilter, always runs)
  logs: userId, resource, action, result, timestamp`,
    explanation:
      'Authorization policies are registered at startup as "Resource:Action" string pairs. The PermissionAuthorizationHandler resolves the user\'s full permission set from cache (warm path) or the database (cold path), then checks set membership. An ActionFilter writes an audit record after every authorization decision — grants and denials alike. Role hierarchy is flattened to a HashSet at cache-fill time, so every request-path check is O(1).',
    decisions: [
      {
        label: 'Permissions as data, not enum values',
        rationale:
          'Enum-based permissions require a code deploy to add a new resource type. String pairs ("Invoice:Edit") can be added by admins at runtime with no deployment.',
      },
      {
        label: 'Cache per-user permission set, not per-role',
        rationale:
          'A user can have multiple roles with overlapping permissions. Caching the resolved union avoids re-computing role hierarchy on every request.',
      },
      {
        label: 'Explicit cache eviction on role change, not just TTL expiry',
        rationale:
          'Waiting 5 minutes after revoking a permission is a security gap. Explicit eviction ensures revocation takes effect on the next request.',
      },
    ],
  },
  {
    id: 'schema-form',
    title: 'Schema Form Builder Package',
    tag: 'React / NPM',
    tagColor: '#ff6b6b',
    summary:
      'NPM package architecture: consumer provides a JSON schema, the package renders a fully validated MUI form. Custom renderers override any field without touching the schema or losing validation.',
    diagram: `
  CONSUMER (app code)
  ─────────────────────────────────────────────────
  import { SchemaForm } from 'mui-schema-form-builder';

  const schema = {
    fields: [
      { name: "email",  type: "email",  required: true },
      { name: "role",   type: "select",
        options: ["admin","user"] },
      { name: "bio",    type: "textarea",
        visibleWhen: { field: "role", eq: "admin" } },
    ]
  };

  <SchemaForm
    schema={schema}
    onSubmit={(values) => api.save(values)}
    renderers={{ email: MyCustomEmailInput }}
  />

  PACKAGE INTERNALS
  ─────────────────────────────────────────────────

  SchemaForm
    │
    ├── useFormState(schema)
    │     ├── values : Record<string, unknown>
    │     ├── errors : Record<string, string>
    │     ├── touched: Record<string, boolean>
    │     └── validate() → runs per-field rules
    │
    └── schema.fields.map(field =>
          │
          ├── evalVisibility(field, values)
          │     └── hidden? → return null
          │
          ├── renderer = renderers[field.name]
          │           ?? renderers[field.type]
          │           ?? builtInDefaults[field.type]
          │
          └── <FieldWrapper
                  error={errors[field.name]}
                  label={field.label}>
                <renderer
                  value={values[field.name]}
                  onChange={...}
                  schema={field} />
              </FieldWrapper>
        )

  BUNDLE OUTPUT  (Vite library mode)
  ─────────────────────────────────────────────────
  dist/index.js   ~11 KB gzip   (no MUI, no React)
  dist/index.d.ts  full TypeScript types`,
    explanation:
      'SchemaForm owns all form state in a single useFormState hook. On each keystroke it re-evaluates visibility rules and validates the changed field. Renderer lookup goes: consumer name override → consumer type override → built-in default. FieldWrapper handles label, required mark, and error display — so any custom renderer gets error UI for free without implementing it. Vite library mode externalises React and MUI so the bundle ships zero framework code.',
    decisions: [
      {
        label: 'peerDependencies only — no bundled React or MUI',
        rationale:
          'Bundling React would cause version conflicts and double the bundle size. Peer deps means the consumer\'s installed version is used — always compatible.',
      },
      {
        label: 'Renderer lookup by name first, type second',
        rationale:
          'Type-level overrides replace all fields of that type. Name-level overrides target one specific field. Both are needed: "all selects use MySelect" vs "only the role field uses MySelect".',
      },
      {
        label: 'Validation runs against schema, not inside renderers',
        rationale:
          'Moving validation into the schema layer means custom renderers cannot accidentally bypass it. The schema is the contract; renderers are presentation only.',
      },
    ],
  },
];

export default function Architecture() {
  const [selected, setSelected] = useState<Diagram | null>(null);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 3, md: 6 }, py: 8 }}>
      <FadeIn>
        <SectionTitle
          number="03"
          title="Architecture"
          subtitle="System design diagrams showing how each project is structured — component interaction, data flow, and the reasoning behind key decisions."
        />
      </FadeIn>

      {/* ── Gallery grid ── */}
      <Grid container spacing={3}>
        {diagrams.map((d, i) => (
          <Grid key={d.id} size={{ xs: 12, md: 6 }}>
            <FadeIn delay={i * 80}>
              <Paper
                onClick={() => setSelected(d)}
                sx={{
                  p: 3.5,
                  height: '100%',
                  bgcolor: 'background.paper',
                  border: '1px solid rgba(255,255,255,0.06)',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s, transform 0.2s',
                  '&:hover': {
                    borderColor: d.tagColor,
                    transform: 'translateY(-3px)',
                    '& .zoom-icon': { opacity: 1 },
                  },
                  position: 'relative',
                }}
              >
                {/* zoom hint */}
                <Tooltip title="View full diagram">
                  <ZoomOutMapIcon
                    className="zoom-icon"
                    sx={{
                      position: 'absolute',
                      top: 14,
                      right: 14,
                      fontSize: 18,
                      color: 'text.secondary',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                    }}
                  />
                </Tooltip>

                <Chip
                  label={d.tag}
                  size="small"
                  sx={{
                    bgcolor: `${d.tagColor}18`,
                    color: d.tagColor,
                    border: `1px solid ${d.tagColor}40`,
                    fontSize: '0.68rem',
                    mb: 2,
                  }}
                />

                <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 700, mb: 1.5 }}>
                  {d.title}
                </Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 2.5 }}>
                  {d.summary}
                </Typography>

                {/* diagram preview — clipped */}
                <Paper
                  sx={{
                    p: 1.5,
                    bgcolor: '#0d1b2e',
                    border: `1px solid ${d.tagColor}25`,
                    overflow: 'hidden',
                    maxHeight: 120,
                    position: 'relative',
                  }}
                >
                  <Box
                    component="pre"
                    sx={{ m: 0, fontFamily: 'monospace', fontSize: '0.6rem', color: d.tagColor, lineHeight: 1.5, whiteSpace: 'pre' }}
                  >
                    {d.diagram.trim().split('\n').slice(0, 10).join('\n')}
                  </Box>
                  {/* fade-out at bottom */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 40,
                      background: 'linear-gradient(transparent, #0d1b2e)',
                    }}
                  />
                </Paper>

                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                    {d.decisions.length} design decisions
                  </Typography>
                  <Typography variant="caption" sx={{ color: d.tagColor, fontFamily: 'monospace' }}>
                    click to expand →
                  </Typography>
                </Stack>
              </Paper>
            </FadeIn>
          </Grid>
        ))}
      </Grid>

      {/* ── Full-screen dialog ── */}
      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        maxWidth="lg"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              bgcolor: 'background.default',
              border: '1px solid rgba(100,255,218,0.15)',
              backgroundImage: 'none',
            },
          },
        }}
      >
        {selected && (
          <DialogContent sx={{ p: 0 }}>
            <Box sx={{ p: { xs: 3, md: 5 } }}>
              {/* dialog header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                <Box>
                  <Chip
                    label={selected.tag}
                    size="small"
                    sx={{
                      bgcolor: `${selected.tagColor}18`,
                      color: selected.tagColor,
                      border: `1px solid ${selected.tagColor}40`,
                      fontSize: '0.68rem',
                      mb: 1,
                    }}
                  />
                  <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 800 }}>
                    {selected.title}
                  </Typography>
                </Box>
                <IconButton onClick={() => setSelected(null)} sx={{ color: 'text.secondary', ml: 2 }}>
                  <CloseIcon />
                </IconButton>
              </Box>

              <Grid container spacing={4}>
                {/* diagram — full */}
                <Grid size={{ xs: 12, lg: 7 }}>
                  <Paper
                    sx={{
                      p: 3,
                      bgcolor: '#0d1b2e',
                      border: `1px solid ${selected.tagColor}25`,
                      overflow: 'auto',
                    }}
                  >
                    <Box
                      component="pre"
                      sx={{
                        m: 0,
                        fontFamily: 'monospace',
                        fontSize: { xs: '0.6rem', md: '0.72rem' },
                        color: selected.tagColor,
                        lineHeight: 1.7,
                        whiteSpace: 'pre',
                      }}
                    >
                      {selected.diagram.trim()}
                    </Box>
                  </Paper>
                </Grid>

                {/* explanation + decisions */}
                <Grid size={{ xs: 12, lg: 5 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 2, mb: 4 }}>
                    {selected.explanation}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <LightbulbOutlinedIcon sx={{ color: selected.tagColor, fontSize: 18 }} />
                    <Typography variant="subtitle2" sx={{ color: 'text.primary', fontWeight: 700 }}>
                      Design Decisions
                    </Typography>
                  </Box>

                  <Stack spacing={2}>
                    {selected.decisions.map((dec) => (
                      <Paper
                        key={dec.label}
                        sx={{
                          p: 2.5,
                          bgcolor: 'background.paper',
                          border: `1px solid ${selected.tagColor}20`,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: selected.tagColor, fontWeight: 600, mb: 0.8, fontSize: '0.82rem' }}
                        >
                          {dec.label}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8, fontSize: '0.8rem' }}>
                          {dec.rationale}
                        </Typography>
                      </Paper>
                    ))}
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
        )}
      </Dialog>
    </Box>
  );
}
