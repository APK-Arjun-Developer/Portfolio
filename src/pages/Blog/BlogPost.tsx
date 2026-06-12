import { useParams, Link, Navigate } from 'react-router-dom';
import {
  Box, Typography, Button, Chip, Stack, Divider, Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FadeIn from '../../components/ui/FadeIn';
import ArticleRenderer from '../../components/ui/ArticleRenderer';
import { articles } from '../../data/articles';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const article = articles.find((a) => a.slug === slug);

  if (!article) return <Navigate to="/blog" replace />;

  const others = articles.filter((a) => a.slug !== slug).slice(0, 2);

  return (
    <Box sx={{ maxWidth: 760, mx: 'auto', px: { xs: 3, md: 4 }, py: 6 }}>
      {/* ── Back ── */}
      <FadeIn>
        <Button
          component={Link}
          to="/blog"
          startIcon={<ArrowBackIcon />}
          sx={{ color: 'text.secondary', mb: 4, pl: 0, '&:hover': { color: 'primary.main' } }}
        >
          All Articles
        </Button>
      </FadeIn>

      {/* ── Header ── */}
      <FadeIn delay={50}>
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
          {article.tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{ bgcolor: 'rgba(100,255,218,0.08)', color: 'primary.main', fontSize: '0.7rem', mb: 1 }}
            />
          ))}
        </Stack>

        <Typography
          variant="h3"
          sx={{ color: 'text.primary', fontWeight: 800, mb: 2, lineHeight: 1.2, fontSize: { xs: '1.8rem', md: '2.4rem' } }}
        >
          {article.title}
        </Typography>

        <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
            <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{article.date}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
            <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{article.readTime}</Typography>
          </Box>
        </Stack>

        <Typography variant="body1" sx={{ color: 'primary.main', fontStyle: 'italic', lineHeight: 1.8, mb: 4 }}>
          {article.excerpt}
        </Typography>

        <Divider sx={{ borderColor: 'rgba(100,255,218,0.1)', mb: 5 }} />
      </FadeIn>

      {/* ── Body ── */}
      <FadeIn delay={100}>
        <ArticleRenderer sections={article.sections} />
      </FadeIn>

      {/* ── Footer ── */}
      <FadeIn delay={120}>
        <Divider sx={{ borderColor: 'rgba(100,255,218,0.1)', mt: 6, mb: 5 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 6 }}>
          <Button
            component={Link}
            to="/blog"
            startIcon={<ArrowBackIcon />}
            sx={{ color: 'text.secondary', pl: 0, '&:hover': { color: 'primary.main' } }}
          >
            All Articles
          </Button>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
            {article.readTime}
          </Typography>
        </Box>

        {/* ── Related articles ── */}
        {others.length > 0 && (
          <>
            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 700, mb: 3 }}>
              More Articles
            </Typography>
            <Stack spacing={2}>
              {others.map((other) => (
                <Paper
                  key={other.slug}
                  component={Link}
                  to={`/blog/${other.slug}`}
                  sx={{
                    p: 3,
                    bgcolor: 'background.paper',
                    border: '1px solid rgba(255,255,255,0.06)',
                    textDecoration: 'none',
                    display: 'block',
                    transition: 'border-color 0.2s',
                    '&:hover': { borderColor: 'primary.main' },
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: 'text.primary', fontWeight: 600, mb: 0.5 }}>
                    {other.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {other.readTime} · {other.date}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </>
        )}
      </FadeIn>
    </Box>
  );
}
