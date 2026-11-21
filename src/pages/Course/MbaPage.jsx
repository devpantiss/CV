import HeroMedia from '../../components/ui/HeroMedia';
import React from "react";
import { Link } from "react-router-dom";
import { GrWorkshop } from "react-icons/gr";
import { TfiWrite } from "react-icons/tfi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { PiStudent } from "react-icons/pi";
import { LiaUniversitySolid } from "react-icons/lia";
import {
  FaChartLine,
  FaHandshake,
  FaMoneyBillWave,
  FaUserCog,
  FaChartPie,
  FaBuilding,
  FaCogs,
  FaLaptopCode,
  FaBriefcase,
} from "react-icons/fa";

const examData = [
  {
    exam: "CAT",
    siteUrl: "https://iimcat.ac.in/",
    examDates: [{ session: "", dates: "Check official website for dates" }],
  },
  {
    exam: "XAT",
    siteUrl: "https://xatonline.net.in/",
    examDates: [{ session: "", dates: "Check official website for dates" }],
  },
  {
    exam: "MAT",
    siteUrl: "https://mat.aima.in/",
    examDates: [{ session: "", dates: "Check official website for dates" }],
  },
  {
    exam: "SNAP",
    siteUrl: "https://www.snaptest.org/",
    examDates: [{ session: "", dates: "Check official website for dates" }],
  },
  {
    exam: "CMAT",
    siteUrl: "https://cmat.nta.ac.in/",
    examDates: [{ session: "", dates: "Check official website for dates" }],
  },
];

const government = [
  {
    name: "Indian Institute of Management (IIM) Ahmedabad",
    location: "Ahmedabad, Gujarat",
    rank: 1,
    siteUrl: "https://www.iimahd.ac.in/",
  },
  {
    name: "Indian Institute of Management (IIM) Bangalore",
    location: "Bangalore, Karnataka",
    rank: 2,
    siteUrl: "https://www.iimb.ac.in/",
  },
  {
    name: "Indian Institute of Management (IIM) Calcutta",
    location: "Kolkata, West Bengal",
    rank: 3,
    siteUrl: "https://www.iimcal.ac.in/",
  },
  {
    name: "Indian Institute of Management (IIM) Lucknow",
    location: "Lucknow, Uttar Pradesh",
    rank: 4,
    siteUrl: "https://www.iiml.ac.in/",
  },
  {
    name: "Faculty of Management Studies (FMS), Delhi University",
    location: "Delhi",
    rank: 5,
    siteUrl: "https://www.fms.edu/",
  },
];

const privateCollege = [
  {
    name: "Xavier Labour Relations Institute (XLRI)",
    location: "Jamshedpur, Jharkhand",
    rank: 1,
    siteUrl: "https://www.xlri.ac.in/",
  },
  {
    name: "Management Development Institute (MDI), Gurgaon",
    location: "Gurgaon, Haryana",
    rank: 2,
    siteUrl: "https://www.mdi.ac.in/",
  },
  {
    name: "Symbiosis Institute of Business Management (SIBM) Pune",
    location: "Pune, Maharashtra",
    rank: 3,
    siteUrl: "https://www.sibm.edu/",
  },
  {
    name: "Narsee Monjee Institute of Management Studies (NMIMS)",
    location: "Mumbai, Maharashtra",
    rank: 4,
    siteUrl: "https://www.nmims.edu/",
  },
  {
    name: "Indian Institute of Foreign Trade (IIFT)",
    location: "New Delhi",
    rank: 5,
    siteUrl: "https://iift.ac.in/",
  },
];

const featuredCollege = [
  {
    name: "ISBR",
    location: "Bengaluru, Karnataka",
    siteUrl: "https://www.isbr.in/",
  },
  {
    name: "Mangalmay Group of Institutions",
    location: "Greater Noida, UP",
    siteUrl: "https://www.mangalmay.org/",
  },
  {
    name: "Graphic Era University",
    location: "Dehradun, Uttarakhand",
    siteUrl: "https://geu.ac.in/",
  },
  {
    name: "Poddar Group of Institutions",
    location: "Jaipur, Rajasthan",
    siteUrl: "https://www.poddarinstitute.org/",
  },
  {
    name: "R V University",
    location: "Bengaluru, Karnataka",
    siteUrl: "https://rvu.edu.in/",
  },
  {
    name: "SRM UNIVERSITY",
    location: "Sonepat, Haryana",
    siteUrl: "https://srmuniversity.ac.in/",
  },
  {
    name: "GNIOT Group of Institutes",
    location: "Greater Noida, UP",
    siteUrl: "https://www.gniotgroup.edu.in/",
  },
  {
    name: "Amity University",
    location: "Noida, New Delhi",
    siteUrl: "https://www.amity.edu/",
  },
  {
    name: "Alliance University",
    location: "Bengaluru, Karnataka",
    siteUrl: "https://www.alliance.edu.in/",
  },
  {
    name: "Flame University",
    location: "Pune, Maharashtra",
    siteUrl: "https://www.flame.edu.in/",
  },
  {
    name: "S.P MANDALI's WE SCHOOL (Welingkar)",
    location: "Bangalore, Karnataka",
    siteUrl: "https://www.welingkar.org/",
  },
  {
    name: "ITM University",
    location: "Vadodara, Gujarat",
    siteUrl: "https://www.itm.edu/",
  },
  {
    name: "Vishwa Vishwani School of Business",
    location: "Hyderabad, Telangana",
    siteUrl: "https://www.vishwavishwani.ac.in/",
  },
  {
    name: "SSIM",
    location: "Hyderabad, Telangana",
    siteUrl: "https://ssim.ac.in/",
  },
  {
    name: "INurture Education Solutions",
    location: "Bengaluru, Karnataka",
    siteUrl: "https://inurture.co.in/",
  },
  {
    name: "Accurate Group of Institutions",
    location: "Greater Noida, Uttar Pradesh",
    siteUrl: "https://www.accurate.in/",
  },
  {
    name: "Mody University",
    location: "Sikar, Rajasthan",
    siteUrl: "https://www.modyuniversity.ac.in/",
  },
  {
    name: "Nicmar",
    location: "Hyderabad, Telengana",
    siteUrl: "https://www.nicmar.ac.in/hyderabad/campus",
  }
];


const streams = [
  {
    name: "Marketing",
    icon: <FaChartLine className="text-4xl text-[var(--color-primary)]" />,
  },
  {
    name: "Finance",
    icon: <FaMoneyBillWave className="text-4xl text-[var(--color-primary)]" />,
  },
  {
    name: "Human Resources",
    icon: <FaUserCog className="text-4xl text-[var(--color-primary)]" />,
  },
  {
    name: "Operations Management",
    icon: <FaCogs className="text-4xl text-[var(--color-primary)]" />,
  },
  {
    name: "Business Analytics",
    icon: <FaChartPie className="text-4xl text-[var(--color-primary)]" />,
  },
  {
    name: "Entrepreneurship",
    icon: <FaBuilding className="text-4xl text-[var(--color-primary)]" />,
  },
];

const MbaPage = () => {

  return (
    <div className="btech-page-container">
      <div className="hero-section course-editorial-hero bg-gradient-to-b lg:bg-gradient-to-br from-[var(--color-primary-soft)] via-[var(--color-background)] to-[var(--color-accent-soft)] text-[var(--color-foreground)] pt-64 lg:pt-40 pb-20 px-6">
        <HeroMedia image="/media/pathways/business.jpg" />
        <nav className="hero-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/explorecity">Courses & colleges</a><span aria-hidden="true">/</span><span>Course guide</span></nav>
        <p className="course-hero-kicker">Explore your next chapter</p>
        <div className="container mx-auto flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
            <h1 className="text-5xl font-bold">Master of Business Administration</h1>
            <br />
            <p className="text-lg mt-4">Empowering Future Business Leaders with Innovative Management Skills</p>
            {/* <h1 className="text-5xl font-bold">Master of Business Administration (M.B.A)</h1>
            <p className="mt-4 text-lg">An in-depth look at the premier undergraduate program in engineering and technology.</p> */}
          </div>
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            {/* <img src="https://res.cloudinary.com/du3i8e0se/image/upload/v1722097730/Untitled_design__1_-removebg_d9cwlr.png" alt="B.Tech Illustration" className="rounded-lg w-[450px]" /> */}
            <img
              src="https://res.cloudinary.com/du3i8e0se/image/upload/v1722202936/management-removebg-preview_1_ai37uj.png"
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
              MBA (Master of Business Administration) is a postgraduate program
              typically spanning two years.
            </li>
            <li>
              Focuses on developing business acumen, leadership skills, and
              strategic thinking.
            </li>
            <li>
              Covers core subjects like finance, marketing, human resources,
              operations, and strategic management.
            </li>
            <li>
              Offers specializations in various domains like finance, marketing,
              HR, operations, consulting, and more.
            </li>
            <li>
              Prepares graduates for managerial roles across diverse industries.
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
            <li>Typically requires a bachelor's degree in any discipline.</li>
            <li>Some colleges may specify minimum percentage requirements.</li>
            <li>
              Admission is often based on entrance exams like CAT, GMAT, XAT,
              MAT, etc.
            </li>
            <li>
              Work experience might be preferred or mandatory for some programs.
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
              Strong emphasis on placements with top recruiters from various
              industries.
            </li>
            <li>
              Campus placements are common, offering a platform to connect with
              potential employers.
            </li>
            <li>Internships during the program enhance placement prospects.</li>
            <li>
              High salary packages and diverse job profiles are key highlights.
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

export default MbaPage;
