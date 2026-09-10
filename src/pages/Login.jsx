import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck, BarChart3, Users, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios.js";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await API.post("/auth/login", formData);
      const token = response.data.token || response.data.accessToken;
      if (token) {
        localStorage.setItem("token", token);
      }
      navigate("/");
    } catch (err) {
        if (error.response?.status === 429) {
    setError(
      "Too many login attempts. Please try again after 15 minutes."
    );
    return;
  }
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-900 relative overflow-hidden">
      
      {/* Dynamic Diagonal / Cross-Over Divider Background Effect */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block overflow-hidden z-0">
        {/* Angled glowing beam cutting across the center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent rotate-[35deg] scale-150 blur-[1px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[2px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent rotate-[35deg] scale-125" />
      </div>

      {/* Left Side: Branding & Info Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 z-10 border-r border-slate-800/60 shadow-[inset_-20px_0_40px_rgba(0,0,0,0.3)]">
        {/* Background Decorative Glow */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Logo Section */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
            <ShieldCheck size={26} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Digicampus</span>
        </div>

        {/* Middle Content Section */}
        <div className="relative z-10 max-w-lg my-auto py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
            Admin Portal v2.4
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
            Manage your academy with absolute precision.
          </h1>
          <p className="mt-4 text-base text-slate-400 leading-relaxed">
            Oversee real-time campus analytics, student enrollments, course structures, and system configurations securely from one centralized dashboard.
          </p>

          {/* Feature Highlights Grid */}
          <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 mt-0.5">
                <BarChart3 size={20} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Live Analytics</h3>
                <p className="text-xs text-slate-400 mt-0.5">Track portal metrics instantly</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 mt-0.5">
                <Users size={20} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">User Control</h3>
                <p className="text-xs text-slate-400 mt-0.5">Manage roles & access levels</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500">
          <span>&copy; {new Date().getFullYear()} Digicampus Inc. All rights reserved.</span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <Layers size={14} /> Secure SSL Encrypted
          </span>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex flex-1 items-center justify-center bg-slate-50 p-4 sm:p-8 lg:p-12 relative z-10">
        <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-100 sm:p-10">
          
          {/* Mobile Header Branding */}
          <div className="mb-8 text-center lg:text-left">
            <div className="mx-auto lg:mx-0 mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner">
              <ShieldCheck size={28} />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Welcome Back</h2>
            <p className="mt-2 text-sm text-slate-500">Sign in to your Digicampus admin profile.</p>
          </div>

          {/* Error Alert Box */}
          {error && (
            <div className="mb-6 rounded-xl bg-rose-50 border border-rose-100 p-4 text-sm font-medium text-rose-600">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Email Address
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-400">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="admin@digicampus.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
                />
              </div>
            </div>

            {/* Password Input Field with Toggle Eye Icon */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Password
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-400">
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-12 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-700 hover:shadow-indigo-600/40 focus:outline-none focus:ring-4 focus:ring-indigo-600/20 disabled:opacity-75 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Footer Subtext */}
          <div className="mt-8 text-center text-xs text-slate-400">
            Authorized administrators only. Secure portal powered by Digicampus.
          </div>

        </div>
      </div>

    </div>
  );
};

export default Login;