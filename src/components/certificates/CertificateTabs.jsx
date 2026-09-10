import {
  Award,
  FileCheck2,
} from "lucide-react";

const CertificateTabs = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex gap-6 border-b border-slate-200">
      {/* Templates */}
      <button
        type="button"
        onClick={() => onTabChange("templates")}
        className={`relative flex items-center gap-2 pb-3 text-sm font-medium transition ${
          activeTab === "templates"
            ? "text-indigo-600"
            : "text-slate-500 hover:text-slate-800"
        }`}
      >
        <Award size={17} />

        Certificate Templates

        {activeTab === "templates" && (
          <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-indigo-600" />
        )}
      </button>

      {/* Issued Certificates */}
      <button
        type="button"
        onClick={() => onTabChange("issued")}
        className={`relative flex items-center gap-2 pb-3 text-sm font-medium transition ${
          activeTab === "issued"
            ? "text-indigo-600"
            : "text-slate-500 hover:text-slate-800"
        }`}
      >
        <FileCheck2 size={17} />

        Issued Certificates

        {activeTab === "issued" && (
          <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-indigo-600" />
        )}
      </button>
    </div>
  );
};

export default CertificateTabs;