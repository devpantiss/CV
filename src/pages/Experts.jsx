import LinkedInLink from '../components/ui/LinkedInLink';
import { isExpert } from '../features/content/people';
import useContent from '../features/content/useContent';
import ContentStatus from '../features/content/ContentStatus';
import { teamDefaults } from '../features/content/defaults';
import { FiArrowRight, FiCheck, FiMail, FiPhone } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import SectionHeading from '../components/ui/SectionHeading';


const overseasSupport = ['Personalised student profiling', 'Institution and programme exploration', 'Application and interview guidance', 'Global network with local context'];

const Experts = () => {
 const { items: members, loading, error } = useContent('team', teamDefaults);
 const experts = members.filter(isExpert);
 return (
  <><PageHero variant="experts" eyebrow="Career Valley experts" title="Expertise that connects institutions with opportunity." description="Meet our education network and explore opportunities for institutional partnerships, events and collaboration."><Link to="/contact_us" className="button button-primary">Discuss a partnership <FiArrowRight /></Link></PageHero><section className="section"><div className="site-container"><SectionHeading eyebrow="Our experts" title="People behind stronger education partnerships." /><div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-2"><ContentStatus loading={loading} error={error} empty={!experts.length} />{experts.map((expert) => <article key={expert.name} className="card overflow-hidden"><div className="aspect-[16/10] bg-[var(--color-primary-soft)]"><img src={expert.photo} alt={expert.name} width="480" height="600" loading="lazy" className="h-full w-full object-cover" /></div><div className="p-5"><h2 className="font-bold">{expert.name}</h2><p className="mt-1 text-sm text-[var(--color-muted)]">{expert.role || 'Education expert'}</p><LinkedInLink href={expert.linkedin} name={expert.name} /><p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">{expert.bio || "A member of Career Valley’s education expert network. For institutions interested in collaborating on education events, open houses or knowledge sessions, contact our team to discuss a suitable engagement."}</p><Link className="button button-secondary mt-5" to="/contact_us">Discuss collaboration <FiArrowRight /></Link></div></article>)}</div></div></section><section className="section surface-muted"><div className="site-container grid items-center gap-12 lg:grid-cols-2"><div><SectionHeading eyebrow="Overseas education" title="Global options, understood in context." description="Career Valley works with Satguru Education to help students explore international study opportunities and navigate the process with personalised support." /><div className="mt-8 grid gap-3">{overseasSupport.map((item) => <p key={item} className="flex items-center gap-3 font-semibold"><span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]"><FiCheck /></span>{item}</p>)}</div></div><div className="rounded-[var(--radius-lg)] bg-[var(--color-primary-soft)] p-8 text-[var(--color-foreground)] md:p-10"><p className="text-sm font-bold uppercase tracking-widest text-[var(--color-muted)]">Institutional enquiries</p><h2 className="mt-4 text-3xl font-bold tracking-tight">Discuss your goals with the team.</h2><p className="mt-4 text-[var(--color-muted)]">Start with a direct conversation about the destination, programme or application decision you are considering.</p><div className="mt-8 grid gap-3"><a href="mailto:info@thecareervalley.com" className="flex items-center gap-3 rounded-xl bg-[var(--color-surface)] p-4 font-semibold"><FiMail />info@thecareervalley.com</a><a href="tel:+919839048312" className="flex items-center gap-3 rounded-xl bg-[var(--color-surface)] p-4 font-semibold"><FiPhone />+91 98390 48312</a></div></div></div></section></>
);
};
export default Experts;
