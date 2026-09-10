import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Save, Upload, Image as ImageIcon, Plus, X,
  CheckCircle2, BookOpen, IndianRupee, Clock3, Target,
  AlertCircle, Video, Link, FileVideo, Layers, ChevronDown, ChevronUp, GripVertical,
} from "lucide-react";
import API from "../../utils/axios.js";

const EditCourse = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "", shortDescription: "", description: "",
    category: "", instructor: "", price: "", originalPrice: "",
    duration: "", level: "Beginner", language: "Hindi + English",
    accessDuration: "Lifetime", status: "Draft",
    thumbnail: null, thumbnailUrl: "",
    videoType: "youtube", youtubeUrl: "", videoFile: null,
  });
  const [outcomes, setOutcomes] = useState([""]);
  const [requirements, setRequirements] = useState([""]);
  const [modules, setModules] = useState([]);
  const [expandedModules, setExpandedModules] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/courses/${id}`)
      .then(({ data }) => {
        const c = data._id ? data : (data.course || data.data || data);
        setFormData({
          title: c.title || "",
          shortDescription: c.shortDescription || "",
          description: c.description || "",
          category: c.category || "",
          instructor: c.instructor || "",
          price: c.price != null ? String(c.price) : "",
          originalPrice: c.originalPrice != null ? String(c.originalPrice) : "",
          duration: c.duration || "",
          level: c.level || "Beginner",
          language: c.language || "Hindi + English",
          accessDuration: c.accessDuration || "Lifetime",
          status: c.status || "Draft",
          thumbnail: null,
          thumbnailUrl: c.thumbnail || "",
          videoType: c.videoType || "youtube",
          youtubeUrl: c.youtubeUrl || "",
          videoFile: null,
        });
        setOutcomes(c.outcomes?.length ? c.outcomes : [""]);
        setRequirements(c.requirements?.length ? c.requirements : [""]);

        // Load existing modules with temp IDs for React keys
        if (c.modules?.length) {
          const loaded = c.modules.map((m) => ({
            _tempId: m._id || Date.now() + Math.random(),
            title: m.title || "",
            lessons: (m.lessons || []).map((l) => ({
              _tempId: l._id || Date.now() + Math.random(),
              title: l.title || "",
              videoUrl: l.videoUrl || "",
              duration: l.duration || "",
            })),
          }));
          setModules(loaded);
          const expanded = {};
          loaded.forEach((m) => { expanded[m._tempId] = true; });
          setExpandedModules(expanded);
        }
      })
      .catch(() => alert("Failed to load course."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) setFormData((prev) => ({ ...prev, thumbnail: file, thumbnailUrl: "" }));
  };

  const handleVideoType = (type) => {
    setFormData((prev) => ({ ...prev, videoType: type, youtubeUrl: "", videoFile: null }));
  };

  const handleVideoFile = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("video/"))
      setFormData((prev) => ({ ...prev, videoFile: file }));
  };

  /* ================= MODULES ================= */

  const addModule = () => {
    const id = Date.now();
    setModules((prev) => [...prev, { _tempId: id, title: "", lessons: [] }]);
    setExpandedModules((prev) => ({ ...prev, [id]: true }));
  };

  const removeModule = (tempId) =>
    setModules((prev) => prev.filter((m) => m._tempId !== tempId));

  const updateModuleTitle = (tempId, value) =>
    setModules((prev) =>
      prev.map((m) => (m._tempId === tempId ? { ...m, title: value } : m))
    );

  const toggleModule = (tempId) =>
    setExpandedModules((prev) => ({ ...prev, [tempId]: !prev[tempId] }));

  const addLesson = (moduleTempId) =>
    setModules((prev) =>
      prev.map((m) =>
        m._tempId === moduleTempId
          ? { ...m, lessons: [...m.lessons, { _tempId: Date.now(), title: "", videoUrl: "", duration: "" }] }
          : m
      )
    );

  const removeLesson = (moduleTempId, lessonTempId) =>
    setModules((prev) =>
      prev.map((m) =>
        m._tempId === moduleTempId
          ? { ...m, lessons: m.lessons.filter((l) => l._tempId !== lessonTempId) }
          : m
      )
    );

  const updateLesson = (moduleTempId, lessonTempId, field, value) =>
    setModules((prev) =>
      prev.map((m) =>
        m._tempId === moduleTempId
          ? { ...m, lessons: m.lessons.map((l) => l._tempId === lessonTempId ? { ...l, [field]: value } : l) }
          : m
      )
    );

  const handleSave = async (publishOverride = null) => {
    if (!formData.title.trim()) return alert("Please enter course title.");
    if (!formData.category) return alert("Please select course category.");
    if (!formData.price) return alert("Please enter course price.");

    const cleanModules = modules
      .filter((m) => m.title.trim())
      .map((m, mIdx) => ({
        title: m.title.trim(),
        order: mIdx,
        lessons: m.lessons
          .filter((l) => l.title.trim())
          .map((l, lIdx) => ({
            title: l.title.trim(),
            videoUrl: l.videoUrl.trim(),
            videoType: "youtube",
            duration: l.duration.trim(),
            order: lIdx,
          })),
      }));

    setIsSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("shortDescription", formData.shortDescription);
      fd.append("description", formData.description);
      fd.append("category", formData.category);
      fd.append("instructor", formData.instructor);
      fd.append("price", formData.price);
      fd.append("originalPrice", formData.originalPrice);
      fd.append("duration", formData.duration);
      fd.append("level", formData.level);
      fd.append("language", formData.language);
      fd.append("accessDuration", formData.accessDuration);
      fd.append("status", publishOverride !== null ? publishOverride : formData.status);
      fd.append("videoType", formData.videoType);
      if (formData.videoType === "youtube") fd.append("youtubeUrl", formData.youtubeUrl);
      if (formData.videoType === "file" && formData.videoFile) fd.append("video", formData.videoFile);
      if (formData.thumbnail) fd.append("thumbnail", formData.thumbnail);
      fd.append("outcomes", JSON.stringify(outcomes.filter(Boolean)));
      fd.append("requirements", JSON.stringify(requirements.filter(Boolean)));
      fd.append("modules", JSON.stringify(cleanModules));

      await API.put(`/courses/update/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Course updated successfully!");
      navigate("/admin/courses");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update course.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-500">Loading...</div>;

  const thumbnailPreview = formData.thumbnail
    ? URL.createObjectURL(formData.thumbnail)
    : formData.thumbnailUrl;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <button
            onClick={() => navigate("/admin/courses")}
            className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <BookOpen size={22} className="text-slate-900" />
              <h1 className="text-2xl font-bold text-slate-900">Edit Course</h1>
            </div>
            <p className="mt-1 text-sm text-slate-500">Update course details.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSave(formData.status === "Published" ? "Draft" : "Published")}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            {formData.status === "Published" ? "Unpublish" : "Publish"}
          </button>
          <button
            onClick={() => handleSave(null)}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            <Save size={17} />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        {/* LEFT */}
        <div className="space-y-6">
          {/* BASIC INFO */}
          <Section icon={BookOpen} title="Basic Information" description="Update the basic details of your course.">
            <div className="grid gap-5 md:grid-cols-2">
              <Input label="Course Title" name="title" value={formData.title} onChange={handleChange} placeholder="Digital Marketing Mastery" required className="md:col-span-2" />
              <Input label="Short Description" name="shortDescription" value={formData.shortDescription} onChange={handleChange} placeholder="Master digital marketing..." className="md:col-span-2" />
              <Select label="Category" name="category" value={formData.category} onChange={handleChange} options={["Digital Marketing","SEO","Google Ads","Meta Ads","Social Media Marketing","Content Marketing","Email Marketing","Analytics"]} placeholder="Select category" />
              <Select label="Instructor" name="instructor" value={formData.instructor} onChange={handleChange} options={["Shah Alam","Rahul Sharma","Priya Singh"]} placeholder="Select instructor" />
              <Select label="Level" name="level" value={formData.level} onChange={handleChange} options={["Beginner","Intermediate","Advanced","All Levels"]} />
              <Select label="Language" name="language" value={formData.language} onChange={handleChange} options={["Hindi + English","Hindi","English"]} />
            </div>
            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Full Course Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={7} placeholder="Describe your course..." className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white" />
            </div>
          </Section>

          {/* VIDEO */}
          <Section icon={Video} title="Course Video" description="Update the course preview video.">
            <div className="grid grid-cols-2 gap-3">
              {["youtube", "file"].map((type) => (
                <button key={type} type="button" onClick={() => handleVideoType(type)}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${formData.videoType === type ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
                  {type === "youtube" ? <><Link size={17} /> YouTube URL</> : <><Upload size={17} /> Upload Video</>}
                </button>
              ))}
            </div>

            {formData.videoType === "youtube" && (
              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700">YouTube Video URL</label>
                <div className="relative">
                  <Link size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="url" value={formData.youtubeUrl}
                    onChange={(e) => setFormData((prev) => ({ ...prev, youtubeUrl: e.target.value }))}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white" />
                </div>
                {formData.youtubeUrl && (
                  <div className="mt-3 overflow-hidden rounded-xl">
                    <iframe
                      src={`https://www.youtube.com/embed/${getYoutubeId(formData.youtubeUrl)}`}
                      className="h-48 w-full" allowFullScreen title="preview" />
                  </div>
                )}
              </div>
            )}

            {formData.videoType === "file" && (
              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700">Course Video File</label>
                <label className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-center transition hover:border-slate-400">
                  <FileVideo size={21} className="text-slate-600" />
                  <p className="mt-2 text-sm font-semibold text-slate-700">{formData.videoFile ? formData.videoFile.name : "Upload Course Video"}</p>
                  <p className="mt-1 text-xs text-slate-400">MP4, WebM or MOV</p>
                  <input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={handleVideoFile} className="hidden" />
                </label>
              </div>
            )}
          </Section>

          {/* PRICING */}
          <Section icon={IndianRupee} title="Pricing" description="Update course pricing.">
            <div className="grid gap-5 md:grid-cols-2">
              <Input label="Original Price" name="originalPrice" value={formData.originalPrice} onChange={handleChange} placeholder="59999" type="number" prefix="₹" />
              <Input label="Selling Price" name="price" value={formData.price} onChange={handleChange} placeholder="49999" type="number" prefix="₹" required />
            </div>
          </Section>

          {/* COURSE DETAILS */}
          <Section icon={Clock3} title="Course Details" description="Configure course duration and access.">
            <div className="grid gap-5 md:grid-cols-3">
              <Input label="Duration" name="duration" value={formData.duration} onChange={handleChange} placeholder="42 Hours" />
              <Select label="Access Duration" name="accessDuration" value={formData.accessDuration} onChange={handleChange} options={["Lifetime","1 Year","6 Months","3 Months","Custom"]} />
              <Select label="Course Status" name="status" value={formData.status} onChange={handleChange} options={["Draft","Published"]} />
            </div>
          </Section>

          {/* OUTCOMES */}
          <Section icon={Target} title="What Students Will Learn" description="Update learning outcomes.">
            <div className="space-y-3">
              {outcomes.map((outcome, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <input type="text" value={outcome}
                    onChange={(e) => setOutcomes((prev) => prev.map((item, i) => i === index ? e.target.value : item))}
                    placeholder="Example: Create high-converting Meta Ads campaigns"
                    className="h-11 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white" />
                  {outcomes.length > 1 && (
                    <button onClick={() => setOutcomes((prev) => prev.filter((_, i) => i !== index))}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500">
                      <X size={17} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => setOutcomes((prev) => [...prev, ""])}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900">
              <Plus size={17} /> Add Learning Outcome
            </button>
          </Section>

          {/* CURRICULUM */}
          <Section icon={Layers} title="Course Curriculum" description="Add modules and lessons. Each lesson needs a title, YouTube URL, and duration.">
            <div className="space-y-4">
              {modules.map((mod, mIdx) => (
                <div key={mod._tempId} className="rounded-xl border border-slate-200 overflow-hidden">

                  {/* Module Header */}
                  <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 border-b border-slate-200">
                    <GripVertical size={16} className="text-slate-300 shrink-0" />
                    <span className="text-xs font-bold text-slate-400 shrink-0">Module {mIdx + 1}</span>
                    <input
                      type="text"
                      value={mod.title}
                      onChange={(e) => updateModuleTitle(mod._tempId, e.target.value)}
                      placeholder="Module title (e.g. Introduction to SEO)"
                      className="flex-1 h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-slate-400"
                    />
                    <button onClick={() => toggleModule(mod._tempId)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 transition">
                      {expandedModules[mod._tempId] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    <button onClick={() => removeModule(mod._tempId)} className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition">
                      <X size={16} />
                    </button>
                  </div>

                  {/* Lessons */}
                  {expandedModules[mod._tempId] && (
                    <div className="p-4 space-y-3">
                      {mod.lessons.map((lesson, lIdx) => (
                        <div key={lesson._tempId} className="grid gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 w-5 shrink-0">{lIdx + 1}.</span>
                            <input
                              type="text"
                              value={lesson.title}
                              onChange={(e) => updateLesson(mod._tempId, lesson._tempId, "title", e.target.value)}
                              placeholder="Lesson title"
                              className="flex-1 h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                            />
                            <button onClick={() => removeLesson(mod._tempId, lesson._tempId)} className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition shrink-0">
                              <X size={14} />
                            </button>
                          </div>
                          <div className="flex gap-2 pl-7">
                            <input
                              type="url"
                              value={lesson.videoUrl}
                              onChange={(e) => updateLesson(mod._tempId, lesson._tempId, "videoUrl", e.target.value)}
                              placeholder="YouTube URL (https://youtube.com/watch?v=...)"
                              className="flex-1 h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                            />
                            <input
                              type="text"
                              value={lesson.duration}
                              onChange={(e) => updateLesson(mod._tempId, lesson._tempId, "duration", e.target.value)}
                              placeholder="Duration (e.g. 12:30)"
                              className="w-36 h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                            />
                          </div>
                        </div>
                      ))}
                      <button onClick={() => addLesson(mod._tempId)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition">
                        <Plus size={14} /> Add Lesson
                      </button>
                    </div>
                  )}

                </div>
              ))}
            </div>

            <button
              onClick={addModule}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-400 hover:bg-white transition"
            >
              <Plus size={17} /> Add Module
            </button>
          </Section>

          {/* REQUIREMENTS */}
          <Section icon={AlertCircle} title="Requirements" description="Update course requirements.">
            <div className="space-y-3">
              {requirements.map((req, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <CheckCircle2 size={17} />
                  </div>
                  <input type="text" value={req}
                    onChange={(e) => setRequirements((prev) => prev.map((item, i) => i === index ? e.target.value : item))}
                    placeholder="Example: Basic computer knowledge"
                    className="h-11 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white" />
                  {requirements.length > 1 && (
                    <button onClick={() => setRequirements((prev) => prev.filter((_, i) => i !== index))}
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500">
                      <X size={17} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => setRequirements((prev) => [...prev, ""])}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900">
              <Plus size={17} /> Add Requirement
            </button>
          </Section>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* THUMBNAIL */}
          <Section icon={ImageIcon} title="Course Thumbnail" description="Recommended size: 1280 × 720">
            <label className="group relative flex min-h-[190px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-slate-400">
              {thumbnailPreview ? (
                <img src={thumbnailPreview} alt="Course preview" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
                    <Upload size={20} />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-700">Upload Thumbnail</p>
                  <p className="mt-1 text-xs text-slate-400">PNG, JPG or WEBP</p>
                </>
              )}
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleThumbnail} className="hidden" />
            </label>
            {thumbnailPreview && (
              <button onClick={() => setFormData((prev) => ({ ...prev, thumbnail: null, thumbnailUrl: "" }))}
                className="mt-3 text-xs font-semibold text-red-500 hover:text-red-600">
                Remove thumbnail
              </button>
            )}
          </Section>
        </div>
      </div>

      {/* BOTTOM ACTIONS */}
      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-end">
        <button onClick={() => navigate("/admin/courses")}
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          Cancel
        </button>
        <button onClick={() => handleSave(null)} disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60">
          <Save size={17} />
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

/* ── helpers ── */
const getYoutubeId = (url) => {
  const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
  return match ? match[1] : "";
};

const Section = ({ icon: Icon, title, description, children }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="mb-6 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
        <Icon size={19} />
      </div>
      <div>
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>
    </div>
    {children}
  </section>
);

const Input = ({ label, name, value, onChange, placeholder, type = "text", required = false, className = "", prefix }) => (
  <div className={className}>
    <label className="mb-2 block text-sm font-semibold text-slate-700">
      {label}{required && <span className="ml-1 text-red-500">*</span>}
    </label>
    <div className="relative">
      {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">{prefix}</span>}
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
        className={`h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white ${prefix ? "pl-8" : ""}`} />
    </div>
  </div>
);

const Select = ({ label, name, value, onChange, options, placeholder }) => (
  <div>
    <label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
    <select name={name} value={value} onChange={onChange}
      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white">
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  </div>
);

export default EditCourse;
