import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, MenuItem, HoveredLink } from "../ui/navbar-menu";
import { cn } from "@/lib/utils";

const Header = ({ className }) => {
  const [active, setActive] = useState(null);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("id");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    navigate("/login");
  };

  return (
    <div className={cn("fixed top-5 inset-x-0 max-w-2xl mx-auto z-50", className)}>
      <Menu setActive={setActive}>
        <div className="flex items-center gap-4 mr-4">
            <HoveredLink to="/" className="font-bold text-lg">DevConnect</HoveredLink>
        </div>
        
        {role === "recruiter" ? (
            <>
                <MenuItem setActive={setActive} active={active} item="Company">
                    <div className="flex flex-col space-y-4 text-sm">
                        <HoveredLink to="/admin/company">Manage Company</HoveredLink>
                        <HoveredLink to="/admin/companies/create">Create Company</HoveredLink>
                    </div>
                </MenuItem>
                <MenuItem setActive={setActive} active={active} item="Jobs">
                    <div className="flex flex-col space-y-4 text-sm">
                        <HoveredLink to="/admin/jobs">Manage Jobs</HoveredLink>
                        <HoveredLink to="/admin/jobs/create">Post Job</HoveredLink>
                    </div>
                </MenuItem>
            </>
        ) : role === "user" ? (
            <>
                <HoveredLink to="/">Home</HoveredLink>
                <HoveredLink to="/jobs">Jobs</HoveredLink>
                <HoveredLink to="/user/dashboard">Dashboard</HoveredLink>
                <HoveredLink to="/about">About</HoveredLink>
            </>
        ) : (
            <>
                <HoveredLink to="/">Home</HoveredLink>
                <HoveredLink to="/jobs">Jobs</HoveredLink>
                <HoveredLink to="/about">About</HoveredLink>
            </>
        )}

        <div className="ml-auto pl-4">
             {role ? (
                <button onClick={handleLogout} className="text-neutral-700 dark:text-neutral-200 hover:text-black text-sm">Logout</button>
             ) : (
                <HoveredLink to="/login">Login</HoveredLink>
             )}
        </div>
      </Menu>
    </div>
  );
};

export default Header;
