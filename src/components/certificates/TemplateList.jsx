import { Award } from "lucide-react";
import TemplateCard from "./TemplateCard";

const TemplateList = ({
  templates,
  search = "",
  courses = [],
  onPreview,
  onEdit,
  onDuplicate,
  onToggleStatus,
  onDelete,
}) => {
  const resolveCourse = (template) => {
    if (template.courseId?.title) return template.courseId.title;
    if (template.courseId?.name) return template.courseId.name;
    const id = typeof template.courseId === "string" ? template.courseId : template.courseId?._id;
    const found = courses.find((c) => (c._id || c.id) === id);
    return found?.title || found?.name || "";
  };

  const filteredTemplates = templates.filter((template) => {
    const courseName = resolveCourse(template);
    return `${template.name} ${courseName}`
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  return (
    <section>
      <div className="mb-3">
        <h2 className="text-base font-semibold text-slate-900">
          Certificate Templates
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Manage certificate designs assigned to your courses.
        </p>
      </div>

      <div className="space-y-3">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template._id || template.id}
            template={template}
            courseName={resolveCourse(template)}
            onPreview={onPreview}
            onEdit={onEdit}
            onDuplicate={onDuplicate}
            onToggleStatus={onToggleStatus}
            onDelete={onDelete}
          />
        ))}

        {filteredTemplates.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <Award size={28} className="mx-auto text-slate-300" />
            <p className="mt-3 text-sm font-medium text-slate-700">
              No certificate templates found
            </p>
            <p className="mt-1 text-xs text-slate-400">Try a different search.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TemplateList;