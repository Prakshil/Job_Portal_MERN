import React, { useState, useEffect } from "react";
import styles from "./PostJob.module.css";
import { useNavigate } from "react-router-dom";

const PostJob = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experienceLevel: "",
    position: "",
  });

  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  // Fetch companies owned by the current recruiter
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/company/get`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });

        const data = await response.json();
        console.log("Companies fetch response:", data);

        if (response.ok && data.company) {
          setCompanies(data.company);
          if (data.company.length === 0) {
            alert("You need to create a company first before posting jobs!");
          }
        } else {
          console.error("Failed to fetch companies:", data.error);
          setCompanies([]);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
        setCompanies([]);
      } finally {
        setLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, []);

  // Handle input changes
  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  // Handle company select
  const selectChangeHandler = (e) => {
    setSelectedCompany(e.target.value);
  };

  // Handle form submit
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!selectedCompany) {
      alert("Please select a company before posting a job!");
      return;
    }

    if (!input.title || !input.description || !input.salary || !input.location) {
      alert("Please fill in all required fields!");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      
      const jobData = {
        title: input.title,
        description: input.description,
        requirements: input.requirements.split(',').map(req => req.trim()).filter(req => req),
        salary: Number(input.salary),
        experienceLevel: Number(input.experienceLevel),
        location: input.location,
        jobType: input.jobType,
        position: Number(input.position),
        companyId: selectedCompany
      };

      console.log("Submitting job data:", jobData);

      const response = await fetch(`${API_URL}/api/job/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(jobData)
      });

      const data = await response.json();
      console.log("Job creation response:", data);

      if (response.ok && data.success) {
        alert("Job posted successfully!");
        navigate("/admin/jobs");
      } else {
        alert(data.error || "Failed to post job");
      }
    } catch (error) {
      console.error("Error posting job:", error);
      alert("Failed to post job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.heading}>Post Job</div>
      <div className={styles.container}>
        <form onSubmit={submitHandler} className={styles.form}>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={input.title}
                onChange={changeEventHandler}
              />
            </div>
            <div className={styles.field}>
              <label>Description</label>
              <input
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
              />
            </div>
            <div className={styles.field}>
              <label>Requirements</label>
              <input
                type="text"
                name="requirements"
                value={input.requirements}
                onChange={changeEventHandler}
              />
            </div>
            <div className={styles.field}>
              <label>Salary</label>
              <input
                type="text"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
              />
            </div>
            <div className={styles.field}>
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
              />
            </div>
            <div className={styles.field}>
              <label>Job Type</label>
              <input
                type="text"
                name="jobType"
                value={input.jobType}
                onChange={changeEventHandler}
              />
            </div>
            <div className={styles.field}>
              <label>Experience Level</label>
              <input
                type="text"
                name="experience"
                value={input.experience}
                onChange={changeEventHandler}
              />
            </div>
            <div className={styles.field}>
              <label>No of Positions</label>
              <input
                type="number"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
              />
            </div>

            {loadingCompanies ? (
              <div>Loading companies...</div>
            ) : companies.length > 0 ? (
              <div className={styles.selectWrapper}>
                <select value={selectedCompany} onChange={selectChangeHandler}>
                  <option value="">Select a Company</option>
                  {companies.map((company) => (
                    <option
                      key={company._id}
                      value={company._id}
                    >
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <p>No companies found. Please create a company first.</p>
                <button 
                  type="button" 
                  onClick={() => navigate("/admin/companies/create")}
                  className={styles.button}
                >
                  Create Company
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <button type="button" className={styles.button}>
              Please wait
            </button>
          ) : (
            <button type="submit" className={styles.button}>
              Post New Job
            </button>
          )}

          {companies.length === 0 && (
            <p className={styles.warning}>
              *Please register a company first, before posting jobs
            </p>
          )}
        </form>
      </div>
    </>
  );
};

export default PostJob;
