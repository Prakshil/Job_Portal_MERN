import { useState, useEffect, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Company.module.css";

const Companies = () => {
  const [input, setInput] = useState("");
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  
  // Prevent unnecessary re-renders by using a memoized URL
  const logoBaseUrl = API_URL;

  // Memoized fetch function to prevent recreating on each render
  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/company/get`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.company) {
        // Pre-process company data to prevent flickering from image loading
        const processedCompanies = data.company.map(company => ({
          ...company,
          // Ensure logo path is properly formed
          logo: company.logo || null
        }));
        setCompanies(processedCompanies);
      } else {
        console.error("Failed to fetch companies:", data.error);
        setCompanies([]);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // Fetch companies from database
  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // Filter companies based on search input
  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(input.toLowerCase())
  );

  // Handle Edit
  const handleEdit = (id) => {
    navigate(`/admin/company/setup?id=${id}`);
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/company/delete/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (response.ok) {
          // Remove from local state
          setCompanies(companies.filter(company => company._id !== id));
          alert("Company deleted successfully!");
        } else {
          const data = await response.json();
          alert(data.error || "Failed to delete company");
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete company");
      }
    }
  };

  // Memoize company rows to prevent unnecessary re-renders
  const CompanyRow = memo(({ company, onEdit, onDelete }) => (
    <tr key={company._id}>
      <td>
        <div className={styles.logoContainer}>
          <img
            src={company.logo ? `${logoBaseUrl}${company.logo}` : "/vite.svg"}
            alt={`${company.name} Logo`}
            className={styles.companyLogo}
            onError={(e) => {
              e.target.src = "/vite.svg";
              // Don't log to prevent console spam
            }}
            loading="lazy"
          />
        </div>
      </td>
      <td>{company.name}</td>
      <td>{company.description || "Not provided"}</td>
      <td>
        {company.website ? (
          <a 
            href={company.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.websiteLink}
          >
            {company.website.replace(/^https?:\/\/(www\.)?/, '')}
          </a>
        ) : (
          "Not provided"
        )}
      </td>
      <td>{company.location || "Not provided"}</td>
      <td>{new Date(company.createdAt).toLocaleDateString()}</td>
      <td>
        <button
          className={styles.editBtn}
          onClick={() => onEdit(company._id)}
        >
          ✏️ Edit
        </button>
        <button
          className={styles.deleteBtn}
          onClick={() => onDelete(company._id)}
        >
          🗑️ Delete
        </button>
      </td>
    </tr>
  ));

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <input
          type="text"
          className={styles.input}
          placeholder="🔍 Search company name..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className={styles.newCompanyBtn}
          onClick={() => navigate("/admin/companies/create")}
        >
          ➕ New Company
        </button>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <p className={styles.loadingText}>Loading companies...</p>
          </div>
        ) : filteredCompanies.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Logo</th>
                <th>Company Name</th>
                <th>Description</th>
                <th>Website</th>
                <th>Location</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((company) => (
                <CompanyRow 
                  key={company._id} 
                  company={company}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyState}>
            <p>No companies found. {companies.length === 0 ? "Create your first company!" : "Try searching or create a new one."}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;
