import { FiArrowUpRight, FiMapPin } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading';

const cities = [
  { name: 'Hyderabad', image: '/cities/hyderabad.jpg', count: 100 },
  { name: 'Bangalore', image: '/cities/bangalore.jpg', count: 120 },
  { name: 'Delhi', image: '/cities/delhi.jpg', count: 106 },
  { name: 'Mumbai', image: '/cities/mumbai.jpg', count: 109 },
  { name: 'Pune', image: '/cities/pune.jpg', count: 4 },
  { name: 'Chennai', image: '/cities/chennai.jpg', count: 110 },
];

const CitiesSection = () => (
  <section className="section cities-section">
    <div className="site-container">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading eyebrow="Explore by city" title="Find the right environment for your next chapter." description="Start with a city, then compare the colleges, courses and institution types available there." />
        <Link to="/explorecity" className="button button-secondary shrink-0">View all colleges <FiArrowUpRight /></Link>
      </div>
      <div className="city-bento">
        {cities.map((city, index) => {
          const { count } = city;
          return (
            <Link className={`city-tile city-tile-${index + 1}`} to={`/explorecity?city=${encodeURIComponent(city.name)}`} key={city.name}>
              <img src={city.image} alt={`${city.name} city skyline`} width="800" height="600" loading="lazy" />
              <span className="city-tile-shade" aria-hidden="true" />
              <span className="city-tile-content"><small><FiMapPin /> Study in</small><strong>{city.name}</strong><em>{count ? `${count} ${count === 1 ? 'college' : 'colleges'} listed` : 'Explore colleges'}</em></span>
              <span className="city-tile-action" aria-hidden="true"><FiArrowUpRight /></span>
            </Link>
          );
        })}
      </div>
    </div>
  </section>
);

export default CitiesSection;
