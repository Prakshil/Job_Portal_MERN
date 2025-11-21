import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Users, Eye, Plus, Calendar, MapPin, DollarSign, Trash2, Edit, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { resolveCompany, buildLogoUrl, COMPANY_PLACEHOLDER } from '../lib/utils.js';
import gsap from 'gsap';
import styles from "./AdminJobs.module.css";

const AdminJobs = () => {
  const [input, setInput] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companiesMap, setCompaniesMap] = useState({});
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const headerRef = useRef(null);
  const statsRef = useRef(null);
  const jobCardsRef = useRef([]);

  // Fetch jobs created by the current recruiter
  // Fetch jobs and companies to resolve company names/logos
  useEffect(() => {
    const fetchJobsAndCompanies = async () => {
      try {
        const token = localStorage.getItem("token");
        const jobsRes = await fetch(`${API_URL}/api/job/recruiter`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });
        const jobsData = await jobsRes.json();
        console.log("Jobs fetch response:", jobsData);

        if (jobsRes.ok && jobsData.jobs) {
          setJobs(jobsData.jobs);
        } else {
          console.error("Failed to fetch jobs:", jobsData.error);
          setJobs([]);
        }

        // Fetch companies list for mapping
        const companiesRes = await fetch(`${API_URL}/api/company/get`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });
        const companiesData = await companiesRes.json();
        console.log("Companies fetch response (for mapping):", companiesData);
        if (companiesRes.ok && Array.isArray(companiesData.company)) {
          const map = {};
          companiesData.company.forEach(c => { map[c._id] = c; });
          setCompaniesMap(map);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobsAndCompanies();
  }, []);

  useEffect(() => {
    // Animate header
    if (headerRef.current) {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );
    }

    // Animate stats cards
    if (statsRef.current) {
      const cards = statsRef.current.querySelectorAll('[class*="bentoCard"]');
      gsap.fromTo(cards,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.3
        }
      );
    }

    // Animate job cards when they load
    if (jobs.length > 0 && jobCardsRef.current.length > 0) {
      gsap.fromTo(jobCardsRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.08,
          ease: "power2.out"
        }
      );
    }
  }, [jobs]);

  const handleCardHover = (e, isEntering) => {
    gsap.to(e.currentTarget, {
      y: isEntering ? -4 : 0,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleButtonHover = (e, isEntering) => {
    gsap.to(e.currentTarget, {
      scale: isEntering ? 1.05 : 1,
      duration: 0.2,
      ease: "power2.out"
    });
  };

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
    toast((t) => (
      <div className={styles.toastConfirm}>
        <p>Are you sure you want to delete this job?</p>
        <div className={styles.toastButtons}>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
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
                  toast.success('Job deleted successfully!');
                } else {
                  const data = await response.json();
                  toast.error(data.error || 'Failed to delete job');
                }
              } catch (error) {
                console.error('Delete error:', error);
                toast.error('Failed to delete job');
              }
            }}
            className={styles.confirmBtn}
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className={styles.cancelBtn}
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
    });
  };

  // Filtered jobs
  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(input.toLowerCase()) ||
      job.company?.name?.toLowerCase().includes(input.toLowerCase()) ||
      job.location.toLowerCase().includes(input.toLowerCase())
  );

  const totalJobs = jobs.length;
  const totalApplicants = jobs.reduce((sum, job) => sum + (job.applicationCount || 0), 0);
  const activeJobs = jobs.filter(job => job.jobType === 'On-site' || job.jobType === 'Remote').length;

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div ref={headerRef} className={styles.header}>
        <div>
          <h1 className={styles.title}>Recruiter Dashboard</h1>
          <p className={styles.subtitle}>Manage your job postings and track applications</p>
        </div>
        <button 
          onClick={navigateToCreateJob}
          className={styles.createBtn}
          onMouseEnter={handleButtonHover}
          onMouseLeave={(e) => handleButtonHover(e, false)}
        >
          <Plus size={20} />
          New Job
        </button>
      </div>

      {/* Bento Grid Stats */}
      <div ref={statsRef} className={styles.bentoGrid}>
        <div className={`${styles.bentoCard} ${styles.bentoLarge}`}>
          <div className={styles.cardIcon} style={{ backgroundColor: '#6366f1' }}>
            <Briefcase size={24} />
          </div>
          <div>
            <p className={styles.cardLabel}>Total Jobs Posted</p>
            <h3 className={styles.cardValue}>{totalJobs}</h3>
            <p className={styles.cardSubtext}>Active listings</p>
          </div>
        </div>

        <div className={styles.bentoCard}>
          <div className={styles.cardIcon} style={{ backgroundColor: '#ec4899' }}>
            <Users size={24} />
          </div>
          <div>
            <p className={styles.cardLabel}>Total Applicants</p>
            <h3 className={styles.cardValue}>{totalApplicants}</h3>
          </div>
        </div>

        <div className={styles.bentoCard}>
          <div className={styles.cardIcon} style={{ backgroundColor: '#10b981' }}>
            <Eye size={24} />
          </div>
          <div>
            <p className={styles.cardLabel}>Active Jobs</p>
            <h3 className={styles.cardValue}>{activeJobs}</h3>
          </div>
        </div>

        <div className={`${styles.bentoCard} ${styles.bentoWide}`}>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Search by job title, company, or location..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className={styles.jobsSection}>
        <h2 className={styles.sectionTitle}>All Job Postings</h2>
        {loading ? (
          <div className={styles.emptyState}>
            <Briefcase size={48} />
            <p>Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className={styles.emptyState}>
            <Briefcase size={48} />
            <p>No jobs found</p>
            <button onClick={navigateToCreateJob} className={styles.emptyBtn}>
              Post Your First Job
            </button>
          </div>
        ) : (
          <div className={styles.jobsGrid}>
            {filteredJobs.map((job, index) => {
              const { name, logo } = resolveCompany(job, companiesMap);
              const logoUrl = buildLogoUrl(logo, API_URL) || COMPANY_PLACEHOLDER;
              return (
              <div 
                key={job._id} 
                ref={(el) => (jobCardsRef.current[index] = el)}
                className={styles.jobCard}
                onMouseEnter={(e) => handleCardHover(e, true)}
                onMouseLeave={(e) => handleCardHover(e, false)}
              >
                <div className={styles.jobHeader}>
                  <div className={styles.jobCompany}>
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt={name || 'Company'}
                        className={styles.companyLogo}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={styles.logoPlaceholder} style={{ display: logoUrl ? 'none' : 'flex' }}>
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h3 className={styles.jobTitle}>{job.title}</h3>
                      {name && <p className={styles.companyName}>{name}</p>}
                    </div>
                  </div>
                  <span className={styles.jobBadge}>{job.jobType}</span>
                </div>

                <div className={styles.jobDetails}>
                  <div className={styles.jobDetail}>
                    <MapPin size={16} />
                    <span>{job.location}</span>
                  </div>
                  <div className={styles.jobDetail}>
                    <DollarSign size={16} />
                    <span>${job.salary?.toLocaleString()}</span>
                  </div>
                  <div className={styles.jobDetail}>
                    <Calendar size={16} />
                    <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className={styles.jobDetail}>
                    <Users size={16} />
                    <span>{job.applicationCount || 0} applicants</span>
                  </div>
                </div>

                <div className={styles.jobActions}>
                  <button 
                    onClick={() => handleApplicants(job._id)}
                    className={styles.actionBtn}
                    title="View applicants"
                    onMouseEnter={(e) => handleButtonHover(e, true)}
                    onMouseLeave={(e) => handleButtonHover(e, false)}
                  >
                    <Users size={18} />
                    Applicants ({job.applicationCount || 0})
                  </button>
                  <button 
                    onClick={() => handleEdit(job._id)}
                    className={styles.editBtn}
                    title="Edit job"
                    onMouseEnter={(e) => handleButtonHover(e, true)}
                    onMouseLeave={(e) => handleButtonHover(e, false)}
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(job._id)}
                    className={styles.deleteBtn}
                    title="Delete job"
                    onMouseEnter={(e) => handleButtonHover(e, true)}
                    onMouseLeave={(e) => handleButtonHover(e, false)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );})}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminJobs;
