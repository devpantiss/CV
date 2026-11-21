import { functionErrorMessage } from '../../lib/functionError';
import { useState } from 'react';
import Modal from 'react-modal';
import { FiX, FiArrowRight } from 'react-icons/fi';
import { supabase } from '../../lib/supabase';
import { registrationDetails } from './validation';

export default function EventRegistration({ event, onClose, onSuccess }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submit = async (e) => {
    e.preventDefault(); setError(''); setBusy(true);
    try {
      const form = Object.fromEntries(new FormData(e.currentTarget));
      const details = registrationDetails({ ...form, consent: form.consent === 'on' });
      if (!supabase) throw new Error('Event registration is not configured yet.');
      const { data, error: failure } = await supabase.functions.invoke('event-registration', { body: { action: 'register', eventId: event._id || event.id, ...details, consent: true, website: form.website } });
      if (failure) throw new Error(await functionErrorMessage(failure, 'Unable to register right now. Please try again.'));
      if (!data?.success) throw new Error(data?.error || 'Unable to register right now. Please try again.');
      onSuccess('Your registration has been received. We look forward to seeing you.'); onClose();
    } catch (failure) { setError(failure.message); } finally { setBusy(false); }
  };
  return <Modal isOpen onRequestClose={() => { if (!busy) onClose(); }} shouldCloseOnEsc={!busy} shouldCloseOnOverlayClick={!busy} className="modal-content-1 event-registration" overlayClassName="modal-overlay-1" contentLabel="Event registration"><button className="event-registration-close" aria-label="Close registration" disabled={busy} onClick={onClose}><FiX /></button><p className="eyebrow">Save your place</p><h2>Join the conversation.</h2><p className="event-registration-subtitle">{event.title}</p><form onSubmit={submit}><div className="event-registration-fields">{[['name', 'Full name', 'text', 'name'], ['email', 'Email address', 'email', 'email'], ['phone', 'Phone number', 'tel', 'tel'], ['institution', 'School / college', 'text', 'organization'], ['city', 'City', 'text', 'address-level2']].map(([name, label, type, autoComplete]) => <label key={name}><span>{label}</span><input required name={name} type={type} autoComplete={autoComplete} maxLength={name === 'email' ? 254 : name === 'institution' ? 160 : name === 'phone' ? 25 : 100} /></label>)}</div><label className="event-registration-trap" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label><label className="event-registration-consent"><input type="checkbox" name="consent" required /><span>I agree to Career Valley storing my details in its event registration system and private Google Sheet, and contacting me about this event.</span></label>{error && <p role="alert" className="event-registration-error">{error}</p>}<button className="button button-primary" disabled={busy}>{busy ? 'Submitting…' : 'Register for event'}<FiArrowRight /></button><p className="event-registration-note">No account needed. Your details are visible only to the Career Valley team.</p></form></Modal>;
}
