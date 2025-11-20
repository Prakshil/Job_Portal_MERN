import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const Login = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [redirectMessage, setRedirectMessage] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("user");

  useEffect(() => {
    if (location.state?.message) {
      setRedirectMessage(location.state.message);
    }
  }, [location]);

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
    setName("");
    setEmail("");
    setPassword("");
    setPhoneNumber("");
    setRole("user");
    setRedirectMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSignIn) {
        // === LOGIN PROCESS ===
        try {
            const res = await fetch(`${API_URL}/api/user/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password, role }),
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.error || data.message || "Login failed");
                return;
            }
            localStorage.setItem("role", data.user.role);
            localStorage.setItem("email", data.user.email);
            localStorage.setItem("id", data.user._id);
            localStorage.setItem("token", data.token);
            localStorage.setItem("name", data.user.name);
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/dashboard");
        } catch (error) {
            console.error("Login error:", error);
            alert("Login failed");
        }
    } else {
        // === REGISTRATION PROCESS ===
        try {
            const payload = { name, email, password, role, phoneNumber: Number(phoneNumber) };
            const res = await fetch(`${API_URL}/api/user/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.error || data.message || "Signup failed");
                return;
            }
            localStorage.setItem("role", data.user.role);
            localStorage.setItem("email", data.user.email);
            localStorage.setItem("id", data.user._id);
            localStorage.setItem("token", data.token);
            localStorage.setItem("name", data.user.name);
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/dashboard");
        } catch (error) {
            console.error("Signup error:", error);
            alert("Signup failed");
        }
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black border border-neutral-800">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          {isSignIn ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          {isSignIn ? "Login to access your dashboard" : "Sign up to get started with DevConnect"}
        </p>
        
        {redirectMessage && (
            <p className="text-red-500 text-sm mt-2">{redirectMessage}</p>
        )}

        <form className="my-8" onSubmit={handleSubmit}>
          {!isSignIn && (
            <>
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                    <LabelInputContainer>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="John Doe" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </LabelInputContainer>
                    <LabelInputContainer>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" placeholder="1234567890" type="number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                    </LabelInputContainer>
                </div>
            </>
          )}

          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" placeholder="projectmayhem@fc.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </LabelInputContainer>
          
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input id="password" placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </LabelInputContainer>

          <div className="mb-4">
            <Label className="mb-2 block">Role</Label>
            <div className="flex space-x-4">
                <label className="flex items-center space-x-2 text-neutral-300">
                    <input type="radio" name="role" value="user" checked={role === "user"} onChange={(e) => setRole(e.target.value)} className="accent-white" />
                    <span>User</span>
                </label>
                <label className="flex items-center space-x-2 text-neutral-300">
                    <input type="radio" name="role" value="recruiter" checked={role === "recruiter"} onChange={(e) => setRole(e.target.value)} className="accent-white" />
                    <span>Recruiter</span>
                </label>
            </div>
          </div>

          <button
            className="bg-gradient-to-br from-black to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] relative group/btn"
            type="submit">
            {isSignIn ? "Sign In" : "Sign Up"} &rarr;
            <BottomGradient />
          </button>

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

          <div className="text-center">
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                {isSignIn ? "Don't have an account? " : "Already have an account? "}
                <span onClick={toggleForm} className="cursor-pointer text-blue-500 hover:underline">
                    {isSignIn ? "Sign Up" : "Sign In"}
                </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default Login;
