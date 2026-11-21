import { lazy, Suspense, useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

const AdminPage = lazy(() => import('./pages/admin/AdminPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const TeamPage = lazy(() => import('./pages/TeamPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ExploreCityPage = lazy(() => import('./pages/ExploreCityPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const Experts = lazy(() => import('./pages/Experts'));
const Colleges = lazy(() => import('./pages/Colleges'));
const Courses = lazy(() => import('./pages/Courses'));

const pageMeta = {
  '/': ['Career Valley | Career & College Guidance', 'Thoughtful career and college guidance for students and families.'],
  '/about': ['About Career Valley', 'Meet the people and purpose behind Career Valley.'],
  '/team': ['Our Team | Career Valley', 'Meet the people behind Career Valley’s student-first guidance.'],
  '/services': ['Career Guidance Services | Career Valley', 'Explore counselling, campus visits, education fairs and admission support.'],
  '/events': ['Student Events | Career Valley', 'Discover upcoming Career Valley education events and open houses.'],
  '/contact_us': ['Talk to a Career Counsellor | Career Valley', 'Start a conversation with the Career Valley guidance team.'],
};

const App = () => {
  const { pathname } = useLocation();
  const isAuthPage = pathname.startsWith('/auth') || pathname.startsWith('/admin');

  useEffect(() => {
    window.scrollTo(0, 0);
    const [title, description] = pageMeta[pathname] || ['Career Valley', 'Career, course and college guidance for students.'];
    document.title = title;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = description;
  }, [pathname]);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      {!isAuthPage && <Header />}
      <main id="main-content">
        <Suspense fallback={<div className="grid min-h-[60vh] place-items-center" role="status"><span className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--color-primary-soft)] border-t-[var(--color-primary)]"><span className="sr-only">Loading page</span></span></div>}>
          <Routes>
            <Route path="/admin/*" element={<AdminPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact_us" element={<ContactPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/explorecity" element={<ExploreCityPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/experts" element={<Experts />} />
            <Route path="/colleges/*" element={<Colleges />} />
            <Route path="/courses/*" element={<Courses />} />
            <Route path="/auth/*" element={<AuthPage />} />
            <Route path="*" element={<section className="page-hero"><div className="site-container relative z-10"><span className="eyebrow">404</span><h1 className="display-title">This path hasn’t been mapped yet.</h1><p className="lead">Let’s get you back to useful guidance.</p><Link to="/" className="button button-primary mt-8">Return home</Link></div></section>} />
          </Routes>
        </Suspense>
      </main>
      {!isAuthPage && <Footer />}
    </>
  );
};

export default App;
