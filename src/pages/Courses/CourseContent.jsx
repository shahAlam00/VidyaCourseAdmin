import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  ChevronDown,
  ChevronRight,
  Video,
  Trash2,
  X,
  Save,
  Play,
  FileText,
  Loader2,
} from "lucide-react";
import API from "../../utils/axios.js";

const CourseContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [openModules, setOpenModules] = useState([]);
  const [modal, setModal] = useState(null);
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/courses/${id}`);
      setCourse(data.data);
      setModules(data.data.modules || []);
      if (data.data.modules?.length > 0) {
        setOpenModules([data.data.modules[0]._id]);
      }
    } catch (err) {
      alert("Failed to load course.");
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (id) =>
    setOpenModules((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const addModule = async (title) => {
    if (!title.trim()) return;
    try {
      const { data } = await API.post(`/courses/${id}/modules`, { title });
      setModules(data.data);
      setModal(null);
    } catch (err) {
      alert("Failed to add module.");
    }
  };

  const deleteModule = async (moduleId) => {
    if (!confirm("Delete this module and all its lessons?")) return;
    try {
      const { data } = await API.delete(`/courses/${id}/modules/${moduleId}`);
      setModules(data.data);
    } catch (err) {
      alert("Failed to delete module.");
    }
  };

  const addLesson = async (lessonData) => {
    if (!lessonData.title.trim() || !lessonData.videoUrl.trim()) return;
    try {
      const { data } = await API.post(`/courses/${id}/modules/${activeModuleId}/lessons`, lessonData);
      setModules(data.data);
      setModal(null);
    } catch (err) {
      alert("Failed to add lesson.");
    }
  };

  const deleteLesson = async (moduleId, lessonId) => {
    if (!confirm("Delete this lesson?")) return;
    try {
      const { data } = await API.delete(`/courses/${id}/modules/${moduleId}/lessons/${lessonId}`);
      setModules(data.data);
    } catch (err) {
      alert("Failed to delete lesson.");
    }
  };

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-slate-400" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/admin/courses")} className="rounded-xl border p-2 hover:bg-slate-50">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Course Content</h1>
            <p className="text-sm text-slate-500">{course?.title}</p>
          </div>
        </div>
        <button
          onClick={() => setModal("module")}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus size={17} /> Add Module
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Modules" value={modules.length} />
        <Stat label="Total Lessons" value={totalLessons} />
        <Stat label="Status" value={course?.status || "Draft"} />
      </div>

      {/* Modules */}
      <div className="space-y-4">
        {modules.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center">
            <Video size={32} className="mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-semibold text-slate-500">No modules yet. Add your first module!</p>
          </div>
        )}

        {modules.map((module, index) => {
          const open = openModules.includes(module._id);
          return (
            <div key={module._id} className="overflow-hidden rounded-2xl border bg-white">
              <div className="flex items-center gap-3 p-4">
                <button onClick={() => toggleModule(module._id)} className="text-slate-500">
                  {open ? <ChevronDown size={19} /> : <ChevronRight size={19} />}
                </button>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{module.title}</h3>
                  <p className="text-xs text-slate-500">{module.lessons.length} lessons</p>
                </div>
                <button
                  onClick={() => { setActiveModuleId(module._id); setModal("lesson"); }}
                  className="hidden items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold hover:bg-slate-50 sm:flex"
                >
                  <Plus size={14} /> Add Lesson
                </button>
                <button
                  onClick={() => deleteModule(module._id)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {open && (
                <div className="border-t bg-slate-50 p-3">
                  {module.lessons.length ? (
                    <div className="space-y-2">
                      {module.lessons.map((lesson, i) => (
                        <LessonRow
                          key={lesson._id}
                          lesson={lesson}
                          index={i}
                          onDelete={() => deleteLesson(module._id, lesson._id)}
                          onPreview={() => { setActiveLesson(lesson); setModal("preview"); }}
                        />
                      ))}
                    </div>
                  ) : (
                    <button
                      onClick={() => { setActiveModuleId(module._id); setModal("lesson"); }}
                      className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed py-8 text-center hover:bg-white"
                    >
                      <Video size={22} className="text-slate-300" />
                      <p className="mt-2 text-sm font-semibold text-slate-500">Add your first lesson</p>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modals */}
      {modal === "module" && <ModuleModal onClose={() => setModal(null)} onSave={addModule} />}
      {modal === "lesson" && <LessonModal onClose={() => setModal(null)} onSave={addLesson} />}
      {modal === "preview" && activeLesson && <PreviewModal lesson={activeLesson} onClose={() => setModal(null)} />}
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div className="rounded-2xl border bg-white p-5">
    <p className="text-sm text-slate-500">{label}</p>
    <p className="mt-1 text-2xl font-bold">{value}</p>
  </div>
);

const LessonRow = ({ lesson, index, onDelete, onPreview }) => (
  <div className="flex items-center gap-3 rounded-xl border bg-white p-3">
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500">
      <Video size={17} />
    </div>
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-semibold">{index + 1}. {lesson.title}</p>
      <p className="text-xs text-slate-400">{lesson.duration || "No duration set"}</p>
    </div>
    {lesson.isFree && (
      <span className="hidden rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-600 sm:block">FREE</span>
    )}
    <button onClick={onPreview} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
      <Play size={16} />
    </button>
    <button onClick={onDelete} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500">
      <Trash2 size={16} />
    </button>
  </div>
);

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
    <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b p-5">
        <h2 className="font-bold">{title}</h2>
        <button onClick={onClose}><X size={19} /></button>
      </div>
      {children}
    </div>
  </div>
);

const ModuleModal = ({ onClose, onSave }) => {
  const [title, setTitle] = useState("");
  return (
    <Modal title="Add Module" onClose={onClose}>
      <div className="p-5">
        <label className="text-sm font-semibold">Module Name</label>
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSave(title)}
          placeholder="e.g. SEO Mastery"
          className="mt-2 h-11 w-full rounded-xl border bg-slate-50 px-4 text-sm outline-none focus:border-slate-400"
        />
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-xl border px-4 py-2 text-sm">Cancel</button>
          <button onClick={() => onSave(title)} className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            <Save size={15} /> Add Module
          </button>
        </div>
      </div>
    </Modal>
  );
};

const LessonModal = ({ onClose, onSave }) => {
  const [data, setData] = useState({ title: "", videoUrl: "", videoType: "youtube", duration: "", isFree: false });
  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };
  return (
    <Modal title="Add Lesson" onClose={onClose}>
      <div className="space-y-4 p-5">
        <Field label="Lesson Title" name="title" value={data.title} onChange={change} placeholder="Introduction to Digital Marketing" />
        <div>
          <label className="text-sm font-semibold">Video Type</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {["youtube", "file"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setData((p) => ({ ...p, videoType: t }))}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${data.videoType === t ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
              >
                {t === "youtube" ? "YouTube URL" : "Direct URL"}
              </button>
            ))}
          </div>
        </div>
        <Field
          label={data.videoType === "youtube" ? "YouTube Video URL" : "Video URL"}
          name="videoUrl"
          value={data.videoUrl}
          onChange={change}
          placeholder={data.videoType === "youtube" ? "https://www.youtube.com/watch?v=..." : "https://..."}
        />
        <Field label="Duration (optional)" name="duration" value={data.duration} onChange={change} placeholder="18:32" />
        <label className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 cursor-pointer">
          <input type="checkbox" name="isFree" checked={data.isFree} onChange={change} className="h-4 w-4" />
          <div>
            <p className="text-sm font-semibold">Free Preview</p>
            <p className="text-xs text-slate-400">Allow visitors to watch this lesson for free.</p>
          </div>
        </label>
        <button
          onClick={() => onSave(data)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white"
        >
          <Save size={16} /> Save Lesson
        </button>
      </div>
    </Modal>
  );
};

const Field = ({ label, name, value, onChange, placeholder }) => (
  <div>
    <label className="text-sm font-semibold">{label}</label>
    <input name={name} value={value} onChange={onChange} placeholder={placeholder} className="mt-2 h-11 w-full rounded-xl border bg-slate-50 px-4 text-sm outline-none focus:border-slate-400" />
  </div>
);

const PreviewModal = ({ lesson, onClose }) => {
  const getEmbedUrl = (url) => {
    try {
      const parsed = new URL(url);
      if (parsed.hostname.includes("youtu.be")) return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
      const v = parsed.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
    } catch {}
    if (url.includes("youtube.com/embed")) return url;
    return null;
  };

  const embedUrl = lesson.videoType === "youtube" ? getEmbedUrl(lesson.videoUrl) : null;

  return (
    <Modal title={lesson.title} onClose={onClose}>
      <div className="p-5">
        {embedUrl ? (
          <div className="aspect-video overflow-hidden rounded-xl bg-black">
            <iframe src={embedUrl} title={lesson.title} className="h-full w-full" allowFullScreen />
          </div>
        ) : lesson.videoUrl ? (
          <video src={lesson.videoUrl} controls className="w-full rounded-xl" />
        ) : (
          <div className="rounded-xl bg-red-50 p-5 text-sm text-red-600">No video URL set</div>
        )}
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
          <FileText size={16} /> {lesson.duration || "Duration not set"}
        </div>
      </div>
    </Modal>
  );
};

export default CourseContent;
