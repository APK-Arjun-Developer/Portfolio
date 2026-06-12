import { Box, Typography, Button, Stack, Chip, Grid, Paper, Divider } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StorageIcon from '@mui/icons-material/Storage';
import WebIcon from '@mui/icons-material/Web';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { Link } from 'react-router-dom';
import FadeIn from '../../components/ui/FadeIn';
import { personal, projects } from '../../data/personal';

const buildAreas = [
  {
    icon: <StorageIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
    title: 'Backend Systems',
    description: 'Scalable ASP.NET Core APIs with multi-tenant isolation, clean architecture, and EF Core.',
  },
  {
    icon: <WebIcon sx={{ fontSize: 32, color: '#bd34fe' }} />,
    title: 'Frontend Apps',
    description: 'React + TypeScript SPAs with Material UI, state management, and published NPM packages.',
  },
  {
    icon: <AccountTreeIcon sx={{ fontSize: 32, color: '#f7c948' }} />,
    title: 'Architecture & Design',
    description: 'Multi-tenant SaaS, RBAC systems, domain-driven design, and REST API standards.',
  },
];

export default function Home() {
  return (
    <Box>
      {/* ── Hero ── */}
      <Box
        sx={{
          minHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          px: { xs: 3, sm: 6, md: 12 },
          maxWidth: 960,
          mx: 'auto',
        }}
      >
        <FadeIn delay={100}>
          <Typography variant="body1" sx={{ color: 'primary.main', fontFamily: 'monospace', mb: 2, fontSize: '1rem' }}>
            Hi, my name is
          </Typography>
        </FadeIn>

        <FadeIn delay={200}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.8rem', sm: '3.8rem', md: '5rem' },
              color: 'text.primary',
              lineHeight: 1.05,
              fontWeight: 800,
            }}
          >
            {personal.name}.
          </Typography>
        </FadeIn>

        <FadeIn delay={300}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3.5rem' },
              color: 'text.secondary',
              lineHeight: 1.1,
              mt: 1,
              mb: 3,
              fontWeight: 700,
            }}
          >
            {personal.role}.
          </Typography>
        </FadeIn>

        <FadeIn delay={400}>
          <Typography
            variant="body1"
            sx={{ color: 'text.secondary', maxWidth: 520, lineHeight: 1.9, mb: 4, fontSize: '1.05rem' }}
          >
            {personal.summary}
          </Typography>
        </FadeIn>

        <FadeIn delay={500}>
          <Stack direction="row" spacing={1} sx={{ mb: 5, flexWrap: 'wrap' }}>
            {['ASP.NET Core', 'React', 'TypeScript', 'Multi-Tenant', 'RBAC', 'Clean Architecture'].map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
                sx={{ color: 'primary.main', borderColor: 'rgba(100,255,218,0.35)', mb: 1, fontSize: '0.75rem' }}
              />
            ))}
          </Stack>
        </FadeIn>

        <FadeIn delay={600}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 5 }}>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              startIcon={<DownloadIcon />}
              href={personal.resumeUrl}
              download
              sx={{ borderRadius: 1, px: 3, py: 1.2 }}
            >
              Download Resume
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={Link}
              to="/projects"
              endIcon={<ArrowForwardIcon />}
              sx={{ borderRadius: 1, px: 3, py: 1.2, color: '#0a192f', fontWeight: 700 }}
            >
              View Projects
            </Button>
          </Stack>
        </FadeIn>

        <FadeIn delay={700}>
          <Stack direction="row" spacing={1}>
            <Button
              href={personal.github}
              target="_blank"
              startIcon={<GitHubIcon />}
              sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' }, pl: 0 }}
            >
              GitHub
            </Button>
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 1 }} />
            <Button
              href={personal.linkedin}
              target="_blank"
              startIcon={<LinkedInIcon />}
              sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
            >
              LinkedIn
            </Button>
          </Stack>
        </FadeIn>
      </Box>

      {/* ── What I Build ── */}
      <Box sx={{ px: { xs: 3, sm: 6, md: 12 }, py: 10, maxWidth: 1100, mx: 'auto' }}>
        <FadeIn>
          <Typography variant="overline" sx={{ color: 'primary.main', fontFamily: 'monospace', letterSpacing: 2 }}>
            What I Build
          </Typography>
          <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 700, mt: 0.5, mb: 5 }}>
            End-to-end full stack development
          </Typography>
        </FadeIn>

        <Grid container spacing={3}>
          {buildAreas.map((area, i) => (
            <Grid key={area.title} size={{ xs: 12, md: 4 }}>
              <FadeIn delay={i * 120}>
                <Paper
                  sx={{
                    p: 4,
                    height: '100%',
                    bgcolor: 'background.paper',
                    border: '1px solid rgba(255,255,255,0.05)',
                    transition: 'border-color 0.2s, transform 0.2s',
                    '&:hover': { borderColor: 'primary.main', transform: 'translateY(-4px)' },
                  }}
                >
                  <Box sx={{ mb: 2 }}>{area.icon}</Box>
                  <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 700, mb: 1.5 }}>
                    {area.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                    {area.description}
                  </Typography>
                </Paper>
              </FadeIn>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ── Featured Projects Preview ── */}
      <Box sx={{ px: { xs: 3, sm: 6, md: 12 }, pb: 12, maxWidth: 1100, mx: 'auto' }}>
        <FadeIn>
          <Typography variant="overline" sx={{ color: 'primary.main', fontFamily: 'monospace', letterSpacing: 2 }}>
            Featured Work
          </Typography>
          <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 700, mt: 0.5, mb: 5 }}>
            Selected projects
          </Typography>
        </FadeIn>

        <Grid container spacing={3}>
          {projects.map((project, i) => (
            <Grid key={project.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <FadeIn delay={i * 100}>
                <Paper
                  component={Link}
                  to="/projects"
                  sx={{
                    p: 3.5,
                    height: '100%',
                    bgcolor: 'background.paper',
                    border: '1px solid rgba(255,255,255,0.05)',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'border-color 0.2s, transform 0.2s',
                    '&:hover': { borderColor: 'primary.main', transform: 'translateY(-4px)' },
                  }}
                >
                  <Typography variant="caption" sx={{ color: 'primary.main', fontFamily: 'monospace', mb: 1 }}>
                    {String(i + 1).padStart(2, '0')}
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 700, mb: 1, fontSize: '1rem' }}>
                    {project.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7, mb: 2, flex: 1, fontSize: '0.8rem' }}>
                    {project.tagline}
                  </Typography>
                  <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap' }}>
                    {project.techStack.slice(0, 3).map((tech) => (
                      <Chip key={tech} label={tech} size="small" sx={{ bgcolor: 'rgba(100,255,218,0.07)', color: 'text.secondary', fontSize: '0.65rem', mb: 0.5 }} />
                    ))}
                  </Stack>
                </Paper>
              </FadeIn>
            </Grid>
          ))}
        </Grid>

        <FadeIn delay={300}>
          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Button
              component={Link}
              to="/projects"
              variant="outlined"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              sx={{ borderRadius: 1 }}
            >
              View All Projects
            </Button>
          </Box>
        </FadeIn>
      </Box>
    </Box>
  );
}
