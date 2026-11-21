import { FiArrowRight, FiCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Banner from '../components/Homepage/banner/Banner';
import CareerPathExplorer from '../components/Homepage/CareerPathExplorer';
import CitiesSection from '../components/Homepage/CitiesSection';
import EventsCalendarBanner from '../components/Homepage/EventsCalendarBanner';
import TimelineComponent from '../components/Homepage/timeline/TimeLine';
import HomepageEvents from '../components/Homepage/HomepageEvents';
import PathwaysSection from '../components/Homepage/PathwaysSection';
import StudentOutcomes from '../components/Homepage/StudentOutcomes';
import TrustStrip from '../components/Homepage/TrustStrip';
import Accordion from '../components/ui/Accordion';
import SectionHeading from '../components/ui/SectionHeading';
import AffiliatedColleges from '../components/Homepage/AffiliatedColleges';

const faqs = [
  { question: 'Who is Career Valley for?', answer: 'Career Valley supports school students, undergraduate and postgraduate aspirants, and families who want clearer guidance on courses, colleges and career direction.' },
  { question: 'What happens during a counselling conversation?', answer: 'The conversation starts with your questions, interests, academic context and goals. A counsellor then helps you compare relevant pathways and identify practical next steps.' },
  { question: 'Can parents participate?', answer: 'Yes. Parents are welcome to be part of the process so that decisions can be discussed openly and understood by everyone involved.' },
  { question: 'Do you help with college selection and admissions?', answer: 'Yes. Existing Career Valley services include college and course exploration, campus visits, education events, one-to-one counselling and admission support.' },
  { question: 'How do I get started?', answer: 'Use the contact page to call, email or share what kind of guidance you need. The team can then suggest an appropriate next step.' },
];

const HomePage = () => (
  <div className="homepage-layout">
    <Banner />
    <EventsCalendarBanner />
    <TrustStrip />
    <TimelineComponent />
    <HomepageEvents />

    <PathwaysSection />
    <CitiesSection />
    <AffiliatedColleges />

    <section id="career-explorer" className="section scroll-mt-24 career-explorer-section"><div className="site-container"><div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end"><SectionHeading eyebrow="Career path explorer" title="Turn curiosity into a useful place to start." description="Choose an interest and your current stage to surface relevant course guides already available on Career Valley." /><span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-xs font-bold text-[var(--color-muted)]">No signup required</span></div><CareerPathExplorer /></div></section>

    <section className="parents-parallax section text-[var(--color-foreground)]"><div className="site-container grid items-center gap-12 lg:grid-cols-2"><div><span className="eyebrow text-[var(--color-primary)]">For parents</span><h2 className="section-title">Support their ambition without adding to the pressure.</h2><p className="max-w-xl text-lg leading-8 text-[var(--color-muted)]">Career decisions work better when students feel heard and parents understand the reasoning. We create space for both—grounded in real courses, colleges and next steps.</p><Link to="/contact_us" className="button button-primary mt-8">Talk with a counsellor <FiArrowRight /></Link></div><div className="parents-process rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-7 backdrop-blur"><p className="text-sm font-bold uppercase tracking-widest text-[var(--color-primary)]">A shared process</p><div className="mt-6 grid gap-4">{['Understand the student’s strengths and interests', 'Compare options with reliable context', 'Discuss practical considerations together', 'Agree on a confident next step'].map((item) => <div key={item} className="flex items-start gap-3 rounded-2xl bg-[var(--color-surface)] p-4"><span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--color-accent)] text-[var(--color-on-primary)]"><FiCheck /></span><span className="font-semibold">{item}</span></div>)}</div></div></div></section>

    <StudentOutcomes />
    <section className="section surface-muted"><div className="site-container grid gap-14 lg:grid-cols-[.75fr_1.25fr]"><SectionHeading eyebrow="Common questions" title="Know what to expect before you begin." description="A few straightforward answers about Career Valley’s current guidance services." /><Accordion items={faqs} /></div></section>
    <section className="section"><div className="site-container"><div className="relative overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-accent-soft)] px-6 py-16 text-center text-[var(--color-foreground)] md:px-12"><span className="absolute -right-12 -top-24 h-72 w-72 rounded-full border border-[var(--color-border)]" /><span className="eyebrow text-[var(--color-accent)]">Your next step</span><h2 className="mx-auto mt-4 max-w-3xl text-4xl font-bold tracking-[-.04em] md:text-6xl">Your future shouldn’t be a guess.</h2><p className="mx-auto mt-5 max-w-xl text-[var(--color-muted)]">Tell us what decision you’re facing. We’ll help you find a useful place to start.</p><Link to="/contact_us" className="button button-primary mt-8">Start a conversation <FiArrowRight /></Link></div></div></section>
  </div>
);
export default HomePage;
