import { useState } from 'react';
import { z } from 'zod';
import { FormBuilder, FIELD_TYPE } from 'mui-schema-form-builder';
import {
  Box, Typography, Paper, Stack, Grid, Alert, Button, Chip, Divider,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import FadeIn from '../../components/ui/FadeIn';
import SectionTitle from '../../components/ui/SectionTitle';
import { personal, projects } from '../../data/personal';

type Status = 'idle' | 'success' | 'error';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

type ContactValues = z.infer<typeof contactSchema>;

const contactFields = [
  { name: 'name',    label: 'Name',    type: FIELD_TYPE.TEXT,     required: true, fullWidth: true, grid: { xs: 12, sm: 6 } },
  { name: 'email',   label: 'Email',   type: FIELD_TYPE.TEXT,     required: true, fullWidth: true, grid: { xs: 12, sm: 6 }, muiProps: { type: 'email' } },
  { name: 'subject', label: 'Subject', type: FIELD_TYPE.TEXT,     required: true, fullWidth: true, grid: { xs: 12 } },
  { name: 'message', label: 'Message', type: FIELD_TYPE.TEXTAREA, required: true, fullWidth: true, rows: 5, grid: { xs: 12 } },
];

const schemaFormProject = projects.find((p) => p.id === 'schema-form-builder');

const socialLinks = [
  { icon: <EmailIcon />,    label: 'Email',    value: personal.email,               href: `mailto:${personal.email}`, description: 'Fastest way to reach me' },
  { icon: <GitHubIcon />,   label: 'GitHub',   value: 'github.com/APK-Arjun-Developer', href: personal.github,           description: 'See my open-source work' },
  { icon: <LinkedInIcon />, label: 'LinkedIn', value: 'linkedin.com/in/arjunp',     href: personal.linkedin,          description: 'Connect professionally' },
];

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (values: ContactValues) => {
    try {
      if (personal.formspreeId) {
        const res = await fetch(`https://formspree.io/f/${personal.formspreeId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(values),
        });
        if (!res.ok) throw new Error('Submission failed');
      } else {
        const subject = encodeURIComponent(values.subject);
        const body = encodeURIComponent(`Name: ${values.name}\n\n${values.message}`);
        window.open(`mailto:${personal.email}?subject=${subject}&body=${body}`);
      }
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <Box sx={{ maxWidth: 1050, mx: 'auto', px: { xs: 3, md: 6 }, py: 8 }}>
      <FadeIn>
        <SectionTitle
          number="05"
          title="Contact"
          subtitle="Have a project in mind, a role to discuss, or just want to connect? I'd love to hear from you."
        />
      </FadeIn>

      <Grid container spacing={5}>
        {/* ── Left column — info ── */}
        <Grid size={{ xs: 12, md: 4 }}>
          <FadeIn delay={80}>
            {/* Availability badge */}
            <Paper
              sx={{
                p: 2.5, mb: 3,
                bgcolor: personal.available ? 'rgba(100,255,218,0.06)' : 'rgba(255,107,107,0.06)',
                border: '1px solid',
                borderColor: personal.available ? 'rgba(100,255,218,0.25)' : 'rgba(255,107,107,0.25)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FiberManualRecordIcon
                  sx={{
                    fontSize: 10,
                    color: personal.available ? '#64ffda' : '#ff6b6b',
                    animation: personal.available ? 'pulse 2s infinite' : 'none',
                    '@keyframes pulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.3 } },
                  }}
                />
                <Typography variant="body2" sx={{ color: personal.available ? 'primary.main' : '#ff6b6b', fontWeight: 600 }}>
                  {personal.available ? 'Open to opportunities' : 'Currently unavailable'}
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5, ml: 2.5 }}>
                {personal.available ? 'Actively looking for full-time roles' : 'Not accepting new work right now'}
              </Typography>
            </Paper>

            {/* Social links */}
            <Stack spacing={2} sx={{ mb: 4 }}>
              {socialLinks.map((link) => (
                <Paper
                  key={link.label}
                  component="a"
                  href={link.href}
                  target={link.label !== 'Email' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  sx={{
                    p: 2, bgcolor: 'background.paper',
                    border: '1px solid rgba(255,255,255,0.06)',
                    textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 2,
                    transition: 'border-color 0.2s, transform 0.2s',
                    '&:hover': { borderColor: 'primary.main', transform: 'translateX(4px)' },
                  }}
                >
                  <Box sx={{ color: 'primary.main', display: 'flex' }}>{link.icon}</Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600, lineHeight: 1.3 }}>
                      {link.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {link.description}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Stack>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 4 }} />

            {/* Resume download */}
            <Typography variant="subtitle2" sx={{ color: 'text.primary', fontWeight: 700, mb: 2 }}>
              Resume
            </Typography>
            <Button
              variant="outlined" color="primary" fullWidth
              startIcon={<DownloadIcon />}
              href={personal.resumeUrl}
              download="Arjun_P_Resume.pdf"
              sx={{ borderRadius: 1, py: 1.5, justifyContent: 'flex-start' }}
            >
              Download PDF
            </Button>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
              Last updated · June 2026
            </Typography>
          </FadeIn>
        </Grid>

        {/* ── Right column — form ── */}
        <Grid size={{ xs: 12, md: 8 }}>
          <FadeIn delay={160}>
            <Paper
              sx={{
                p: { xs: 3, md: 4.5 },
                bgcolor: 'background.paper',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 700, mb: 0.5 }}>
                Send a Message
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3.5 }}>
                I typically respond within 24 hours.
              </Typography>

              {status === 'success' ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <CheckCircleIcon sx={{ fontSize: 56, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 700, mb: 1 }}>
                    Message sent!
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    Thanks for reaching out — I'll get back to you soon.
                  </Typography>
                  <Button variant="outlined" color="primary" onClick={() => setStatus('idle')}>
                    Send another
                  </Button>
                </Box>
              ) : (
                <>
                  {status === 'error' && (
                    <Alert severity="error" sx={{ mb: 3 }} onClose={() => setStatus('idle')}>
                      Something went wrong. Try emailing me directly at <strong>{personal.email}</strong>.
                    </Alert>
                  )}

                  <FormBuilder
                    fields={contactFields}
                    schema={contactSchema}
                    onSubmit={handleSubmit}
                    submitText="Send Message"
                    spacing={2.5}
                    sx={{
                      boxShadow: 'none',
                      bgcolor: 'transparent',
                      border: 'none',
                      p: 0,
                      borderRadius: 0,
                    }}
                  />

                  {/* Powered-by badge */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                    <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.7rem' }}>
                      Form built with
                    </Typography>
                    <Chip
                      label="mui-schema-form-builder"
                      size="small"
                      component="a"
                      href={schemaFormProject?.npm ?? 'https://www.npmjs.com/package/mui-schema-form-builder'}
                      target="_blank"
                      rel="noopener noreferrer"
                      clickable
                      sx={{
                        fontSize: '0.65rem',
                        bgcolor: 'rgba(100,255,218,0.06)',
                        color: 'primary.main',
                        border: '1px solid rgba(100,255,218,0.2)',
                        '&:hover': { bgcolor: 'rgba(100,255,218,0.12)' },
                      }}
                    />
                  </Box>
                </>
              )}
            </Paper>
          </FadeIn>
        </Grid>
      </Grid>
    </Box>
  );
}
