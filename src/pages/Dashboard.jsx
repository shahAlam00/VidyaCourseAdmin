import React, { useEffect, useState } from "react";
import { Users, BookOpen, Award, TrendingUp } from "lucide-react";
import API from "../utils/axios.js";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get("/courses/admin/stats").catch(() => ({ data: { data: {} } })),
      API.get("/courses/all").catch(() => ({ data: { data: [] } })),
    ])
      .then(([statsRes, coursesRes]) => {
        setStats(statsRes.data.data || statsRes.data);
        const list = coursesRes.data.data || coursesRes.data.courses || [];
        setCourses(Array.isArray(list) ? list : []);
      })
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { 
      title: "Total Students", 
      value: stats?.totalStudents ?? stats?.studentsCount ?? "0", 
      icon: Users,
      color: "bg-blue-50 text-blue-600 border-blue-100" 
    },
    { 
      title: "Total Enrollments", 
      value: stats?.totalEnrollments ?? stats?.enrollmentsCount ?? "0", 
      icon: TrendingUp,
      color: "bg-violet-50 text-violet-600 border-violet-100" 
    },
    { 
      title: "Total Courses", 
      value: stats?.totalCourses ?? stats?.coursesCount ?? "0", 
      icon: BookOpen,
      color: "bg-amber-50 text-amber-600 border-amber-100" 
    },
    { 
      title: "Published Courses", 
      value: stats?.publishedCourses ?? stats?.publishedCount ?? "0", 
      icon: Award,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100" 
    },
  ];

  return (
    <div className="bg-slate-50/50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Overview of your academy performance, analytics, and courses.</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-8 animate-pulse">
          {/* Stats Grid Skeleton */}
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div 
                key={item} 
                className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2 w-full">
                    <div className="h-3 w-24 bg-slate-200 rounded"></div>
                    <div className="h-8 w-16 bg-slate-200 rounded"></div>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-slate-200 flex-shrink-0"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Courses Table Skeleton */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div className="space-y-1">
                <div className="h-4 w-32 bg-slate-200 rounded"></div>
                <div className="h-3 w-48 bg-slate-200 rounded"></div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-4">Course</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Enrolled</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[1, 2, 3, 4, 5].map((row) => (
                    <tr key={row}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-16 rounded-lg bg-slate-200 flex-shrink-0"></div>
                          <div className="h-4 w-40 bg-slate-200 rounded"></div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-24 bg-slate-200 rounded"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-16 bg-slate-200 rounded"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-10 bg-slate-200 rounded"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 w-20 rounded-full bg-slate-200"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={stat.title} 
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{stat.title}</p>
                      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
                        {typeof stat.value === "number" ? stat.value.toLocaleString("en-IN") : stat.value}
                      </h2>
                    </div>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.color} transition-transform group-hover:scale-110`}>
                      <Icon size={24} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Courses Table Section */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-base font-bold text-slate-900">Recent Courses</h2>
                <p className="text-xs text-slate-500 mt-0.5">A quick look at your recently uploaded or managed courses.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-4">Course</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Enrolled</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {courses.slice(0, 5).map((course) => (
                    <tr key={course._id} className="transition-colors hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {course.thumbnail ? (
                            <img 
                              src={course.thumbnail} 
                              alt={course.title} 
                              className="h-10 w-16 rounded-lg object-cover border border-slate-100 flex-shrink-0" 
                            />
                          ) : (
                            <div className="h-10 w-16 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs flex-shrink-0">
                              IMG
                            </div>
                          )}
                          <span className="font-semibold text-slate-800 line-clamp-1 max-w-[240px]">
                            {course.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-medium">{course.category || "Uncategorized"}</td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        ₹{Number(course.price || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">{course.enrolledCount || 0}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                          course.status === "Published" 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${course.status === "Published" ? "bg-emerald-500" : "bg-slate-400"}`}></span>
                          {course.status || "Draft"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {courses.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center">
                        <p className="text-sm font-medium text-slate-500">No courses found yet.</p>
                        <p className="text-xs text-slate-400 mt-1">Get started by creating your first course!</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;