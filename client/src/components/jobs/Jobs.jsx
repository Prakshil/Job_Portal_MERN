import React, { useState, useEffect } from "react";
import { resolveCompany, buildLogoUrl, COMPANY_PLACEHOLDER } from "../../lib/utils";
import style from "./Jobs.module.css";
import { useNavigate, useLocation } from "react-router-dom";

const Jobs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: "",
    industry: "",
    salary: "",
    search: ""
  });
  
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Check for search query in URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery) {
      setFilters(prev => ({ ...prev, search: searchQuery }));
    }
  }, [location.search]);

  // Fetch all jobs
  useEffect(() => {
    const fetchJobs = async () => {
      const manualJobs = [
        {
          _id: 'manual-1',
          title: 'Senior Frontend Developer',
          company: { name: 'TechVision Inc.', logoUrl: 'https://cdn-icons-png.flaticon.com/512/732/732221.png' },
          jobType: 'Full-time',
          salary: '120,000 - 150,000',
          location: 'San Francisco, CA (Remote)',
          experienceLevel: '3-5 years',
          description: 'Join our team to build modern web applications using React, TypeScript, and GraphQL. We are looking for experienced developers who can lead frontend initiatives.',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          position: 5
        },
        {
          _id: 'manual-2',
          title: 'Backend Engineer (Node.js)',
          company: { name: 'DataFlow Systems', logoUrl: 'https://cdn-icons-png.flaticon.com/512/2906/2906274.png' },
          jobType: 'Full-time',
          salary: '110,000 - 140,000',
          location: 'New York, NY (Hybrid)',
          experienceLevel: '2-4 years',
          description: 'Develop scalable backend services using Node.js, Express, and MongoDB. Implement RESTful APIs and microservices architecture.',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          position: 3
        },
        {
          _id: 'manual-3',
          title: 'UX/UI Designer',
          company: { name: 'CreativeMinds', logoUrl: 'https://cdn-icons-png.flaticon.com/512/5968/5968705.png' },
          jobType: 'Contract',
          salary: '90,000 - 110,000',
          location: 'Austin, TX (On-site)',
          experienceLevel: '2+ years',
          description: 'Design intuitive user interfaces for web and mobile applications. Create wireframes, prototypes, and collaborate with development teams.',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          position: 2
        },
        {
            _id: 'manual-4',
            title: 'DevOps Engineer',
            company: { name: 'CloudTech Solutions', logoUrl: 'https://cdn-icons-png.flaticon.com/512/873/873107.png' },
            jobType: 'Full-time',
            salary: '125,000 - 155,000',
            location: 'Seattle, WA (Hybrid)',
            experienceLevel: '3+ years',
            description: 'Implement CI/CD pipelines, manage cloud infrastructure on AWS, and optimize application deployment processes.',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            position: 4
        },
        {
            _id: 'manual-5',
            title: 'Full Stack Developer',
            company: { name: 'Innovate Solutions', logoUrl: 'https://cdn-icons-png.flaticon.com/512/2702/2702602.png' },
            jobType: 'Full-time',
            salary: '130,000 - 160,000',
            location: 'Remote',
            experienceLevel: '4+ years',
            description: 'Work on all aspects of our SaaS platform using React, Node.js, and AWS. Strong problem-solving skills and full product lifecycle experience required.',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            position: 2
        },
        {
            _id: 'manual-6',
            title: 'Machine Learning Engineer',
            company: { name: 'AI Innovations', logoUrl: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png' },
            jobType: 'Full-time',
            salary: '140,000 - 180,000',
            location: 'Boston, MA (Remote)',
            experienceLevel: '3-5 years',
            description: 'Develop machine learning models and algorithms to solve complex business problems. Experience with Python, TensorFlow, and cloud ML platforms required.',
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            position: 3
        }
      ];

      try {
        const response = await fetch(`${API_URL}/api/job/get`);
        const data = await response.json();
        
        let fetchedJobs = [];
        if (response.ok && data.jobs) {
          fetchedJobs = data.jobs;
        } else {
          console.error("Failed to fetch jobs:", data.error);
        }

        // Add manual jobs if not logged in OR if no jobs found
        const token = localStorage.getItem("token");
        if (!token || fetchedJobs.length === 0) {
            // If we have fetched jobs but user is not logged in, we might want to show both? 
            // But usually fetched jobs are better. 
            // If fetchedJobs is empty, show manual jobs.
            if (fetchedJobs.length === 0) {
                fetchedJobs = manualJobs;
            } else if (!token) {
                // If we have jobs but user is guest, maybe append manual jobs?
                // Or just show fetched jobs. Let's append for more content.
                fetchedJobs = [...fetchedJobs, ...manualJobs];
            }
        }

        setJobs(fetchedJobs);
        setFilteredJobs(fetchedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        // If fetch fails, show manual jobs
        setJobs(manualJobs);
        setFilteredJobs(manualJobs);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = jobs;

    if (filters.search) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.location) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  }, [filters, jobs]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleJobClick = (jobId) => {
    if (jobId.toString().startsWith('manual-')) {
        navigate('/login', { state: { message: 'Sign in to view job details and apply' } });
        return;
    }
    navigate(`/job/${jobId}`);
  };

  const handleApply = async (jobId) => {
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

    try {
      const response = await fetch(`${API_URL}/api/application/apply/${jobId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        alert("Application submitted successfully!");
      } else {
        alert(data.error || "Failed to apply for job");
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      alert("Failed to apply for job. Please try again.");
    }
  };
  return (
    <>
      <div className={style.dashboard}>
        <div className={style.sidebar}>
          <p className={style.title}>Filter DevConnect Jobs</p>

          {/* Search Bar */}
          <div className={style.filterSection}>
            <h3>Search Jobs</h3>
            <input 
              type="text"
              placeholder="Search by title or description..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className={style.searchInput}
            />
          </div>

          <div className={style.filterSection}>
            <h3>Location</h3>
            <ul>
              {[
                "",
                "Ahemdabad",
                "Pune", 
                "Mumbai",
                "Delhi",
                "Kolkata",
                "Banglore",
                "Chennai",
                "Hyderabad",
              ].map((city, i) => (
                <li 
                  key={i} 
                  onClick={() => handleFilterChange("location", city)}
                  className={`${filters.location === city ? style.active : ""} ${!city ? style.allOption : ""}`}
                >
                  {city || "All Locations"}
                </li>
              ))}
            </ul>
          </div>

          <div className={style.filterSection}>
            <h3>Industry</h3>
            <ul>
              {["", "IT", "Banking", "Food", "Pharmacy", "Education", "Health"].map(
                (ind, i) => (
                  <li 
                    key={i}
                    onClick={() => handleFilterChange("industry", ind)}
                    className={`${filters.industry === ind ? style.active : ""} ${!ind ? style.allOption : ""}`}
                  >
                    {ind || "All Industries"}
                  </li>
                )
              )}
            </ul>
          </div>

          <div className={style.filterSection}>
            <h3>Salary</h3>
            <ul>
              {[
                "0-5 LPA",
                "5-10 LPA",
                "10-15 LPA",
                "15-20 LPA",
                "20-25 LPA",
                "25-30 LPA",
              ].map((sal, i) => (
                <li key={i}>{sal}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className={style.content}>
          {loading ? (
            <div className={style.loading}>Loading jobs...</div>
          ) : filteredJobs.length === 0 ? (
            <div className={style.noJobs}>No jobs found matching your criteria</div>
          ) : (
            filteredJobs.map((job) => {
              const { name, logo } = resolveCompany(job);
              const logoUrl = buildLogoUrl(logo, API_URL) || COMPANY_PLACEHOLDER;
              return (
              <div key={job._id} className={style.card}>
                <div className={style.cardHeader}>
                  <span className={style.date}>
                    Created: {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className={style.companyInfo}>
                  {logoUrl && (
                    <img
                      src={logoUrl}
                      alt="Company Logo"
                      className={style.logo}
                      onError={(e) => { e.target.src = COMPANY_PLACEHOLDER; }}
                    />
                  )}
                  <div>
                    <p className={style.location}>📍 {job.location}</p>
                    <p className={style.roleType}>💼 {job.title} ({job.jobType})</p>
                  </div>
                </div>

                <p className={style.description}>
                  {job.description.length > 120 
                    ? `${job.description.substring(0, 120)}...` 
                    : job.description
                  }
                </p>

                <div className={style.detailsRow}>
                  <span>📌 {job.position} Positions</span>
                  <span>⏳ {job.experienceLevel}</span>
                  <span>💰 ₹{job.salary}</span>
                </div>

                <div className={style.actions}>
                  <button
                    className={style.detailsBtn}
                    onClick={() => handleJobClick(job._id)}
                  >
                    View Details
                  </button>
                  <button 
                    className={style.applyBtn || style.saveBtn}
                    onClick={() => handleApply(job._id)}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            );})
          )}
        </div>
      </div>
    </>
  );
};

export default Jobs;
