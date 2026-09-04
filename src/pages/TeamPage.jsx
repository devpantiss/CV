import { FiArrowRight, FiCheck, FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import SectionHeading from '../components/ui/SectionHeading';

const guidanceExperts = [
  { name: 'Sonali Mulay', photo: 'https://i.postimg.cc/nVjg34sd/Sonali-Mulay-expert-1.jpg' },
  { name: 'Ishita Kundu', photo: 'https://i.postimg.cc/vBjjQBKL/Ishita-Kundu-expert-1.jpg' },
  { name: 'Prof. Satya Kiran Sastry', photo: 'https://i.postimg.cc/43fjPjtt/Prof-Satya-Kiran-Sastry-expert-1.jpg' },
];

const principles = [
  'Listen to the student before recommending a path',
  'Explain choices in language families can understand',
  'Turn information into a practical next step',
];

const TeamPage = () => (
  <>
    <PageHero
      variant="team"
      eyebrow="Our team"
      title="Real people behind every clearer decision."
      description="Meet the people who bring care, educational context and practical experience to every Career Valley conversation."
    >
      <Link to="/contact_us" className="button button-primary">Talk with the team <FiArrowRight /></Link>
    </PageHero>

    <section className="section">
      <div className="site-container grid items-center gap-12 lg:grid-cols-[.78fr_1.22fr] xl:gap-20">
        <div className="relative mx-auto w-full max-w-md">
          <div className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-primary-soft)] shadow-[var(--shadow-md)]">
            <img
              src="https://res.cloudinary.com/du3i8e0se/image/upload/v1721847900/qkvrjqtsook5wjnzbzwb.jpg"
              alt="Divya Rupainwar, founder and CEO of Career Valley"
              width="640"
              height="800"
              className="aspect-[4/5] w-full object-cover object-top"
            />
          </div>
          <div className="absolute -bottom-5 left-4 right-4 rounded-2xl border border-white/80 bg-white/90 p-4 shadow-[var(--shadow-md)] backdrop-blur md:left-8 md:right-8">
            <p className="text-xs font-extrabold uppercase tracking-[.14em] text-[var(--color-primary)]">Founder & CEO</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight">Divya Rupainwar</h2>
          </div>
        </div>

        <div className="pt-8 lg:pt-0">
          <SectionHeading
            eyebrow="Leadership"
            title="Guidance grounded in more than a decade of experience."
            description="Divya founded Career Valley in 2013 to give students more context, confidence and ownership when choosing their educational direction."
          />
          <div className="mt-8 grid gap-3">
            {principles.map((principle) => <p key={principle} className="flex items-start gap-3 rounded-xl bg-[var(--color-surface-muted)] p-4 font-semibold"><span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--color-primary-soft)] text-sm text-[var(--color-primary)]"><FiCheck /></span>{principle}</p>)}
          </div>
          <a href="mailto:divya@thecareervalley.com" className="button button-secondary mt-8"><FiMail />Contact Divya</a>
        </div>
      </div>
    </section>

    <section className="section surface-muted">
      <div className="site-container">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Guidance network" title="Experienced perspectives, brought together for students." description="Career Valley’s education experts add specialist context and a human perspective to important course and college decisions." />
          <Link to="/experts" className="button button-secondary shrink-0">Explore expert profiles <FiArrowRight /></Link>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {guidanceExperts.map((expert) => (
            <article key={expert.name} className="group overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-sm)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]">
              <div className="aspect-[4/4.6] overflow-hidden bg-[var(--color-primary-soft)]">
                <img src={expert.photo} alt={expert.name} width="560" height="650" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
              </div>
              <div className="p-5">
                <p className="text-xs font-extrabold uppercase tracking-[.12em] text-[var(--color-primary)]">Education expert</p>
                <h2 className="mt-2 text-xl font-bold tracking-tight">{expert.name}</h2>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="section-compact bg-[var(--color-primary)] text-white">
      <div className="site-container flex flex-col justify-between gap-7 md:flex-row md:items-center">
        <div><p className="text-sm font-bold uppercase tracking-widest text-white/60">Start a conversation</p><h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight">Bring the team the decision you are trying to make.</h2></div>
        <Link to="/contact_us" className="button shrink-0 bg-white text-[var(--color-primary)]">Get in touch <FiArrowRight /></Link>
      </div>
    </section>
  </>
);

export default TeamPage;
