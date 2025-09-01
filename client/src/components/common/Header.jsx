import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import style from "./Header.module.css";

const Header = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role"); // 'user' or 'recruiter'

  const handleLogout = () => {
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <header className={style.header}>
      <div className={style.logo}>
        <NavLink to="/">DevConnect Jobs</NavLink>
      </div>

      <nav className={style.nav}>
        <ul>
          {role === "recruiter" ? (
            <>
              <li>
                <NavLink className={style.text} to="/admin/company">
                  Company
                </NavLink>
              </li>
              <li>
                <NavLink className={style.text} to="/admin/jobs">
                  Job
                </NavLink>
              </li>
            </>
          ) : role === "user" ? (
            <>
              <li>
                <NavLink className={style.text} to="/">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink className={style.text} to="/jobs">
                  Jobs
                </NavLink>
              </li>
              <li>
                <NavLink className={style.text} to="/user/dashboard">
                  My Applications
                </NavLink>
              </li>
              <li>
                <NavLink className={style.text} to="/about">
                  About
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink className={style.text} to="/">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink className={style.text} to="/jobs">
                  Jobs
                </NavLink>
              </li>
              <li>
                <NavLink className={style.text} to="/about">
                  About
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>

      <div>
        <ul>
          {role ? (
            <li>
              <button className={style.btn} onClick={handleLogout}>
                Logout
              </button>
            </li>
          ) : (
            <li>
              <NavLink className={style.btn} to="/login">
                Login
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
