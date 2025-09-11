/**
 * Home Component - Landing Page
 * Main entry point of the job portal with hero section, search functionality, and job categories
 */

import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import style from "./Home.module.css";
import Card from "../card/Card";
import StaticJobCards from "../card/StaticJobCards";

const Home = () => {
  const jobsRef = useRef(null);
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("role");

  const scrollLeft = () => {
    if (jobsRef.current) jobsRef.current.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (jobsRef.current) jobsRef.current.scrollBy({ left: 200, behavior: "smooth" });
  };

  // Search removed from home page

  return (
    <>
      {/* Hero Section */}
      <div className={style.home}>
        <p className={style.text}>The Premier Tech Job Platform</p>
        <h1>
          Discover & Apply to <br />
          Your <span className={style.dream}>Ideal Tech Careers</span>
        </h1>
        <p>
          Connect with the best tech companies and find opportunities that match your skills and aspirations.
          <br /> Streamlined application process to help you land your next role faster.
        </p>
        {/* search removed */}
      </div>

      {/* Job categories */}
      <div className={style.jobsWrapper}>
        <button className={style.scrollBtn} onClick={scrollLeft}>
          <i className="ri-arrow-left-s-line"></i>
        </button>

        <div className={style.jobs} ref={jobsRef}>
          <div><h2>Frontend Developer</h2></div>
          <div><h2>Backend Developer</h2></div>
          <div><h2>UI/UX Designer</h2></div>
          <div><h2>Full Stack Developer</h2></div>
          <div><h2>Project Manager</h2></div>
          <div><h2>Data Scientist</h2></div>
          <div><h2>DevOps Engineer</h2></div>
        </div>

        <button className={style.scrollBtn} onClick={scrollRight}>
          <i className="ri-arrow-right-s-line"></i>
        </button>
      </div>

      {/* Featured Jobs */}
      <div className={style.cardContainer}>
        <h1>Latest and Top Popular Jobs For You</h1>
        <div className={style.line} />
        {!isLoggedIn && (
          <div className={style.signupPrompt}>
            <p>
              Ready to apply for these exciting positions? <span onClick={() => navigate("/login")}>Sign in</span> or create an account to access full job details and submit your application.
            </p>
          </div>
        )}
        <div>{isLoggedIn ? <Card /> : <StaticJobCards />}</div>
      </div>
    </>
  );
};

export default Home;
