import React, { useMemo, useState, useEffect } from "react";
import API from "../../utils/axios.js";

const statusConfig = {
  Pending: { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-500" },
  "In Review": { text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-500" },
  Answered: { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500" },
  Closed: { text: "text-slate-600", bg: "bg-slate-100", border: "border-slate-200", dot: "bg-slate-400" },
};

function DoubtSupport() {
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoubt, setSelectedDoubt] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [priorityFilter, setPriorityFilter] = useState("All Priority");

  const [reply, setReply] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const tabs = ["All", "Pending", "In Review", "Answered", "Closed"];

  // Fetch all doubts
  useEffect(() => {
    fetchDoubts();
  }, []);

  const fetchDoubts = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/doubts/admin/all");
      setDoubts(data.data || []);
    } catch (err) {
      console.error("Failed to fetch doubts:", err);
    } finally {
      setLoading(false);
    }
  };

  const openDoubt = async (doubt) => {
    try {
      setLoadingDetail(true);
      setSelectedDoubt(doubt); // show drawer immediately
      const { data } = await API.get(`/doubts/admin/${doubt._id}`);
      setSelectedDoubt(data.data);
    } catch (err) {
      console.error("Failed to fetch doubt detail:", err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const sendReply = async () => {
    const message = reply.trim();
    if (!message || !selectedDoubt) return;
    try {
      setSendingReply(true);
      const { data } = await API.post(`/doubts/admin/${selectedDoubt._id}/reply`, { message });
      setSelectedDoubt(data.data);
      setReply("");
      // Update list
      setDoubts((prev) =>
        prev.map((d) => (d._id === data.data._id ? { ...d, status: data.data.status } : d))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send reply.");
    } finally {
      setSendingReply(false);
    }
  };

  const updateStatus = async (status) => {
    if (!selectedDoubt) return;
    try {
      setUpdatingStatus(true);
      const { data } = await API.patch(`/doubts/admin/${selectedDoubt._id}/status`, { status });
      setSelectedDoubt(data.data);
      setDoubts((prev) =>
        prev.map((d) => (d._id === data.data._id ? { ...d, status: data.data.status } : d))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const courses = ["All Courses", ...new Set(doubts.map((d) => d.course?.title).filter(Boolean))];

  const filteredDoubts = useMemo(() => {
    return doubts.filter((doubt) => {
      const matchesTab = activeTab === "All" || doubt.status === activeTab;
      const s = search.toLowerCase();
      const matchesSearch =
        doubt.student?.name?.toLowerCase().includes(s) ||
        doubt.title?.toLowerCase().includes(s) ||
        doubt.course?.title?.toLowerCase().includes(s);
      const matchesCourse =
        courseFilter === "All Courses" || doubt.course?.title === courseFilter;
      const matchesPriority =
        priorityFilter === "All Priority" || doubt.priority === priorityFilter;
      return matchesTab && matchesSearch && matchesCourse && matchesPriority;
    });
  }, [doubts, activeTab, search, courseFilter, priorityFilter]);

  const stats = {
    total: doubts.length,
    pending: doubts.filter((d) => d.status === "Pending").length,
    review: doubts.filter((d) => d.status === "In Review").length,
    answered: doubts.filter((d) => d.status === "Answered").length,
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div className="w-full bg-white px-3 py-6 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-full">

        {/* HEADER */}
        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <MessageIcon />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                  Doubt Support
                </h1>
                <p className="mt-1 text-sm text-slate-500">Manage and respond to student questions</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 shadow-sm">
              <p className="text-xs text-slate-500">Total Doubts</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-900">{stats.total}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 shadow-sm">
              <p className="text-xs text-slate-500">Pending</p>
              <p className="mt-0.5 text-sm font-semibold text-amber-600">{stats.pending}</p>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
          <StatCard title="Total Doubts" value={stats.total} icon={<MessageIcon />} />
          <StatCard title="Pending" value={stats.pending} icon={<ClockIcon />} accent="amber" />
          <StatCard title="In Review" value={stats.review} icon={<SearchIcon />} accent="blue" />
          <StatCard title="Answered" value={stats.answered} icon={<CheckIcon />} accent="emerald" />
        </div>

        {/* MAIN TABLE CONTAINER */}
        <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Tabs */}
          <div className="border-b border-slate-200 px-4 pt-4 md:px-6">
            <div className="flex gap-1 overflow-x-auto no-scrollbar">
              {tabs.map((tab) => {
                const count = tab === "All" ? doubts.length : doubts.filter((d) => d.status === tab).length;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex shrink-0 items-center gap-2 rounded-t-lg px-4 py-3 text-sm font-medium transition ${
                      activeTab === tab
                        ? "border-b-2 border-violet-600 text-violet-600 bg-slate-50"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tab}
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${activeTab === tab ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-600"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filters */}
          <div className="border-b border-slate-200 bg-slate-50/50 p-4 md:p-6">
            <div className="grid gap-3 lg:grid-cols-[1fr_220px_180px]">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student, course or doubt..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                />
              </div>
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-violet-500"
              >
                {courses.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-violet-500"
              >
                <option value="All Priority">All Priority</option>
                <option value="Important">Important</option>
                <option value="Normal">Normal</option>
              </select>
            </div>
          </div>

          {/* Desktop Table / Responsive Layout */}
          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-400 text-sm">Loading doubts...</div>
          ) : (
            <>
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">Student</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">Course</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">Doubt</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">Priority</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">Status</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right sm:px-6">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredDoubts.map((doubt) => (
                      <DoubtRow key={doubt._id} doubt={doubt} onOpen={() => openDoubt(doubt)} formatDate={formatDate} />
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredDoubts.length === 0 && (
                <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <MessageIcon />
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-800">No doubts found</h3>
                  <p className="mt-1 text-sm text-slate-500">Try changing your search or filters.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* DETAIL DRAWER */}
      {selectedDoubt && (
        <>
          <div className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs" onClick={() => setSelectedDoubt(null)} />
          <aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-2xl flex-col border-l border-slate-200 bg-white shadow-2xl">

            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4 md:px-6">
              <div>
                <p className="text-xs font-semibold text-violet-600">
                  DOUBT #{selectedDoubt._id?.slice(-6).toUpperCase()}
                </p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">Doubt Details</h2>
              </div>
              <button
                onClick={() => setSelectedDoubt(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto">

              {/* Student Info */}
              <div className="border-b border-slate-200 p-5 md:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-100 font-semibold text-violet-700">
                      {selectedDoubt.student?.avatar || selectedDoubt.student?.name?.charAt(0).toUpperCase() || "S"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{selectedDoubt.student?.name}</h3>
                      <p className="mt-0.5 text-xs text-slate-500">{selectedDoubt.student?.email}</p>
                    </div>
                  </div>
                  <StatusBadge status={selectedDoubt.status} />
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <InfoBox label="Course" value={selectedDoubt.course?.title || "—"} />
                  <InfoBox label="Lesson" value={selectedDoubt.lesson || "General"} />
                </div>
              </div>

              {/* Doubt Question */}
              <div className="border-b border-slate-200 p-5 md:p-6 bg-slate-50/50">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Student Question</p>
                    <h3 className="mt-2 text-base font-semibold text-slate-900">{selectedDoubt.title}</h3>
                  </div>
                  <PriorityBadge priority={selectedDoubt.priority} />
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">{selectedDoubt.description}</p>
              </div>

              {/* Conversation */}
              <div className="p-5 md:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Conversation</p>
                    <h3 className="mt-1 font-semibold text-slate-800">Student & Support Team</h3>
                  </div>
                  <span className="text-xs text-slate-400">{formatDate(selectedDoubt.createdAt)}</span>
                </div>

                {loadingDetail ? (
                  <div className="text-center text-sm text-slate-400 py-8">Loading conversation...</div>
                ) : (
                  <div className="space-y-4">
                    {selectedDoubt.messages?.map((msg, idx) => (
                      <div key={msg._id || idx} className={`flex ${msg.senderRole === "admin" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-xs ${
                          msg.senderRole === "admin"
                            ? "rounded-br-md bg-violet-600 text-white"
                            : "rounded-bl-md border border-slate-200 bg-slate-100 text-slate-700"
                        }`}>
                          <p className="text-sm leading-6">{msg.message}</p>
                          <p className={`mt-2 text-[10px] ${msg.senderRole === "admin" ? "text-violet-200" : "text-slate-400"}`}>
                            {msg.senderRole === "admin" ? "You" : selectedDoubt.student?.name} • {formatTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Reply Area */}
            <div className="border-t border-slate-200 bg-slate-50 p-4 md:p-5">
              <textarea
                rows={3}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Write your reply to the student..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus("In Review")}
                    disabled={updatingStatus}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
                  >
                    Mark In Review
                  </button>
                  <button
                    onClick={() => updateStatus("Closed")}
                    disabled={updatingStatus}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
                  >
                    Close
                  </button>
                </div>
                <button
                  onClick={sendReply}
                  disabled={!reply.trim() || sendingReply}
                  className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <SendIcon />
                  {sendingReply ? "Sending..." : "Send Reply"}
                </button>
              </div>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}

/* ── TABLE ROW ── */
function DoubtRow({ doubt, onOpen, formatDate }) {
  return (
    <tr className="transition hover:bg-slate-50/80">
      <td className="px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Avatar text={doubt.student?.avatar || doubt.student?.name?.charAt(0).toUpperCase() || "S"} />
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{doubt.student?.name}</p>
            <p className="mt-0.5 text-xs text-slate-400 truncate">{doubt.student?.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 sm:px-6">
        <p className="text-sm text-slate-700 line-clamp-1">{doubt.course?.title}</p>
        <p className="mt-1 text-xs text-slate-400 truncate">{doubt.lesson || "General"}</p>
      </td>
      <td className="px-4 py-4 sm:px-6">
        <p className="text-sm font-medium text-slate-900 line-clamp-1">{doubt.title}</p>
        <p className="mt-1 text-xs text-slate-400 truncate">{formatDate(doubt.createdAt)}</p>
      </td>
      <td className="px-4 py-4 sm:px-6 whitespace-nowrap"><PriorityBadge priority={doubt.priority} /></td>
      <td className="px-4 py-4 sm:px-6 whitespace-nowrap"><StatusBadge status={doubt.status} /></td>
      <td className="px-4 py-4 sm:px-6 text-right whitespace-nowrap">
        <button
          onClick={onOpen}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-2xs transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
        >
          View Doubt
        </button>
      </td>
    </tr>
  );
}

/* ── SMALL COMPONENTS ── */
function StatCard({ title, value, icon, accent = "violet" }) {
  const accentClasses = {
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accentClasses[accent]}`}>{icon}</div>
        <span className="text-2xl font-bold text-slate-900">{value}</span>
      </div>
      <p className="mt-4 text-sm text-slate-500">{title}</p>
    </div>
  );
}

function Avatar({ text }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700 ring-1 ring-violet-500/10">
      {text}
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1.5 text-xs leading-5 text-slate-700 font-medium">{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.Pending;
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium ${config.bg} ${config.border} ${config.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const important = priority === "Important";
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${important ? "border-red-200 bg-red-50 text-red-600" : "border-slate-200 bg-slate-50 text-slate-500"}`}>
      {priority}
    </span>
  );
}

/* ── ICONS ── */
function MessageIcon({ className = "h-5 w-5" }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 014 11.5a8.5 8.5 0 1117 0z" /></svg>;
}
function SearchIcon({ className = "h-5 w-5" }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="7" strokeWidth="2" /><path d="M20 20l-4-4" strokeWidth="2" strokeLinecap="round" /></svg>;
}
function ClockIcon() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" strokeWidth="2" /><path d="M12 7v5l3 2" strokeWidth="2" strokeLinecap="round" /></svg>;
}
function CheckIcon() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12l4 4L19 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function SendIcon() {
  return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 2L11 13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M22 2l-7 20-4-9-9-4 20-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function CloseIcon() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 6l12 12M18 6L6 18" strokeWidth="2" strokeLinecap="round" /></svg>;
}

export default DoubtSupport;