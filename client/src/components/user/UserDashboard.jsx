import React, { useState, useEffect } from "react";
import { resolveCompany, buildLogoUrl, COMPANY_PLACEHOLDER } from "../../lib/utils";
import { useNavigate } from "react-router-dom";
import styles from "./UserDashboard.module.css";

const UserDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/application/my-applications`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });

        const data = await response.json();
        console.log("Applications fetch response:", data);

        if (response.ok && data.applications) {
          setApplications(data.applications);
        } else {
          console.error("Failed to fetch applications:", data.error);
          setApplications([]);
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: "#ffa500",
      accepted: "#28a745", 
      rejected: "#dc3545"
    };

    return (
      <span 
        className={styles.statusBadge}
        style={{ backgroundColor: statusColors[status] }}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const navigateToJobs = () => {
    navigate("/jobs");
  };

  if (loading) {
    return <div className={styles.loading}>Loading your applications...</div>;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>My Job Applications</h1>
        <button className={styles.browseBtn} onClick={navigateToJobs}>
          Browse More Jobs
        </button>
      </div>

      {applications.length === 0 ? (
        <div className={styles.emptyState}>
          <h2>No Applications Yet</h2>
          <p>You haven't applied to any jobs yet. Start browsing and applying!</p>
          <button className={styles.startBtn} onClick={navigateToJobs}>
            Start Job Search
          </button>
        </div>
      ) : (
        <div className={styles.applicationsGrid}>
          {applications.map((application) => {
            const { name, logo } = resolveCompany(application.job);
            const logoUrl = buildLogoUrl(logo, API_URL) || COMPANY_PLACEHOLDER;
            return (
            <div key={application._id} className={styles.applicationCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.jobTitle}>{application.job?.title}</h3>
                {getStatusBadge(application.status)}
              </div>

              <div className={styles.companyInfo}>
                <img
                  src={logoUrl}
                  alt={`${name || 'Company'} Logo`}
                  className={styles.companyLogo}
                  onError={(e) => { e.target.src = COMPANY_PLACEHOLDER; }}
                />
                <div>
                  <h4 className={styles.companyName}>
                    {name || "Company Name"}
                  </h4>
                  <p className={styles.location}>📍 {application.job?.location}</p>
                </div>
              </div>

              <div className={styles.jobDetails}>
                <p className={styles.salary}>💰 ₹{application.job?.salary}</p>
                <p className={styles.jobType}>{application.job?.jobType}</p>
                <p className={styles.experience}>{application.job?.experienceLevel}</p>
              </div>

              <div className={styles.applicationInfo}>
                <p className={styles.appliedDate}>
                  Applied: {new Date(application.createdAt).toLocaleDateString()}
                </p>
                <p className={styles.description}>
                  {application.job?.description?.substring(0, 100)}...
                </p>
              </div>

              <div className={styles.actions}>
                <button 
                  className={styles.viewBtn}
                  onClick={() => navigate(`/job/${application.job?._id}`)}
                >
                  View Job
                </button>
                {application.status === "pending" && (
                  <span className={styles.pendingText}>Awaiting Response</span>
                )}
                {application.status === "accepted" && (
                  <span className={styles.acceptedText}>🎉 Congratulations!</span>
                )}
                {application.status === "rejected" && (
                  <span className={styles.rejectedText}>Keep trying!</span>
                )}
              </div>
            </div>
          );})}
        </div>
      )}

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <h3>{applications.length}</h3>
          <p>Total Applications</p>
        </div>
        <div className={styles.statCard}>
          <h3>{applications.filter(app => app.status === "pending").length}</h3>
          <p>Pending</p>
        </div>
        <div className={styles.statCard}>
          <h3>{applications.filter(app => app.status === "accepted").length}</h3>
          <p>Accepted</p>
        </div>
        <div className={styles.statCard}>
          <h3>{applications.filter(app => app.status === "rejected").length}</h3>
          <p>Rejected</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
