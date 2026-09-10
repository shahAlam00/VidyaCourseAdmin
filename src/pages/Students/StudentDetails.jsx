import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Calendar,
  Loader2,
  CheckCircle2,
  TrendingUp,
  Award,
} from "lucide-react";
import API from "../../utils/axios.js";

const StudentDetails = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/auth/students/${id}`)
      .then(({ data }) => setStudent(data.data))
      .catch(() => alert("Failed to load student details."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="animate-spin text-slate-400" size={32} />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="text-slate-500 font-semibold">Student not found.</p>
        <Link to="/admin/students" className="mt-4 text-sm text-indigo-600 hover:underline">
          ← Back to Students
        </Link>
      </div>
    );
  }

  const completedCourses = student.courses.filter((c) => c.progress === 100).length;
  const avgProgress =
    student.courses.length > 0
      ? Math.round(student.courses.reduce((s, c) => s + c.progress, 0) / student.courses.length)
      : 0;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/admin/students"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Profile</h1>
          <p className="text-sm text-slate-500">Full details and enrolled courses.</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">

        {/* Left - Profile Card */}
        <div className="space-y-5">

          {/* Avatar + Basic Info */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 font-black text-3xl mb-4">
              {student.avatar || student.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-slate-900">{student.name}</h2>
            <p className="text-sm text-slate-500 mt-1">{student.email}</p>

            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                Active Student
              </span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Contact Info</h3>

            <InfoRow icon={Mail} label="Email" value={student.email} />
            <InfoRow icon={Phone} label="Phone" value={student.phone || "Not provided"} empty={!student.phone} />
            <InfoRow icon={MapPin} label="Location" value={student.location || "Not provided"} empty={!student.location} />
            <InfoRow icon={Calendar} label="Joined" value={student.joinedDate} />
          </div>

          {/* Stats */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Stats</h3>

            <StatRow icon={BookOpen} label="Enrolled Courses" value={student.courses.length} color="indigo" />
            <StatRow icon={CheckCircle2} label="Completed" value={completedCourses} color="emerald" />
            <StatRow icon={Award} label="Certificates" value={completedCourses} color="amber" />
            <StatRow icon={TrendingUp} label="Avg. Progress" value={`${avgProgress}%`} color="violet" />
          </div>
        </div>

        {/* Right - Enrolled Courses */}
        <div className="xl:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">
                Enrolled Courses
                <span className="ml-2 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                  {student.courses.length}
                </span>
              </h3>
            </div>

            {student.courses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                <BookOpen size={36} className="text-slate-200 mb-3" />
                <p className="text-sm font-semibold text-slate-500">No courses enrolled yet.</p>
                <p className="text-xs text-slate-400 mt-1">This student hasn't purchased any courses.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {student.courses.map((course) => (
                  <div key={course._id} className="flex items-start gap-4 p-5 hover:bg-slate-50/50 transition-colors">
                    {/* Thumbnail */}
                    <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      {course.thumbnail ? (
                        <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-300">
                          <BookOpen size={20} />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 mb-1">
                            {course.category}
                          </span>
                          <p className="text-sm font-bold text-slate-900 leading-snug truncate">
                            {course.title}
                          </p>
                          {course.instructor && (
                            <p className="text-xs text-slate-400 mt-0.5">by {course.instructor}</p>
                          )}
                        </div>

                        {/* Progress Badge */}
                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                          course.progress === 100
                            ? "bg-emerald-50 text-emerald-700"
                            : course.progress > 0
                            ? "bg-indigo-50 text-indigo-700"
                            : "bg-slate-100 text-slate-500"
                        }`}>
                          {course.progress === 100 ? "✓ Done" : `${course.progress}%`}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                          <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                          <span>{course.progress}% complete</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              course.progress === 100 ? "bg-emerald-500" : "bg-indigo-500"
                            }`}
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Purchased date */}
                      {course.purchasedAt && (
                        <p className="mt-2 text-[10px] text-slate-400">
                          Enrolled: {new Date(course.purchasedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Small reusable components
const InfoRow = ({ icon: Icon, label, value, empty }) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
      <Icon size={14} />
    </div>
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className={`text-sm font-semibold mt-0.5 ${empty ? "text-slate-300 italic" : "text-slate-800"}`}>
        {value}
      </p>
    </div>
  </div>
);

const StatRow = ({ icon: Icon, label, value, color }) => {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    violet: "bg-violet-50 text-violet-600",
  };
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${colors[color]}`}>
          <Icon size={14} />
        </div>
        <span className="text-sm text-slate-600">{label}</span>
      </div>
      <span className="text-sm font-bold text-slate-900">{value}</span>
    </div>
  );
};

export default StudentDetails;
