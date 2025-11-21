/**
 * Main Application Component
 * Handles routing and layout for the Job Portal application
 * Uses React Router for client-side navigation
 */

import "./App.css";
import { createBrowserRouter, Outlet, RouterProvider, useLocation } from "react-router-dom";

// Public Components
import Home from "./components/home/Home";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import About from "./components/about/About";
import Jobs from "./components/jobs/Jobs";
import JobDetails from "./components/details/JobDetails";

// Authentication Components
import Login from "./auth/Login";

// Admin/Recruiter Components
import Company from "./admin/Company";
import CompanyCreate from "./admin/CompanyCreate";
import CompanySetup from "./admin/CompanySetup";
import AdminJobs from "./admin/AdminJobs";
import PostJob from "./admin/PostJob";
import Applicants from "./admin/Applicants";


import UserDashboard from "./components/user/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/dashborad/Dashboard";

const Layout = () => {
  const location = useLocation();
  const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

  // Hide footer for logged-in areas (admin/user/dashboard)
  const hideFooter =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/user") ||
    location.pathname === "/dashboard";

  // Add top padding when user is logged in to prevent header overlap
  const contentPaddingClass = role ? "pt-24" : "";

  return (
    <>
      <Header />
      <div className={contentPaddingClass}>
        <Outlet />
      </div>
      {!hideFooter && <Footer />}
    </>
  );
};

/**
 * Main App Function
 * Configures all application routes with proper protection and role-based access
 */
function App() {
  // Define all application routes with their respective components and protection
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        // Public Routes
        {
          path: "/",
          element: <Home />, // Landing page with search functionality
        },
        {
          path: "/about",
          element: <About />, // About page with company information
        },
        {
          path: "/jobs",
          element: <Jobs />, // Job listings page with search and filters
        },
        {
          path: "/job/:id",
          element: <JobDetails />, // Individual job details page
        },
        {
          path: "/login",
          element: <Login />, // User authentication page
        },
        {
          path: "/dashboard",
          element: <Dashboard />, // General dashboard (redirects based on role)
        },

        // User Protected Routes (Job Seekers)
        {
          path: "/user/dashboard",
          element: (
            <ProtectedRoute allowedRoles={["user"]}>
              <UserDashboard />
            </ProtectedRoute>
          ), // User dashboard for managing applications
        },

        // Recruiter/Admin Protected Routes
        {
          path: "/admin/company",
          element: (
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <Company />
            </ProtectedRoute>
          ), // Company management dashboard
        },
        {
          path: "/admin/companies/create",
          element: (
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <CompanyCreate />
            </ProtectedRoute>
          ), // Create new company form
        },
        {
          path: "/admin/company/setup",
          element: (
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <CompanySetup />
            </ProtectedRoute>
          ), // Complete company setup form
        },
        {
          path: "/admin/company/:id",
          element: (
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <CompanySetup />
            </ProtectedRoute>
          ), // Edit existing company
        },
        {
          path: "/admin/jobs",
          element: (
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <AdminJobs />
            </ProtectedRoute>
          ), // Job management dashboard
        },
        {
          path: "/admin/jobs/create",
          element: (
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <PostJob />
            </ProtectedRoute>
          ), // Create new job posting
        },
        {
          path: "/admin/jobs/edit/:id",
          element: (
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <PostJob />
            </ProtectedRoute>
          ), // Edit existing job posting
        },
        {
          path: "/admin/jobs/:id/applicants",
          element: (
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <Applicants />
            </ProtectedRoute>
          ), // View and manage job applicants
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
