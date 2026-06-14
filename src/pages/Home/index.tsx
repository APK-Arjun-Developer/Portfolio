import { Box, Typography, Button, Stack, Chip, Divider } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from 'react-router-dom';
import FadeIn from '../../components/ui/FadeIn';
import { personal } from '../../data/personal';

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
            Hi, I'm
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
            {personal.name}
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
            {['React', 'Node.js', '.NET Core', 'SQL'].map((tag) => (
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
    </Box>
  );
}
