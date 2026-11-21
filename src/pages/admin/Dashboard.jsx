import { impactMetrics } from './impactMetrics';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiBookOpen, FiCalendar, FiUsers, FiMapPin, FiMail, FiClock, FiRefreshCw } from 'react-icons/fi';
import { supabase } from '../../lib/supabase';

async function readAll(table, columns) {
  const result = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase.from(table).select(columns).order('id').range(from, from + 999);
    if (error) throw error;
    result.push(...data);
    if (data.length < 1000) return result;
  }
}
export default function Dashboard({ previewContent }) {
  const [state, setState] = useState({ loading: true, metrics: null, errors: [], updated: null });
  const load = useCallback(async () => {
    setState(current => ({ ...current, loading: true, errors: [] }));
    if (!supabase) {
      const content = Object.entries(previewContent).flatMap(([kind, rows]) => rows.map(row => ({ kind, published: row.published, content: row })));
      setState({ loading: false, metrics: { ...impactMetrics(content, []), queries: null, pending: null, participants: null, registrations: null }, errors: [], updated: new Date() }); return;
    }
    const results = await Promise.allSettled([
      readAll('site_content', 'id,kind,content,published'),
      readAll('event_registrations', 'id,email'),
      supabase.from('contact_queries').select('id', { count: 'exact', head: true }).then(r => { if(r.error) throw r.error; return r.count; }),
      supabase.from('contact_queries').select('id', { count: 'exact', head: true }).is('sheets_synced_at', null).then(r => { if(r.error) throw r.error; return r.count; }),
    ]);
    const value = index => results[index].status === 'fulfilled' ? results[index].value : null;
    const metrics = impactMetrics(value(0) || [], value(1) || []);
    if (value(0) === null) for (const key of ['partners','conducted','cities','upcoming','drafts','nextEvents']) metrics[key] = null;
    if (value(1) === null) metrics.participants = metrics.registrations = null;
    setState({ loading: false, metrics: { ...metrics, queries: value(2), pending: value(3) }, errors: results.flatMap((r,i) => r.status === 'rejected' ? [['Website content','Event participants','Enquiries','Sheet sync'][i]] : []), updated: new Date() });
  }, [previewContent]);
  useEffect(() => { load(); const refresh = () => { if(document.visibilityState === 'visible') load(); }; document.addEventListener('visibilitychange', refresh); return () => document.removeEventListener('visibilitychange', refresh); }, [load]);
  const m = state.metrics || {};
  const cards = [
    ['Partnered colleges',m.partners,'Published college partnerships',FiBookOpen,'partners'],
    ['Events conducted',m.conducted,'Published events with a past date',FiCalendar,'events'],
    ['Total participants',m.participants,'Unique registered email addresses',FiUsers,'events'],
    ['Cities covered',m.cities,'Distinct event locations · excludes online',FiMapPin,'events'],
    ['Upcoming events',m.upcoming,'Published events from today onwards',FiClock,'events'],
    ['Visitor enquiries',m.queries,'All contact form submissions',FiMail,'queries'],
  ];
  const number = value => value == null ? '—' : value.toLocaleString();
  return <section className="studio-main studio-dashboard" aria-busy={state.loading}>
    <div className="studio-collection-header"><div><p className="studio-kicker">Your impact, at a glance</p><h1>Every connection counts.</h1><p>A live overview of your colleges, events and student community.</p></div><button className="studio-button secondary" disabled={state.loading} onClick={load}><FiRefreshCw />{state.loading ? 'Refreshing…' : 'Refresh insights'}</button></div>
    {state.errors.length > 0 && <p className="studio-form-error" role="alert">Couldn’t load {state.errors.join(', ')}. Available insights are shown below. Try refreshing.</p>}
    <div className="studio-impact-grid">{cards.map(([label,value,detail,Icon,target]) => <Link className="studio-impact-card" to={`/admin/${target}`} key={label}><div><span className="studio-impact-icon"><Icon /></span><FiArrowUpRight aria-hidden="true" /></div><h2>{label}</h2><strong className={state.loading ? 'studio-metric-loading' : ''}>{state.loading ? '…' : number(value)}</strong><p>{detail}</p></Link>)}</div>
    <div className="studio-dashboard-bottom"><section className="studio-dashboard-panel"><div className="studio-panel-heading"><h2>Coming up next</h2><Link to="/admin/events">Manage events <FiArrowUpRight /></Link></div>{state.loading ? <p role="status">Loading event schedule…</p> : m.nextEvents?.length ? <ul className="studio-next-events">{m.nextEvents.map(event => <li key={event.id}><span className="studio-event-date">{new Date(`${event.content.date}T12:00:00`).toLocaleDateString(undefined,{day:'numeric',month:'short'})}</span><div><strong>{event.content.title}</strong><p>{event.content.location}</p></div></li>)}</ul> : <p>{m.nextEvents === null ? 'Event schedule unavailable. Refresh to try again.' : 'No upcoming events yet. Create and publish your next event to see it here.'}</p>}</section>
    <section className="studio-dashboard-panel"><div className="studio-panel-heading"><h2>Workspace pulse</h2></div><dl className="studio-pulse"><div><dt>Event registrations <small>Includes repeat participants across events</small></dt><dd>{state.loading ? '…' : number(m.registrations)}</dd></div><div><dt>Draft entries <small>Across all content sections</small></dt><dd>{state.loading ? '…' : number(m.drafts)}</dd></div><div><dt>Enquiries awaiting Sheet sync <small><Link to="/admin/queries">Review enquiries →</Link></small></dt><dd>{state.loading ? '…' : number(m.pending)}</dd></div></dl></section></div>
    <p className="studio-dashboard-note" role="status">{!supabase ? 'Design preview · Sample content; participant and enquiry totals unavailable.' : state.loading ? 'Updating insights…' : `Updated ${state.updated?.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}. Participants reflect registrations, not confirmed attendance. Cities use the event location field.`}</p>
  </section>;
}
