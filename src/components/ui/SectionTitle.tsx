import { Box, Typography } from '@mui/material';

interface Props {
  number: string;
  title: string;
  subtitle?: string;
}

export default function SectionTitle({ number, title, subtitle }: Props) {
  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="body2" sx={{ color: 'primary.main', fontFamily: 'monospace', mb: 0.5 }}>
        {number}.
      </Typography>
      <Typography variant="h3" sx={{ color: 'text.primary', fontWeight: 700, mb: 1 }}>
        {title}
      </Typography>
      <Box sx={{ height: 3, width: 60, bgcolor: 'primary.main', borderRadius: 1, mb: subtitle ? 2 : 0, opacity: 0.7 }} />
      {subtitle && (
        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 560, lineHeight: 1.8 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
