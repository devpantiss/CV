import { functionErrorMessage } from '../../lib/functionError';
import { useEffect, useState } from 'react';
import { FiX, FiRefreshCw, FiExternalLink, FiUsers, FiMail, FiDownload, FiCheckCircle } from 'react-icons/fi';
import { supabase } from '../../lib/supabase';
import AdminDialog from './AdminDialog';
export default function EventRegistrations({ event, onClose, returnFocus }) {
  const [rows, setRows] = useState([]);
  const [sheet, setSheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [emailReady, setEmailReady] = useState(false);
  const [emailService, setEmailService] = useState(false);
  const [activity, setActivity] = useState('');
  const load = async () => {
    if (!supabase) { setLoading(false); return; }
    const all = [];
    for (let offset = 0; ; offset += 1000) {
      const result = await supabase.from('event_registrations').select('*').eq('event_id', event.id).order('created_at', { ascending: false }).order('id').range(offset, offset + 999);
      if (result.error) throw new Error('Unable to load registrations. Please retry.');
      all.push(...result.data); if (result.data.length < 1000) break;
    }
    const linked = await supabase.from('event_registration_sheets').select('*').eq('event_id', event.id).maybeSingle();
    if (linked.error) throw new Error('Unable to load spreadsheet status.');
    setRows(all); setSheet(linked.data); setLoading(false);
    try {
      const { data, error: failure } = await supabase.functions.invoke('event-confirmation', { body: { action: 'status' } });
      setEmailService(!failure); setEmailReady(!failure && Boolean(data?.ready));
    } catch { setEmailService(false); setEmailReady(false); }
  };
  useEffect(() => { let active = true; load().catch(e => { if (active) { setError(e.message); setLoading(false); } }); return () => { active = false; }; /* Event is fixed for this dialog. */ }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const emailAction = async (action, row, resolution) => {
    if (action === 'resolve' && !window.confirm(resolution === 'sent'
      ? `Have you checked the sender's Gmail Sent folder and confirmed the event pass was sent to ${row.email}? This will mark it as sent without sending another email.`
      : `Have you checked the sender's Gmail Sent folder and confirmed no event pass was sent to ${row.email}? This enables another send.`)) return;
    setBusy(true); setActivity(`${action}:${row.id}`); setError(''); setMessage('');
    try {
      const { data, error: failure } = await supabase.functions.invoke('event-confirmation', { body: { action, eventId: event.id, registrationId: row.id, ...(resolution ? { resolution } : {}) } });
      if (failure) throw new Error(await functionErrorMessage(failure, 'Unable to prepare the event pass. Please try again.'));
      if (action === 'preview') {
        if (!data?.pdf) throw new Error('The pass could not be prepared.');
        const bytes = Uint8Array.from(atob(data.pdf), character => character.charCodeAt(0));
        const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
        const link = document.createElement('a'); link.href = url; link.download = data.filename; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
        setMessage(`PDF pass downloaded for ${row.name}. No email was sent.`);
      } else {
        if (!data?.success) throw new Error(data?.error || 'Unable to send the confirmation.');
        setMessage(action === 'resolve' ? 'Email review saved.' : data.alreadySent ? `A confirmation has already been sent to ${row.email}.` : data.message || `Confirmation and pass sent to ${row.email}.`);
      }
    } catch (failure) { setError(failure.message); }
    finally { if (action !== 'preview') { try { await load(); } catch (failure) { setError(failure.message); } } setBusy(false); setActivity(''); }
  };
  const sync = async () => {
    setBusy(true); setActivity('sync'); setError(''); setMessage('');
    try {
      const { data, error: failure } = await supabase.functions.invoke('event-registration', { body: { action: 'sync', eventId: event.id } });
      if (failure) throw new Error(await functionErrorMessage(failure, 'Unable to sync. Please try again.'));
      if (!data.success) throw new Error(data.error);
      setMessage(data.pending ? 'Another sync is running. Refresh shortly.' : `${data.count} registrations synced to Google Sheets.`); await load();
    } catch (e) { setError(e.message); } finally { setBusy(false); setActivity(''); }
  };
  const visible = rows.filter(row => `${row.name} ${row.email} ${row.phone} ${row.institution} ${row.city}`.toLowerCase().includes(search.toLowerCase()));
  const pending = rows.filter(row => !row.sheets_synced_at).length;
  return <AdminDialog labelId="registrations-title" onClose={onClose} busy={busy} returnFocus={returnFocus} className="studio-registrations-dialog"><header className="studio-editor-header"><div><p className="studio-kicker">Event registrations</p><h2 id="registrations-title">{event.title}</h2></div><button className="studio-icon" disabled={busy} onClick={onClose} aria-label="Close registrations"><FiX /></button></header><div className="studio-registrations-body"><div className="studio-registrations-summary"><div><FiUsers /><strong>{rows.length}</strong><span>Registered students</span></div><p>{sheet?.synced_at ? `Last synced ${new Date(sheet.synced_at).toLocaleString('en-IN')} · ${pending} pending` : 'Connect a private spreadsheet for this event.'}</p></div><div className="studio-registrations-actions"><button className="studio-button primary" disabled={busy || loading || !supabase} onClick={sync}><FiRefreshCw />{activity === 'sync' ? 'Syncing…' : sheet?.spreadsheet_id ? 'Sync to Google Sheets' : 'Create & sync Google Sheet'}</button>{sheet?.spreadsheet_id && <a className="studio-button secondary" href={`https://docs.google.com/spreadsheets/d/${encodeURIComponent(sheet.spreadsheet_id)}/edit`} target="_blank" rel="noopener noreferrer">Open sheet<FiExternalLink /></a>}<button className="studio-button secondary" disabled={busy} onClick={() => { setLoading(true); setError(''); load().catch(e => { setError(e.message); setLoading(false); }); }}>Refresh list</button></div><p className="studio-registrations-note">Only registrations for this event appear here. Student details and the Google Sheet are private to your team. New registrations sync automatically after the sheet is connected; retry here if any are pending.</p><div className="studio-pass-intro"><FiMail /><div><strong>Confirmation & event pass</strong><p>{emailReady ? 'Send a personal confirmation with a PDF admission pass to each registered student. Sent means Gmail accepted the message; it does not confirm inbox delivery or attendance.' : emailService ? 'PDF pass downloads are ready. Connect the Workspace sender with Google sign-in to enable sending.' : 'Email-pass service setup is pending. Existing registrations and Google Sheets sync remain available.'}</p></div></div>{error && <p role="alert" className="studio-form-error">{error}</p>}{message && <p role="status">{message}</p>}<label className="studio-field"><span>Find a student</span><input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Name, email, phone or college" /></label>{loading ? <p role="status">Loading registrations…</p> : rows.length ? <div className="studio-registrations-table"><table><caption className="sr-only">Registered students for {event.title}</caption><thead><tr><th scope="col">Student</th><th scope="col">Contact</th><th scope="col">School / college</th><th scope="col">Registered</th><th scope="col">Confirmation & pass</th></tr></thead><tbody>{visible.map(row => <tr key={row.id}><td><strong>{row.name}</strong><small>{row.city}</small></td><td><a href={`mailto:${row.email}`}>{row.email}</a><small>{row.phone}</small></td><td>{row.institution}</td><td>{new Date(row.created_at).toLocaleString('en-IN')}</td><td className="studio-pass-cell"><span className={`studio-pass-status is-${row.pass_email_status || 'not_sent'}`}>{row.pass_email_status === 'sent' ? <><FiCheckCircle />Sent</> : row.pass_email_status === 'sending' ? 'Sending / awaiting status' : row.pass_email_status === 'review' ? 'Check Gmail Sent' : row.pass_email_status === 'failed' ? 'Not sent · Retry available' : 'Not sent'}</span>{row.pass_email_sent_at && <small>{new Date(row.pass_email_sent_at).toLocaleString('en-IN')}</small>}{row.pass_email_error && <small>{row.pass_email_error}</small>}<div className="studio-pass-actions"><button className="studio-button secondary" disabled={busy || !emailService} onClick={() => emailAction('preview', row)} aria-label={`Download PDF pass for ${row.name}`}><FiDownload />{activity === `preview:${row.id}` ? 'Preparing…' : 'PDF pass'}</button>{!['sent','sending','review'].includes(row.pass_email_status) && <button className="studio-button primary" disabled={busy || !emailReady} onClick={() => emailAction('send', row)} aria-label={`Send confirmation and event pass to ${row.name}`}><FiMail />{activity === `send:${row.id}` ? 'Sending…' : row.pass_email_status === 'failed' ? 'Retry confirmation' : 'Send confirmation & pass'}</button>}{(row.pass_email_status === 'review' || (row.pass_email_status === 'sending' && Date.now() - new Date(row.pass_email_started_at).getTime() > 300000)) && <><button className="studio-button secondary" disabled={busy || !emailService} onClick={() => emailAction('resolve', row, 'sent')}>Verified in Gmail: mark sent</button><button className="studio-button secondary" disabled={busy || !emailService} onClick={() => emailAction('resolve', row, 'not_sent')}>Verified not sent: allow retry</button></>}</div></td></tr>)}</tbody></table>{!visible.length && <p>No students match your search.</p>}</div> : <div className="studio-empty"><FiUsers /><h3>Your guest list starts here.</h3><p>Students who submit this event’s registration form will appear here.</p></div>}</div></AdminDialog>;
}
