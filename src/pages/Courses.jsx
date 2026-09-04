import { FiBookOpen, FiChevronDown } from 'react-icons/fi';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import BaPage from './Course/BaPage';
import BbaPage from './Course/BbaPage';
import BcaPage from './Course/BcaPage';
import BcomPage from './Course/BcomPage';
import BscPage from './Course/BscPage';
import Btech from './Course/Btech';
import LlbPage from './Course/LlbPage';
import MbaPage from './Course/MbaPage';
import MtechPage from './Course/MtechPage';

const courses = [
  ['B.Tech', 'btech'], ['B.Sc', 'bsc'], ['B.Com', 'bcom'], ['BBA', 'bba'], ['BCA', 'bca'], ['BA', 'ba'], ['MBA', 'mba'], ['M.Tech', 'mtech'], ['LLB', 'llb'],
];

const Courses = () => (
  <div className="course-content-shell">
    <div className="fixed inset-x-0 top-[76px] z-40 border-y border-[var(--color-border)] bg-white/90 backdrop-blur-xl">
      <div className="site-container flex h-14 items-center gap-3 overflow-x-auto [scrollbar-width:none]">
        <span className="sticky left-0 z-10 flex shrink-0 items-center gap-2 bg-white/95 pr-3 text-xs font-extrabold uppercase tracking-widest text-[var(--color-primary)]"><FiBookOpen />Course guides <FiChevronDown className="md:hidden" /></span>
        <nav className="flex gap-1" aria-label="Course guides">{courses.map(([label, path]) => <NavLink key={path} to={`/courses/${path}`} className={({ isActive }) => `shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-colors ${isActive ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-primary)]'}`}>{label}</NavLink>)}</nav>
      </div>
    </div>
    <Routes>
      <Route index element={<Navigate to="btech" replace />} />
      <Route path="btech" element={<Btech />} /><Route path="ba" element={<BaPage />} /><Route path="bba" element={<BbaPage />} /><Route path="bca" element={<BcaPage />} /><Route path="bcom" element={<BcomPage />} /><Route path="bsc" element={<BscPage />} /><Route path="mba" element={<MbaPage />} /><Route path="mtech" element={<MtechPage />} /><Route path="llb" element={<LlbPage />} />
    </Routes>
  </div>
);
export default Courses;
