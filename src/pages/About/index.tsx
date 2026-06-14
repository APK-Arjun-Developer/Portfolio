import { Box, Typography, Grid, Paper, Chip, Stack, Divider } from '@mui/material';
import FadeIn from '../../components/ui/FadeIn';
import SectionTitle from '../../components/ui/SectionTitle';
import { skills } from '../../data/personal';

const skillSections = [
  { label: 'Backend', items: skills.backend, color: '#64ffda' },
  { label: 'Frontend', items: skills.frontend, color: '#bd34fe' },
  { label: 'Databases', items: skills.databases, color: '#f7c948' },
  { label: 'Tools', items: skills.tools, color: '#ff6b6b' },
];

const careerStart = new Date('2023-08-01');
function getDynamicExperience() {
  const now = new Date();
  const months =
    (now.getFullYear() - careerStart.getFullYear()) * 12 +
    (now.getMonth() - careerStart.getMonth());
  const years = months / 12;
  return years % 1 === 0 ? `${years}` : years.toFixed(1);
}

const timeline = [
  {
    period: 'Feb 2025 – Present',
    role: 'Full Stack Developer',
    company: 'Techbumbles Software Solutions Pvt Ltd · Erode, TN',
    highlights: [
      'Building scalable full-stack web applications with React, Node.js, .NET Core and PostgreSQL',
      'Collaborating with cross-functional teams to deliver new features and improve system architecture',
      'Implementing best practices in performance optimisation, security, and maintainability',
    ],
  },
  {
    period: 'Aug 2023 – Jan 2025',
    role: 'Full Stack Developer',
    company: 'PM Square Soft Services Pvt Ltd · Coimbatore, TN',
    highlights: [
      'Developed high-performance web apps using React, Node.js, and .NET Core',
      'Designed and optimised databases with MySQL, SQLite, and SQL Server',
      'Conducted code reviews, debugging, and maintained architecture and user-guide documentation',
    ],
  },
];

export default function About() {
  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', px: { xs: 3, md: 6 }, py: 8 }}>
      <FadeIn>
        <SectionTitle number="01" title="About Me" />
      </FadeIn>

      <Grid container spacing={8}>
        {/* ── Left: Bio + Timeline ── */}
        <Grid size={{ xs: 12, md: 7 }}>
          <FadeIn delay={100}>
            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 2, mb: 2 }}>
              I'm a Full Stack Developer with experience building production web applications
              using <Box component="span" sx={{ color: 'primary.main' }}>React, Node.js, and .NET Core</Box>.
              I work across the full stack — from database design to responsive UI.
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 2, mb: 2 }}>
              I've shipped multi-role SaaS platforms in healthcare, food delivery, and parking — systems
              where data integrity, real-time updates, and role-based access control matter.
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 2, mb: 6 }}>
              I graduated with a B.E. in Aeronautical Engineering from Excel Engineering College (CGPA 8.0)
              and transitioned into software through the NxtWave MERN programme in 2023.
            </Typography>
          </FadeIn>

          {/* Timeline */}
          <FadeIn delay={200}>
            <Typography variant="h6" sx={{ color: 'text.primary', mb: 3, fontWeight: 700 }}>
              Experience
            </Typography>
          </FadeIn>

          <Stack spacing={0} sx={{ position: 'relative' }}>
            {/* vertical line */}
            <Box sx={{ position: 'absolute', left: 7, top: 8, bottom: 8, width: 2, bgcolor: 'rgba(100,255,218,0.15)', borderRadius: 1 }} />

            {timeline.map((item, i) => (
              <FadeIn key={item.period} delay={300 + i * 150}>
                <Box sx={{ display: 'flex', gap: 3, mb: 4, position: 'relative' }}>
                  {/* dot */}
                  <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: 'background.paper', border: '2px solid', borderColor: 'primary.main', mt: 0.5, flexShrink: 0, zIndex: 1 }} />

                  <Box>
                    <Typography variant="caption" sx={{ color: 'primary.main', fontFamily: 'monospace' }}>
                      {item.period}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: 'text.primary', fontWeight: 700, mt: 0.2 }}>
                      {item.role}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
                      {item.company}
                    </Typography>
                    <Stack spacing={0.8}>
                      {item.highlights.map((h) => (
                        <Box key={h} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                          <Typography sx={{ color: 'primary.main', fontSize: '0.65rem', mt: 0.5, flexShrink: 0 }}>▹</Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7, fontSize: '0.85rem' }}>{h}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Box>
              </FadeIn>
            ))}
          </Stack>
        </Grid>

        {/* ── Right: Skills ── */}
        <Grid size={{ xs: 12, md: 5 }}>
          <FadeIn delay={150}>
            <Typography variant="h6" sx={{ color: 'text.primary', mb: 3, fontWeight: 700 }}>
              Technical Skills
            </Typography>
          </FadeIn>

          <Stack spacing={2.5}>
            {skillSections.map((section, i) => (
              <FadeIn key={section.label} delay={200 + i * 100}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    bgcolor: 'background.paper',
                    border: '1px solid rgba(255,255,255,0.06)',
                    transition: 'border-color 0.2s',
                    '&:hover': { borderColor: section.color },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: section.color }} />
                    <Typography variant="caption" sx={{ color: section.color, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: 1.5, fontSize: '0.7rem' }}>
                      {section.label}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                    {section.items.map((item) => (
                      <Chip
                        key={item}
                        label={item}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.04)',
                          color: 'text.primary',
                          fontSize: '0.75rem',
                          border: '1px solid rgba(255,255,255,0.08)',
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
                        }}
                      />
                    ))}
                  </Box>
                </Paper>
              </FadeIn>
            ))}
          </Stack>

          <FadeIn delay={600}>
            <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.06)' }} />
            <Box sx={{ display: 'flex', gap: 4 }}>
              {[
                { value: `${getDynamicExperience()}`, label: 'Years Experience' },
                { value: '2', label: 'Companies' },
              ].map((stat) => (
                <Box key={stat.label} sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 800, fontFamily: 'monospace' }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.72rem' }}>
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </FadeIn>
        </Grid>
      </Grid>
    </Box>
  );
}
