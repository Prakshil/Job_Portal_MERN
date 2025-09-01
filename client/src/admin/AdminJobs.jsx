import React, { useState, useEffect } from "react";
import styles from "./AdminJobs.module.css";
import { useNavigate } from "react-router-dom";

const AdminJobs = () => {
  const [input, setInput] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Fetch jobs created by the current recruiter
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/job/recruiter`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });

        const data = await response.json();
        console.log("Jobs fetch response:", data);

        if (response.ok && data.jobs) {
          setJobs(data.jobs);
        } else {
          console.error("Failed to fetch jobs:", data.error);
          setJobs([]);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Navigation handlers
  const navigateToCreateJob = () => {
    navigate("/admin/jobs/create");
  };

  const handleEdit = (jobId) => {
    navigate(`/admin/jobs/edit/${jobId}`);
  };

  const handleApplicants = (jobId) => {
    navigate(`/admin/jobs/${jobId}/applicants`);
  };

  const handleDelete = async (jobId) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/job/delete/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        setJobs(jobs.filter(job => job._id !== jobId));
        alert("Job deleted successfully!");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete job");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete job");
    }
  };

  // Filtered jobs
  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(input.toLowerCase()) ||
      job.company?.name?.toLowerCase().includes(input.toLowerCase()) ||
      job.location.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Admin Jobs</h2>

      <div className={styles.topBar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="🔍 Filter by name, role"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className={styles.newJobBtn} onClick={navigateToCreateJob}>
          ➕ New Job
        </button>
      </div>

      <div className={styles.tableWrapper}>
      {loading ? (
        <div className={styles.loadingContainer}>
          <p className={styles.loadingText}>Loading jobs...</p>
        </div>
      ) : (
        <table className={styles.jobsTable}>
          <thead>
            <tr>
              <th>#</th>
              <th>Job Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Salary</th>
              <th>Job Type</th>
              <th>Posted Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job, index) => (
                <tr key={job._id} className={styles.tableRow}>
                  <td>{index + 1}</td>
                  <td className={styles.jobTitle}>{job.title}</td>
                  <td>{job.company?.name || 'N/A'}</td>
                  <td>{job.location}</td>
                  <td>${job.salary}</td>
                  <td><span className={styles.jobType}>{job.jobType}</span></td>
                  <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                  <td className={styles.actionCol}>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.editBtn}
                        onClick={() => handleEdit(job._id)}
                        title="Edit job"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className={styles.applicantsBtn}
                        onClick={() => handleApplicants(job._id)}
                        title="View applicants"
                      >
                        👥 Applicants ({job.applicationCount || 0})
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(job._id)}
                        title="Delete job"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">
                  <div className={styles.emptyState}>
                    <p>
                      {jobs.length === 0 ? 'No jobs posted yet. Create your first job!' : 'No jobs match your search.'}
                    </p>
                    {jobs.length === 0 && (
                      <button className={styles.newJobBtn} onClick={navigateToCreateJob}>
                        ➕ Create First Job
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      </div>
    </div>
  );
};

export default AdminJobs;
