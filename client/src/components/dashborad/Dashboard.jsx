import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    console.log("Dashboard - Current role:", role);
    console.log("Dashboard - All localStorage:", {
      role: localStorage.getItem("role"),
      user: localStorage.getItem("user"),
      email: localStorage.getItem("email")
    });

    if (role === "recruiter") {
      console.log("Redirecting to /admin/company");
      navigate("/admin/company");
    } else if (role === "user") {
      console.log("Redirecting to /user/dashboard");
      navigate("/user/dashboard");
    } else {
      console.log("No valid role, redirecting to /login");
      navigate("/login");
    }
  }, [role, navigate]);

  return (
    <div>
      <p>Redirecting...</p>
    </div>
  );
};

export default Dashboard;
