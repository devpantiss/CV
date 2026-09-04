import { useState } from 'react';
import { FiArrowRight, FiClock, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import PageHero from '../components/ui/PageHero';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', topic: 'Career counselling', message: '' });
  const handleChange = (event) => setFormData((value) => ({ ...value, [event.target.name]: event.target.value }));
  const handleSubmit = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent(`${formData.topic} enquiry from ${formData.name}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\n${formData.message}`);
    window.location.href = `mailto:info@thecareervalley.com?subject=${subject}&body=${body}`;
  };
  return (
    <>
      <PageHero variant="contact" eyebrow="Talk to us" title="Bring us the question you’re trying to answer." description="Whether you are choosing a course, comparing colleges or simply unsure where to begin, a conversation can make the next step clearer." />
      <section className="section"><div className="site-container grid gap-12 lg:grid-cols-[.7fr_1.3fr]"><div><h2 className="text-2xl font-bold tracking-tight">Contact Career Valley</h2><p className="mt-3 text-[var(--color-muted)]">Reach out directly or use the form to prepare an email in your preferred mail app.</p><div className="mt-8 grid gap-3"><a className="card flex items-center gap-4 p-4 hover:border-[var(--color-primary)]" href="mailto:info@thecareervalley.com"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]"><FiMail /></span><span><small className="block text-[var(--color-muted)]">Email</small><strong>info@thecareervalley.com</strong></span></a><a className="card flex items-center gap-4 p-4 hover:border-[var(--color-primary)]" href="tel:+918309071632"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]"><FiPhone /></span><span><small className="block text-[var(--color-muted)]">Phone</small><strong>+91 8309 071632</strong></span></a><div className="card flex items-center gap-4 p-4"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]"><FiMapPin /></span><span><small className="block text-[var(--color-muted)]">Location</small><strong>Hyderabad, Telangana</strong></span></div><div className="flex items-start gap-3 rounded-xl bg-[var(--color-accent-soft)] p-4 text-sm"><FiClock className="mt-1 shrink-0" /><p>Share a little context in your message so the team can understand the kind of guidance you need.</p></div></div></div>
        <form className="card grid gap-5 p-6 md:p-8" onSubmit={handleSubmit}><div><p className="text-sm font-bold uppercase tracking-widest text-[var(--color-primary)]">Start a conversation</p><h2 className="mt-2 text-2xl font-bold">What would you like help with?</h2></div><div className="grid gap-5 sm:grid-cols-2"><div className="field"><label htmlFor="name">Full name</label><input id="name" name="name" required autoComplete="name" value={formData.name} onChange={handleChange} /></div><div className="field"><label htmlFor="email">Email address</label><input id="email" name="email" type="email" required autoComplete="email" value={formData.email} onChange={handleChange} /></div><div className="field"><label htmlFor="phone">Phone number</label><input id="phone" name="phone" type="tel" autoComplete="tel" value={formData.phone} onChange={handleChange} /></div><div className="field"><label htmlFor="topic">I need help with</label><select id="topic" name="topic" value={formData.topic} onChange={handleChange}><option>Career counselling</option><option>Choosing a course</option><option>Choosing a college</option><option>Admission support</option><option>Education events</option><option>Other</option></select></div></div><div className="field"><label htmlFor="message">Tell us a little more</label><textarea id="message" name="message" rows="5" required value={formData.message} onChange={handleChange} /></div><p className="text-xs text-[var(--color-muted)]">Submitting opens your email application. Career Valley does not currently store this form on the website.</p><button className="button button-primary justify-self-start" type="submit">Prepare email <FiArrowRight /></button></form>
      </div></section>
    </>
  );
};
export default ContactPage;
