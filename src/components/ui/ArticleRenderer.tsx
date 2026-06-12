import { Box, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import type { ArticleSection } from '../../data/articles';

interface Props {
  sections: ArticleSection[];
}

export default function ArticleRenderer({ sections }: Props) {
  return (
    <Box>
      {sections.map((section, i) => {
        switch (section.type) {
          case 'heading':
            return (
              <Typography
                key={i}
                variant="h5"
                sx={{ color: 'text.primary', fontWeight: 700, mt: 5, mb: 2 }}
              >
                {section.content}
              </Typography>
            );

          case 'subheading':
            return (
              <Typography
                key={i}
                variant="h6"
                sx={{ color: 'text.primary', fontWeight: 600, mt: 3, mb: 1.5 }}
              >
                {section.content}
              </Typography>
            );

          case 'paragraph':
            return (
              <Typography
                key={i}
                variant="body1"
                sx={{ color: 'text.secondary', lineHeight: 2, mb: 2.5 }}
              >
                {section.content}
              </Typography>
            );

          case 'code':
            return (
              <Paper
                key={i}
                sx={{ my: 3, bgcolor: '#0d1b2e', border: '1px solid rgba(100,255,218,0.12)', overflow: 'auto' }}
              >
                {/* language label */}
                <Box sx={{ px: 2, py: 0.8, borderBottom: '1px solid rgba(100,255,218,0.08)', display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: 'rgba(100,255,218,0.5)', fontFamily: 'monospace', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                    {section.language ?? 'code'}
                  </Typography>
                </Box>
                <Box
                  component="pre"
                  sx={{ m: 0, p: 2.5, fontFamily: 'monospace', fontSize: '0.8rem', color: '#ccd6f6', lineHeight: 1.7, whiteSpace: 'pre', overflowX: 'auto' }}
                >
                  {section.content}
                </Box>
              </Paper>
            );

          case 'list':
            return (
              <List key={i} dense sx={{ mb: 2.5, pl: 1 }}>
                {section.items?.map((item, j) => (
                  <ListItem key={j} alignItems="flex-start" sx={{ px: 0, py: 0.6 }}>
                    <Box sx={{ color: 'primary.main', fontFamily: 'monospace', fontSize: '0.75rem', mr: 1.5, mt: 0.5, flexShrink: 0 }}>▹</Box>
                    <ListItemText
                      primary={item}
                      slotProps={{ primary: { sx: { color: 'text.secondary', lineHeight: 1.8, fontSize: '0.95rem' } } }}
                    />
                  </ListItem>
                ))}
              </List>
            );

          case 'callout':
            return (
              <Paper
                key={i}
                sx={{
                  my: 3,
                  p: 3,
                  bgcolor: 'rgba(100,255,218,0.04)',
                  border: '1px solid rgba(100,255,218,0.2)',
                  borderLeft: '4px solid',
                  borderLeftColor: 'primary.main',
                }}
              >
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 2, fontStyle: 'italic' }}>
                  {section.content}
                </Typography>
              </Paper>
            );

          default:
            return null;
        }
      })}
    </Box>
  );
}
