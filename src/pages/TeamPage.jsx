import { isExpert } from '../features/content/people';
import LinkedInLink from '../components/ui/LinkedInLink';
import useContent from '../features/content/useContent';
import ContentStatus from '../features/content/ContentStatus';
import { teamDefaults } from '../features/content/defaults';
import { FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import SectionHeading from '../components/ui/SectionHeading';



const TeamPage = () => {
 const { items, loading, error } = useContent('team', teamDefaults);
 const members = items.filter(member => !isExpert(member));

 return (
  <>
    <PageHero
      variant="team"
      eyebrow="Our team"
      title="Real people behind every clearer decision."
      description="Meet the people who bring care, educational context and practical experience to every Career Valley conversation."
    >
      <Link to="/contact_us" className="button button-primary">Talk with the team <FiArrowRight /></Link>
    </PageHero>

    <section className="section surface-muted">
      <div className="site-container">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Guidance network" title="Meet our core team." description="The people building relationships between students, families and education institutions." />
          <Link to="/experts" className="button button-secondary shrink-0">Explore expert profiles <FiArrowRight /></Link>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <ContentStatus loading={loading} error={error} empty={!members.length} />{members.map((expert) => (
            <article key={expert.name} className="group overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]">
              <div className="aspect-[4/4.6] overflow-hidden bg-[var(--color-primary-soft)]">
                <img src={expert.photo} alt={expert.name} width="560" height="650" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
              </div>
              <div className="p-5">
                <p className="text-xs font-extrabold uppercase tracking-[.12em] text-[var(--color-primary)]">{expert.role || 'Team member'}</p>
                <h2 className="mt-2 text-xl font-bold tracking-tight">{expert.name}</h2><LinkedInLink href={expert.linkedin} name={expert.name} /><p className="mt-2 text-sm text-[var(--color-muted)]">{expert.bio || 'Part of the Career Valley education network, connecting institutions with meaningful conversations and opportunities for collaboration.'}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="section-compact bg-[var(--color-accent-soft)] text-[var(--color-foreground)]">
      <div className="site-container flex flex-col justify-between gap-7 md:flex-row md:items-center">
        <div><p className="text-sm font-bold uppercase tracking-widest text-[var(--color-muted)]">Start a conversation</p><h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight">Bring the team the decision you are trying to make.</h2></div>
        <Link to="/contact_us" className="button button-primary shrink-0">Get in touch <FiArrowRight /></Link>
      </div>
    </section>
  </>
);
};

export default TeamPage;
