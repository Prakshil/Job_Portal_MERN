/**
 * StaticJobCards Component - Featured Jobs Display for unregistered users
 * Shows static job cards that don't require API calls
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import style from "./Card.module.css";

const StaticJobCards = () => {
  const navigate = useNavigate();
  
  // Static job data
  const staticJobs = [
    {
      id: 'static-1',
      title: 'Senior Frontend Developer',
      companyName: 'TechVision Inc.',
      jobType: 'Full-time',
      salary: '120,000 - 150,000',
      location: 'San Francisco, CA (Remote)',
      experienceLevel: '3-5 years',
      description: 'Join our team to build modern web applications using React, TypeScript, and GraphQL. We are looking for experienced developers who can lead frontend initiatives.',
      postedDate: '2 days ago'
    },
    {
      id: 'static-2',
      title: 'Backend Engineer (Node.js)',
      companyName: 'DataFlow Systems',
      jobType: 'Full-time',
      salary: '110,000 - 140,000',
      location: 'New York, NY (Hybrid)',
      experienceLevel: '2-4 years',
      description: 'Develop scalable backend services using Node.js, Express, and MongoDB. Implement RESTful APIs and microservices architecture.',
      postedDate: '1 week ago'
    },
    {
      id: 'static-3',
      title: 'UX/UI Designer',
      companyName: 'CreativeMinds',
      jobType: 'Contract',
      salary: '90,000 - 110,000',
      location: 'Austin, TX (On-site)',
      experienceLevel: '2+ years',
      description: 'Design intuitive user interfaces for web and mobile applications. Create wireframes, prototypes, and collaborate with development teams.',
      postedDate: '3 days ago'
    },
    {
      id: 'static-4',
      title: 'Full Stack Developer',
      companyName: 'Innovate Solutions',
      jobType: 'Full-time',
      salary: '130,000 - 160,000',
      location: 'Remote',
      experienceLevel: '4+ years',
      description: 'Work on all aspects of our SaaS platform using React, Node.js, and AWS. Strong problem-solving skills and full product lifecycle experience required.',
      postedDate: '5 days ago'
    },
    {
      id: 'static-5',
      title: 'DevOps Engineer',
      companyName: 'CloudTech Solutions',
      jobType: 'Full-time',
      salary: '125,000 - 155,000',
      location: 'Seattle, WA (Hybrid)',
      experienceLevel: '3+ years',
      description: 'Implement CI/CD pipelines, manage cloud infrastructure on AWS, and optimize application deployment processes.',
      postedDate: '1 week ago'
    },
    {
      id: 'static-6',
      title: 'Machine Learning Engineer',
      companyName: 'AI Innovations',
      jobType: 'Full-time',
      salary: '140,000 - 180,000',
      location: 'Boston, MA (Remote)',
      experienceLevel: '3-5 years',
      description: 'Develop machine learning models and algorithms to solve complex business problems. Experience with Python, TensorFlow, and cloud ML platforms required.',
      postedDate: '4 days ago'
    }
  ];

  const handleJobClick = (jobId) => {
    // Navigate to login page with a message about signing in to view job details
    navigate('/login', { state: { message: 'Sign in to view job details and apply' } });
  };

  return (
    <div className={style.cardContainer}>
      {staticJobs.map((job) => (
        <div
          key={job.id}
          className={style.card}
          onClick={() => handleJobClick(job.id)}
        >
          <div className={style.cardHeader}>
            <div className={`${style.companyLogo} ${style.staticLogo}`}>
              {job.companyName.charAt(0)}
            </div>
            <div className={style.jobType}>{job.jobType}</div>
          </div>

          <h2 className={style.jobTitle}>{job.title}</h2>
          <h3 className={style.companyName}>{job.companyName}</h3>

          <div className={style.jobDetails}>
            <p>
              <strong>💰 Salary:</strong> ${job.salary}
            </p>
            <p>
              <strong>📍 Location:</strong> {job.location}
            </p>
            <p>
              <strong>⏰ Experience:</strong> {job.experienceLevel}
            </p>
          </div>

          <p className={style.description}>{job.description}</p>

          <div className={style.cardFooter}>
            <span className={style.postedDate}>Posted {job.postedDate}</span>
            <button className={style.applyBtn}>View Details</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StaticJobCards;
