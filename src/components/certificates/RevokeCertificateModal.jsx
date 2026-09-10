import { useEffect, useState } from "react";
import {
  X,
  ShieldX,
  AlertTriangle,
  User,
  Award,
  CalendarDays,
} from "lucide-react";

const RevokeCertificateModal = ({
  isOpen,
  onClose,
  onConfirm,
  certificate = null,
}) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [revoking, setRevoking] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setReason("");
      setError("");
      setRevoking(false);
    }
  }, [isOpen]);

  if (!isOpen || !certificate) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedReason = reason.trim();

    if (!trimmedReason) {
      setError("Please provide a reason for revoking this certificate.");
      return;
    }

    if (trimmedReason.length < 5) {
      setError("Reason must be at least 5 characters.");
      return;
    }

    try {
      setRevoking(true);
      await onConfirm?.({ certificate, reason: trimmedReason });
    } finally {
      setRevoking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <ShieldX size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Revoke Certificate
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                This action will invalidate the certificate.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-6">
            {/* Warning */}
            <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
              <AlertTriangle
                size={18}
                className="mt-0.5 shrink-0 text-red-600"
              />

              <div>
                <p className="text-sm font-semibold text-red-800">
                  Are you sure you want to revoke this certificate?
                </p>

                <p className="mt-1 text-xs leading-5 text-red-700">
                  The certificate will no longer be considered valid.
                  Its record will remain available for audit and
                  verification history.
                </p>
              </div>
            </div>

            {/* Certificate Information */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="space-y-4">
                {/* Student */}
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm">
                    <User size={16} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] text-slate-400">
                      Student
                    </p>

                    <p className="truncate text-sm font-medium text-slate-700">
                      {certificate.studentName ||
                        certificate.student?.name ||
                        certificate.student?.fullName ||
                        "Unknown Student"}
                    </p>
                  </div>
                </div>

                {/* Course */}
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm">
                    <Award size={16} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] text-slate-400">
                      Course
                    </p>

                    <p className="truncate text-sm font-medium text-slate-700">
                      {certificate.course ||
                        certificate.courseName ||
                        "Unknown Course"}
                    </p>
                  </div>
                </div>

                {/* Certificate ID */}
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm">
                    <ShieldX size={16} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] text-slate-400">
                      Certificate ID
                    </p>

                    <p className="truncate font-mono text-xs font-medium text-slate-700">
                      {certificate.certificateId || "—"}
                    </p>
                  </div>
                </div>

                {/* Issue Date */}
                {(certificate.issuedAt || certificate.issueDate) && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm">
                      <CalendarDays size={16} />
                    </div>

                    <div>
                      <p className="text-[11px] text-slate-400">
                        Issue Date
                      </p>

                      <p className="text-sm font-medium text-slate-700">
                        {certificate.issuedAt
                          ? new Date(certificate.issuedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                          : certificate.issueDate}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Reason for Revocation *
              </label>

              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setError("");
                }}
                rows={4}
                maxLength={500}
                placeholder="Enter the reason for revoking this certificate..."
                className={`w-full resize-none rounded-lg border px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                  error
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
                }`}
              />

              <div className="mt-1.5 flex items-center justify-between">
                <div>
                  {error && (
                    <p className="text-xs text-red-600">
                      {error}
                    </p>
                  )}
                </div>

                <p className="text-[11px] text-slate-400">
                  {reason.length}/500
                </p>
              </div>
            </div>

            {/* Final Notice */}
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
              <p className="text-xs leading-5 text-slate-500">
                Revoking this certificate should only be done when
                necessary. The revocation reason should be clear
                because it may be stored in the certificate audit
                history.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={revoking}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
            >
              <ShieldX size={16} />
              {revoking ? "Revoking..." : "Revoke Certificate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RevokeCertificateModal;