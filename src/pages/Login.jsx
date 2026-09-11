import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck, BarChart3, Users, Layers, Sparkles, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios.js";
import Logo from "../assets/Logo.png";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const validateField = (name, value) => {
    if (name === "email") {
      if (!value) return "Email address is required.";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Please enter a valid email address (e.g. name@domain.com).";
      }
    }
    if (name === "password") {
      if (!value) return "Password is required.";
      if (value.length < 6) {
        return "Password must be at least 6 characters long.";
      }
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    const errorMsg = validateField(name, value);
    setFieldErrors({ ...fieldErrors, [name]: errorMsg });

    if (generalError) setGeneralError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const emailErr = validateField("email", formData.email);
    const passwordErr = validateField("password", formData.password);

    if (emailErr || passwordErr) {
      setFieldErrors({ email: emailErr, password: passwordErr });
      return;
    }

    setLoading(true);
    setGeneralError("");

    try {
      const response = await API.post("/auth/login", formData);
      const token = response.data.token || response.data.accessToken;
      if (token) {
        localStorage.setItem("token", token);
      }
      navigate("/");
    } catch (err) {
      if (err.response?.status === 429) {
        setGeneralError("Too many login attempts. Please try again after 15 minutes.");
        return;
      }
      setGeneralError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#1d5ed2] font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Left Side: Immersive Enterprise Branding & Analytics Panel */}
      <div className="hidden lg:flex lg:w-[55%] flex-col justify-between p-12 xl:p-16 relative overflow-hidden bg-gradient-to-br from-[#1d5ed2] via-blue-700 to-blue-900 border-r border-blue-400/20">
        
        {/* Subtle Decorative Ambient Glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

        {/* Top Logo Section */}
        <div className="relative z-10 flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-blue-200 text-[#1d5ed2] shadow-xl p-2">
            <img src={Logo} alt="Logo" className="h-full w-full object-contain" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-white block">VIDYA UDBHAV</span>
            <span className="text-[10px] font-extrabold tracking-[0.25em] text-blue-200 block -mt-1">ACADEMY</span>
          </div>
        </div>

        {/* Middle Content Section */}
        <div className="relative z-10 max-w-xl my-auto py-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/30 text-white text-xs font-semibold tracking-wider uppercase mb-8 backdrop-blur-md shadow-sm">
            <Sparkles size={14} className="text-blue-200 animate-pulse" />
            Admin Portal v2.4 Enterprise
          </div>
          
          <h1 className="text-4xl xl:text-5xl font-black tracking-tight text-white leading-[1.15]">
            Manage your academy with absolute precision.
          </h1>
          <p className="mt-5 text-base text-blue-100 leading-relaxed font-normal">
            Oversee real-time campus analytics, student enrollments, course structures, and system configurations securely from one centralized dashboard.
          </p>

          {/* Feature Highlights Grid with White Background Cards */}
          <div className="mt-12 grid grid-cols-2 gap-4">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-blue-100 shadow-lg shadow-blue-900/10 transition-all duration-300 hover:scale-[1.02]">
              <div className="p-2.5 rounded-xl bg-[#1d5ed2]/10 border border-[#1d5ed2]/20 text-[#1d5ed2] mt-0.5">
                <BarChart3 size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Live Analytics</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">Track portal metrics instantly in real-time</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-blue-100 shadow-lg shadow-blue-900/10 transition-all duration-300 hover:scale-[1.02]">
              <div className="p-2.5 rounded-xl bg-[#1d5ed2]/10 border border-[#1d5ed2]/20 text-[#1d5ed2] mt-0.5">
                <Users size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">User Control</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">Granular role and access level management</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-blue-100 border-t border-white/20 pt-6">
          <span>&copy; {new Date().getFullYear()} Vidya Udbhav Academy Inc. All rights reserved.</span>
          <span className="flex items-center gap-1.5 text-white font-medium">
            <Layers size={14} className="text-blue-200" /> Secure SSL Encrypted
          </span>
        </div> 
      </div>

      {/* Right Side: High-End Polish Login Form with White Background Card */}
      <div className="flex flex-1 items-center justify-center bg-white p-6 sm:p-10 lg:p-12 relative z-10">
        
        {/* Subtle mobile ambient glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent lg:hidden pointer-events-none" />

        <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/40 bg-white p-8 shadow-2xl backdrop-blur-2xl sm:p-10 relative">
          
          {/* Header Branding */}
          <div className="mb-8 text-center lg:text-left">
            <div className="mx-auto lg:mx-0 mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1d5ed2]/10 border border-[#1d5ed2]/20 text-[#1d5ed2] shadow-inner">
              <ShieldCheck size={28} />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">Welcome Back</h2>
            <p className="mt-2 text-sm text-slate-600">Sign in to your Vidya Udbhav Academy admin profile.</p>
          </div>

          {/* General Server/Rate Limit Error Alert Box */}
          {generalError && (
            <div className="mb-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm font-medium text-rose-600 flex items-start gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
              <span>{generalError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            
            {/* Email Input Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-400 pointer-events-none">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@vidyaudbhav.com"
                  className={`w-full rounded-2xl border bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 transition-all focus:outline-none focus:ring-4 ${
                    fieldErrors.email 
                      ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/15" 
                      : "border-slate-200 focus:border-[#1d5ed2] focus:bg-white focus:ring-[#1d5ed2]/15"
                  }`}
                />
              </div>
              {/* Inline Text Warning for Email Field */}
              {fieldErrors.email && (
                <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-600 pl-1">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{fieldErrors.email}</span>
                </div>
              )}
            </div>

            {/* Password Input Field with Toggle Eye Icon */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Password
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-400 pointer-events-none">
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full rounded-2xl border bg-slate-50 py-3.5 pl-11 pr-12 text-sm text-slate-900 placeholder-slate-400 transition-all focus:outline-none focus:ring-4 ${
                    fieldErrors.password 
                      ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/15" 
                      : "border-slate-200 focus:border-[#1d5ed2] focus:bg-white focus:ring-[#1d5ed2]/15"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Inline Text Warning for Password Field */}
              {fieldErrors.password && (
                <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-600 pl-1">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{fieldErrors.password}</span>
                </div>
              )}
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="group mt-3 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#1d5ed2] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#1d5ed2]/30 transition-all hover:bg-[#184fb5] hover:shadow-[#1d5ed2]/50 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-[#1d5ed2]/30 disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Footer Subtext */}
          <div className="mt-8 text-center text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-6">
            Authorized administrators only. Secure portal powered by <span className="text-slate-700 font-semibold">Vidya Udbhav Academy</span>.
          </div>

        </div>
      </div>

    </div>
  );
};

export default Login;