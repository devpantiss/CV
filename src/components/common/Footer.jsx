import { FiArrowUpRight, FiInstagram, FiLinkedin, FiMail, FiPhone } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] text-white">
    <div className="site-container py-16">
      <div className="grid gap-12 lg:grid-cols-[1.35fr_2fr]">
        <div>
          <Link to="/" className="brand-logo-plate" aria-label="Career Valley home"><img src="/career-valley-logo-transparent.png" alt="The Career Valley" width="2172" height="724" className="h-auto w-[230px]" /></Link>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/65">Helping students and families make thoughtful decisions about courses, colleges and career direction since 2013.</p>
          <div className="mt-6 flex gap-2"><a className="grid h-10 w-10 place-items-center rounded-full border border-white/15 hover:bg-white/10" href="https://www.instagram.com/divya_rupainwar/" target="_blank" rel="noreferrer" aria-label="Career Valley on Instagram"><FiInstagram /></a><a className="grid h-10 w-10 place-items-center rounded-full border border-white/15 hover:bg-white/10" href="https://www.linkedin.com/in/divya-rupainwar-b90b3961/" target="_blank" rel="noreferrer" aria-label="Career Valley on LinkedIn"><FiLinkedin /></a></div>
        </div>
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3">
          <div><h2 className="text-sm font-bold">Explore</h2><div className="mt-4 grid gap-3 text-sm text-white/65"><Link to="/colleges/ug">UG colleges</Link><Link to="/colleges/pg">PG colleges</Link><Link to="/courses/btech">Courses</Link><Link to="/events">Events</Link></div></div>
          <div><h2 className="text-sm font-bold">Company</h2><div className="mt-4 grid gap-3 text-sm text-white/65"><Link to="/about">Our story</Link><Link to="/experts">Experts</Link><Link to="/gallery">Gallery</Link><Link to="/contact_us">Contact</Link></div></div>
          <div className="col-span-2 md:col-span-1"><h2 className="text-sm font-bold">Talk with us</h2><div className="mt-4 grid gap-3 text-sm text-white/65"><a className="flex items-center gap-2" href="mailto:info@thecareervalley.com"><FiMail />info@thecareervalley.com</a><a className="flex items-center gap-2" href="tel:+918309071632"><FiPhone />+91 8309 071632</a><Link className="mt-2 flex items-center gap-1 font-bold text-white" to="/contact_us">Start a conversation <FiArrowUpRight /></Link></div></div>
        </div>
      </div>
      <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} Career Valley. All rights reserved.</p><p>Hyderabad, Telangana, India</p></div>
    </div>
  </footer>
);

export default Footer;
