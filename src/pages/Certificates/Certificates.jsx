import { useState, useEffect } from "react";
import { Award, Plus, Search } from "lucide-react";

import CertificateStats from "../../components/certificates/CertificateStats";
import CertificateTabs from "../../components/certificates/CertificateTabs";
import TemplateList from "../../components/certificates/TemplateList";
import CreateTemplateModal from "../../components/certificates/CreateTemplateModal";
import CertificatePreviewModal from "../../components/certificates/CertificatePreviewModal";
import IssuedCertificateTable from "../../components/certificates/IssuedCertificateTable";
import IssueCertificateModal from "../../components/certificates/IssueCertificateModal";
import RevokeCertificateModal from "../../components/certificates/RevokeCertificateModal";

import * as certService from "../../services/certificateService";
import API from "../../utils/axios.js";

export default function Certificates() {
  const [activeTab, setActiveTab] = useState("templates");
  const [search, setSearch] = useState("");

  // Templates
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [templateError, setTemplateError] = useState("");

  // Courses from API
  const [courses, setCourses] = useState([]);

  // Students from API — NO mock data
  const [students, setStudents] = useState([]);

  // Issued Certificates from API — NO mock data
  const [issuedCertificates, setIssuedCertificates] = useState([]);
  const [loadingIssued, setLoadingIssued] = useState(false);
  const [issuedError, setIssuedError] = useState("");

  // Create / Edit Modal
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [saving, setSaving] = useState(false);

  // Preview Modal — used for both template preview and issued cert view
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null); // { template, studentName, courseName, completionDate, certificateId }

  // Issue Modal
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  // Revoke Modal
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [certificateToRevoke, setCertificateToRevoke] = useState(null);

  // ===================================================
  // FETCH TEMPLATES
  // ===================================================
  const fetchTemplates = async () => {
    try {
      setLoadingTemplates(true);
      setTemplateError("");
      const { data } = await certService.getTemplates();
      setTemplates(data.data || []);
    } catch (err) {
      setTemplateError(err?.response?.data?.message || "Failed to load templates.");
    } finally {
      setLoadingTemplates(false);
    }
  };

  // ===================================================
  // FETCH COURSES
  // ===================================================
  const fetchCourses = async () => {
    try {
      const { data } = await API.get("/courses/all");
      const list = data.courses || data.data || data;
      setCourses(Array.isArray(list) ? list : []);
    } catch {
      // non-fatal
    }
  };

  // ===================================================
  // FETCH REAL STUDENTS — uses existing GET /auth/students
  // ===================================================
  const fetchStudents = async () => {
    try {
      const { data } = await API.get("/auth/students");
      setStudents(data.data || []);
    } catch {
      // non-fatal — dropdown will show empty
    }
  };

  // ===================================================
  // FETCH ISSUED CERTIFICATES
  // ===================================================
  const fetchIssuedCertificates = async () => {
    try {
      setLoadingIssued(true);
      setIssuedError("");
      const { data } = await certService.getIssuedCertificates();
      setIssuedCertificates(data.data || []);
    } catch (err) {
      setIssuedError(err?.response?.data?.message || "Failed to load issued certificates.");
    } finally {
      setLoadingIssued(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
    fetchCourses();
    fetchStudents();
    fetchIssuedCertificates();
  }, []);

  // ===================================================
  // RESOLVE COURSE NAME from loaded courses list
  // ===================================================
  const getCourseName = (courseId) => {
    if (!courseId) return "";
    if (typeof courseId === "object") return courseId.title || courseId.name || "";
    const found = courses.find((c) => (c._id || c.id) === courseId);
    return found?.title || found?.name || "";
  };

  // ===================================================
  // TEMPLATE HANDLERS
  // ===================================================
  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setIsTemplateModalOpen(true);
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setIsTemplateModalOpen(true);
  };

  const handleSaveTemplate = async (formData) => {
    try {
      setSaving(true);
      if (editingTemplate) {
        const id = editingTemplate._id || editingTemplate.id;
        const { data } = await certService.updateTemplate(id, formData);
        setTemplates((prev) => prev.map((t) => ((t._id || t.id) === id ? data.data : t)));
      } else {
        const { data } = await certService.createTemplate(formData);
        setTemplates((prev) => [data.data, ...prev]);
      }
      setIsTemplateModalOpen(false);
      setEditingTemplate(null);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save template.");
    } finally {
      setSaving(false);
    }
  };

  // Template preview — uses "Alex Johnson" as dummy student name (design preview only)
  const handlePreview = (template) => {
    setPreviewData({
      template,
      studentName: "Alex Johnson",
      courseName: getCourseName(template.courseId),
      completionDate: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
      certificateId: "PREVIEW",
    });
    setIsPreviewOpen(true);
  };

  const handleDuplicate = async (template) => {
    try {
      const id = template._id || template.id;
      const { data } = await certService.duplicateTemplate(id);
      setTemplates((prev) => [data.data, ...prev]);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to duplicate template.");
    }
  };

  const handleToggleStatus = async (template) => {
    try {
      const id = template._id || template.id;
      const { data } = await certService.toggleTemplateStatus(id);
      setTemplates((prev) => prev.map((t) => ((t._id || t.id) === id ? data.data : t)));
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update status.");
    }
  };

  const handleDelete = async (template) => {
    if (!window.confirm(`Delete "${template.name}"? This cannot be undone.`)) return;
    try {
      const id = template._id || template.id;
      await certService.deleteTemplate(id);
      setTemplates((prev) => prev.filter((t) => (t._id || t.id) !== id));
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete template.");
    }
  };

  // ===================================================
  // ISSUE CERTIFICATE — calls real API
  // ===================================================
  const handleIssueCertificate = async ({ studentId, courseId, templateId, completionDate }) => {
    try {
      await certService.issueCertificate({ studentId, courseId, templateId, completionDate });
      setIsIssueModalOpen(false);
      setActiveTab("issued");
      await fetchIssuedCertificates();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to issue certificate.");
    }
  };

  // ===================================================
  // VIEW ISSUED CERTIFICATE — uses real student data
  // ===================================================
  const handleViewIssuedCertificate = (cert) => {
    // Build a template-like object from the issued cert's copied fields
    const templateObj = {
      title: cert.title,
      subtitle: cert.subtitle,
      description: cert.description,
      issuerName: cert.issuerName,
      signatoryName: cert.signatoryName,
      logo: cert.logo,
      signature: cert.signature,
      background: cert.background,
      qrEnabled: cert.qrEnabled,
      name: cert.name,
    };
    setPreviewData({
      template: templateObj,
      studentName: cert.studentName || "—",
      courseName: getCourseName(cert.courseId),
      completionDate: cert.completionDate
        ? new Date(cert.completionDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
        : cert.issuedAt
        ? new Date(cert.issuedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
        : "—",
      certificateId: cert.certificateId || "—",
    });
    setIsPreviewOpen(true);
  };

  // ===================================================
  // DOWNLOAD — use pdfUrl if available
  // ===================================================
  const handleDownloadIssuedCertificate = (cert) => {
    if (cert.pdfUrl) {
      window.open(cert.pdfUrl, "_blank");
    } else {
      alert("PDF not yet generated for this certificate. Use Print to save as PDF.");
      window.print();
    }
  };

  // ===================================================
  // REVOKE — calls real API
  // ===================================================
  const handleRevokeIssuedCertificate = (cert) => {
    setCertificateToRevoke(cert);
    setIsRevokeModalOpen(true);
  };

  const handleConfirmRevoke = async ({ certificate, reason }) => {
    try {
      const id = certificate._id || certificate.id;
      await certService.revokeCertificate(id, reason);
      setIsRevokeModalOpen(false);
      setCertificateToRevoke(null);
      await fetchIssuedCertificates();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to revoke certificate.");
    }
  };

  const closeTemplateModal = () => {
    setIsTemplateModalOpen(false);
    setEditingTemplate(null);
  };

  const closePreviewModal = () => {
    setIsPreviewOpen(false);
    setPreviewData(null);
  };

  const closeRevokeModal = () => {
    setIsRevokeModalOpen(false);
    setCertificateToRevoke(null);
  };

  // Derived stats from real data
  const totalTemplates = templates.length;
  const activeTemplates = templates.filter((t) => t.active).length;
  const totalIssued = issuedCertificates.length;
  const totalValid = issuedCertificates.filter((c) => c.status === "valid").length;

  return (
    <>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Certificates</h1>
            <p className="mt-1 text-sm text-slate-500">
              Create and manage course completion certificates.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setIsIssueModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-2.5 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50"
            >
              <Award size={17} />
              Issue Certificate
            </button>

            <button
              type="button"
              onClick={handleCreateTemplate}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <Plus size={17} />
              Create Template
            </button>
          </div>
        </div>

        {/* STATS */}
        <CertificateStats
          totalTemplates={totalTemplates}
          activeTemplates={activeTemplates}
          totalIssued={totalIssued}
          totalValid={totalValid}
        />

        {/* SEARCH */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative max-w-lg">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search certificates, students or certificate ID..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        {/* TABS */}
        <CertificateTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* TEMPLATES TAB */}
        {activeTab === "templates" && (
          <>
            {loadingTemplates ? (
              <div className="py-16 text-center text-sm text-slate-400">Loading templates...</div>
            ) : templateError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
                {templateError}
                <button onClick={fetchTemplates} className="ml-3 underline hover:no-underline">
                  Retry
                </button>
              </div>
            ) : (
              <TemplateList
                templates={templates}
                search={search}
                courses={courses}
                onPreview={handlePreview}
                onEdit={handleEdit}
                onDuplicate={handleDuplicate}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
              />
            )}
          </>
        )}

        {/* ISSUED TAB */}
        {activeTab === "issued" && (
          <IssuedCertificateTable
            certificates={issuedCertificates}
            loading={loadingIssued}
            error={issuedError}
            courses={courses}
            onView={handleViewIssuedCertificate}
            onDownload={handleDownloadIssuedCertificate}
            onRevoke={handleRevokeIssuedCertificate}
          />
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      <CreateTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={closeTemplateModal}
        onSave={handleSaveTemplate}
        editingTemplate={editingTemplate}
        courses={courses}
        saving={saving}
      />

      {/* PREVIEW MODAL — works for both template preview and issued cert view */}
      {previewData && (
        <CertificatePreviewModal
          isOpen={isPreviewOpen}
          onClose={closePreviewModal}
          template={previewData.template}
          studentName={previewData.studentName}
          courseName={previewData.courseName}
          completionDate={previewData.completionDate}
          certificateId={previewData.certificateId}
        />
      )}

      {/* ISSUE MODAL */}
      <IssueCertificateModal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        onIssue={handleIssueCertificate}
        students={students}
        templates={templates}
      />

      {/* REVOKE MODAL */}
      <RevokeCertificateModal
        isOpen={isRevokeModalOpen}
        onClose={closeRevokeModal}
        certificate={certificateToRevoke}
        onConfirm={handleConfirmRevoke}
      />
    </>
  );
}
