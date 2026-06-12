import { Box, Paper, Chip, Stack, Typography, Grid } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Link } from 'react-router-dom';
import FadeIn from '../../components/ui/FadeIn';
import SectionTitle from '../../components/ui/SectionTitle';
import { articles } from '../../data/articles';

export default function Blog() {
  const [featured, ...rest] = articles;

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', px: { xs: 3, md: 6 }, py: 8 }}>
      <FadeIn>
        <SectionTitle
          number="04"
          title="Blog"
          subtitle="Technical deep-dives on architecture, backend systems, and developer tooling."
        />
      </FadeIn>

      {/* ── Featured article ── */}
      <FadeIn delay={80}>
        <Paper
          component={Link}
          to={`/blog/${featured.slug}`}
          sx={{
            p: { xs: 3, md: 5 },
            mb: 4,
            bgcolor: 'background.paper',
            border: '1px solid rgba(100,255,218,0.12)',
            textDecoration: 'none',
            display: 'block',
            transition: 'border-color 0.2s, transform 0.2s',
            '&:hover': { borderColor: 'primary.main', transform: 'translateY(-2px)' },
          }}
        >
          <Typography variant="caption" sx={{ color: 'primary.main', fontFamily: 'monospace', mb: 1, display: 'block' }}>
            Latest Article
          </Typography>

          <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 700, mb: 1.5 }}>
            {featured.title}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.9, mb: 3 }}>
            {featured.excerpt}
          </Typography>

          <Grid container sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Grid>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                {featured.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" sx={{ bgcolor: 'rgba(100,255,218,0.07)', color: 'primary.main', fontSize: '0.68rem', mb: 0.5 }} />
                ))}
              </Stack>
            </Grid>
            <Grid>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
                <AccessTimeIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{featured.readTime}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </FadeIn>

      {/* ── Rest of articles ── */}
      <Stack spacing={2.5}>
        {rest.map((article, i) => (
          <FadeIn key={article.slug} delay={160 + i * 80}>
            <Paper
              component={Link}
              to={`/blog/${article.slug}`}
              sx={{
                p: 3.5,
                bgcolor: 'background.paper',
                border: '1px solid rgba(255,255,255,0.06)',
                textDecoration: 'none',
                display: 'flex',
                gap: 3,
                alignItems: 'flex-start',
                transition: 'border-color 0.2s',
                '&:hover': { borderColor: 'primary.main' },
              }}
            >
              <Typography
                variant="h5"
                sx={{ color: 'primary.main', fontFamily: 'monospace', fontWeight: 800, lineHeight: 1, mt: 0.5, minWidth: 32 }}
              >
                {String(i + 2).padStart(2, '0')}
              </Typography>

              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ color: 'text.primary', fontWeight: 600, mb: 0.8 }}>
                  {article.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 2, fontSize: '0.85rem' }}>
                  {article.excerpt}
                </Typography>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Stack direction="row" spacing={0.8} sx={{ flexWrap: 'wrap' }}>
                    {article.tags.slice(0, 3).map((tag) => (
                      <Chip key={tag} label={tag} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.04)', color: 'text.secondary', fontSize: '0.65rem', mb: 0.5 }} />
                    ))}
                  </Stack>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7, flexShrink: 0 }}>
                    <AccessTimeIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{article.readTime}</Typography>
                  </Box>
                </Stack>
              </Box>

              <ArrowForwardIcon sx={{ color: 'text.secondary', mt: 0.5, flexShrink: 0, fontSize: 18, transition: 'color 0.2s', '.MuiPaper-root:hover &': { color: 'primary.main' } }} />
            </Paper>
          </FadeIn>
        ))}
      </Stack>
    </Box>
  );
}
