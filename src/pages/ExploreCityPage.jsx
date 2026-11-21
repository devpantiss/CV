import { useMemo, useState } from 'react';
import { FiArrowUpRight, FiFilter, FiMapPin, FiSearch, FiX } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import collegesData from '../data/colleges.json';

const filterOptions = {
  course: ['B.Tech', 'M.Tech', 'M.B.A', 'B.B.A', 'B.Sc', 'M.Sc', 'B.Com', 'B.C.A', 'B.A', 'L.L.B'],
  collegeType: ['Public', 'Private'],
  stream: ['Management', 'Engineering', 'Science', 'Commerce', 'Arts', 'Computer Application', 'Law'],
};

const filterLabels = {
  course: 'Course',
  collegeType: 'College type',
  stream: 'Stream',
};

const ExploreCityPage = () => {
  const params = new URLSearchParams(useLocation().search);
  const [city, setCity] = useState(params.get('city') || '');
  const initialProgram = params.get('programType') || '';
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    programType: initialProgram.toLowerCase(),
    course: '',
    collegeType: '',
    stream: '',
  });

  const results = useMemo(() => collegesData.filter((college) => {
    if (city && college.city?.toLowerCase() !== city.toLowerCase()) return false;
    if (search && !college.name?.toLowerCase().includes(search.toLowerCase())) return false;

    return Object.entries(filters).every(([key, value]) => (
      !value || college[key]?.toLowerCase().includes(value.toLowerCase())
    ));
  }), [city, filters, search]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length + (search ? 1 : 0) + (city ? 1 : 0);
  const update = (event) => setFilters((value) => ({ ...value, [event.target.name]: event.target.value }));
  const clearFilters = () => {
    setSearch(''); setCity('');
    setFilters({ programType: '', course: '', collegeType: '', stream: '' });
  };

  return (
    <>
      <PageHero
        variant="colleges"
        eyebrow={city ? `Study in ${city}` : 'College explorer'}
        title={`${initialProgram || 'College'} options${city ? ` in ${city}` : ''}.`}
        description="Build a focused shortlist by programme, course, stream and institution type, then review every option in one clear workspace."
      />

      <section className="section" aria-label="College search results">
        <div className="site-container grid items-start gap-8 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="card p-5 lg:sticky lg:top-28" aria-label="College filters">
            <div className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                  <FiFilter aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-bold">Filters</h2>
                  <p className="text-xs text-[var(--color-muted)]">{activeFilterCount} active</p>
                </div>
              </div>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-primary)] hover:underline"
                >
                  <FiX aria-hidden="true" /> Clear
                </button>
              )}
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              <label className="field sm:col-span-2 lg:col-span-1">
                <span>Search colleges</span>
                <span className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" aria-hidden="true" />
                  <input
                    className="!pl-10"
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="College name"
                  />
                </span>
              </label>

              <label className="field"><span>City</span><select value={city} onChange={event=>setCity(event.target.value)}><option value="">All cities</option>{[...new Set(collegesData.map(college=>college.city).filter(Boolean))].sort().map(value=><option key={value} value={value}>{value}</option>)}</select></label>
              <label className="field">
                <span>Programme</span>
                <select name="programType" value={filters.programType} onChange={update}>
                  <option value="">All programmes</option>
                  <option value="undergraduate">Undergraduate</option>
                  <option value="postgraduate">Postgraduate</option>
                </select>
              </label>

              {Object.entries(filterOptions).map(([name, options]) => (
                <label className="field" key={name}>
                  <span>{filterLabels[name]}</span>
                  <select name={name} value={filters[name]} onChange={update}>
                    <option value="">All {filterLabels[name].toLowerCase()}s</option>
                    {options.map((option) => <option value={option} key={option}>{option}</option>)}
                  </select>
                </label>
              ))}
            </div>
          </aside>

          <div className="min-w-0">
            <div className="flex flex-col gap-3 border-b border-[var(--color-border)] pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--color-primary)]">{city || 'All cities'}</p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                  {results.length} {results.length === 1 ? 'college' : 'colleges'} found
                </h2>
              </div>
              <span className="text-sm text-[var(--color-muted)]">Showing the closest matches to your filters</span>
            </div>

            {results.length ? (
              <div className="mt-6 grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                {results.map((college, index) => (
                  <article className="card group flex min-h-full flex-col p-6" key={`${college.name}-${index}`}>
                    <div className="flex items-start gap-4">
                      {college.imageUrl && college.imageUrl !== '-' && (
                        <img
                          src={college.imageUrl}
                          alt=""
                          width="56"
                          height="56"
                          loading="lazy"
                          className="h-14 w-14 shrink-0 rounded-2xl border border-[var(--color-border)] bg-white object-contain p-1.5"
                        />
                      )}
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold leading-snug">{college.name}</h3>
                        <p className="mt-1 flex items-center gap-1 text-sm text-[var(--color-muted)]">
                          <FiMapPin className="shrink-0" aria-hidden="true" />
                          {college.city}, {college.state}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {college.rank && <span className="rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-xs font-bold text-[var(--color-primary)]">#{college.rank} {college.ranking_org}</span>}
                      {college.review && <span className="rounded-full bg-[var(--color-surface-muted)] px-3 py-1 text-xs font-bold text-[var(--color-muted)]">{college.review} rating</span>}
                    </div>

                    <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-[var(--color-border)] pt-5 text-sm">
                      <div><dt className="text-[var(--color-muted)]">Course</dt><dd className="mt-1 font-semibold">{college.course}</dd></div>
                      <div><dt className="text-[var(--color-muted)]">Duration</dt><dd className="mt-1 font-semibold">{college.duration}</dd></div>
                      <div><dt className="text-[var(--color-muted)]">Type</dt><dd className="mt-1 font-semibold">{college.collegeType}</dd></div>
                    </dl>

                    {college.collegeUrl && (
                      <a
                        href={college.collegeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-[var(--color-primary)]"
                      >
                        Visit college website
                        <FiArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                      </a>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] p-10 text-center sm:p-14">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white text-[var(--color-primary)] shadow-sm">
                  <FiSearch aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl font-bold">No colleges match these filters.</h3>
                <p className="mt-2 text-[var(--color-muted)]">Try a broader programme or remove one of the filters.</p>
                {activeFilterCount > 0 && <button type="button" onClick={clearFilters} className="button button-secondary mt-6">Clear all filters</button>}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ExploreCityPage;
