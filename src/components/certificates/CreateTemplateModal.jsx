import { useEffect, useRef, useState } from "react";
import {
  X,
  Upload,
  Image as ImageIcon,
  FileSignature,
  Palette,
  QrCode,
  Check,
} from "lucide-react";

const defaultForm = {
  name: "",
  courseId: "",
  title: "Certificate of Completion",
  subtitle: "This certificate is proudly presented to",
  description:
    "For successfully completing the course and demonstrating commitment to learning.",
  issuerName: "",
  signatoryName: "",
  qrEnabled: true,
  active: true,
  logo: null,
  signature: null,
  background: null,
};

const CreateTemplateModal = ({
  isOpen,
  onClose,
  onSave,
  editingTemplate = null,
  courses = [],
  saving = false,
}) => {
  const [form, setForm] = useState(defaultForm);

  const logoInputRef = useRef(null);
  const signatureInputRef = useRef(null);
  const backgroundInputRef = useRef(null);

  const isEditMode = Boolean(editingTemplate);

  useEffect(() => {
    if (!isOpen) return;

    if (editingTemplate) {
      setForm({
        name: editingTemplate.name || "",
        courseId:
          editingTemplate.courseId?._id ||
          (typeof editingTemplate.courseId === "string" ? editingTemplate.courseId : "") ||
          "",
        title:
          editingTemplate.title || "Certificate of Completion",
        subtitle:
          editingTemplate.subtitle ||
          "This certificate is proudly presented to",
        description:
          editingTemplate.description ||
          "For successfully completing the course and demonstrating commitment to learning.",
        issuerName: editingTemplate.issuerName || "",
        signatoryName: editingTemplate.signatoryName || "",
        qrEnabled:
          editingTemplate.qrEnabled !== undefined
            ? editingTemplate.qrEnabled
            : true,
        active:
          editingTemplate.active !== undefined
            ? editingTemplate.active
            : true,
        logo: editingTemplate.logo || null,
        signature: editingTemplate.signature || null,
        background: editingTemplate.background || null,
      });
    } else {
      setForm(defaultForm);
    }
  }, [isOpen, editingTemplate]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggle = (field) => {
    setForm((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload PNG, JPG or WEBP image.");
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("File size must be less than 5MB.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setForm((prev) => ({
      ...prev,
      [field]: {
        file,
        preview: previewUrl,
      },
    }));
  };

  const removeFile = (field) => {
    setForm((prev) => ({
      ...prev,
      [field]: null,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter template name.");
      return;
    }

    if (!form.courseId) {
      alert("Please select a course.");
      return;
    }

    if (!form.title.trim()) {
      alert("Please enter certificate title.");
      return;
    }

    if (!form.issuerName.trim()) {
      alert("Please enter issuer name.");
      return;
    }

    if (!form.signatoryName.trim()) {
      alert("Please enter signatory name.");
      return;
    }

    const serializeFile = (field) => {
      if (!field) return null;
      if (typeof field === "string") return field;
      // blob preview — backend can't use it, send null until file upload API exists
      return null;
    };

    const payload = {
      ...form,
      logo: serializeFile(form.logo),
      signature: serializeFile(form.signature),
      background: serializeFile(form.background),
    };
    onSave?.(payload);
  };

  const getPreview = (file) => {
    if (!file) return null;

    if (typeof file === "string") return file;

    return file.preview;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {isEditMode
                ? "Edit Certificate Template"
                : "Create Certificate Template"}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {isEditMode
                ? "Update your certificate template details."
                : "Create a reusable certificate template for your courses."}
            </p>
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
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto px-6 py-6"
        >
          <div className="space-y-7">
            {/* Basic Information */}
            <section>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Basic Information
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Configure the basic details of your certificate.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Template Name */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    Template Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Web Development Certificate"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                {/* Course */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    Course *
                  </label>

                  {courses.length > 0 ? (
                    <select
                      name="courseId"
                      value={form.courseId}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    >
                      <option value="">Select course</option>

                      {courses.map((course) => (
                        <option
                          key={course._id || course.id}
                          value={course._id || course.id}
                        >
                          {course.title || course.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name="courseId"
                      value={form.courseId}
                      onChange={handleChange}
                      placeholder="No courses available"
                      disabled
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none text-slate-400"
                    />
                  )}
                </div>
              </div>
            </section>

            {/* Certificate Content */}
            <section>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Certificate Content
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Define the text that will appear on the certificate.
                </p>
              </div>

              <div className="space-y-4">
                {/* Certificate Title */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    Certificate Title *
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Certificate of Completion"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    Subtitle
                  </label>

                  <input
                    type="text"
                    name="subtitle"
                    value={form.subtitle}
                    onChange={handleChange}
                    placeholder="This certificate is proudly presented to"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Certificate description..."
                    className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>
            </section>

            {/* Issuer Information */}
            <section>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Issuer Information
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Information about the organization and certificate
                  signatory.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    Issuer Name *
                  </label>

                  <input
                    type="text"
                    name="issuerName"
                    value={form.issuerName}
                    onChange={handleChange}
                    placeholder="The Digi Campus"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    Signatory Name *
                  </label>

                  <input
                    type="text"
                    name="signatoryName"
                    value={form.signatoryName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>
            </section>

            {/* Assets */}
            <section>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Certificate Assets
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Upload the logo, signature and certificate background.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {/* Logo */}
                <UploadBox
                  title="Logo"
                  description="PNG, JPG or WEBP"
                  icon={ImageIcon}
                  inputRef={logoInputRef}
                  preview={getPreview(form.logo)}
                  onClick={() => logoInputRef.current?.click()}
                  onChange={(e) =>
                    handleFileChange(e, "logo")
                  }
                  onRemove={() => removeFile("logo")}
                />

                {/* Signature */}
                <UploadBox
                  title="Signature"
                  description="PNG, JPG or WEBP"
                  icon={FileSignature}
                  inputRef={signatureInputRef}
                  preview={getPreview(form.signature)}
                  onClick={() =>
                    signatureInputRef.current?.click()
                  }
                  onChange={(e) =>
                    handleFileChange(e, "signature")
                  }
                  onRemove={() => removeFile("signature")}
                />

                {/* Background */}
                <UploadBox
                  title="Background"
                  description="PNG, JPG or WEBP"
                  icon={Palette}
                  inputRef={backgroundInputRef}
                  preview={getPreview(form.background)}
                  onClick={() =>
                    backgroundInputRef.current?.click()
                  }
                  onChange={(e) =>
                    handleFileChange(e, "background")
                  }
                  onRemove={() => removeFile("background")}
                />
              </div>
            </section>

            {/* Settings */}
            <section>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Certificate Settings
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Configure verification and template status.
                </p>
              </div>

              <div className="space-y-3">
                {/* QR Verification */}
                <ToggleRow
                  icon={QrCode}
                  title="QR Verification"
                  description="Add a QR code to allow students and employers to verify the certificate."
                  enabled={form.qrEnabled}
                  onClick={() => handleToggle("qrEnabled")}
                />

                {/* Active */}
                <ToggleRow
                  icon={Check}
                  title="Active Template"
                  description="Allow this template to be used when certificates are issued."
                  enabled={form.active}
                  onClick={() => handleToggle("active")}
                />
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {saving
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update Template"
                : "Create Template"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ---------------- Upload Box ---------------- */

const UploadBox = ({
  title,
  description,
  icon: Icon,
  inputRef,
  preview,
  onClick,
  onChange,
  onRemove,
}) => {
  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={onChange}
        className="hidden"
      />

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        {preview ? (
          <div className="relative">
            <div className="flex h-32 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white">
              <img
                src={preview}
                alt={title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={onClick}
                className="flex-1 rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Change
              </button>

              <button
                type="button"
                onClick={onRemove}
                className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={onClick}
            className="flex h-40 w-full flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white transition hover:border-indigo-400 hover:bg-indigo-50/30"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Icon size={19} />
            </div>

            <span className="mt-3 text-xs font-semibold text-slate-700">
              Upload {title}
            </span>

            <span className="mt-1 text-[11px] text-slate-400">
              {description}
            </span>

            <span className="mt-2 flex items-center gap-1 text-[11px] font-medium text-indigo-600">
              <Upload size={13} />
              Choose file
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

/* ---------------- Toggle Row ---------------- */

const ToggleRow = ({
  icon: Icon,
  title,
  description,
  enabled,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:bg-slate-50"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <Icon size={17} />
        </div>

        <div>
          <p className="text-sm font-medium text-slate-800">
            {title}
          </p>

          <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <div
        className={`relative ml-4 h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-indigo-600" : "bg-slate-300"
        }`}
      >
        <div
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </div>
    </button>
  );
};

export default CreateTemplateModal;