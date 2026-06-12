import { Box, Typography, Grid, Paper, Chip, Button, Stack } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from 'react-router-dom';
import FadeIn from '../../components/ui/FadeIn';
import SectionTitle from '../../components/ui/SectionTitle';
import { projects } from '../../data/personal';

export default function Projects() {
  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', px: { xs: 3, md: 6 }, py: 8 }}>
      <FadeIn>
        <SectionTitle
          number="02"
          title="Projects"
          subtitle="Three production-grade projects spanning backend APIs, MVC applications, and published open-source packages."
        />
      </FadeIn>

      <Stack spacing={6}>
        {projects.map((project, idx) => (
          <FadeIn key={project.id} delay={idx * 100}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 5 },
                bgcolor: 'background.paper',
                border: '1px solid rgba(100,255,218,0.08)',
                transition: 'border-color 0.2s',
                '&:hover': { borderColor: 'primary.main' },
              }}
            >
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Typography variant="caption" sx={{ color: 'primary.main', fontFamily: 'monospace' }}>
                    Featured Project {String(idx + 1).padStart(2, '0')}
                  </Typography>
                  <Typography variant="h5" sx={{ color: 'text.primary', mt: 0.5, mb: 1, fontWeight: 700 }}>
                    {project.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'primary.main', mb: 2, fontStyle: 'italic' }}>
                    {project.tagline}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.9, mb: 3 }}>
                    {project.description}
                  </Typography>

                  <Typography variant="subtitle2" sx={{ color: 'text.primary', mb: 1 }}>Key Features</Typography>
                  <Stack spacing={0.6} sx={{ mb: 3 }}>
                    {project.features.slice(0, 4).map((f) => (
                      <Box key={f} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                        <Typography sx={{ color: 'primary.main', fontSize: '0.65rem', mt: 0.4, flexShrink: 0 }}>▹</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7, fontSize: '0.85rem' }}>{f}</Typography>
                      </Box>
                    ))}
                  </Stack>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    {project.techStack.map((tech) => (
                      <Chip key={tech} label={tech} size="small" variant="outlined" sx={{ color: 'primary.main', borderColor: 'rgba(100,255,218,0.3)', fontSize: '0.7rem' }} />
                    ))}
                  </Box>

                  <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
                    <Button
                      component={Link}
                      to={`/projects/${project.id}`}
                      variant="contained"
                      color="primary"
                      size="small"
                      endIcon={<ArrowForwardIcon />}
                      sx={{ color: '#0a192f', fontWeight: 700, borderRadius: 1 }}
                    >
                      View Details
                    </Button>
                    {project.github && (
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
                          <Typography sx={{ color: 'primary.main', fontFamily: 'monospace', fontSize: '0.75rem', mt: 0.2 }}>▹</Typography>
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
        ))}
      </Stack>
    </Box>
  );
}
