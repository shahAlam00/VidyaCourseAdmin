import { Award, Download, Eye, ShieldX, ShieldCheck } from "lucide-react";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const IssuedCertificateTable = ({
  certificates = [],
  loading = false,
  error = "",
  courses = [],
  onView,
  onDownload,
  onRevoke,
}) => {
  const getCourseName = (courseId) => {
    if (!courseId) return "—";
    if (typeof courseId === "object") return courseId.title || courseId.name || "—";
    const found = courses.find((c) => (c._id || c.id) === courseId);
    return found?.title || found?.name || courseId;
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-sm text-slate-400">
        Loading issued certificates...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <Award size={28} className="mx-auto text-slate-300" />
        <p className="mt-3 text-sm font-medium text-slate-700">No certificates issued yet</p>
        <p className="mt-1 text-xs text-slate-400">
          Issue a certificate to a student to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3.5">Certificate ID</th>
              <th className="px-5 py-3.5">Student</th>
              <th className="px-5 py-3.5">Course</th>
              <th className="px-5 py-3.5">Issue Date</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {certificates.map((cert) => (
              <tr key={cert._id} className="hover:bg-slate-50 transition">
                <td className="px-5 py-4 font-mono text-xs text-slate-600">
                  {cert.certificateId || "—"}
                </td>
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-800">{cert.studentName || "—"}</p>
                  {cert.studentEmail && (
                    <p className="text-xs text-slate-400">{cert.studentEmail}</p>
                  )}
                </td>
                <td className="px-5 py-4 text-slate-600">
                  {getCourseName(cert.courseId)}
                </td>
                <td className="px-5 py-4 text-slate-500">
                  {formatDate(cert.issuedAt || cert.createdAt)}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      cert.status === "valid"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {cert.status === "valid" ? (
                      <ShieldCheck size={11} />
                    ) : (
                      <ShieldX size={11} />
                    )}
                    {cert.status === "valid" ? "Valid" : "Revoked"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onView?.(cert)}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                    >
                      <Eye size={13} className="inline mr-1" />
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() => onDownload?.(cert)}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                    >
                      <Download size={13} className="inline mr-1" />
                      Download
                    </button>

                    {cert.status === "valid" && (
                      <button
                        type="button"
                        onClick={() => onRevoke?.(cert)}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                      >
                        <ShieldX size={13} className="inline mr-1" />
                        Revoke
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IssuedCertificateTable;
