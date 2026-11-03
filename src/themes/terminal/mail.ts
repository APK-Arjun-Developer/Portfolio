import { personal } from '../../data/personal';

export interface EnquiryValues {
  name: string;
  email: string;
  phone: string;
  message: string;
}

/** The site has no backend, so the contact form composes an email for the visitor's mail app. */
export function composeMailto({ name, email, phone, message }: EnquiryValues) {
  const sender = [`From: ${name}`, `Email: ${email}`];
  if (phone) sender.push(`Phone: ${phone}`);
  const body = `${message}\n\n${sender.join('\n')}`;
  const subject = `Project enquiry from ${name}`;
  return `mailto:${personal.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
