/**
 * Home Component - Landing Page
 * Main entry point of the job portal with hero section, search functionality, and job categories
 */

import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./Home.module.css";
import Card from "../card/Card";

const Home = () => {
  // Refs for horizontal scrolling functionality
  const jobsRef = useRef(null);
  const navigate = useNavigate();

  // State for search functionality
  const [searchQuery, setSearchQuery] = useState("");

  /**
   * Scroll job categories to the left
   */
  const scrollLeft = () => {
    jobsRef.current.scrollBy({ left: -200, behavior: "smooth" });
  };

  /**
   * Scroll job categories to the right
   */
  const scrollRight = () => {
    jobsRef.current.scrollBy({ left: 200, behavior: "smooth" });
  };

  /**
   * Handle search form submission
   * Navigates to jobs page with search query as URL parameter
   */
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to jobs page with search query as URL parameter
      navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      // Navigate to jobs page without search query
      navigate('/jobs');
    }
  };

  /**
   * Handle input field changes for search
   */
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      {/* Hero Section with main heading and search */}
      <div className={style.home}>
        <p className={style.text}>No. 1 Felix Job Portal Website </p>
        <h1>
          Search, Apply & <br />
          Get Your <span className={style.dream}>Dream Jobs</span>
        </h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa
          perferendis, ratione consequatur <br /> animi cupiditate saepe
          eligendi expedita ipsum eaque voluptas?
        </p>

        {/* Search Form */}
        <form onSubmit={handleSearch}>
          <div className={style.input}>
            <input
              type="search"
              placeholder="find your dream jobs...."
              value={searchQuery}
              onChange={handleInputChange}
            />
            <button type="submit">
              <i className="ri-search-line"></i>
            </button>
          </div>
        </form>
      </div>

      {/* Job Categories Section with horizontal scrolling */}
      <div className={style.jobsWrapper}>
        <button className={style.scrollBtn} onClick={scrollLeft}>
          <i className="ri-arrow-left-s-line"></i>
        </button>

        <div className={style.jobs} ref={jobsRef}>
          <div>
            <h2>Frontend Developer</h2>
          </div>
          <div>
            <h2>Backend Developer</h2>
          </div>
          <div>
            <h2>UI/UX Designer</h2>
          </div>
          <div>
            <h2>Full Stack Developer</h2>
          </div>
          <div>
            <h2>Project Manager</h2>
          </div>
          <div>
            <h2>Data Scientist</h2>
          </div>
          <div>
            <h2>DevOps Engineer</h2>
          </div>
        </div>

        <button className={style.scrollBtn} onClick={scrollRight}>
          <i className="ri-arrow-right-s-line"></i>
        </button>
      </div>

      {/* Featured Jobs Section */}
      <div className={style.cardContainer}>
        <h1>Latest and Top Popular Jobs For You</h1>
        <div className={style.line}></div>
        <div>
          <Card />
        </div>
      </div>
    </>
  );
};

export default Home;
