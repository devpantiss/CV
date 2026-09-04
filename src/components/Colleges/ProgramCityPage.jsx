import { FiArrowUpRight, FiMapPin } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import PageHero from '../ui/PageHero';

const cities = [
  { name: 'Delhi', image: '/cities/delhi.jpg', desc: 'National Capital Region' },
  { name: 'Mumbai', image: '/cities/mumbai.jpg', desc: 'Finance & media hub' },
  { name: 'Bangalore', image: '/cities/bangalore.jpg', desc: 'India’s technology capital' },
  { name: 'Hyderabad', image: '/cities/hyderabad.jpg', desc: 'Technology & research hub' },
  { name: 'Chennai', image: '/cities/chennai.jpg', desc: 'Engineering & healthcare hub' },
  { name: 'Kolkata', image: '/cities/kolkata.jpg', desc: 'Culture & academic heritage' },
  { name: 'Pune', image: '/cities/pune.jpg', desc: 'Student-friendly education hub' },
  { name: 'Ahmedabad', image: '/cities/ahmedabad.jpg', desc: 'Business & design education' },
];

const ProgramCityPage = ({ programType }) => (
  <>
    <PageHero
      variant="colleges"
      eyebrow="Explore colleges"
      title={`${programType} options, city by city.`}
      description={`Explore ${programType.toLowerCase()} college information across India’s leading education hubs.`}
    />

    <section className="section">
      <div className="site-container">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Choose your destination</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Study in a city that fits your ambition.</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-[var(--color-muted)]">
            Compare colleges across {cities.length} major Indian metros and narrow the list with focused filters.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cities.map((city) => (
            <Link
              key={city.name}
              to={`/explorecity?city=${encodeURIComponent(city.name)}&programType=${encodeURIComponent(programType)}`}
              className="card group relative min-h-[360px] overflow-hidden bg-[var(--color-surface-muted)]"
              aria-label={`Explore ${programType.toLowerCase()} colleges in ${city.name}`}
            >
              <img
                src={city.image}
                alt={`${city.name} cityscape`}
                width="700"
                height="850"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
              <span className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-md transition group-hover:-translate-y-0.5 group-hover:bg-white group-hover:text-slate-950">
                <FiArrowUpRight aria-hidden="true" />
              </span>
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-white/75">
                  <FiMapPin aria-hidden="true" />
                  {city.desc}
                </p>
                <h3 className="mt-2 text-3xl font-bold tracking-tight">{city.name}</h3>
                <p className="mt-3 translate-y-2 text-sm text-white/75 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  View colleges and filters
                </p>
              </div>
            </Link>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-[var(--color-muted)]">
          College information is a starting point. Always confirm current fees, eligibility and admission details with the institution.
        </p>
      </div>
    </section>
  </>
);

export default ProgramCityPage;
