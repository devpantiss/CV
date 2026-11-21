import LinkedInLink from '../components/ui/LinkedInLink';
import useContent from '../features/content/useContent';
import { teamDefaults } from '../features/content/defaults';
import { isLeadership } from '../features/content/content';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import SectionHeading from '../components/ui/SectionHeading';

const values = [
  { title: 'Listen before advising', text: 'Every student brings a different mix of interests, circumstances and ambitions.' },
  { title: 'Make options understandable', text: 'Guidance should reduce complexity and make trade-offs easier to see.' },
  { title: 'Keep the student involved', text: 'The strongest decision is one a student understands and feels ownership of.' },
];

const AboutPage = () => {
 const { items: members } = useContent('team', teamDefaults);
 const founder = members.find(isLeadership);
 return (
  <>
    <PageHero variant="about" eyebrow="About Career Valley" title="Guidance built around the person—not just the programme." description="Career Valley was founded to help students navigate education choices with more clarity, context and confidence.">
      <Link to="/contact_us" className="button button-primary">Meet with a counsellor <FiArrowRight /></Link>
    </PageHero>

    <section className="section"><div className="site-container grid items-center gap-14 lg:grid-cols-2"><div className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-primary-soft)]"><img src="https://res.cloudinary.com/du3i8e0se/image/upload/v1721844626/js2nqbft8hklayhw6swd.jpg" alt="Career Valley education guidance session" width="720" height="600" className="aspect-[6/5] h-full w-full object-cover" /></div><div><SectionHeading eyebrow="Our story" title="A clearer bridge between opportunity and aspiration." /><div className="mt-5 grid gap-5 text-[var(--color-muted)]"><p>In 2013, founder Divya Rupainwar saw students struggling to make informed higher-education decisions. They had access to more information than ever, but not always the context needed to use it.</p><p>Career Valley began with a simple purpose: help students understand their options, connect with educational opportunities and make choices that support their ambitions.</p><p>That work now spans personal counselling, education fairs, campus visits, course and college exploration, and admission support.</p></div></div></div></section>

    <section className="section surface-muted"><div className="site-container"><SectionHeading eyebrow="How we work" title="Human guidance, practical next steps." description="Our role is to make a complex decision feel more structured, transparent and manageable." /><div className="mt-12 grid gap-5 lg:grid-cols-3">{values.map((value) => <article key={value.title} className="card p-7"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]"><FiCheck /></span><h3 className="mt-8 text-xl font-bold">{value.title}</h3><p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{value.text}</p></article>)}</div></div></section>

    {founder && <section className="section"><div className="site-container grid items-center gap-12 lg:grid-cols-[.7fr_1.3fr]"><div className="mx-auto w-full max-w-sm overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-primary-soft)]"><img src={founder.photo} alt={founder.name} width="500" height="620" loading="lazy" className="aspect-[4/5] w-full object-cover" /></div><div><span className="eyebrow">{founder.role}</span><h2 className="section-title">{founder.name}</h2><LinkedInLink href={founder.linkedin} name={founder.name} /><blockquote className="max-w-3xl text-xl leading-9 text-[var(--color-muted)]">{founder.bio}</blockquote><div className="mt-8 flex flex-wrap gap-3"><Link to="/experts" className="button button-secondary">Meet our experts</Link>{founder.email && <a href={`mailto:${founder.email}`} className="button button-primary">Contact {founder.name.split(' ')[0]}</a>}</div></div></div></section>}

    <section className="section-compact bg-[var(--color-accent-soft)] text-[var(--color-foreground)]"><div className="site-container flex flex-col justify-between gap-7 md:flex-row md:items-center"><div><p className="text-sm font-bold uppercase tracking-widest text-[var(--color-muted)]">Looking ahead</p><h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight">Continuing to make educational decisions easier to understand.</h2></div><Link to="/services" className="button button-primary shrink-0">Explore our services <FiArrowRight /></Link></div></section>
  </>
);
};
export default AboutPage;
