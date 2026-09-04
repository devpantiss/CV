import { FiArrowRight, FiCheck, FiMail, FiPhone } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import SectionHeading from '../components/ui/SectionHeading';

const experts = [
  { name: 'Sonali Mulay', photo: 'https://i.postimg.cc/nVjg34sd/Sonali-Mulay-expert-1.jpg' },
  { name: 'Ishita Kundu', photo: 'https://i.postimg.cc/vBjjQBKL/Ishita-Kundu-expert-1.jpg' },
  { name: 'Prof. Satya Kiran Sastry', photo: 'https://i.postimg.cc/43fjPjtt/Prof-Satya-Kiran-Sastry-expert-1.jpg' },
  { name: 'Pranab Kumar', photo: 'https://i.postimg.cc/PrZG5WTL/Pranab-kumar-Misra-expert-1.jpg' },
];
const overseasSupport = ['Personalised student profiling', 'Institution and programme exploration', 'Application and interview guidance', 'Global network with local context'];

const Experts = () => (
  <><PageHero variant="experts" eyebrow="Career Valley experts" title="Experienced voices for important education decisions." description="Meet the experts who bring educational context, practical insight and a human perspective to the guidance process."><Link to="/contact_us" className="button button-primary">Book a conversation <FiArrowRight /></Link></PageHero><section className="section"><div className="site-container"><SectionHeading eyebrow="Our experts" title="People who help make the path easier to understand." /><div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{experts.map((expert) => <article key={expert.name} className="card overflow-hidden"><div className="aspect-[4/5] bg-[var(--color-primary-soft)]"><img src={expert.photo} alt={expert.name} width="480" height="600" loading="lazy" className="h-full w-full object-cover" /></div><div className="p-5"><h2 className="font-bold">{expert.name}</h2><p className="mt-1 text-sm text-[var(--color-muted)]">Education expert</p></div></article>)}</div></div></section><section className="section surface-muted"><div className="site-container grid items-center gap-12 lg:grid-cols-2"><div><SectionHeading eyebrow="Overseas education" title="Global options, understood in context." description="Career Valley works with Satguru Education to help students explore international study opportunities and navigate the process with personalised support." /><div className="mt-8 grid gap-3">{overseasSupport.map((item) => <p key={item} className="flex items-center gap-3 font-semibold"><span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]"><FiCheck /></span>{item}</p>)}</div></div><div className="rounded-[var(--radius-lg)] bg-[var(--color-primary)] p-8 text-white md:p-10"><p className="text-sm font-bold uppercase tracking-widest text-white/55">One-to-one consultation</p><h2 className="mt-4 text-3xl font-bold tracking-tight">Discuss your goals with the team.</h2><p className="mt-4 text-white/70">Start with a direct conversation about the destination, programme or application decision you are considering.</p><div className="mt-8 grid gap-3"><a href="mailto:info@thecareervalley.com" className="flex items-center gap-3 rounded-xl bg-white/10 p-4 font-semibold"><FiMail />info@thecareervalley.com</a><a href="tel:+918309071632" className="flex items-center gap-3 rounded-xl bg-white/10 p-4 font-semibold"><FiPhone />+91 8309 071632</a></div></div></div></section></>
);
export default Experts;
