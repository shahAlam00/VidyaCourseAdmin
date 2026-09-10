import { useEffect, useState } from "react";
import {
  X, Award, User, BookOpen, FileText, CalendarDays, ShieldCheck, AlertCircle,
} from "lucide-react";

const defaultForm = {
  studentId: "",
  courseId: "",
  templateId: "",
  completionDate: new Date().toISOString().split("T")[0],
};

const IssueCertificateModal = ({
  isOpen,
  onClose,
  onIssue,
  students = [],
  templates = [],
}) => {
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [studentSearch, setStudentSearch] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setForm({ ...defaultForm, completionDate: new Date().toISOString().split("T")[0] });
    setStudentSearch("");
  }, [isOpen]);

  if (!isOpen) return null;

  // Selected student object
  const selectedStudent = students.find(
    (s) => String(s._id || s.id) === String(form.studentId)
  );

  // Enrolled courses for selected student — from student.courses array (populated by GET /auth/students)
  const enrolledCourses = selectedStudent?.courses || [];

  // Selected course object
  const selectedCourse = enrolledCourses.find(
    (c) => String(c._id || c.id) === String(form.courseId)
  );

  // Templates filtered by selected courseId
  const filteredTemplates = form.courseId
    ? templates.filter(
        (t) =>
          t.active !== false &&
          String(typeof t.courseId === "object" ? t.courseId?._id : t.courseId) ===
            String(form.courseId)
      )
    : [];

  const selectedTemplate = filteredTemplates.find(
    (t) => String(t._id || t.id) === String(form.templateId)
  );

  // Filter students by search
  const filteredStudents = studentSearch.trim()
    ? students.filter(
        (s) =>
          s.name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
          s.email?.toLowerCase().includes(studentSearch.toLowerCase())
      )
    : students;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      // Reset downstream selections when parent changes
      if (name === "studentId") { updated.courseId = ""; updated.templateId = ""; }
      if (name === "courseId") { updated.templateId = ""; }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.studentId) { alert("Please select a student."); return; }
    if (!form.courseId) { alert("Please select a course."); return; }
    if (!form.templateId) { alert("Please select a certificate template."); return; }
    if (!form.completionDate) { alert("Please select completion date."); return; }

    try {
      setSubmitting(true);
      await onIssue?.({
        studentId: form.studentId,
        courseId: form.courseId,
        templateId: form.templateId,
        completionDate: form.completionDate,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Award size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Issue Certificate</h2>
              <p className="mt-1 text-xs text-slate-500">Issue a certificate to a student manually.</p>
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
        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-6">
          <div className="space-y-5">

            {/* Student Search */}
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-slate-700">
                <User size={14} className="text-slate-400" />
                Select Student *
              </label>

              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="mb-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              {students.length === 0 ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-xs text-amber-700">
                  No students found.
                </div>
              ) : (
                <select
                  name="studentId"
                  value={form.studentId}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">Select student</option>
                  {filteredStudents.map((student) => (
                    <option key={student._id || student.id} value={student._id || student.id}>
                      {student.name} — {student.email}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Selected Student Preview */}
            {selectedStudent && (
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm">
                    <User size={17} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{selectedStudent.name}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{selectedStudent.email}</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {enrolledCourses.length} enrolled course{enrolledCourses.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Course — only enrolled courses of selected student */}
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-slate-700">
                <BookOpen size={14} className="text-slate-400" />
                Select Course *
              </label>

              {!form.studentId ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-xs text-slate-400">
                  Select a student first.
                </div>
              ) : enrolledCourses.length === 0 ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-xs text-amber-700">
                  No enrolled courses found for this student.
                </div>
              ) : (
                <select
                  name="courseId"
                  value={form.courseId}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">Select course</option>
                  {enrolledCourses.map((course) => (
                    <option key={course._id || course.id} value={course._id || course.id}>
                      {course.title || course.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Template — only templates matching selected course */}
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-slate-700">
                <FileText size={14} className="text-slate-400" />
                Certificate Template *
              </label>

              {!form.courseId ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-xs text-slate-400">
                  Select a course first.
                </div>
              ) : filteredTemplates.length === 0 ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-xs text-amber-700">
                  No active certificate template available for this course.
                </div>
              ) : (
                <select
                  name="templateId"
                  value={form.templateId}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">Select certificate template</option>
                  {filteredTemplates.map((template) => (
                    <option key={template._id || template.id} value={template._id || template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Completion Date */}
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-slate-700">
                <CalendarDays size={14} className="text-slate-400" />
                Completion Date *
              </label>
              <input
                type="date"
                name="completionDate"
                value={form.completionDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Summary */}
            {selectedStudent && selectedCourse && selectedTemplate && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  <h3 className="text-sm font-semibold text-slate-800">Certificate Summary</h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <SummaryItem label="Student" value={selectedStudent.name} />
                  <SummaryItem label="Course" value={selectedCourse.title || selectedCourse.name} />
                  <SummaryItem label="Template" value={selectedTemplate.name} />
                  <SummaryItem label="Completion Date" value={formatDate(form.completionDate)} />
                </div>
                <div className="mt-4 flex items-start gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-3">
                  <ShieldCheck size={15} className="mt-0.5 shrink-0 text-emerald-600" />
                  <p className="text-xs leading-5 text-emerald-700">
                    {selectedTemplate.qrEnabled
                      ? "QR verification is enabled. A unique certificate ID will be generated by the backend."
                      : "QR verification is disabled for this template."}
                  </p>
                </div>
              </div>
            )}

            {/* Notice */}
            <div className="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 p-4">
              <AlertCircle size={17} className="mt-0.5 shrink-0 text-amber-600" />
              <div>
                <p className="text-xs font-semibold text-amber-800">Before issuing</p>
                <p className="mt-1 text-xs leading-5 text-amber-700">
                  Make sure the student has successfully completed the selected course. Once issued,
                  the certificate will appear in the Issued Certificates section.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-7 flex items-center justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
            >
              <Award size={16} />
              {submitting ? "Issuing..." : "Issue Certificate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SummaryItem = ({ label, value }) => (
  <div>
    <p className="text-[11px] text-slate-400">{label}</p>
    <p className="mt-1 truncate text-xs font-medium text-slate-700">{value || "—"}</p>
  </div>
);

const formatDate = (date) => {
  if (!date) return "—";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

export default IssueCertificateModal;
