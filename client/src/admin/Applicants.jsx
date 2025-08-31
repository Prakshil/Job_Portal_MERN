import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./Applicants.module.css";

const Applicants = () => {
  const { id: jobId } = useParams(); // Get job ID from URL
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch job details first
        const jobResponse = await fetch(`${API_URL}/api/job/get/${jobId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });
        
        if (jobResponse.ok) {
          const jobData = await jobResponse.json();
          setJobDetails(jobData.job);
        }

        // Fetch applications for this job
        const response = await fetch(`${API_URL}/api/application/job/${jobId}`, {
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

    if (jobId) {
      fetchApplications();
    }
  }, [jobId]);

  const updateApplicationStatus = async (applicationId, newStatus) => {
    setUpdatingStatus(applicationId);
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/application/status/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update the local state
        setApplications(prev => 
          prev.map(app => 
            app._id === applicationId 
              ? { ...app, status: newStatus }
              : app
          )
        );
        alert(`Application ${newStatus} successfully!`);
      } else {
        alert(data.error || "Failed to update application status");
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      alert("Failed to update application status. Please try again.");
    } finally {
      setUpdatingStatus(null);
    }
  };

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

  if (loading) {
    return <div className={styles.loading}>Loading applications...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>
            Job Applicants ({applications.length})
          </h1>
          {jobDetails && (
            <div className={styles.jobInfo}>
              <h2>{jobDetails.title}</h2>
              <p>📍 {jobDetails.location} • 💰 ₹{jobDetails.salary} • {jobDetails.jobType}</p>
            </div>
          )}
        </div>
        <button 
          className={styles.backBtn}
          onClick={() => navigate("/admin/jobs")}
        >
          ← Back to Jobs
        </button>
      </div>

      {applications.length === 0 ? (
        <div className={styles.emptyState}>
          <h3>No Applications Yet</h3>
          <p>No one has applied for this job yet. Share the job posting to get more applications!</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Applicant Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th className={styles.actionCol}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application._id}>
                  <td className={styles.nameCell}>
                    <div className={styles.applicantInfo}>
                      <strong>{application.applicant?.name || "N/A"}</strong>
                    </div>
                  </td>
                  <td>{application.applicant?.email || "N/A"}</td>
                  <td>{application.applicant?.phoneNumber || "N/A"}</td>
                  <td>{new Date(application.createdAt).toLocaleDateString()}</td>
                  <td>{getStatusBadge(application.status)}</td>
                  <td className={styles.actionCol}>
                    {application.status === "pending" ? (
                      <div className={styles.actionButtons}>
                        <button 
                          className={styles.acceptBtn}
                          onClick={() => updateApplicationStatus(application._id, "accepted")}
                          disabled={updatingStatus === application._id}
                        >
                          {updatingStatus === application._id ? "..." : "Accept"}
                        </button>
                        <button 
                          className={styles.rejectBtn}
                          onClick={() => updateApplicationStatus(application._id, "rejected")}
                          disabled={updatingStatus === application._id}
                        >
                          {updatingStatus === application._id ? "..." : "Reject"}
                        </button>
                      </div>
                    ) : (
                      <div className={styles.statusActions}>
                        {application.status === "accepted" && (
                          <button 
                            className={styles.rejectBtn}
                            onClick={() => updateApplicationStatus(application._id, "rejected")}
                            disabled={updatingStatus === application._id}
                          >
                            Reject
                          </button>
                        )}
                        {application.status === "rejected" && (
                          <button 
                            className={styles.acceptBtn}
                            onClick={() => updateApplicationStatus(application._id, "accepted")}
                            disabled={updatingStatus === application._id}
                          >
                            Accept
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className={styles.summary}>
        <div className={styles.statCard}>
          <h3>{applications.filter(app => app.status === "pending").length}</h3>
          <p>Pending Applications</p>
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

export default Applicants;
