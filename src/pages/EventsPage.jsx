import { CatalystCalendar } from '../components/Homepage/EventsCalendarBanner';
import EventRegistration from '../features/events/EventRegistration';
import { useEffect, useState } from 'react';
import { FiArrowRight, FiCalendar, FiClock, FiMapPin, FiX } from 'react-icons/fi';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchEventById, fetchEventsByStatus } from '../redux/features/eventSlice';
import EventImage from '../components/ui/EventImage';
import PageHero from '../components/ui/PageHero';

Modal.setAppElement('#root');
const formatDate = (value) => value && !Number.isNaN(new Date(value).getTime()) ? new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value)) : 'Date to be announced';
const getErrorMessage = (error) => error?.message || error?.error || (typeof error === 'string' ? error : 'Something went wrong. Please try again.');

const EventsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryTab = new URLSearchParams(location.search).get('tab');
  const activeTab = queryTab?.toLowerCase() === 'recent' ? 'Recent' : 'Upcoming';
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState('');
  const { events, status, error } = useSelector((state) => state.events);
  const eventList = Array.isArray(events) ? events : [];

  useEffect(() => { dispatch(fetchEventsByStatus(activeTab)); }, [activeTab, dispatch]);

  const showEvent = async (eventItem) => {
    setSelectedEvent(eventItem);
    const result = await dispatch(fetchEventById(eventItem._id));
    if (fetchEventById.fulfilled.match(result) && result.payload?.event) setSelectedEvent(result.payload.event);
  };

  const startRegistration = (eventItem) => { setSelectedEvent(eventItem); setConfirming(true); setRegistrationMessage(''); };

  return (
    <>
      <PageHero variant="events" eyebrow="Career Valley events" title="Meet people, ask better questions and explore what’s possible." description="Education fairs, open houses and student-focused sessions designed to bring useful information and real conversations into one place." />
      <section className="section events-calendar-inverted"><div className="site-container"><p className="eyebrow">Official event calendar</p><h2 className="section-title">Career Catalyst 4.0</h2><p className="lead">13 cities · December 2026 – February 2027. Select your city to enquire. Event times will be announced.</p><CatalystCalendar /></div></section>
      <section className="section"><div className="site-container">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow">Event calendar</p><h2 className="mt-3 text-3xl font-bold tracking-tight">{activeTab} events</h2></div><div className="inline-flex rounded-full border border-[var(--color-border)] bg-white p-1" role="group" aria-label="Event status"><button type="button" onClick={() => navigate('/events?tab=Upcoming')} className={`rounded-full px-5 py-2 text-sm font-bold ${activeTab === 'Upcoming' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-muted)]'}`}>Upcoming</button><button type="button" onClick={() => navigate('/events?tab=Recent')} className={`rounded-full px-5 py-2 text-sm font-bold ${activeTab === 'Recent' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-muted)]'}`}>Recent</button></div></div>
        {registrationMessage && <p className="mt-8 rounded-xl bg-[var(--color-primary-soft)] p-4 font-semibold text-[var(--color-primary-strong)]" role="status">{registrationMessage}</p>}
        {status === 'loading' && eventList.length === 0 && <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-label="Loading events">{[1, 2, 3].map((item) => <div key={item} className="h-96 animate-pulse rounded-[var(--radius-md)] bg-[var(--color-surface-muted)]" />)}</div>}
        {status === 'failed' && <div className="card mt-12 p-8 text-center"><h3 className="text-xl font-bold">We couldn’t load events.</h3><p className="mt-2 text-[var(--color-muted)]">{getErrorMessage(error)}</p><button className="button button-secondary mt-5" type="button" onClick={() => dispatch(fetchEventsByStatus(activeTab))}>Try again</button></div>}
        {status !== 'loading' && status !== 'failed' && eventList.length === 0 && <div className="mt-12 rounded-[var(--radius-lg)] bg-[var(--color-surface-muted)] p-12 text-center"><FiCalendar className="mx-auto text-3xl text-[var(--color-primary)]" /><h3 className="mt-5 text-2xl font-bold">No {activeTab.toLowerCase()} events right now.</h3><p className="mx-auto mt-2 max-w-lg text-[var(--color-muted)]">Check the other tab or contact the team to learn about future sessions.</p></div>}
        {eventList.length > 0 && <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{eventList.map((item) => <article key={item._id} className="card overflow-hidden"><div className="aspect-[16/10] bg-[var(--color-primary-soft)]"><EventImage event={item} className="h-full w-full object-cover" /></div><div className="p-6"><p className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">{item.eventType || 'Career Valley event'}</p><h3 className="mt-3 text-xl font-bold">{item.title}</h3><div className="mt-5 grid gap-2 text-sm text-[var(--color-muted)]"><span className="flex items-center gap-2"><FiCalendar />{formatDate(item.date)}</span>{item.time && <span className="flex items-center gap-2"><FiClock />{item.time}</span>}<span className="flex items-center gap-2"><FiMapPin />{item.location || 'Location to be announced'}</span></div><div className="mt-6 flex flex-wrap gap-2"><button className="button button-secondary !min-h-10 !px-4" type="button" onClick={() => showEvent(item)}>View details</button>{activeTab === 'Upcoming' && <button className="button button-primary !min-h-10 !px-4" type="button" onClick={() => startRegistration(item)}>Register <FiArrowRight /></button>}</div></div></article>)}</div>}
      </div></section>

      <Modal isOpen={Boolean(selectedEvent) && !confirming} onRequestClose={() => setSelectedEvent(null)} className="modal-content-1" overlayClassName="modal-overlay-1" contentLabel="Event details"><button type="button" className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-[var(--color-surface-muted)]" onClick={() => setSelectedEvent(null)} aria-label="Close event details"><FiX /></button>{selectedEvent && <div><EventImage event={selectedEvent} className="max-h-64 w-full rounded-xl object-cover" /><p className="mt-6 text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">{selectedEvent.eventType || 'Event details'}</p><h2 className="mt-2 pr-10 text-3xl font-bold">{selectedEvent.title}</h2><div className="mt-4 flex flex-wrap gap-4 text-sm text-[var(--color-muted)]"><span className="flex items-center gap-2"><FiCalendar />{formatDate(selectedEvent.date)}</span><span className="flex items-center gap-2"><FiMapPin />{selectedEvent.location}</span>{selectedEvent.time && <span className="flex items-center gap-2"><FiClock />{selectedEvent.time}</span>}</div>{selectedEvent.desc && <p className="mt-6 leading-7 text-[var(--color-muted)]">{selectedEvent.desc}</p>}{activeTab === 'Upcoming' && <button className="button button-primary mt-7" type="button" onClick={() => startRegistration(selectedEvent)}>Register for this event</button>}</div>}</Modal>
      {confirming && selectedEvent && <EventRegistration event={selectedEvent} onClose={() => { setConfirming(false); setSelectedEvent(null); }} onSuccess={setRegistrationMessage} />}
    </>
  );
};
export default EventsPage;
