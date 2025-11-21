/**
 * Card Component - Featured Jobs Display
 * Shows latest and popular jobs with company logos
 */

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import style from "./Card.module.css";
import { resolveCompany, buildLogoUrl, COMPANY_PLACEHOLDER } from "../../lib/utils";

gsap.registerPlugin(ScrollTrigger);

const Card = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const cardRefs = useRef([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${API_URL}/api/job/get`);
        const data = await response.json();

        if (response.ok && data.jobs) {
          // Show only first 6 jobs for the featured section
          setJobs(data.jobs.slice(0, 6));
        } else {
          console.error("Failed to fetch jobs:", data.error);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    if (jobs.length > 0 && cardRefs.current.length > 0) {
      cardRefs.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(card,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              delay: index * 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }
      });
    }
  }, [jobs]);

  const handleCardHover = (e, isEntering) => {
    gsap.to(e.currentTarget, {
      y: isEntering ? -8 : 0,
      scale: isEntering ? 1.02 : 1,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleJobClick = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  if (loading) {
    return (
      <div className={style.cardContainer}>
        <div className={style.loading}>Loading featured jobs...</div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className={style.cardContainer}>
        <div className={style.noJobs}>No jobs available at the moment</div>
      </div>
    );
  }

  return (
    <div className={style.cardContainer}>
      {jobs.map((job, index) => {
        const { name, logo } = resolveCompany(job);
        const logoUrl = buildLogoUrl(logo, API_URL) || COMPANY_PLACEHOLDER;
        return (
        <div
          key={job._id}
          ref={(el) => (cardRefs.current[index] = el)}
          className={style.card}
          onClick={() => handleJobClick(job._id)}
          onMouseEnter={(e) => handleCardHover(e, true)}
          onMouseLeave={(e) => handleCardHover(e, false)}
        >
          <div className={style.cardHeader}>
            <img
              src={logoUrl}
              alt="Company Logo"
              className={style.companyLogo}
              onError={(e) => { e.target.src = COMPANY_PLACEHOLDER; }}
            />
            <div className={style.jobType}>{job.jobType}</div>
          </div>

          <h2 className={style.jobTitle}>{job.title}</h2>

          <div className={style.jobDetails}>
            <p>
              <strong>💰 Salary:</strong> ₹{job.salary}
            </p>
            <p>
              <strong>📍 Location:</strong> {job.location}
            </p>
            <p>
              <strong>⏰ Experience:</strong> {job.experienceLevel}
            </p>
          </div>

          <p className={style.description}>
            {job.description.length > 100
              ? `${job.description.substring(0, 100)}...`
              : job.description
            }
          </p>

          <div className={style.cardFooter}>
            <span className={style.postedDate}>
              Posted {new Date(job.createdAt).toLocaleDateString()}
            </span>
            <button className={style.applyBtn}>Apply Now</button>
          </div>
        </div>
      );})}
    </div>
  );
};

export default Card;
