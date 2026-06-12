import { useState, type ChangeEvent, type FormEvent } from 'react';
import {
  Box, Typography, Paper, Button, Stack, TextField,
  Grid, Divider, Alert, CircularProgress, Chip,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import DownloadIcon from '@mui/icons-material/Download';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import FadeIn from '../../components/ui/FadeIn';
import SectionTitle from '../../components/ui/SectionTitle';
import { personal } from '../../data/personal';

type Status = 'idle' | 'sending' | 'success' | 'error';

interface FormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const empty: FormValues = { name: '', email: '', subject: '', message: '' };

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = 'Name is required';
  if (!values.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = 'Enter a valid email address';
  if (!values.subject.trim()) errors.subject = 'Subject is required';
  if (!values.message.trim()) errors.message = 'Message is required';
  else if (values.message.trim().length < 20)
    errors.message = 'Message must be at least 20 characters';
  return errors;
}

const socialLinks = [
  {
    icon: <EmailIcon />,
    label: 'Email',
    value: personal.email,
    href: `mailto:${personal.email}`,
    description: 'Fastest way to reach me',
  },
  {
    icon: <GitHubIcon />,
    label: 'GitHub',
    value: 'github.com/arjunp',
    href: personal.github,
    description: 'See my open-source work',
  },
  {
    icon: <LinkedInIcon />,
    label: 'LinkedIn',
    value: 'linkedin.com/in/arjunp',
    href: personal.linkedin,
    description: 'Connect professionally',
  },
];

export default function Contact() {
  const [values, setValues] = useState<FormValues>(empty);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [status, setStatus] = useState<Status>('idle');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (touched[name as keyof FormValues]) {
      setErrors(validate({ ...values, [name]: value }));
    }
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate(values));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const allTouched = { name: true, email: true, subject: true, message: true };
    setTouched(allTouched);
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus('sending');

    try {
      if (personal.formspreeId) {
        const res = await fetch(`https://formspree.io/f/${personal.formspreeId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(values),
        });
        if (!res.ok) throw new Error('Form submission failed');
      } else {
        // Fallback: open mailto with the message pre-filled
        const subject = encodeURIComponent(values.subject);
        const body = encodeURIComponent(
          `Name: ${values.name}\n\n${values.message}`
        );
        window.open(`mailto:${personal.email}?subject=${subject}&body=${body}`);
        // Treat as success
      }
      setStatus('success');
      setValues(empty);
      setTouched({});
    } catch {
      setStatus('error');
    }
  };

  const fieldError = (field: keyof FormValues) =>
    touched[field] ? errors[field] : undefined;

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
                p: 2.5,
                mb: 3,
                bgcolor: personal.available
                  ? 'rgba(100,255,218,0.06)'
                  : 'rgba(255,107,107,0.06)',
                border: '1px solid',
                borderColor: personal.available
                  ? 'rgba(100,255,218,0.25)'
                  : 'rgba(255,107,107,0.25)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FiberManualRecordIcon
                  sx={{
                    fontSize: 10,
                    color: personal.available ? '#64ffda' : '#ff6b6b',
                    animation: personal.available
                      ? 'pulse 2s infinite'
                      : 'none',
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 1 },
                      '50%': { opacity: 0.3 },
                    },
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: personal.available ? 'primary.main' : '#ff6b6b',
                    fontWeight: 600,
                  }}
                >
                  {personal.available
                    ? 'Open to opportunities'
                    : 'Currently unavailable'}
                </Typography>
              </Box>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', display: 'block', mt: 0.5, ml: 2.5 }}
              >
                {personal.available
                  ? 'Actively looking for full-time roles'
                  : 'Not accepting new work right now'}
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
                    p: 2,
                    bgcolor: 'background.paper',
                    border: '1px solid rgba(255,255,255,0.06)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    transition: 'border-color 0.2s, transform 0.2s',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'translateX(4px)',
                    },
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
              variant="outlined"
              color="primary"
              fullWidth
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
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setStatus('idle')}
                  >
                    Send another
                  </Button>
                </Box>
              ) : (
                <Box component="form" onSubmit={handleSubmit} noValidate>
                  {status === 'error' && (
                    <Alert severity="error" sx={{ mb: 3 }} onClose={() => setStatus('idle')}>
                      Something went wrong. Try emailing me directly at{' '}
                      <strong>{personal.email}</strong>.
                    </Alert>
                  )}

                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        name="name"
                        label="Name"
                        fullWidth
                        required
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!fieldError('name')}
                        helperText={fieldError('name')}
                        disabled={status === 'sending'}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        required
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!fieldError('email')}
                        helperText={fieldError('email')}
                        disabled={status === 'sending'}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        name="subject"
                        label="Subject"
                        fullWidth
                        required
                        value={values.subject}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!fieldError('subject')}
                        helperText={fieldError('subject')}
                        disabled={status === 'sending'}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        name="message"
                        label="Message"
                        fullWidth
                        required
                        multiline
                        rows={5}
                        value={values.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!fieldError('message')}
                        helperText={fieldError('message') ?? `${values.message.length} characters`}
                        disabled={status === 'sending'}
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      disabled={status === 'sending'}
                      startIcon={
                        status === 'sending'
                          ? <CircularProgress size={16} color="inherit" />
                          : <SendIcon />
                      }
                      sx={{ color: '#0a192f', fontWeight: 700, borderRadius: 1, px: 4 }}
                    >
                      {status === 'sending' ? 'Sending…' : 'Send Message'}
                    </Button>

                    {!personal.formspreeId && (
                      <Chip
                        label="Opens your email client"
                        size="small"
                        sx={{ color: 'text.secondary', bgcolor: 'rgba(255,255,255,0.04)', fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>
                </Box>
              )}
            </Paper>
          </FadeIn>
        </Grid>
      </Grid>
    </Box>
  );
}
