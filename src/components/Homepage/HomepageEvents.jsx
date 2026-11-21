import EventRegistration from '../../features/events/EventRegistration';
import { supabase } from '../../lib/supabase';
import { useEffect, useRef, useState } from 'react';
import { FiArrowRight, FiCalendar, FiChevronLeft, FiChevronRight, FiClock, FiMapPin } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchEventsByStatus } from '../../redux/features/eventSlice';
import EventImage from '../ui/EventImage';
import SectionHeading from '../ui/SectionHeading';
import './upcoming-events.css';

const sampleEvents = [
  { _id: 'sample-career-open-house', title: 'Career Discovery Open House', eventType: 'Coming soon', location: 'Hyderabad', time: 'Schedule to be announced' },
  { _id: 'sample-ug-fair', title: 'Undergraduate Pathways Fair', eventType: 'Coming soon', location: 'Hyderabad', time: 'Schedule to be announced' },
  { _id: 'sample-parent-session', title: 'Parent & Student Guidance Session', eventType: 'Coming soon', location: 'Online session', time: 'Schedule to be announced' },
];

const HomepageEvents = () => {
  const dispatch = useDispatch();
  const sliderRef = useRef(null);
  const [registrationEvent, setRegistrationEvent] = useState(null);
  const [registrationMessage, setRegistrationMessage] = useState('');
  const [scrollState, setScrollState] = useState({ atStart: true, atEnd: false });
  const { events, status } = useSelector((state) => state.events);
  const eventList = Array.isArray(events) ? events.slice(0, 8) : [];
  const showingSamples = !supabase && status !== 'loading' && eventList.length === 0;
  const displayedEvents = showingSamples ? sampleEvents : eventList;
  useEffect(() => { dispatch(fetchEventsByStatus('Upcoming')); }, [dispatch]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return undefined;

    const updateScrollState = () => {
      const maxScroll = slider.scrollWidth - slider.clientWidth;
      setScrollState({
        atStart: slider.scrollLeft <= 2,
        atEnd: maxScroll <= 2 || slider.scrollLeft >= maxScroll - 2,
      });
    };

    updateScrollState();
    slider.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      slider.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [displayedEvents.length]);

  const moveSlider = (direction) => {
    const slider = sliderRef.current;
    if (!slider) return;
    slider.scrollBy({ left: direction * slider.clientWidth * 0.82, behavior: 'smooth' });
  };

  return <section className="section overflow-hidden upcoming-events-inverted"><div className="site-container"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><SectionHeading eyebrow="Upcoming events" title="Meet, explore and ask better questions." description="Join Career Valley education fairs, open houses and student-focused sessions." /><div className="event-slider-actions"><div className="event-slider-controls" aria-label="Event slider controls"><button type="button" onClick={() => moveSlider(-1)} disabled={scrollState.atStart} aria-label="Show previous events"><FiChevronLeft /></button><button type="button" onClick={() => moveSlider(1)} disabled={scrollState.atEnd} aria-label="Show next events"><FiChevronRight /></button></div><Link to="/events?tab=Upcoming" className="button button-secondary shrink-0">View all events <FiArrowRight /></Link></div></div>
    {status === 'loading' && eventList.length === 0 && <div className="mt-12 grid gap-5 md:grid-cols-3" aria-label="Loading upcoming events">{[1, 2, 3].map((item) => <div className="h-[390px] animate-pulse rounded-[var(--radius-md)] bg-[var(--color-surface-muted)]" key={item} />)}</div>}
    {supabase && status === 'failed' && <p role="alert" className="mt-8 text-[var(--color-muted)]">Events are temporarily unavailable. Please try again later.</p>}

    {showingSamples && <div className="mt-9 flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-accent-soft)] px-4 py-3 text-sm text-[var(--color-muted)]"><FiCalendar className="shrink-0 text-[var(--color-primary)]" /><p>Preview events are shown while the upcoming schedule is being prepared.</p></div>}
    {registrationMessage && <p role="status" className="mt-6">{registrationMessage}</p>}
    <div ref={sliderRef} className="campaign-preview-grid event-slider-track">{displayedEvents.map(event => {
      const date = event.date ? new Date(`${event.date}T12:00:00`) : null;
      return <article key={event._id || event.id} className="campaign-event-card">
        <Link to="/events" className="campaign-event-visual" aria-label={`View details for ${event.title}`}>
          <EventImage event={event} height={240} />
          {date && !Number.isNaN(date.getTime()) && <time className="campaign-event-date" dateTime={event.date}><span>{date.toLocaleDateString('en-IN', { month: 'short' })}</span><strong>{date.getDate().toString().padStart(2, '0')}</strong><span>{date.getFullYear()}</span></time>}
        </Link>
        <div className="campaign-event-content"><span className="campaign-event-series">{event.eventType || 'Career Valley event'}</span><h3>{event.title}</h3>
          <dl className="campaign-event-details"><div><dt><FiMapPin /><span className="sr-only">Venue</span></dt><dd>{event.venue || event.location || 'Location to be announced'}</dd></div><div><dt><FiClock /><span className="sr-only">Time</span></dt><dd>{event.time || 'Time to be announced'}</dd></div></dl>
          {showingSamples ? <Link className="campaign-event-cta" to="/contact_us">Ask about this event <span><FiArrowRight /></span></Link> : <button type="button" className="campaign-event-cta" onClick={() => { setRegistrationMessage(''); setRegistrationEvent(event); }} aria-label={`Register for ${event.title}`}>Register for this event <span><FiArrowRight /></span></button>}
        </div>
      </article>;
    })}</div>
    {status === 'succeeded' && displayedEvents.length === 0 && <p className="mt-8">New events will appear here when published. Check back soon.</p>}
    {registrationEvent && <EventRegistration event={registrationEvent} onClose={() => setRegistrationEvent(null)} onSuccess={setRegistrationMessage} />}
  </div></section>;
};
export default HomepageEvents;
