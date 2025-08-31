/**
 * Company Setup Component - Complete Company Profile Setup
 * Handles company information input including logo upload
 */

import React, { useState, useEffect } from "react";
import styles from "./CompanySetup.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";

const CompanySetup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000";

  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [companyId, setCompanyId] = useState(null);

  // Pre-fill company name and get company ID from URL parameters
  useEffect(() => {
    const companyName = searchParams.get('name');
    const id = searchParams.get('id');

    if (companyName) {
      setInput(prev => ({
        ...prev,
        name: decodeURIComponent(companyName)
      }));
    }

    if (id) {
      setCompanyId(id);
    }
  }, [searchParams]);

  /**
   * Handle text input changes
   */
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  /**
   * Handle file selection and create preview
   */
  const changeFileHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  /**
   * Handle form submission with file upload
   */
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!companyId) {
      alert("Company ID not found. Please try creating the company again.");
      return;
    }

    if (!input.name.trim()) {
      alert("Company name is required");
      return;
    }

    try {
      setLoading(true);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', input.name);
      formData.append('description', input.description);
      formData.append('website', input.website);
      formData.append('location', input.location);

      // Add logo file if selected
      if (selectedFile) {
        formData.append('logo', selectedFile);
      }

      const token = localStorage.getItem("token");

      console.log("Sending form data to update company...");

      const response = await fetch(`${API_URL}/api/company/update/${companyId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`, // Don't set Content-Type for FormData
        },
        credentials: 'include',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update company');
      }

      if (data.success) {
        alert("Company setup completed successfully!");
        navigate("/dashboard");
      } else {
        throw new Error(data.message || 'Update failed');
      }
    } catch (error) {
      console.error('Company update error:', error);
      alert(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={submitHandler} className={styles.form}>
        {/* Header */}
        <div className={styles.header}>
          <button
            type="button"
            onClick={() => {
              // If we came from company create (has name param), go back to create
              const companyName = searchParams.get('name');
              if (companyName) {
                navigate("/admin/companies/create");
              } else {
                navigate("/admin/companies");
              }
            }}
            className={styles.backBtn}
          >
            <span>Back</span>
          </button>
          <h1 className={styles.title}>Company Setup</h1>
        </div>

        {/* Form Fields */}
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Company Name</label>
            <input
              type="text"
              name="name"
              value={input.name}
              onChange={changeEventHandler}
              placeholder="Enter company name"
            />
          </div>

          <div className={styles.field}>
            <label>Description</label>
            <input
              type="text"
              name="description"
              value={input.description}
              onChange={changeEventHandler}
              placeholder="Enter description"
            />
          </div>

          <div className={styles.field}>
            <label>Website</label>
            <input
              type="text"
              name="website"
              value={input.website}
              onChange={changeEventHandler}
              placeholder="https://example.com"
            />
          </div>

          <div className={styles.field}>
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={input.location}
              onChange={changeEventHandler}
              placeholder="City, Country"
            />
          </div>

          <div className={styles.field}>
            <label>Company Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={changeFileHandler}
            />
            {previewUrl && (
              <div className={styles.logoPreview}>
                <img
                  src={previewUrl}
                  alt="Logo preview"
                  className={styles.previewImage}
                />
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        {loading ? (
          <button className={`${styles.submitBtn} ${styles.disabled}`} disabled>
            Please wait...
          </button>
        ) : (
          <button type="submit" className={styles.submitBtn}>
            Update Company
          </button>
        )}
      </form>
    </div>
  );
};

export default CompanySetup;
