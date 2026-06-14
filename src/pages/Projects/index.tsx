import { Box, Typography, Grid, Paper, Chip, Button, Stack, Divider } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BusinessIcon from '@mui/icons-material/Business';
import CodeIcon from '@mui/icons-material/Code';
import { Link } from 'react-router-dom';
import FadeIn from '../../components/ui/FadeIn';
import SectionTitle from '../../components/ui/SectionTitle';
import { projects, type Project } from '../../data/personal';

const companyProjects = projects.filter((p) => p.category === 'company');
const personalProjects = projects.filter((p) => p.category !== 'company');

function ProjectCard({ project, idx }: { project: Project; idx: number }) {
  return (
    <FadeIn key={project.id} delay={idx * 100}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: project.category === 'company' ? 'rgba(189,52,254,0.12)' : 'rgba(100,255,218,0.08)',
          transition: 'border-color 0.2s',
          '&:hover': {
            borderColor: project.category === 'company' ? '#bd34fe' : 'primary.main',
          },
        }}
      >
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5, flexWrap: 'wrap' }}>
              <Typography variant="caption" sx={{ color: project.category === 'company' ? '#bd34fe' : 'primary.main', fontFamily: 'monospace' }}>
                {String(idx + 1).padStart(2, '0')}
              </Typography>
              {project.role && (
                <Chip
                  label={project.role}
                  size="small"
                  sx={{
                    fontSize: '0.65rem',
                    bgcolor: project.category === 'company' ? 'rgba(189,52,254,0.08)' : 'rgba(100,255,218,0.08)',
                    color: project.category === 'company' ? '#bd34fe' : 'primary.main',
                    border: '1px solid',
                    borderColor: project.category === 'company' ? 'rgba(189,52,254,0.3)' : 'rgba(100,255,218,0.25)',
                  }}
                />
              )}
              {project.companyName && (
                <Typography variant="caption" sx={{ color: 'text.disabled', fontFamily: 'monospace', fontSize: '0.7rem' }}>
                  @ {project.companyName}
                </Typography>
              )}
            </Box>

            <Typography variant="h5" sx={{ color: 'text.primary', mb: 1, fontWeight: 700 }}>
              {project.title}
            </Typography>
            <Typography variant="body2" sx={{ color: project.category === 'company' ? '#bd34fe' : 'primary.main', mb: 2, fontStyle: 'italic' }}>
              {project.tagline}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.9, mb: 3 }}>
              {project.description}
            </Typography>

            <Typography variant="subtitle2" sx={{ color: 'text.primary', mb: 1 }}>Key Features</Typography>
            <Stack spacing={0.6} sx={{ mb: 3 }}>
              {project.features.slice(0, 4).map((f) => (
                <Box key={f} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                  <Typography sx={{ color: project.category === 'company' ? '#bd34fe' : 'primary.main', fontSize: '0.65rem', mt: 0.4, flexShrink: 0 }}>▹</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7, fontSize: '0.85rem' }}>{f}</Typography>
                </Box>
              ))}
            </Stack>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {project.techStack.map((tech) => (
                <Chip
                  key={tech}
                  label={tech}
                  size="small"
                  variant="outlined"
                  sx={{
                    color: project.category === 'company' ? '#bd34fe' : 'primary.main',
                    borderColor: project.category === 'company' ? 'rgba(189,52,254,0.3)' : 'rgba(100,255,218,0.3)',
                    fontSize: '0.7rem',
                  }}
                />
              ))}
            </Box>

            <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
              <Button
                component={Link}
                to={`/projects/${project.id}`}
                variant="contained"
                size="small"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: project.category === 'company' ? '#bd34fe' : 'primary.main',
                  color: '#0a192f',
                  fontWeight: 700,
                  borderRadius: 1,
                  '&:hover': { bgcolor: project.category === 'company' ? '#a020e0' : 'primary.dark' },
                }}
              >
                View Details
              </Button>
              {project.github && project.category !== 'company' && (
                <Button size="small" href={project.github} target="_blank" startIcon={<GitHubIcon />} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                  Code
                </Button>
              )}
              {project.npm && (
                <Button size="small" href={project.npm} target="_blank" startIcon={<OpenInNewIcon />} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                  NPM
                </Button>
              )}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 2.5, bgcolor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', height: '100%' }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary', mb: 2 }}>Challenges Solved</Typography>
              <Stack spacing={1.5}>
                {project.challenges.map((c, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 1 }}>
                    <Typography sx={{ color: project.category === 'company' ? '#bd34fe' : 'primary.main', fontFamily: 'monospace', fontSize: '0.75rem', mt: 0.2 }}>▹</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7, fontSize: '0.8rem' }}>
                      {c.problem}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </FadeIn>
  );
}

function SectionHeading({ icon, title, subtitle, color }: { icon: React.ReactNode; title: string; subtitle: string; color: string }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
        <Box sx={{ color }}>{icon}</Box>
        <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 700 }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ color: 'text.secondary', ml: 4 }}>
        {subtitle}
      </Typography>
    </Box>
  );
}

export default function Projects() {
  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', px: { xs: 3, md: 6 }, py: 8 }}>
      <FadeIn>
        <SectionTitle
          number="02"
          title="Projects"
          subtitle="Company work and personal projects — full stack, frontend, and open-source."
        />
      </FadeIn>

      {/* ── Company Projects ── */}
      <FadeIn delay={100}>
        <SectionHeading
          icon={<BusinessIcon sx={{ fontSize: 22 }} />}
          title="Company Work"
          subtitle="Professional projects shipped at Techbumbles Software Solutions and PM Square Soft Services."
          color="#bd34fe"
        />
      </FadeIn>
      <Stack spacing={6} sx={{ mb: 10 }}>
        {companyProjects.map((project, idx) => (
          <ProjectCard key={project.id} project={project} idx={idx} />
        ))}
      </Stack>

      <FadeIn>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 10 }} />
      </FadeIn>

      {/* ── Personal Projects ── */}
      <FadeIn delay={100}>
        <SectionHeading
          icon={<CodeIcon sx={{ fontSize: 22 }} />}
          title="Personal Projects"
          subtitle="Side projects and open-source work built independently."
          color="#64ffda"
        />
      </FadeIn>
      <Stack spacing={6}>
        {personalProjects.map((project, idx) => (
          <ProjectCard key={project.id} project={project} idx={idx} />
        ))}
      </Stack>
    </Box>
  );
}
