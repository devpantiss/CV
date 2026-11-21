import { functionErrorMessage } from '../../lib/functionError';
import { useEffect, useState } from 'react';
import { FiExternalLink, FiRefreshCw } from 'react-icons/fi';
import { supabase } from '../../lib/supabase';
async function readQueries() {
  if (!supabase) return { rows: [], sheet: null };
  const rows = [];
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await supabase.from('contact_queries').select('*').order('created_at', { ascending: false }).order('id').range(offset, offset + 999);
    if (error) throw new Error('Unable to load queries. Please try again.');
    rows.push(...data); if (data.length < 1000) break;
  }
  const { data: sheet, error } = await supabase.from('contact_query_sheet').select('*').eq('id', 'contact').maybeSingle();
  if (error) throw new Error('Unable to load spreadsheet status.');
  return { rows, sheet };
}
export default function ContactQueries() {
  const [data, setData] = useState({ rows: [], sheet: null });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  useEffect(() => { let active = true; readQueries().then(result => { if (active) setData(result); }).catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []);
  const refresh = async () => { setLoading(true); setError(''); try { setData(await readQueries()); } catch (e) { setError(e.message); } finally { setLoading(false); } };
  const sync = async () => {
    setBusy(true); setError(''); setMessage('');
    try {
      const { data: result, error: failure } = await supabase.functions.invoke('contact-query', { body: { action: 'sync' } });
      if (failure) throw new Error(await functionErrorMessage(failure, 'Unable to sync queries. Please retry.'));
      if (!result?.success) throw new Error(result?.error || 'Unable to sync queries.');
      setMessage(result.pending ? 'A sync is already running. Refresh shortly.' : `${result.count} queries synced.`); setData(await readQueries());
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  };
  const visible = data.rows.filter(row => `${row.name} ${row.email} ${row.topic} ${row.message}`.toLowerCase().includes(search.toLowerCase()));
  return <section className="studio-main"><div className="studio-collection-header"><div><p className="studio-kicker">Visitor enquiries</p><h1>A clearer next step starts here.</h1><p>Questions from your contact page, kept separate from event registrations.</p></div></div><div className="studio-registrations-summary"><div><strong>{data.rows.length}</strong><span>Queries received</span></div><p>{data.rows.filter(row => !row.sheets_synced_at).length} pending sync{data.sheet?.synced_at && ` · Last synced ${new Date(data.sheet.synced_at).toLocaleString('en-IN')}`}</p></div><div className="studio-registrations-actions"><button className="studio-button primary" disabled={busy || loading || !supabase} onClick={sync}><FiRefreshCw />{busy ? 'Syncing…' : 'Sync queries to Google Sheets'}</button>{data.sheet?.spreadsheet_id && <a className="studio-button secondary" target="_blank" rel="noopener noreferrer" href={`https://docs.google.com/spreadsheets/d/${encodeURIComponent(data.sheet.spreadsheet_id)}/edit`}>Open query sheet<FiExternalLink /></a>}<button className="studio-button secondary" disabled={busy || loading} onClick={refresh}>Refresh</button></div><p className="studio-registrations-note">Queries save immediately and sync automatically to a separate private Google Sheet. Retry here if any are pending.</p>{error && <p role="alert" className="studio-form-error">{error}</p>}{message && <p role="status">{message}</p>}<label className="studio-field"><span>Search queries</span><input type="search" placeholder="Name, email, topic or message" value={search} onChange={e => setSearch(e.target.value)} /></label>{loading ? <p role="status">Loading enquiries…</p> : visible.length ? <div className="studio-registrations-table"><table><caption className="sr-only">Contact form enquiries</caption><thead><tr><th scope="col">Visitor</th><th scope="col">Query</th><th scope="col">Received</th></tr></thead><tbody>{visible.map(row => <tr key={row.id}><td><strong>{row.name}</strong><small>{row.email}</small><small>{row.phone || 'No phone provided'}</small></td><td><strong>{row.topic}</strong><p className="studio-query-message">{row.message}</p></td><td>{new Date(row.created_at).toLocaleString('en-IN')}<small>{row.sheets_synced_at ? 'Synced' : 'Pending sync'}</small></td></tr>)}</tbody></table></div> : <div className="studio-empty"><h2>{search ? 'No matching queries.' : 'Your inbox is ready.'}</h2><p>{search ? 'Try a different search.' : 'Visitor questions will appear here when someone submits the contact form.'}</p></div>}</section>;
}
