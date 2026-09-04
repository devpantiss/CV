import { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useMotionValue,
} from 'framer-motion';
import {
  FiArrowRight,
  FiArrowDown,
  FiBookOpen,
  FiBriefcase,
  FiCheck,
  FiCode,
  FiCompass,
  FiCpu,
  FiDollarSign,
  FiTrendingUp,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading';

/* ── pathway data ─────────────────────────────────────────────── */
const pathways = [
  {
    id: 'engineering',
    title: 'Engineering & technology',
    courses: ['B.Tech', 'M.Tech'],
    description:
      'Build, design and solve practical problems across modern engineering disciplines.',
    signals: [
      'Building and improving things',
      'Maths, systems and technology',
      'Practical problem-solving',
    ],
    to: '/courses/btech',
    icon: FiCpu,
    image:
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1400&q=84',
    imageAlt: 'Engineering students working with technology in a laboratory',
    mood: { bg: '24, 78, 68', accent: '#3ddbb9', dot: '#3ddbb9' },
  },
  {
    id: 'business',
    title: 'Business & management',
    courses: ['BBA', 'MBA'],
    description:
      'Develop the strategic, operational and people skills behind growing organisations.',
    signals: [
      'Leading teams and projects',
      'Strategy and decision-making',
      'Understanding how organisations grow',
    ],
    to: '/courses/bba',
    icon: FiBriefcase,
    image:
      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1400&q=84',
    imageAlt: 'Business students collaborating around a table',
    mood: { bg: '78, 58, 18', accent: '#f0b94d', dot: '#f0b94d' },
  },
  {
    id: 'science',
    title: 'Science & discovery',
    courses: ['B.Sc'],
    description:
      'Follow your curiosity through research, analysis and scientific thinking.',
    signals: [
      'Asking how and why',
      'Experiments and evidence',
      'Analysing patterns and results',
    ],
    to: '/courses/bsc',
    icon: FiTrendingUp,
    image:
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1400&q=84',
    imageAlt: 'Researcher conducting an experiment in a science laboratory',
    mood: { bg: '18, 52, 78', accent: '#5ba8e0', dot: '#5ba8e0' },
  },
  {
    id: 'commerce',
    title: 'Commerce & finance',
    courses: ['B.Com'],
    description:
      'Understand markets, money and the systems that help businesses make decisions.',
    signals: [
      'Working confidently with numbers',
      'Markets and business performance',
      'Structured financial thinking',
    ],
    to: '/courses/bcom',
    icon: FiDollarSign,
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=84',
    imageAlt: 'Team reviewing financial information and documents',
    mood: { bg: '58, 68, 24', accent: '#b5cc4a', dot: '#b5cc4a' },
  },
  {
    id: 'computing',
    title: 'Computing',
    courses: ['BCA'],
    description:
      'Create digital products and systems through code, data and technology.',
    signals: [
      'Logic and structured thinking',
      'Digital tools and products',
      'Learning through experimentation',
    ],
    to: '/courses/bca',
    icon: FiCode,
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=84',
    imageAlt: 'Student learning to code on a laptop',
    mood: { bg: '48, 24, 72', accent: '#a97ce6', dot: '#a97ce6' },
  },
  {
    id: 'humanities',
    title: 'Arts, humanities & law',
    courses: ['BA', 'LLB'],
    description:
      'Explore people, ideas, society and the frameworks that shape our world.',
    signals: [
      'Reading, writing and debate',
      'People, culture and society',
      'Building a clear point of view',
    ],
    to: '/courses/ba',
    icon: FiBookOpen,
    image:
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1400&q=84',
    imageAlt: 'Rows of books in a university library',
    mood: { bg: '72, 34, 28', accent: '#e0785a', dot: '#e0785a' },
  },
];

const CARD_COUNT = pathways.length;

/* ── single depth frame (scroll-linked) ───────────────────────── */
const DepthFrame = ({ pathway, index, scrollYProgress }) => {
  const Icon = pathway.icon;
  const [isInteractive, setIsInteractive] = useState(false);
  const cardStart = index / CARD_COUNT;
  const cardEnd = (index + 1) / CARD_COUNT;
  const cardMid = (cardStart + cardEnd) / 2;
  const segment = cardEnd - cardStart;
  // Let adjacent cards overlap slightly: the next pathway begins to emerge
  // before the current one exits, avoiding a dead beat between scroll steps.
  const enterStart = Math.max(0, cardStart - segment * 0.14);
  const focusStart = cardStart + segment * 0.28;
  const focusEnd = cardStart + segment * 0.68;
  const exitEnd = Math.min(1, cardEnd + segment * 0.14);

  /* z position: cards start far away and zoom toward viewer */
  const z = useTransform(
    scrollYProgress,
    [enterStart, focusStart, focusEnd, exitEnd],
    ['-980px', '-44px', '46px', '820px']
  );

  /* scale: grow as they approach, then overshoot past */
  const scale = useTransform(
    scrollYProgress,
    [enterStart, focusStart, focusEnd, exitEnd],
    [0.5, 0.93, 1.02, 1.62]
  );

  /* opacity: fade in on approach, fade out as they pass */
  const opacity = useTransform(
    scrollYProgress,
    [enterStart, focusStart, focusEnd, exitEnd],
    [0, 1, 1, 0]
  );

  /* blur: soft when distant, sharp at focal, blur out past */
  const blur = useTransform(
    scrollYProgress,
    [enterStart, focusStart, focusEnd, exitEnd],
    ['10px', '1px', '0px', '8px']
  );

  /* detail panel opacity — only visible near focal point */
  const detailOpacity = useTransform(
    scrollYProgress,
    [focusStart, cardMid - segment * 0.06, cardMid + segment * 0.08, focusEnd],
    [0, 1, 1, 0]
  );

  const detailY = useTransform(
    scrollYProgress,
    [focusStart, cardMid],
    ['24px', '0px']
  );

  // All frames share the same 3D stage. Only the focused one should receive
  // clicks or keyboard focus; otherwise an invisible frame can sit above the
  // visible action panel in the stack.
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const nextIsInteractive = progress >= focusStart && progress <= focusEnd;
    setIsInteractive((current) => (current === nextIsInteractive ? current : nextIsInteractive));
  });

  return (
    <motion.div
      className={`pdg-frame${isInteractive ? ' pdg-frame--interactive' : ''}`}
      style={{
        z,
        scale,
        opacity,
        filter: blur.get ? undefined : undefined,
      }}
    >
      <motion.div className="pdg-frame-inner" style={{ filter: blur }}>
        {/* image */}
        <div className="pdg-image-wrap">
          <img
            src={pathway.image}
            alt={pathway.imageAlt}
            width="1400"
            height="900"
            loading={index < 2 ? 'eager' : 'lazy'}
          />
          <span className="pdg-image-shade" />
        </div>

        {/* top editorial meta */}
        <div className="pdg-meta-top">
          <span className="pdg-index">{String(index + 1).padStart(2, '0')}</span>
          <span className="pdg-icon-badge">
            <Icon aria-hidden="true" />
          </span>
        </div>

        {/* bottom card info (always visible on card) */}
        <div className="pdg-card-info">
          <span className="pdg-courses">{pathway.courses.join(' · ')}</span>
          <strong className="pdg-card-title">{pathway.title}</strong>
        </div>
      </motion.div>

      {/* detail panel — slides in when card is at focal point */}
      <motion.div
        className="pdg-detail"
        style={{ opacity: detailOpacity, y: detailY }}
      >
        <p className="pdg-detail-desc">{pathway.description}</p>
        <div className="pdg-detail-signals">
          <span className="pdg-detail-label">A good match if you enjoy</span>
          <ul>
            {pathway.signals.map((signal) => (
              <li key={signal}>
                <FiCheck aria-hidden="true" />
                {signal}
              </li>
            ))}
          </ul>
        </div>
        <div className="pdg-detail-actions">
          <Link to={pathway.to} className="button button-primary" tabIndex={isInteractive ? 0 : -1}>
            Explore courses <FiArrowRight />
          </Link>
          <Link to="/colleges/ug" className="pdg-text-link" tabIndex={isInteractive ? 0 : -1}>
            View related colleges <FiArrowRight />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── progress / scroll indicator ──────────────────────────────── */
const DepthProgress = ({ scrollYProgress }) => {
  const activeIndex = useMotionValue(0);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    activeIndex.set(Math.min(Math.floor(v * CARD_COUNT), CARD_COUNT - 1));
  });

  return (
    <div className="pdg-progress" aria-hidden="true">
      {pathways.map((p, i) => (
        <ProgressDot key={p.id} index={i} activeIndex={activeIndex} pathway={p} />
      ))}
    </div>
  );
};

const ProgressDot = ({ index, activeIndex, pathway }) => {
  const isActive = useTransform(activeIndex, (v) => v === index);
  const dotScale = useTransform(isActive, (a) => (a ? 1 : 0.6));
  const dotOpacity = useTransform(isActive, (a) => (a ? 1 : 0.35));

  return (
    <motion.button
      type="button"
      className="pdg-progress-dot"
      style={{
        scale: dotScale,
        opacity: dotOpacity,
        '--dot-color': pathway.mood.dot,
      }}
      aria-label={`Pathway ${index + 1}: ${pathway.title}`}
    >
      <span />
    </motion.button>
  );
};

/* ── atmosphere background ────────────────────────────────────── */
const DepthAtmosphere = ({ scrollYProgress }) => {
  /* interpolate background color between pathway moods */
  const bgColor = useTransform(scrollYProgress, (v) => {
    const idx = Math.min(Math.floor(v * CARD_COUNT), CARD_COUNT - 1);
    const nextIdx = Math.min(idx + 1, CARD_COUNT - 1);
    const localProgress = (v * CARD_COUNT - idx);
    const from = pathways[idx].mood.bg;
    const to = pathways[nextIdx].mood.bg;
    const fromParts = from.split(',').map(Number);
    const toParts = to.split(',').map(Number);
    const r = Math.round(fromParts[0] + (toParts[0] - fromParts[0]) * localProgress);
    const g = Math.round(fromParts[1] + (toParts[1] - fromParts[1]) * localProgress);
    const b = Math.round(fromParts[2] + (toParts[2] - fromParts[2]) * localProgress);
    return `radial-gradient(ellipse at 50% 50%, rgba(${r},${g},${b},.28) 0%, rgba(8,20,18,.95) 70%)`;
  });

  return <motion.div className="pdg-atmosphere" style={{ background: bgColor }} />;
};

/* ── side metadata (index + title) ────────────────────────────── */
const SideMeta = ({ scrollYProgress }) => {
  const activeIdx = useTransform(scrollYProgress, (v) =>
    Math.min(Math.floor(v * CARD_COUNT), CARD_COUNT - 1)
  );
  const indexLabel = useTransform(activeIdx, (i) => String(i + 1).padStart(2, '0'));
  const titleLabel = useTransform(activeIdx, (i) => pathways[i]?.title || '');
  const accentColor = useTransform(activeIdx, (i) => pathways[i]?.mood.accent || '#72c7ae');

  return (
    <div className="pdg-side-meta" aria-hidden="true">
      <div className="pdg-side-meta-left">
        <motion.span className="pdg-side-index">{indexLabel}</motion.span>
        <motion.span className="pdg-side-title">{titleLabel}</motion.span>
        <motion.span className="pdg-side-dot" style={{ backgroundColor: accentColor }} />
      </div>
      <div className="pdg-side-meta-right">
        <span className="pdg-side-counter">
          <motion.strong>{indexLabel}</motion.strong> / {String(CARD_COUNT).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};

/* ── mobile fallback (horizontal scroll snap) ─────────────────── */
const MobilePathwayCard = ({ pathway, index }) => {
  const Icon = pathway.icon;
  return (
    <div className="pdg-mobile-card">
      <div className="pdg-mobile-image">
        <img src={pathway.image} alt={pathway.imageAlt} width="520" height="680" loading="lazy" />
        <span className="pdg-mobile-shade" />
        <span className="pdg-mobile-topline">
          <span>{String(index + 1).padStart(2, '0')}</span>
          <Icon aria-hidden="true" />
        </span>
      </div>
      <div className="pdg-mobile-content">
        <span className="pdg-mobile-courses">{pathway.courses.join(' · ')}</span>
        <strong>{pathway.title}</strong>
        <p>{pathway.description}</p>
        <div className="pdg-mobile-signals">
          {pathway.signals.map((s) => (
            <span key={s}><FiCheck aria-hidden="true" />{s}</span>
          ))}
        </div>
        <div className="pdg-mobile-actions">
          <Link to={pathway.to} className="button button-primary">
            Explore courses <FiArrowRight />
          </Link>
          <Link to="/colleges/ug" className="pdg-text-link">
            View colleges <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

/* ── main section ─────────────────────────────────────────────── */
const PathwaysSection = () => {
  const tunnelRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: tunnelRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section className="pathways-section">
      <div className="site-container">
        <div className="pathways-heading">
          <SectionHeading
            eyebrow="Explore pathways"
            title="Start with what sparks your curiosity."
            description="Choose an area that feels interesting. We'll help you understand what it involves and where to explore next."
          />
          <a href="#career-explorer" className="pathways-helper">
            <span aria-hidden="true"><FiCompass /></span>
            <span>
              <small>Still deciding?</small>
              <strong>Try the career path explorer</strong>
            </span>
            <FiArrowRight aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* ── desktop: scroll-driven depth gallery ─── */}
      <div className="pdg-tunnel-wrap" ref={tunnelRef}>
        <div className="pdg-sticky">
          <DepthAtmosphere scrollYProgress={scrollYProgress} />

          {/* The copy lives in the viewport on larger screens so the gallery
              feels like one composed, editorial scene rather than a heading
              followed by a separate animation. */}
          <div className="pdg-intro">
            <span className="pdg-eyebrow">Explore pathways</span>
            <h2>Start with what sparks your curiosity.</h2>
            <p>Choose an area that feels interesting. We'll help you understand what it involves and where to explore next.</p>
            <a href="#career-explorer" className="pdg-intro-helper">
              <FiCompass aria-hidden="true" />
              <span>Still deciding? <strong>Try the career path explorer</strong></span>
              <FiArrowRight aria-hidden="true" />
            </a>
            <div className="pdg-intro-progress" aria-hidden="true">
              <span>01</span><i /><span>06</span>
            </div>
          </div>

          {/* floating particles */}
          <div className="pdg-particles" aria-hidden="true">
            <span /><span /><span /><span /><span /><span />
          </div>

          {/* 3D perspective stage */}
          <div className="pdg-stage">
            <div className="pdg-tunnel">
              {pathways.map((pathway, index) => (
                <DepthFrame
                  key={pathway.id}
                  pathway={pathway}
                  index={index}
                  scrollYProgress={scrollYProgress}
                />
              ))}
            </div>
          </div>

          <SideMeta scrollYProgress={scrollYProgress} />
          <DepthProgress scrollYProgress={scrollYProgress} />

          {/* bottom tags */}
          <div className="pdg-tags" aria-hidden="true">
            <span>Scroll to explore pathways</span>
            <FiArrowDown />
          </div>
        </div>
      </div>

      {/* ── mobile: horizontal scroll snap fallback ─── */}
      <div className="pdg-mobile-wrap">
        <div className="site-container">
          <div className="pdg-mobile-deck">
            {pathways.map((pathway, index) => (
              <MobilePathwayCard key={pathway.id} pathway={pathway} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PathwaysSection;
