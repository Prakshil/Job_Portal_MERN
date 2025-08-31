import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Company.module.css";

const Companies = () => {
  const [input, setInput] = useState("");
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Fetch companies from database
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
    };

    fetchCompanies();
  }, []);

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
          <p>Loading companies...</p>
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
                <tr key={company._id}>
                  <td>
                    <img
                      src={company.logo ? `${API_URL}${company.logo}` : "/vite.svg"}
                      alt={`${company.name} Logo`}
                      className={styles.companyLogo}
                      onError={(e) => {
                        e.target.src = "/vite.svg";
                      }}
                    />
                  </td>
                  <td>{company.name}</td>
                  <td>{company.description || "Not provided"}</td>
                  <td>
                    {company.website ? (
                      <a href={company.website} target="_blank" rel="noopener noreferrer">
                        {company.website}
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
                      onClick={() => handleEdit(company._id)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(company._id)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No companies found. {companies.length === 0 ? "Create your first company!" : "Try searching or create a new one."}</p>
        )}
      </div>
    </div>
  );
};

export default Companies;
