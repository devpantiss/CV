import { useEffect, useRef, useState } from 'react';
import { FiArrowRight, FiCalendar, FiChevronLeft, FiChevronRight, FiClock, FiMapPin } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchEventsByStatus } from '../../redux/features/eventSlice';
import EventImage from '../ui/EventImage';
import SectionHeading from '../ui/SectionHeading';

const formatDate = (value) => {
  if (!value) return 'Date to be announced';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date to be announced' : new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
};

const sampleEvents = [
  { _id: 'sample-career-open-house', title: 'Career Discovery Open House', eventType: 'Coming soon', location: 'Hyderabad', time: 'Schedule to be announced' },
  { _id: 'sample-ug-fair', title: 'Undergraduate Pathways Fair', eventType: 'Coming soon', location: 'Hyderabad', time: 'Schedule to be announced' },
  { _id: 'sample-parent-session', title: 'Parent & Student Guidance Session', eventType: 'Coming soon', location: 'Online session', time: 'Schedule to be announced' },
];

const HomepageEvents = () => {
  const dispatch = useDispatch();
  const sliderRef = useRef(null);
  const [scrollState, setScrollState] = useState({ atStart: true, atEnd: false });
  const { events, status } = useSelector((state) => state.events);
  const eventList = Array.isArray(events) ? events.slice(0, 8) : [];
  const showingSamples = status !== 'loading' && eventList.length === 0;
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

  return <section className="section overflow-hidden bg-white"><div className="site-container"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><SectionHeading eyebrow="Upcoming events" title="Meet, explore and ask better questions." description="Join Career Valley education fairs, open houses and student-focused sessions." /><div className="event-slider-actions"><div className="event-slider-controls" aria-label="Event slider controls"><button type="button" onClick={() => moveSlider(-1)} disabled={scrollState.atStart} aria-label="Show previous events"><FiChevronLeft /></button><button type="button" onClick={() => moveSlider(1)} disabled={scrollState.atEnd} aria-label="Show next events"><FiChevronRight /></button></div><Link to="/events?tab=Upcoming" className="button button-secondary shrink-0">View all events <FiArrowRight /></Link></div></div>
    {status === 'loading' && eventList.length === 0 && <div className="mt-12 grid gap-5 md:grid-cols-3" aria-label="Loading upcoming events">{[1, 2, 3].map((item) => <div className="h-[390px] animate-pulse rounded-[var(--radius-md)] bg-[var(--color-surface-muted)]" key={item} />)}</div>}
    {showingSamples && <div className="mt-9 flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-accent-soft)] px-4 py-3 text-sm text-[var(--color-muted)]"><FiCalendar className="shrink-0 text-[var(--color-primary)]" /><p>Preview events are shown while the upcoming schedule is being prepared.</p></div>}
    {displayedEvents.length > 0 && <div ref={sliderRef} className={`${showingSamples ? 'mt-5' : 'mt-12'} event-slider-track`} role="region" aria-label="Upcoming events slider">{displayedEvents.map((event, index) => <article className="event-preview group" key={event._id || `${event.title}-${index}`}><div className="event-preview-image"><EventImage event={event} height={420} /><span>{event.eventType || 'Career Valley event'}</span></div><div className="event-preview-body"><p className="event-preview-date"><FiCalendar />{formatDate(event.date)}</p><h3>{event.title}</h3><div className="mt-5 grid gap-2 text-sm text-[var(--color-muted)]">{event.location && <p className="flex items-center gap-2"><FiMapPin />{event.location}</p>}{event.time && <p className="flex items-center gap-2"><FiClock />{event.time}</p>}</div><Link to={showingSamples ? '/contact_us' : '/events?tab=Upcoming'} className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-[var(--color-primary)]">{showingSamples ? 'Ask about this event' : 'View event'} <FiArrowRight className="transition-transform group-hover:translate-x-1" /></Link></div></article>)}</div>}
  </div></section>;
};
export default HomepageEvents;
