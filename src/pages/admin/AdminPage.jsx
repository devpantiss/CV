import { profileCategory } from '../../features/content/people';
import Dashboard from './Dashboard';
import LoginBackground from './LoginBackground';
import ContactQueries from './ContactQueries';
import EventRegistrations from './EventRegistrations';
import { discardUpload } from '../../lib/mediaStorage';
import GalleryEditor from './GalleryEditor';
import { saveGalleryEntry } from '../../features/gallery/repository';
import { setGalleryPreview } from '../../features/gallery/previewStore';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiLock, FiShield, FiGrid, FiEye, FiEyeOff, FiBookOpen, FiMail, FiArrowUpRight, FiPlus, FiLogOut, FiImage, FiMoon, FiSun, FiCalendar, FiUsers, FiMessageSquare, FiSearch, FiChevronRight, FiX, FiCheckCircle } from 'react-icons/fi';
import ContentEditor from './ContentEditor';
import ContentCard from './ContentCard';
import AdminDialog from './AdminDialog';
import { supabase } from '../../lib/supabase';
import { fields, imageField, readContent, uploadImage, validateContent } from '../../features/content/content';
import { createPreviewContent, readPreviewImage } from './previewContent';
import { validateImage } from '../../features/content/validation';
import './admin.css';
import '../../features/gallery/gallery.css';

const isPreview = !supabase;
const labels = { dashboard: 'Dashboard', events: 'Events', team: 'Team & Experts', testimonials: 'Testimonials', gallery: 'Gallery', partners: 'Partner Colleges', queries: 'Queries' };
export default function AdminPage() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const requestedKind = pathname.split('/')[2];
  const kind = Object.hasOwn(labels, requestedKind) ? requestedKind : 'dashboard';
  const [previewContent, setPreviewContent] = useState(createPreviewContent);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [peopleGroup, setPeopleGroup] = useState('team');
  const [auth, setAuth] = useState({ loading: Boolean(supabase), user: null });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [draft, setDraft] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [registrations, setRegistrations] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [dark, setDark] = useState(false);
  const request = useRef(0);
  const returnFocus = useRef(null);
  useEffect(() => { if (isPreview) setGalleryPreview(previewContent.gallery); }, [previewContent.gallery]);

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    const verify = async (session) => {
      const version = ++request.current;
      if (!session) { if (active) { setAuth({ loading: false, user: null }); setRows([]); setDraft(null); setRegistrations(null); } return; }
      const { data, error: accessError } = await supabase.rpc('is_site_admin');
      if (!active || version !== request.current) return;
      if (accessError || !data) { setError('This account does not have administrator access.'); await supabase.auth.signOut(); return; }
      setAuth((current) => current.user?.id === session.user.id ? current : { loading: false, user: session.user });
    };
    supabase.auth.getSession().then(({ data }) => verify(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => { setTimeout(() => verify(session), 0); });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (kind === 'queries' || kind === 'dashboard') { setRows([]); setDraft(null); setLoading(false); return; }
    if (isPreview) { setRows(previewContent[kind]); setDraft(null); setDeleting(null); setFile(null); return; }
    if (!auth.user) return;
    let active = true;
    setLoading(true); setRows([]); setError(''); setDraft(null); setDeleting(null);
    readContent(kind, true).then((data) => { if (active) setRows(data); }).catch(() => { if (active) setError('Unable to load content. Check your connection and database setup.'); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [kind, auth.user, previewContent]);
  useEffect(() => {
    if (!file) { setPreview(''); return; }
    const url = URL.createObjectURL(file); setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const login = async (event) => {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const form = new FormData(event.currentTarget);
      const { error: loginError } = await supabase.auth.signInWithPassword({ email: form.get('email'), password: form.get('password') });
      if (loginError) setError('Unable to sign in. Check your email and password and try again.');
    } catch { setError('Unable to reach the sign-in service. Please try again.'); }
    finally { setBusy(false); }
  };
  const edit = (row = {}, trigger = document.activeElement) => { returnFocus.current = trigger; setDraft({ published: false, sort_order: 0, ...(kind === 'gallery' ? { mediaType: 'image' } : {}), ...row, ...(kind === 'team' ? { profileType: row.id || row.name ? profileCategory(row) : peopleGroup } : {}) }); setFile(null); setError(''); setMessage(''); };
  const save = async (event) => {
    event.preventDefault(); setBusy(true); setError(''); setMessage('');
    let uploaded;
    try {
      if (kind === 'gallery') {
        const next = await saveGalleryEntry({ draft, file, preview: isPreview, existing: previewContent.gallery });
        if (isPreview) setPreviewContent((current) => ({ ...current, gallery: next }));
        else setRows(await readContent('gallery', true));
        setDraft(null); setFile(null); setMessage(isPreview ? 'Gallery preview saved. Published entries are visible on the Gallery page in this session.' : 'Gallery entry saved.');
        return;
      }
      const content = Object.fromEntries(fields[kind].map(([key]) => [key, (draft[key] || '').trim()]));
      validateContent(kind, content);
      content[imageField(kind)] = draft[imageField(kind)] || '';
      content.driveFileId = draft.driveFileId || '';
      if (kind === 'partners' && !file && draft.logoPosition) content.logoPosition = draft.logoPosition;
      if (isPreview) {
        if (file) { validateImage(file); content[imageField(kind)] = await readPreviewImage(file); }
        if (kind !== 'testimonials' && !content[imageField(kind)]) throw new Error('Please choose an image.');
        const entry = { ...content, id: draft.id || crypto.randomUUID(), published: draft.published, sort_order: Number(draft.sort_order) || 0 };
        setPreviewContent((current) => ({ ...current, [kind]: (draft.id ? current[kind].map((row) => row.id === draft.id ? entry : row) : [...current[kind], entry]).sort((a, b) => a.sort_order - b.sort_order) }));
        setDraft(null); setFile(null); setMessage('Preview saved for this session. Your live website has not changed.');
        return;
      }
      if (file) { uploaded = await uploadImage(kind, file); content[imageField(kind)] = uploaded.url; content.driveFileId = uploaded.id; }
      if (kind !== 'testimonials' && !content[imageField(kind)]) throw new Error('Please upload an image.');
      const payload = { kind, content, published: draft.published, sort_order: Number(draft.sort_order) || 0 };
      const query = draft.id ? supabase.from('site_content').update(payload).eq('id', draft.id) : supabase.from('site_content').insert(payload);
      const { error: saveError } = await query.select().single();
      if (saveError) throw saveError;
      uploaded = null;
      setDraft(null); setFile(null); setMessage('Saved. Published entries are now available on the website.');
      setRows(await readContent(kind, true));
    } catch (saveError) {
      if (uploaded) { try { await discardUpload(uploaded); } catch { /* Report the save failure; unused files can be removed from Drive. */ } }
      setError(saveError.message || 'Unable to save. Please try again.');
    } finally { setBusy(false); }
  };
  const remove = async () => {
    setBusy(true); setError('');
    try {
      if (isPreview) {
        setPreviewContent((current) => ({ ...current, [kind]: current[kind].filter((row) => row.id !== deleting.id) }));
        setDeleting(null); setMessage('Entry removed from this preview.'); return;
      }
      const { error: deleteError } = await supabase.from('site_content').delete().eq('id', deleting.id).select().single();
      if (deleteError) throw deleteError;
      setRows((current) => current.filter((row) => row.id !== deleting.id)); if (draft?.id === deleting.id) setDraft(null); setDeleting(null); setMessage('Content deleted.');
    } catch { setError(kind === 'events' ? 'Unable to delete this event. Events with registrations are retained; unpublish the event to remove it from the website.' : 'Unable to delete content. Please try again.'); }
    finally { setBusy(false); }
  };

  const collectionRows = kind === 'team' ? rows.filter(row => profileCategory(row) === peopleGroup) : rows;
  const visibleRows = collectionRows.filter((row) => `${row.title || row.name} ${row.location || row.role || row.stage || row.mediaType || ''}`.toLowerCase().includes(search.toLowerCase()) && (filter === 'all' || row.published === (filter === 'published')));
  const totalEntries = isPreview ? Object.values(previewContent).reduce((sum, items) => sum + items.length, 0) : rows.length;

  const activeIndex = Object.keys(labels).indexOf(kind) + 1;
  const collectionIcons = { dashboard: FiGrid, events: FiCalendar, team: FiUsers, testimonials: FiMessageSquare, gallery: FiImage, partners: FiBookOpen, queries: FiMail };
  const closeEditor = () => { if (!busy) { setDraft(null); setFile(null); setError(''); } };
  const switchCollection = (key) => { navigate(`/admin/${key}`); setMessage(''); setError(''); setSearch(''); setFilter('all'); };

  if (!isPreview && (auth.loading || !auth.user)) return <main className="admin-shell studio-login-shell" data-theme={dark ? 'dark' : 'light'}>
    <LoginBackground />
    <section className="studio-auth" aria-labelledby="studio-signin-title">
      <div className="studio-auth-brand-row"><Link to="/" className="studio-brand"><img className="studio-login-logo" src="/career-valley-logo-transparent.png" alt="Career Valley" /></Link><span className="studio-auth-badge"><FiShield aria-hidden="true" /><span>Admin studio</span></span></div>
      {auth.loading ? <p role="status">Checking access…</p> : <>
        <div className="studio-auth-heading"><p className="studio-kicker">Welcome back</p><h1 id="studio-signin-title">Sign in to your studio.</h1><p>Sign in to manage your Career Valley workspace.</p></div>
        <form onSubmit={login} aria-busy={busy}>
          <label className="studio-field"><span>Email address</span><span className="studio-auth-input"><FiMail aria-hidden="true" /><input name="email" type="email" placeholder="you@example.com" autoComplete="username" autoCapitalize="none" spellCheck={false} required disabled={busy} /></span></label>
          <label className="studio-field"><span>Password</span><span className="studio-password-input studio-auth-input"><FiLock aria-hidden="true" /><input name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" autoComplete="current-password" required disabled={busy} /><button type="button" className="studio-icon" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword(value => !value)}>{showPassword ? <FiEyeOff /> : <FiEye />}</button></span></label>
          {error && <p className="studio-form-error" role="alert">{error}</p>}
          <button className="studio-button primary studio-auth-submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in to workspace'}<FiArrowUpRight aria-hidden="true" /></button>
        </form>
        <div className="studio-auth-footer"><span><FiShield aria-hidden="true" />For authorised administrators</span><Link to="/">Back to website <FiArrowUpRight aria-hidden="true" /></Link></div>
      </>}
    </section>
  </main>;

  return <div className="admin-shell" data-theme={dark ? 'dark' : 'light'}>
    <aside className="studio-sidebar"><Link to="/" className="studio-brand"><span className="studio-monogram">cv<span>↗</span></span><span>Career Valley<small>Content studio</small></span></Link><div className="studio-workspace"><span className="studio-workspace-icon">CV</span><div>Career Valley<small>Website workspace</small></div><span className="studio-workspace-dot" /></div><p className="studio-nav-label">Manage content</p><nav aria-label="Content sections">{Object.entries(labels).map(([key, label]) => { const Icon = collectionIcons[key]; return <button key={key} disabled={busy} aria-current={key === kind ? 'page' : undefined} onClick={() => switchCollection(key)}><Icon /><span>{label}</span>{isPreview && previewContent[key] && <small>{previewContent[key].length}</small>}</button>; })}</nav><div className="studio-sidebar-bottom"><Link to="/" className="studio-view-site">View website<FiArrowUpRight /></Link><div className="studio-account"><span className="studio-avatar">CV</span><div title={auth.user?.email || 'Career Valley team'}>{isPreview ? 'Career Valley team' : auth.user?.email || 'Administrator'}<small>{isPreview ? 'Design preview' : 'Content administrator'}</small></div>{auth.user && <button className="studio-icon" aria-label="Sign out" disabled={busy} onClick={async () => { const { error: signOutError } = await supabase.auth.signOut(); if (signOutError) setError('Unable to sign out. Please try again.'); }}><FiLogOut /></button>}</div></div></aside>
    <div className="studio-workspace-main"><header className="studio-topbar"><div className="studio-breadcrumb">Workspace<FiChevronRight /><span>{labels[kind]}</span></div><div className="studio-topbar-actions">{isPreview && <span className="studio-preview-pill"><i />Design preview</span>}<button className="studio-icon" onClick={() => setDark(!dark)} aria-label={`Switch to ${dark ? 'light' : 'dark'} theme`}>{dark ? <FiSun /> : <FiMoon />}</button><span className="studio-avatar">CV</span></div></header>
    {kind === 'dashboard' ? <Dashboard previewContent={previewContent} /> : kind === 'queries' ? <ContactQueries /> : <section className="studio-main"><div className="studio-collection-header"><div><p className="studio-kicker"><span>0{activeIndex}</span> / Content library</p><h1>{kind === 'partners' ? 'A network of possibilities.' : kind === 'team' ? 'People behind the guidance.' : kind === 'events' ? 'Events & experiences.' : kind === 'gallery' ? 'A gallery of possibilities.' : 'Student stories.'}</h1><p>{kind === 'partners' ? 'Manage the colleges featured on your homepage.' : kind === 'events' ? 'Create moments that help students find their way.' : kind === 'team' ? 'Introduce the people making a difference, every day.' : kind === 'gallery' ? 'The moments, media and conversations worth sharing.' : 'Real students. Clearer decisions. A meaningful next step.'}</p></div><button className="studio-button primary" disabled={busy || loading} onClick={(event) => edit({}, event.currentTarget)}><FiPlus />{kind === 'partners' ? 'Add partner college' : kind === 'team' ? peopleGroup === 'expert' ? 'Add expert' : 'Add team member' : kind === 'events' ? 'Create event' : kind === 'gallery' ? 'Upload media / podcast' : 'Add testimonial'}</button></div>
    <div className="studio-summary"><div><span className="studio-summary-icon"><FiImage /></span><strong>{rows.length}</strong><span>Total {kind === 'partners' ? 'colleges' : kind === 'team' ? 'members' : kind === 'events' ? 'events' : kind === 'gallery' ? 'media entries' : 'stories'}</span></div><div><i className="studio-dot live" /><strong>{rows.filter((row) => row.published).length}</strong><span>Published</span></div><div><i className="studio-dot draft" /><strong>{rows.filter((row) => !row.published).length}</strong><span>Drafts</span></div><p>{isPreview ? 'Sample content · Changes reset on refresh' : 'Your website content, in one place'}</p></div>
    {kind === 'team' && <div className="studio-people-groups studio-filters" aria-label="Profile category">{[['team', 'Team'], ['expert', 'Experts']].map(([value, label]) => <button key={value} aria-pressed={peopleGroup === value} onClick={() => { setPeopleGroup(value); setSearch(''); setFilter('all'); }}>{label}<span>{rows.filter(row => profileCategory(row) === value).length}</span></button>)}<Link to={peopleGroup === 'expert' ? '/experts' : '/team'} className="studio-button secondary">View {peopleGroup === 'expert' ? 'Our Experts' : 'Our Team'}<FiArrowUpRight /></Link></div>}{kind === 'gallery' && <div className="studio-gallery-intro"><span>Media uploads <strong>{rows.filter((row) => row.mediaType !== 'podcast').length}</strong></span><span>YouTube podcasts <strong>{rows.filter((row) => row.mediaType === 'podcast').length}</strong></span><Link to="/gallery" className="studio-button secondary">View gallery <FiArrowUpRight /></Link></div>}<div className="studio-library-heading"><h2>{kind === 'team' ? peopleGroup === 'expert' ? 'Experts' : 'Team' : labels[kind]}<span>{collectionRows.length.toString().padStart(2, '0')}</span></h2><span>{isPreview ? `${totalEntries} entries across your studio` : 'Content library'}</span></div><div className="studio-toolbar"><div className="studio-filters" aria-label="Filter content">{['all', 'published', 'draft'].map((value) => <button key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{value === 'all' ? 'All entries' : value === 'draft' ? 'Drafts' : 'Published'}<span>{value === 'all' ? collectionRows.length : collectionRows.filter((row) => row.published === (value === 'published')).length}</span></button>)}</div><label className="studio-search"><FiSearch /><span className="sr-only">Search {labels[kind]}</span><input type="search" placeholder={`Search ${labels[kind].toLowerCase()}…`} value={search} onChange={(event) => setSearch(event.target.value)} /></label></div>
    {loading ? <div className="studio-content-grid" role="status" aria-label="Loading content">{[1, 2, 3].map((item) => <div className="studio-skeleton" key={item}><div /><span /><span /></div>)}</div> : visibleRows.length ? <div className={`studio-content-grid studio-grid-${kind}`}>{visibleRows.map((row) => <ContentCard key={`${row.id}-${row[imageField(kind)]}`} row={row} kind={kind} busy={busy} onEdit={edit} onRegistrations={(entry, trigger) => { returnFocus.current = trigger; setRegistrations(entry); }} onDelete={(entry, trigger) => { returnFocus.current = trigger; setDeleting(entry); setError(''); }} />)}</div> : <div className="studio-empty"><FiSearch /><h2>{rows.length ? 'Nothing here matches just yet.' : `Your first ${kind === 'partners' ? 'partner college' : kind === 'events' ? 'event' : kind === 'team' ? 'team member' : kind === 'gallery' ? 'gallery entry' : 'story'} starts here.`}</h2><p>{rows.length ? 'Try another search, or take a look at all your entries.' : 'Add the details, choose an image and save when you’re ready.'}</p><button className="studio-button secondary" onClick={() => { if (rows.length) { setSearch(''); setFilter('all'); } else edit(); }}>{rows.length ? 'Clear filters' : 'Create first entry'}<FiPlus /></button></div>}
    <footer className="studio-library-footer"><span>Showing {visibleRows.length} of {collectionRows.length} entries</span><span>Made for clearer futures <span aria-hidden="true">↗</span></span></footer></section>}
    </div>
    {registrations && <EventRegistrations event={registrations} returnFocus={returnFocus.current} onClose={() => setRegistrations(null)} />}
    {draft && kind === 'gallery' && <GalleryEditor returnFocus={returnFocus.current} draft={draft} setDraft={setDraft} file={file} setFile={setFile} preview={preview} busy={busy} error={error} onSave={save} onClose={closeEditor} isPreview={isPreview} />}
    {draft && kind !== 'gallery' && <ContentEditor returnFocus={returnFocus.current} kind={kind} draft={draft} setDraft={setDraft} file={file} setFile={setFile} preview={preview} busy={busy} error={error} onSave={save} onClose={closeEditor} isPreview={isPreview} />}
    {deleting && <AdminDialog returnFocus={returnFocus.current} labelId="delete-title" onClose={() => setDeleting(null)} busy={busy} className="studio-delete-dialog"><div className="studio-delete-body"><span className="studio-delete-symbol"><FiX /></span><h2 id="delete-title">Delete this entry?</h2><p>“{deleting.title || deleting.name}” will be removed {isPreview ? 'from this preview' : 'permanently'}.</p>{error && <p role="alert" className="studio-form-error">{error}</p>}<div><button className="studio-button secondary" disabled={busy} onClick={() => setDeleting(null)}>Keep entry</button><button className="studio-button destructive" disabled={busy} onClick={remove}>{busy ? 'Deleting…' : 'Delete entry'}</button></div></div></AdminDialog>}
    {(message || (error && !draft && !deleting)) && <div className={`studio-notice ${error ? 'has-error' : ''}`} role={error ? 'alert' : 'status'}><FiCheckCircle /><span>{error || message}</span><button className="studio-icon" aria-label="Dismiss notification" onClick={() => { setError(''); setMessage(''); }}><FiX /></button></div>}
  </div>;
}
