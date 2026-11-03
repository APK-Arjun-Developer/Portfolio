import { useState, type FormEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { personal } from '../../../data/personal';
import { analytics } from '../../../lib/analytics';
import { composeMailto, type EnquiryValues } from '../mail';
import Dialog from './Dialog';

const fields = [
  { name: 'name', label: 'Name', type: 'text', placeholder: 'Your name', required: true },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'you@company.com', required: true },
  { name: 'phone', label: 'Phone', type: 'tel', placeholder: 'Optional', required: false },
];

export default function ContactDialog({
  open,
  onClose,
}: Readonly<{ open: boolean; onClose: () => void }>) {
  const [mailto, setMailto] = useState<string | null>(null);

  const close = () => {
    setMailto(null);
    onClose();
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = Object.fromEntries(
      new FormData(event.currentTarget),
    ) as unknown as EnquiryValues;
    const href = composeMailto(values);
    analytics.ctaClick('contact_me');
    setMailto(href);
    window.location.href = href;
  };

  return (
    <Dialog open={open} onClose={close} label="Contact me" className="max-w-[32rem]">
      <p className="tm-eyebrow">Contact Me</p>
      {mailto ? (
        <>
          <h2 className="mt-2 text-[1.75rem] font-semibold leading-tight">Almost done.</h2>
          <p className="mt-4">
            Your email app should have opened with the message ready to send. If it didn't, use the
            link below or write to me directly.
          </p>
          <a href={mailto} className="tm-btn-primary group mt-6">
            Open the email again
            <span className="tm-badge">
              <ArrowUpRight size={15} aria-hidden="true" />
            </span>
          </a>
          <p className="mt-5 text-sm text-tm-ink [overflow-wrap:anywhere]">{personal.email}</p>
        </>
      ) : (
        <>
          <h2 className="mt-2 text-[1.75rem] font-semibold leading-tight">
            Tell me about your project.
          </h2>
          <form className="mt-5 space-y-4" onSubmit={onSubmit}>
            {fields.map((field) => (
              <label key={field.name} className="block">
                <span className="tm-field-label">{field.label}</span>
                <input
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="tm-field"
                />
              </label>
            ))}
            <label className="block">
              <span className="tm-field-label">What do you need?</span>
              <textarea
                name="message"
                rows={3}
                required
                placeholder="Scope, timeline and anything else that helps."
                className="tm-field resize-y"
              />
            </label>
            <div className="flex justify-end pt-1">
              <button type="submit" className="tm-btn-primary group">
                Write email
                <span className="tm-badge">
                  <ArrowUpRight size={15} className="tm-nudge-ne" aria-hidden="true" />
                </span>
              </button>
            </div>
          </form>
        </>
      )}
    </Dialog>
  );
}
