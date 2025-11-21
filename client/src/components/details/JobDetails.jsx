import React, { useState, useEffect } from "react";
import { resolveCompany, buildLogoUrl, COMPANY_PLACEHOLDER } from "../../lib/utils";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./Details.module.css";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [companyResolved, setCompanyResolved] = useState({ name: null, logo: null });
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/api/job/get/${id}`);
        const data = await response.json();
        
        if (response.ok && data.job) {
          setJob(data.job);
          const c = resolveCompany(data.job);
          setCompanyResolved({ name: c.name, logo: buildLogoUrl(c.logo, API_URL) || COMPANY_PLACEHOLDER });
        } else {
          console.error("Failed to fetch job details:", data.error);
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  const handleApply = async () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      alert("Please login to apply for jobs");
      navigate("/login");
      return;
    }

    if (role !== "user") {
      alert("Only job seekers can apply for jobs");
      return;
    }

    setApplying(true);

    try {
      const response = await fetch(`${API_URL}/api/application/apply/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        alert("Application submitted successfully!");
        navigate("/user/dashboard");
      } else {
        alert(data.error || "Failed to apply for job");
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      alert("Failed to apply for job. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading job details...</div>;
  if (!job) return <div className={styles.error}>Job not found.</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.companyInfo}>
          {companyResolved.logo ? (
            <img
              src={companyResolved.logo}
              alt={`${companyResolved.name || 'Company'} Logo`}
              className={styles.companyLogo}
              onError={(e) => { e.target.src = COMPANY_PLACEHOLDER; }}
            />
          ) : (
            <img
              src={COMPANY_PLACEHOLDER}
              alt="Company placeholder"
              className={styles.companyLogo}
            />
          )}
          <div>
            <p className={styles.location}>📍 {job.location}</p>
            <p className={styles.postedDate}>
              Posted on {new Date(job.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <button 
          className={styles.backBtn}
          onClick={() => navigate("/jobs")}
        >
          ← Back to Jobs
        </button>
      </div>

      <div className={styles.jobContent}>
        <div className={styles.jobHeader}>
          <h2 className={styles.jobTitle}>{job.title}</h2>
          <div className={styles.jobMeta}>
            <span className={styles.jobType}>{job.jobType}</span>
            <span className={styles.experience}>{job.experienceLevel}</span>
            <span className={styles.positions}>{job.position} positions</span>
          </div>
        </div>

        <div className={styles.salarySection}>
          <h3>💰 Salary</h3>
          <p className={styles.salary}>₹{job.salary}</p>
        </div>

        <div className={styles.descriptionSection}>
          <h3>📋 Job Description</h3>
          <p className={styles.description}>{job.description}</p>
        </div>

        <div className={styles.requirementsSection}>
          <h3>✅ Requirements</h3>
          <div className={styles.requirements}>
            {Array.isArray(job.requirements) ? (
              <ul>
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            ) : (
              <p>{job.requirements}</p>
            )}
          </div>
        </div>

        <div className={styles.companyDetails}>
          <h3>🏢 About the Company</h3>
          <p>{job.company?.description || job.companyId?.description || "Company description not available."}</p>
          <div className={styles.companyMeta}>
            <p><strong>Industry:</strong> {job.company?.industry || job.companyId?.industry || "Not specified"}</p>
            <p><strong>Website:</strong> {job.company?.website || job.companyId?.website || "Not provided"}</p>
            <p><strong>Location:</strong> {job.company?.location || job.companyId?.location || job.location}</p>
          </div>
        </div>

        <div className={styles.actionSection}>
          <button 
            className={styles.applyBtn}
            onClick={handleApply}
            disabled={applying}
          >
            {applying ? "Applying..." : "Apply for this Job"}
          </button>
          <button 
            className={styles.saveBtn}
            onClick={() => alert("Save functionality coming soon!")}
          >
            Save for Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
