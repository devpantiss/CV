import { useEffect, useRef, useState } from 'react';
import { FiBookOpen, FiCalendar, FiChevronDown, FiHome, FiInfo, FiLogOut, FiMenu, FiUser, FiX } from 'react-icons/fi';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/features/authSlice';

const navGroups = [
  { label: 'About', icon: FiInfo, match: ['/about', '/team', '/experts', '/gallery'], items: [['About us', '/about'], ['Our team', '/team'], ['Our experts', '/experts'], ['Gallery', '/gallery']] },
  { label: 'Colleges', icon: FiBookOpen, match: ['/colleges', '/explorecity'], items: [['Undergraduate', '/colleges/ug'], ['Postgraduate', '/colleges/pg']] },
  { label: 'Events', icon: FiCalendar, match: ['/events'], items: [['Upcoming events', '/events?tab=Upcoming'], ['Recent events', '/events?tab=Recent']] },
  { label: 'Courses', icon: FiBookOpen, match: ['/courses'], items: [['B.Tech', '/courses/btech'], ['B.Sc', '/courses/bsc'], ['B.Com', '/courses/bcom'], ['BBA', '/courses/bba'], ['BCA', '/courses/bca'], ['BA', '/courses/ba'], ['MBA', '/courses/mba'], ['M.Tech', '/courses/mtech'], ['LLB', '/courses/llb']] },
];

const NavDropdown = ({ group, pathname }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const Icon = group.icon;
  const active = group.match.some((path) => pathname.startsWith(path));
  useEffect(() => {
    const close = (event) => !ref.current?.contains(event.target) && setOpen(false);
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, []);
  return <div className="relative" ref={ref}><button type="button" className={`original-nav-link ${active ? 'is-active' : ''}`} onClick={() => setOpen((value) => !value)} aria-expanded={open}><Icon aria-hidden="true" />{group.label}<FiChevronDown aria-hidden="true" className={`text-xs transition-transform ${open ? 'rotate-180' : ''}`} /></button>{open && <div className={`original-dropdown ${group.label === 'Courses' ? 'grid w-72 grid-cols-2' : ''}`}>{group.items.map(([label, to]) => <Link key={to} to={to} onClick={() => setOpen(false)} className="original-dropdown-link">{label}</Link>)}</div>}</div>;
};

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMobileGroup, setOpenMobileGroup] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 18); onScroll(); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll); }, []);
  useEffect(() => { setMenuOpen(false); setOpenMobileGroup(''); document.body.classList.remove('menu-open'); }, [pathname]);
  const toggleMenu = () => setMenuOpen((value) => { document.body.classList.toggle('menu-open', !value); return !value; });

  return <header className={`original-header ${scrolled ? 'is-scrolled' : ''}`}><div className="site-container flex h-[82px] items-center justify-between gap-4"><Link to="/" className="brand-logo-plate shrink-0" aria-label="Career Valley home"><img src="/career-valley-logo-transparent.png" alt="The Career Valley" width="2172" height="724" className="h-auto w-[185px] sm:w-[210px]" /></Link><nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary navigation"><NavLink to="/" end className={({ isActive }) => `original-nav-link ${isActive ? 'is-active' : ''}`}><FiHome />Home</NavLink>{navGroups.slice(0, 2).map((group) => <NavDropdown key={group.label} group={group} pathname={pathname} />)}<NavLink to="/services" className={({ isActive }) => `original-nav-link ${isActive ? 'is-active' : ''}`}><FiBookOpen />Services</NavLink>{navGroups.slice(2).map((group) => <NavDropdown key={group.label} group={group} pathname={pathname} />)}</nav><div className="hidden items-center gap-2 xl:flex">{isLoggedIn ? <button type="button" onClick={() => dispatch(logout())} className="original-account"><FiLogOut />{user?.name?.split(' ')[0] || 'Logout'}</button> : <Link to="/auth/login" className="original-account"><FiUser />Login</Link>}<Link to="/events?tab=Upcoming" className="button button-primary !min-h-10 !px-5">Register</Link></div><button type="button" className="grid h-11 w-11 place-items-center rounded-lg border border-[var(--color-border)] bg-white xl:hidden" onClick={toggleMenu} aria-expanded={menuOpen} aria-controls="original-mobile-nav" aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <FiX /> : <FiMenu />}</button></div>{menuOpen && <nav id="original-mobile-nav" className="original-mobile-nav" aria-label="Mobile navigation"><div className="mx-auto max-w-lg"><NavLink to="/" className="original-mobile-link"><FiHome />Home</NavLink>{navGroups.slice(0, 2).map((group) => <div key={group.label}><button className="original-mobile-link w-full" type="button" onClick={() => setOpenMobileGroup(openMobileGroup === group.label ? '' : group.label)}><group.icon />{group.label}<FiChevronDown className={`ml-auto ${openMobileGroup === group.label ? 'rotate-180' : ''}`} /></button>{openMobileGroup === group.label && <div className="original-mobile-submenu">{group.items.map(([label, to]) => <Link key={to} to={to}>{label}</Link>)}</div>}</div>)}<NavLink to="/services" className="original-mobile-link"><FiBookOpen />Services</NavLink>{navGroups.slice(2).map((group) => <div key={group.label}><button className="original-mobile-link w-full" type="button" onClick={() => setOpenMobileGroup(openMobileGroup === group.label ? '' : group.label)}><group.icon />{group.label}<FiChevronDown className={`ml-auto ${openMobileGroup === group.label ? 'rotate-180' : ''}`} /></button>{openMobileGroup === group.label && <div className="original-mobile-submenu">{group.items.map(([label, to]) => <Link key={to} to={to}>{label}</Link>)}</div>}</div>)}<div className="mt-5 grid gap-3 border-t border-[var(--color-border)] pt-5">{!isLoggedIn && <Link to="/auth/login" className="button button-secondary">Login</Link>}<Link to="/events?tab=Upcoming" className="button button-primary">Register for an event</Link></div></div></nav>}</header>;
};
export default Header;
