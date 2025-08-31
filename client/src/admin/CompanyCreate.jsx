import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CompanyCreate.module.css";

const CompanyCreate = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000";

  const registerNewCompany = async () => {
    if (!companyName.trim()) {
      alert("Please enter a company name");
      return;
    }

    setLoading(true);
    console.log("Creating company:", companyName);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/company/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Add Authorization header as backup
        },
        credentials: "include", // This will send cookies (including auth token)
        body: JSON.stringify({ name: companyName.trim() }),
      });

      const data = await response.json();
      console.log("Company creation response:", data);

      if (!response.ok) {
        alert(data.error || data.message || "Failed to create company");
        setLoading(false);
        return;
      }

      // Company created successfully, navigate to setup page with company ID and name
      const companyId = data.company._id;
      navigate(`/admin/company/setup?id=${companyId}&name=${encodeURIComponent(companyName)}`);
      
    } catch (error) {
      console.error("Company creation error:", error);
      alert("Failed to create company. Please try again.");
      setLoading(false);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Your Company Name</h1>
          <p>
            What would you like to give your company name? You can change this
            later.
          </p>
        </div>

        <label className={styles.label}>Company Name</label>
        <input
          type="text"
          className={styles.input}
          placeholder="JobHunt, Microsoft etc."
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />

        <div className={styles.buttonGroup}>
          <button
            className={`${styles.button} ${styles.cancelBtn}`}
            onClick={() => navigate("/admin/company")}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className={`${styles.button} ${styles.continueBtn}`}
            onClick={registerNewCompany}
            disabled={loading}
          >
            {loading ? "Creating..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyCreate;
