import { useParams, Link, Navigate } from 'react-router-dom';
import {
  Box, Typography, Button, Chip, Stack, Paper, Grid, Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GitHubIcon from '@mui/icons-material/GitHub';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import FadeIn from '../../components/ui/FadeIn';
import { projects } from '../../data/personal';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const project = projects.find((p) => p.id === id);

  if (!project) return <Navigate to="/projects" replace />;

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto', px: { xs: 3, md: 6 }, py: 6 }}>
      {/* ── Back ── */}
      <FadeIn>
        <Button
          component={Link}
          to="/projects"
          startIcon={<ArrowBackIcon />}
          sx={{ color: 'text.secondary', mb: 4, pl: 0, '&:hover': { color: 'primary.main' } }}
        >
          All Projects
        </Button>
      </FadeIn>

      {/* ── Header ── */}
      <FadeIn delay={50}>
        <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: project.category === 'company' ? '#bd34fe' : 'primary.main', fontFamily: 'monospace', fontSize: '0.85rem' }}>
            {project.category === 'company' ? 'Company Project' : 'Personal Project'}
          </Typography>
          {project.role && (
            <Chip label={project.role} size="small" sx={{ fontSize: '0.65rem', bgcolor: project.category === 'company' ? 'rgba(189,52,254,0.08)' : 'rgba(100,255,218,0.08)', color: project.category === 'company' ? '#bd34fe' : 'primary.main', border: '1px solid', borderColor: project.category === 'company' ? 'rgba(189,52,254,0.3)' : 'rgba(100,255,218,0.25)' }} />
          )}
          {project.companyName && (
            <Typography variant="caption" sx={{ color: 'text.disabled', fontFamily: 'monospace', fontSize: '0.75rem' }}>
              @ {project.companyName}
            </Typography>
          )}
        </Stack>
        <Typography variant="h3" sx={{ color: 'text.primary', fontWeight: 800, mt: 0.5, mb: 1, fontSize: { xs: '1.8rem', md: '2.6rem' } }}>
          {project.title}
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400, mb: 3 }}>
          {project.tagline}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mb: 4, flexWrap: 'wrap' }}>
          {project.techStack.map((tech) => (
            <Chip
              key={tech}
              label={tech}
              size="small"
              variant="outlined"
              sx={{ color: 'primary.main', borderColor: 'rgba(100,255,218,0.3)', mb: 1, fontSize: '0.72rem' }}
            />
          ))}
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mb: 6 }}>
          {project.github && project.category !== 'company' && (
            <Button variant="outlined" color="primary" href={project.github} target="_blank" startIcon={<GitHubIcon />} sx={{ borderRadius: 1 }}>
              View Code
            </Button>
          )}
          {project.npm && (
            <Button variant="outlined" href={project.npm} target="_blank" startIcon={<OpenInNewIcon />} sx={{ borderRadius: 1, color: 'text.secondary', borderColor: 'rgba(255,255,255,0.2)' }}>
              NPM Package
            </Button>
          )}
          {project.demo && (
            <Button variant="contained" color="primary" href={project.demo} target="_blank" startIcon={<OpenInNewIcon />} sx={{ borderRadius: 1, color: '#0a192f', fontWeight: 700 }}>
              Live Demo
            </Button>
          )}
        </Stack>
      </FadeIn>

      <Divider sx={{ borderColor: 'rgba(100,255,218,0.1)', mb: 6 }} />

      {/* ── Overview ── */}
      <FadeIn delay={100}>
        <SectionHeading label="01" title="Problem & Overview" />
        <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 2, maxWidth: 720, mb: 8 }}>
          {project.overview}
        </Typography>
      </FadeIn>

      {/* ── Features ── */}
      <FadeIn delay={120}>
        <SectionHeading label="02" title="Key Features" />
        <Grid container spacing={2} sx={{ mb: 8 }}>
          {project.features.map((f, i) => (
            <Grid key={f} size={{ xs: 12, sm: 6 }}>
              <FadeIn delay={i * 60}>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                  <CheckCircleOutlineIcon sx={{ color: 'primary.main', fontSize: 18, mt: 0.3, flexShrink: 0 }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>{f}</Typography>
                </Box>
              </FadeIn>
            </Grid>
          ))}
        </Grid>
      </FadeIn>

      {/* ── Challenges ── */}
      <FadeIn delay={140}>
        <SectionHeading label="03" title="Challenges & Solutions" />
        <Stack spacing={3} sx={{ mb: 8 }}>
          {project.challenges.map((c, i) => (
            <FadeIn key={i} delay={i * 80}>
              <Paper
                sx={{
                  p: 3.5,
                  bgcolor: 'background.paper',
                  border: '1px solid rgba(255,255,255,0.06)',
                  '&:hover': { borderColor: 'primary.main' },
                  transition: 'border-color 0.2s',
                }}
              >
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" sx={{ color: '#ff6b6b', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: 1 }}>
                      Problem
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.primary', mt: 1, lineHeight: 1.8 }}>
                      {c.problem}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" sx={{ color: 'primary.main', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: 1 }}>
                      Solution
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, lineHeight: 1.8 }}>
                      {c.solution}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </FadeIn>
          ))}
        </Stack>
      </FadeIn>

      {/* ── Tech Stack detail ── */}
      <FadeIn delay={160}>
        <SectionHeading label="04" title="Tech Stack" />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 8 }}>
          {project.techStack.map((tech) => (
            <Paper
              key={tech}
              sx={{
                px: 2.5,
                py: 1.5,
                bgcolor: 'background.paper',
                border: '1px solid rgba(100,255,218,0.12)',
                '&:hover': { borderColor: 'primary.main' },
                transition: 'border-color 0.2s',
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>{tech}</Typography>
            </Paper>
          ))}
        </Box>
      </FadeIn>

      {/* ── Bottom CTA ── */}
      <FadeIn delay={200}>
        <Divider sx={{ borderColor: 'rgba(100,255,218,0.1)', mb: 5 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Button
            component={Link}
            to="/projects"
            startIcon={<ArrowBackIcon />}
            sx={{ color: 'text.secondary', pl: 0, '&:hover': { color: 'primary.main' } }}
          >
            Back to Projects
          </Button>
          <Stack direction="row" spacing={2}>
            {project.github && (
              <Button variant="outlined" color="primary" href={project.github} target="_blank" startIcon={<GitHubIcon />} sx={{ borderRadius: 1 }}>
                View Code
              </Button>
            )}
            {project.npm && (
              <Button variant="outlined" href={project.npm} target="_blank" startIcon={<OpenInNewIcon />} sx={{ borderRadius: 1, color: 'text.secondary', borderColor: 'rgba(255,255,255,0.2)' }}>
                NPM
              </Button>
            )}
          </Stack>
        </Box>
      </FadeIn>
    </Box>
  );
}

function SectionHeading({ label, title }: { label: string; title: string }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="caption" sx={{ color: 'primary.main', fontFamily: 'monospace' }}>
        {label}.
      </Typography>
      <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 700, mt: 0.3 }}>
        {title}
      </Typography>
      <Box sx={{ height: 2, width: 40, bgcolor: 'primary.main', mt: 1, mb: 0, opacity: 0.5, borderRadius: 1 }} />
    </Box>
  );
}
