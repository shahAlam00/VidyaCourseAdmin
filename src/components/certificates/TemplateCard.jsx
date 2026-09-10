import { Award } from "lucide-react";

const TemplateCard = ({
  template,
  courseName = "",
  onPreview,
  onEdit,
  onDuplicate,
  onToggleStatus,
  onDelete,
}) => {
  const courseDisplay = courseName || "—";

  const createdAt = template.createdAt
    ? new Date(template.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Template Information */}
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Award size={23} />
          </div>

          {/* Details */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-900">
                {template.name}
              </h3>

              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                  template.active
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {template.active ? "Active" : "Inactive"}
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              {courseDisplay}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span>
                QR {template.qrEnabled ? "Enabled" : "Disabled"}
              </span>

              <span>•</span>

              <span>Created {createdAt}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onPreview?.(template)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Preview
          </button>

          <button
            type="button"
            onClick={() => onEdit?.(template)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDuplicate?.(template)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Duplicate
          </button>

          <button
            type="button"
            onClick={() => onToggleStatus?.(template)}
            className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
              template.active
                ? "border-amber-200 text-amber-700 hover:bg-amber-50"
                : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            }`}
          >
            {template.active ? "Disable" : "Enable"}
          </button>

          <button
            type="button"
            onClick={() => onDelete?.(template)}
            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;