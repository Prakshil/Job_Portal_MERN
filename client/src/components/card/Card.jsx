/**
 * Card Component - Featured Jobs Display
 * Shows latest and popular jobs with company logos
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import style from "./Card.module.css";

const Card = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

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
      {jobs.map((job) => (
        <div
          key={job._id}
          className={style.card}
          onClick={() => handleJobClick(job._id)}
        >
          <div className={style.cardHeader}>
            <img
              src={job.company?.logo ? `${API_URL}${job.company.logo}` : "/vite.svg"}
              alt={`${job.company?.name} Logo`}
              className={style.companyLogo}
              onError={(e) => {
                e.target.src = "/vite.svg";
              }}
            />
            <div className={style.jobType}>{job.jobType}</div>
          </div>

          <h2 className={style.jobTitle}>{job.title}</h2>
          <h3 className={style.companyName}>{job.company?.name || "Company Name"}</h3>

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
      ))}
    </div>
  );
};

export default Card;
