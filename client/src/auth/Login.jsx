/**
 * Login Component - Authentication Page
 * Handles both user login and registration with role-based access
 * Supports User and Recruiter roles with JWT authentication
 */

import React, { useState } from "react";
import style from "./Login.module.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  // Toggle between login and registration forms
  const [isSignIn, setIsSignIn] = useState(true);
  const navigate = useNavigate();

  // API base URL with fallback
  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000";

  // Form state variables
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("user"); // Default role is user

  /**
   * Toggle between Sign In and Sign Up forms
   * Resets all form fields when switching
   */
  const toggleForm = () => {
    setIsSignIn(!isSignIn);
    // Clear all form fields when switching forms
    setName("");
    setEmail("");
    setPassword("");
    setPhoneNumber("");
    setRole("user");
  };

  /**
   * Handle form submission for both login and registration
   * Makes API calls to backend authentication endpoints
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignIn) {
      // === LOGIN PROCESS ===
      console.log("Sign In Data:", { email, password, role });

      try {
        const res = await fetch(`${API_URL}/api/user/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Required for cookie-based authentication
          body: JSON.stringify({ email, password, role }),
        });

        const data = await res.json();
        console.log("Login response:", res.status, data);

        if (!res.ok) {
          alert(data.error || data.message || "Login failed");
          return;
        }

        // Store authentication data in localStorage
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("id", data.user._id);
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.user.name);
        localStorage.setItem("user", JSON.stringify(data.user));

        console.log("Stored user data:", {
          role: data.user.role,
          email: data.user.email,
          id: data.user._id,
          name: data.user.name
        });

        console.log("About to navigate to /dashboard");
        alert("Login successful! Redirecting to dashboard...");
        navigate("/dashboard");
      } catch (error) {
        console.error("Login error:", error);
        alert("Login failed - check console for details");
      }
    } else {
      // === REGISTRATION PROCESS ===
      console.log("Sign Up Data:", { name, email, password, role, phoneNumber });

      try {
        const payload = {
          name,
          email,
          password,
          role,
          phoneNumber: Number(phoneNumber), // Convert to number
        };

        const res = await fetch(`${API_URL}/api/user/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Required for cookie-based authentication
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        console.log("Signup response:", res.status, data);

        if (!res.ok) {
          alert(data.error || data.message || "Signup failed");
          return;
        }

        // Store authentication data in localStorage
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("id", data.user._id);
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.user.name);
        localStorage.setItem("user", JSON.stringify(data.user));

        console.log("Registration successful, stored user data:", {
          role: data.user.role,
          email: data.user.email,
          id: data.user._id,
          name: data.user.name
        });

        alert("Registration successful! Redirecting to dashboard...");
        navigate("/dashboard");
      } catch (error) {
        console.error("Signup error:", error);
        alert("Signup failed - check console for details");
      }
    }
  };

  return (
    <div className={style.login}>
      <div className={style.loginForm}>
        <h2>{isSignIn ? "Sign In" : "Sign Up"}</h2>

        <form onSubmit={handleSubmit}>
          {/* Registration-only fields */}
          {!isSignIn && (
            <>
              <input
                type="text"
                placeholder="Your name..."
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                type="number"
                placeholder="Your phoneNumber..."
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />

              {/* Role selection for registration */}
              <div className={style.radioGroup}>
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={role === "user"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  User
                </label>

                <label>
                  <input
                    type="radio"
                    name="role"
                    value="recruiter"
                    checked={role === "recruiter"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  Recruiter
                </label>
              </div>
            </>
          )}

          {/* Role selection for login */}
          {isSignIn && (
            <div className={style.radioGroup}>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={role === "user"}
                  onChange={(e) => setRole(e.target.value)}
                />
                User
              </label>

              <label>
                <input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={role === "recruiter"}
                  onChange={(e) => setRole(e.target.value)}
                />
                Recruiter
              </label>
            </div>
          )}

          {/* Common fields for both login and registration */}
          <input
            type="email"
            placeholder="Your email..."
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Your password..."
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">{isSignIn ? "Sign In" : "Sign Up"}</button>

          {/* Form help section */}
          <div className={style.formHelp}>
            <div className={style.remember}>
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#">Need help?</a>
          </div>
        </form>

        {/* Form toggle section */}
        <div className={style.formSwitch}>
          {isSignIn ? (
            <p>
              New to Felix Job Portal ?{" "}
              <span onClick={toggleForm}>Sign Up Now</span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span onClick={toggleForm}>Sign In Now</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
