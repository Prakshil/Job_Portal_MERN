import React, { useState, useEffect } from "react";
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
      try {
        const response = await fetch(`${API_URL}/api/job/get`);
        const data = await response.json();
        
        if (response.ok && data.jobs) {
          setJobs(data.jobs);
          setFilteredJobs(data.jobs);
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
          <p className={style.title}>Filter Felix Opening Jobs</p>

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
                  className={filters.location === city ? style.active : ""}
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
                    className={filters.industry === ind ? style.active : ""}
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
            filteredJobs.map((job) => (
              <div key={job._id} className={style.card}>
                <div className={style.cardHeader}>
                  <span className={style.date}>
                    Created: {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                  <span className={style.favorite} title="Add to favourites">
                    ❤️
                  </span>
                </div>

                <div className={style.companyInfo}>
                  <img
                    src={job.company?.logo ? `${API_URL}${job.company.logo}` : "/vite.svg"}
                    alt={`${job.company?.name} Logo`}
                    className={style.logo}
                    onError={(e) => {
                      e.target.src = "/vite.svg"; // Fallback if logo fails to load
                    }}
                  />
                  <div>
                    <h2 className={style.companyName}>
                      {job.company?.name || "Company Name"}
                    </h2>
                    <p className={style.location}>📍 {job.location}</p>
                    <p className={style.roleType}>
                      💼 {job.title} ({job.jobType})
                    </p>
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
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Jobs;
