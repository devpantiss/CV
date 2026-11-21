import { useMemo, useState } from 'react';
import { FiArrowUpRight, FiChevronDown, FiFilter, FiMapPin, FiSearch } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import collegesData from '../data/colleges.json';
import './college-explorer.css';

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
        <div className="site-container college-explorer-layout">
          <aside className="college-filters" aria-labelledby="college-filter-title">
            <div className="college-filters-header">
              <span className="college-filters-icon"><FiFilter aria-hidden="true" /></span>
              <div className="college-filters-heading">
                <h2 id="college-filter-title">Refine your search</h2>
                <p>{activeFilterCount ? `${activeFilterCount} active ${activeFilterCount === 1 ? 'filter' : 'filters'}` : 'Find your best fit'}</p>
              </div>
              <button type="button" onClick={clearFilters} disabled={!activeFilterCount} className="college-filters-reset">Reset</button>
            </div>

            <div className="college-filters-fields">
              <label className="college-filter-field college-filter-search">
                <span>Search colleges</span>
                <span className="college-filter-control">
                  <FiSearch className="college-filter-search-icon" aria-hidden="true" />
                  <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by college name" />
                </span>
              </label>
              {[
                { name: 'city', label: 'City', value: city, placeholder: 'All cities', options: [...new Set(collegesData.map(college => college.city).filter(Boolean))].sort() },
                { name: 'programType', label: 'Programme', value: filters.programType, placeholder: 'All programmes', options: ['undergraduate', 'postgraduate'] },
                ...Object.entries(filterOptions).map(([name, options]) => ({ name, label: filterLabels[name], value: filters[name], placeholder: name === 'collegeType' ? 'All college types' : `All ${filterLabels[name].toLowerCase()}s`, options })),
              ].map(({ name, label, value, placeholder, options }) => (
                <label className="college-filter-field" key={name}>
                  <span>{label}</span>
                  <span className="college-filter-control">
                    <select name={name} value={value} data-active={Boolean(value)} onChange={name === 'city' ? event => setCity(event.target.value) : update}>
                      <option value="">{placeholder}</option>
                      {options.map(option => <option value={option} key={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>)}
                    </select>
                    <FiChevronDown className="college-filter-chevron" aria-hidden="true" />
                  </span>
                </label>
              ))}
            </div>
            <div className="college-filters-footer"><span className="college-filters-status" aria-hidden="true" />Results update as you filter</div>
          </aside>

          <div className="min-w-0">
            <div className="flex flex-col gap-3 border-b border-[var(--color-border)] pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--color-primary)]">{city || 'All cities'}</p>
                <h2 aria-live="polite" aria-atomic="true" className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                  {results.length} {results.length === 1 ? 'college' : 'colleges'} found
                </h2>
              </div>
              <span className="text-sm text-[var(--color-muted)]">Showing the closest matches to your filters</span>
            </div>

            {results.length ? (
              <div className="college-results-grid">
                {results.map((college, index) => (
                  <article className="card college-result-card group flex min-h-full flex-col" key={`${college.name}-${index}`}>
                    <div className="flex items-start gap-3">
                      {college.imageUrl && college.imageUrl !== '-' && (
                        <img
                          src={college.imageUrl}
                          alt=""
                          width="40"
                          height="40"
                          loading="lazy"
                          className="h-10 w-10 shrink-0 rounded-xl border border-[var(--color-border)] bg-white object-contain p-1.5"
                        />
                      )}
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold leading-snug">{college.name}</h3>
                        <p className="mt-1 flex items-center gap-1 text-xs text-[var(--color-muted)]">
                          <FiMapPin className="shrink-0" aria-hidden="true" />
                          {college.city}, {college.state}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {college.rank && <span className="rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-xs font-bold text-[var(--color-primary)]">#{college.rank} {college.ranking_org}</span>}
                      {college.review && <span className="rounded-full bg-[var(--color-surface-muted)] px-3 py-1 text-xs font-bold text-[var(--color-muted)]">{college.review} rating</span>}
                    </div>

                    <dl className="mt-4 grid grid-cols-3 gap-x-3 gap-y-3 border-t border-[var(--color-border)] pt-4 text-xs">
                      <div><dt className="text-[var(--color-muted)]">Course</dt><dd className="mt-1 font-semibold">{college.course}</dd></div>
                      <div><dt className="text-[var(--color-muted)]">Duration</dt><dd className="mt-1 font-semibold">{college.duration}</dd></div>
                      <div><dt className="text-[var(--color-muted)]">Type</dt><dd className="mt-1 font-semibold">{college.collegeType}</dd></div>
                    </dl>

                    {college.collegeUrl && (
                      <a
                        href={college.collegeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-auto inline-flex items-center gap-2 pt-5 text-xs font-bold text-[var(--color-primary)]"
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
