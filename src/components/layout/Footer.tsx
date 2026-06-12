import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import { personal } from '../../data/personal';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        textAlign: 'center',
        py: 4,
        mt: 8,
        borderTop: '1px solid rgba(100,255,218,0.1)',
        color: 'text.secondary',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 1 }}>
        <Tooltip title="GitHub">
          <IconButton href={personal.github} target="_blank" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
            <GitHubIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="LinkedIn">
          <IconButton href={personal.linkedin} target="_blank" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
            <LinkedInIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Email">
          <IconButton href={`mailto:${personal.email}`} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
            <EmailIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Typography variant="body2">
        Built by {personal.name} · {new Date().getFullYear()}
      </Typography>
    </Box>
  );
}
