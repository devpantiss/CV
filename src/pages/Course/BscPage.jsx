import HeroMedia from '../../components/ui/HeroMedia';
import React from "react";
import { Link } from "react-router-dom";
import { GrWorkshop } from "react-icons/gr";
import { TfiWrite } from "react-icons/tfi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { PiStudent } from "react-icons/pi";
import { LiaUniversitySolid } from "react-icons/lia";
import {
  FaLaptopCode,
  FaLeaf,
  FaMicroscope,
  FaFlask,
  FaChartLine,
  FaAtom,
  FaCalculator,
  FaGlobe,
  FaDna,
  FaBriefcase,
} from "react-icons/fa";

const examData = [
  {
    exam: "CUET",
    siteUrl: "https://cuet.samarth.ac.in",
    examDates: [{ session: "", dates: "15 May '24 - 31 May '24" }],
  },
  {
    exam: "NPAT",
    siteUrl: "https://www.npat.in",
    examDates: [{ session: "", dates: "To be announced" }],
  },
  {
    exam: "KCET",
    siteUrl: "https://cetonline.karnataka.gov.in/kea/",
    examDates: [{ session: "", dates: "18 Apr '24 - 19 Apr '24" }],
  },
];

const government = [
  {
    name: "Hindu College, New Delhi",
    location: "New Delhi, Delhi",
    rank: 1,
    siteUrl: "http://hinducollege.ac.in",
  },
  {
    name: "Miranda House, New Delhi",
    location: "New Delhi, Delhi",
    rank: 2,
    siteUrl: "http://www.mirandahouse.ac.in",
  },
  {
    name: "St. Stephen's College, New Delhi",
    location: "New Delhi, Delhi",
    rank: 3,
    siteUrl: "https://www.ststephens.edu",
  },
  {
    name: "Madras Christian College (MCC), Chennai",
    location: "Chennai, Tamil Nadu",
    rank: 4,
    siteUrl: "https://www.mcc.edu.in",
  },
  {
    name: "Loyola College, Chennai",
    location: "Chennai, Tamil Nadu",
    rank: 5,
    siteUrl: "https://www.loyolacollege.edu",
  },
];

const privateCollege = [
  {
    name: "St. Xavier's College, Mumbai",
    location: "Mumbai, Maharashtra",
    rank: 1,
    siteUrl: "https://xaviers.edu/main",
  },
  {
    name: "Christ University, Bangalore",
    location: "Bangalore, Karnataka",
    rank: 2,
    siteUrl: "https://christuniversity.in",
  },
  {
    name: "Presidency College, Chennai",
    location: "Chennai, Tamil Nadu",
    rank: 3,
    siteUrl: "https://presidencycollege.ac.in",
  },
  {
    name: "St. Joseph's College, Bangalore",
    location: "Bangalore, Karnataka",
    rank: 4,
    siteUrl: "https://www.sjc.ac.in",
  },
  {
    name: "Fergusson College, Pune",
    location: "Pune, Maharashtra",
    rank: 5,
    siteUrl: "http://fergusson.edu",
  },
];

const featuredCollege = [
  {
    name: "Amity University",
    location: "Noida, New Delhi",
    siteUrl: "https://www.amity.edu/",
  },
  {
    name: "GNIOT Group of Institutes",
    location: "Greater Noida, UP",
    siteUrl: "https://www.gniotgroup.edu.in/",
  },
  {
    name: "Flame University",
    location: "Pune, Maharashtra",
    siteUrl: "https://www.flame.edu.in/",
  },
  {
    name: "ITM University",
    location: "Vadodara, Gujarat",
    siteUrl: "https://www.itm.edu/",
  },
  {
    name: "SRM UNIVERSITY",
    location: "Sonepat, Haryana",
    siteUrl: "https://srmuniversity.ac.in/",
  },
  {
    name: "R V University",
    location: "Bengaluru, Karnataka",
    siteUrl: "https://rvu.edu.in/",
  },
  {
    name: "Poddar Group of Institutions",
    location: "Jaipur, Rajasthan",
    siteUrl: "https://www.poddarinstitute.org/",
  },
  {
    name: "Mody University",
    location: "Sikar, Rajasthan",
    siteUrl: "https://www.modyuniversity.ac.in/",
  },
  {
    name: "Graphic Era University",
    location: "Dehradun, Uttarakhand",
    siteUrl: "https://geu.ac.in/",
  },
  {
    name: "Gitam",
    location: "Hyderabad, Telangana",
    siteUrl: "https://www.gitam.edu/",
  }
];


const streams = [
  {
    name: "Computer Science",
    icon: <FaLaptopCode className="text-4xl text-[var(--color-primary)]" />,
  },
  { name: "Botany", icon: <FaLeaf className="text-4xl text-[var(--color-primary)]" /> },
  {
    name: "Zoology",
    icon: <FaMicroscope className="text-4xl text-[var(--color-primary)]" />,
  },
  { name: "Chemistry", icon: <FaFlask className="text-4xl text-[var(--color-primary)]" /> },
  {
    name: "Economics",
    icon: <FaChartLine className="text-4xl text-[var(--color-primary)]" />,
  },
  { name: "Physics", icon: <FaAtom className="text-4xl text-[var(--color-primary)]" /> },
  {
    name: "Mathematics",
    icon: <FaCalculator className="text-4xl text-[var(--color-primary)]" />,
  },
  { name: "Geology", icon: <FaGlobe className="text-4xl text-[var(--color-primary)]" /> },
  {
    name: "Biotechnology",
    icon: <FaDna className="text-4xl text-[var(--color-primary)]" />,
  },
];

const BscPage = () => {
  return (
    <div className="btech-page-container">
      <div className="hero-section course-editorial-hero bg-gradient-to-b lg:bg-gradient-to-br from-[var(--color-primary-soft)] via-[var(--color-background)] to-[var(--color-accent-soft)] text-[var(--color-foreground)] pt-64 lg:pt-40 pb-20 px-6">
        <HeroMedia image="/media/pathways/science.jpg" />
        <nav className="hero-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/explorecity">Courses & colleges</a><span aria-hidden="true">/</span><span>Course guide</span></nav>
        <p className="course-hero-kicker">Explore your next chapter</p>
        <div className="container mx-auto flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
            <h1 className="text-5xl font-bold">Bachelor of Science</h1>
            <br />
            <p className="text-lg mt-4">Empowering Innovators with the Knowledge to Transform the Future through Science.</p>
            {/* <h1 className="text-5xl font-bold">Bachelor of Science (B.Sc)</h1>
            <p className="mt-4 text-lg">An in-depth look at the premier undergraduate program in engineering and technology.</p> */}
          </div>
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            {/* <img src="https://res.cloudinary.com/du3i8e0se/image/upload/v1722094698/vecteezy_a-scientist-working-in-a-lab-male-character-doing-a_5607850-ai-brush-removebg-tdf5tm6j_uvhraa.png" alt="B.Tech Illustration" className="rounded-lg" /> */}
            <img
              src="https://res.cloudinary.com/du3i8e0se/image/upload/v1722202939/science_1_xspm1c.png"
              alt="B.Tech Illustration"
              className="rounded-lg floating w-[400px]"
            />
          </div>
        </div>
      </div>

      <main className="container mx-auto pb-12 pt-12 lg:pt-24 px-6">
        <section id="course-details" className="mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[var(--color-primary)] flex items-center">
            <PiStudent className="mr-2" /> Course Details
          </h2>
          <ul className="custom-list list-inside bg-[var(--color-surface-muted)] p-6 rounded-lg shadow-sm text-lg leading-relaxed">
            <li>
              B.Sc (Bachelor of Science) is a three-year undergraduate program.
            </li>
            <li>Focuses on foundational and applied sciences.</li>
            <li>
              Provides specialization in various disciplines such as computer
              science, physics, chemistry, biology, and mathematics.
            </li>
          </ul>
        </section>

        <section id="streams" className="mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[var(--color-primary)] flex items-center"><FaLaptopCode className="mr-2"/> Associated Streams</h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {streams.map((stream, index) => (
              <div key={index} className="flex flex-col items-center text-center bg-[var(--color-surface)] shadow-md rounded-lg p-6">
                {stream.icon}
                <h4 className="text-lg font-bold mt-4 text-[var(--color-primary)]">{stream.name}</h4>
              </div>
            ))}
          </div>
        </section>

        <section id="eligibility-criteria" className="mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[var(--color-primary)] flex items-center">
            <IoMdCheckmarkCircleOutline className="mr-2" /> Eligibility Criteria
          </h2>
          <ul className="custom-list list-inside bg-[var(--color-surface-muted)] p-6 rounded-lg shadow-sm text-lg leading-relaxed">
            <li>
              Eligibility criteria vary depending on the college and specific
              program.
            </li>
            <li>
              Most colleges require candidates to have completed their 12th
              standard with a minimum of 50% marks in science stream.
            </li>
            <li>
              Some colleges may also require candidates to have a valid score in
              an entrance exam.
            </li>
          </ul>
        </section>

        <section id="top-exams" className="mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[var(--color-primary)] flex items-center">
            <TfiWrite className="mr-2" /> Top Exams
          </h2>
          <div className="overflow-x-auto bg-[var(--color-surface)] shadow-md rounded-lg">
            <table className="w-full text-sm text-left text-[var(--color-foreground)]">
              <thead className="text-xs uppercase bg-[var(--color-primary-soft)] text-[var(--color-muted)]">
                <tr>
                  <th scope="col" className="px-6 py-3 text-[var(--color-primary)]">
                    Exam Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-[var(--color-primary)]">
                    Exam Dates
                  </th>
                </tr>
              </thead>
              <tbody>
                {examData.map((exam, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-[var(--color-surface-muted)]" : "bg-[var(--color-surface)]"
                    } border-t border-[var(--color-border)]`}
                  >
                    <td className="px-6 py-4">
                      <Link
                        to={exam.siteUrl}
                        className="hover:text-[var(--color-primary-strong)] text-[var(--color-primary)]"
                      >
                        {exam.exam}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <ul>
                        {exam.examDates.map((session, idx) => (
                          <li key={idx}>
                            {session.session ? `${session.session}: ` : ""}
                            {session.dates}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="placement-details" className="mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[var(--color-primary)] flex items-center">
          <FaBriefcase className="mr-2" /> Career Prospects
          </h2>
          <ul className="custom-list list-inside bg-[var(--color-surface-muted)] p-6 rounded-lg shadow-sm text-lg leading-relaxed">
            <li>
              Eligibility criteria must be met before applying to any B.Sc.
              placement, on- or off-campus.
            </li>
            <li>
              Companies evaluate applicants based on academic performance,
              skills, and relevant experience.
            </li>
            <li>
              Top recruiters have specific eligibility criteria for applicants.
            </li>
            <li>
              Internship opportunities are often available to enhance practical
              knowledge and employability.
            </li>
            <li>
              Placement training sessions are conducted to prepare students for
              interviews and assessments.
            </li>
            <li>
              Alumni networks and industry connections play a crucial role in
              securing placements.
            </li>
          </ul>
        </section>

        <section id="top-colleges" className="mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[var(--color-primary)] flex items-center">
            <LiaUniversitySolid className="mr-2" /> Top Colleges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-semibold mb-2 text-[var(--color-primary)]">
                Government Colleges
              </h3>
              <div className="bg-[var(--color-surface)] shadow-md rounded-lg p-6">
                {government.map((college, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${
                      index < government.length - 1
                        ? "border-b border-[var(--color-border)] pb-4"
                        : ""
                    }`}
                  >
                    <h4 className="text-lg font-bold">
                      <Link
                        to={college.siteUrl}
                        className="hover:text-[var(--color-primary-strong)] text-[var(--color-primary)]"
                      >
                        {college.name}
                      </Link>
                    </h4>
                    <p>{college.location}</p>
                    <p>Rank: {college.rank}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-2 text-[var(--color-primary)]">
                Private Colleges
              </h3>
              <div className="bg-[var(--color-surface)] shadow-md rounded-lg p-6">
                {privateCollege.map((college, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${
                      index < privateCollege.length - 1
                        ? "border-b border-[var(--color-border)] pb-4"
                        : ""
                    }`}
                  >
                    <h4 className="text-lg font-bold">
                      <Link
                        to={college.siteUrl}
                        className="hover:text-[var(--color-primary-strong)] text-[var(--color-primary)]"
                      >
                        {college.name}
                      </Link>
                    </h4>
                    <p>{college.location}</p>
                    <p>Rank: {college.rank}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-2 text-[var(--color-primary)]">
                Featured Colleges
              </h3>
              <div className="bg-[var(--color-surface)] shadow-md rounded-lg p-6">
                {featuredCollege.map((college, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${
                      index < featuredCollege.length - 1
                        ? "border-b border-[var(--color-border)] pb-4"
                        : ""
                    }`}
                  >
                    <h4 className="text-lg font-bold">
                      <Link
                        to={college.siteUrl}
                        className="hover:text-[var(--color-primary-strong)] text-[var(--color-primary)]"
                      >
                        {college.name}
                      </Link>
                    </h4>
                    <p>{college.location}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <style>{`
        .custom-list li {
          position: relative;
          padding-left: 1.5em;
        }
        .custom-list li::before {
          content: "\\2713"; 
          position: absolute;
          left: 0;
          top: -5px;
          color: var(--color-primary);
          font-size: 1.2em;
          font-weight: 800; 
        }
      `}</style>
    </div>
  );
};

export default BscPage;
