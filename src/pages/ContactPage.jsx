import { functionErrorMessage } from '../lib/functionError';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { contactDetails } from '../features/contact/validation';
import { useRef, useState } from 'react';
import { FiArrowRight, FiClock, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import PageHero from '../components/ui/PageHero';

const ContactPage = () => {
  const eventQuery = new URLSearchParams(useLocation().search).get('event');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', topic: eventQuery ? 'Education events' : 'Career counselling', message: eventQuery ? `I would like to enquire about ${eventQuery}.` : '' });
  const handleChange = (event) => setFormData((value) => ({ ...value, [event.target.name]: event.target.value }));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const submissionId = useRef(crypto.randomUUID());
  const handleSubmit = async (event) => {
    event.preventDefault(); setError(''); setSuccess(false); setBusy(true);
    try {
      const form = new FormData(event.currentTarget);
      const details = contactDetails({ ...formData, consent: form.get('consent') === 'on' });
      if (!supabase) throw new Error('The contact form is temporarily unavailable. Please email or call us.');
      const { data, error: failure } = await supabase.functions.invoke('contact-query', { body: { action: 'submit', submissionId: submissionId.current, ...details, consent: true, website: form.get('website') } });
      if (failure) throw new Error(await functionErrorMessage(failure, 'Unable to send your query. Please try again.'));
      if (!data?.success) throw new Error(data?.error || 'Unable to send your query.');
      setSuccess(true); submissionId.current = crypto.randomUUID();
      setFormData({ name: '', email: '', phone: '', topic: 'Career counselling', message: '' });
      event.target.reset();
    } catch (failure) { setError(failure.message); } finally { setBusy(false); }
  };
  return (
    <>
      <PageHero variant="contact" eyebrow="Talk to us" title="Bring us the question you’re trying to answer." description="Whether you are choosing a course, comparing colleges or simply unsure where to begin, a conversation can make the next step clearer." />
      <section className="section"><div className="site-container grid gap-12 lg:grid-cols-[.7fr_1.3fr]"><div><h2 className="text-2xl font-bold tracking-tight">Contact Career Valley</h2><p className="mt-3 text-[var(--color-muted)]">Tell us what’s on your mind. Send a query below, or reach out to the team directly.</p><div className="mt-8 grid gap-3"><a className="card flex items-center gap-4 p-4 hover:border-[var(--color-primary)]" href="mailto:info@thecareervalley.com"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]"><FiMail /></span><span><small className="block text-[var(--color-muted)]">Email</small><strong>info@thecareervalley.com</strong></span></a><a className="card flex items-center gap-4 p-4 hover:border-[var(--color-primary)]" href="tel:+919839048312"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]"><FiPhone /></span><span><small className="block text-[var(--color-muted)]">Phone</small><strong>+91 98390 48312</strong></span></a><div className="card flex items-center gap-4 p-4"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]"><FiMapPin /></span><span><small className="block text-[var(--color-muted)]">Location</small><strong>Hyderabad, Telangana</strong></span></div><div className="flex items-start gap-3 rounded-xl bg-[var(--color-accent-soft)] p-4 text-sm"><FiClock className="mt-1 shrink-0" /><p>Share a little context in your message so the team can understand the kind of guidance you need.</p></div></div></div>
        <form className="card grid gap-5 p-6 md:p-8" onSubmit={handleSubmit} aria-busy={busy}><fieldset disabled={busy} className="contents"><div><p className="text-sm font-bold uppercase tracking-widest text-[var(--color-primary)]">Start a conversation</p><h2 className="mt-2 text-2xl font-bold">What would you like help with?</h2></div><div className="grid gap-5 sm:grid-cols-2"><div className="field"><label htmlFor="name">Full name</label><input id="name" name="name" maxLength={100} required autoComplete="name" value={formData.name} onChange={handleChange} /></div><div className="field"><label htmlFor="email">Email address</label><input id="email" name="email" maxLength={254} type="email" required autoComplete="email" value={formData.email} onChange={handleChange} /></div><div className="field"><label htmlFor="phone">Phone number</label><input id="phone" name="phone" maxLength={25} type="tel" autoComplete="tel" value={formData.phone} onChange={handleChange} /></div><div className="field"><label htmlFor="topic">I need help with</label><select id="topic" name="topic" value={formData.topic} onChange={handleChange}><option>Career counselling</option><option>Choosing a course</option><option>Choosing a college</option><option>Admission support</option><option>Education events</option><option>Other</option></select></div></div><div className="field"><label htmlFor="message">Tell us a little more</label><textarea id="message" name="message" maxLength={3000} rows="5" required value={formData.message} onChange={handleChange} /></div><label className="event-registration-trap" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label><label className="event-registration-consent !my-0"><input name="consent" type="checkbox" required /><span>I agree to Career Valley storing my query and contact details in its enquiry system and private Google Sheet, and contacting me about my query.</span></label>{error && <p role="alert" className="event-registration-error">{error}</p>}{success && <p role="status" className="rounded-xl bg-[var(--color-primary-soft)] p-4 text-[var(--color-primary-strong)]">Thank you. Your query has been received by Career Valley.</p>}<button className="button button-primary justify-self-start" type="submit">{busy ? 'Sending…' : 'Send query'} <FiArrowRight /></button><p className="text-xs text-[var(--color-muted)]">Your details are visible only to the Career Valley team. No account needed.</p></fieldset></form>
      </div></section>
    </>
  );
};
export default ContactPage;
