import { Award, FileCheck2 } from "lucide-react";

const CertificateStats = ({
  totalTemplates = 0,
  activeTemplates = 0,
  totalIssued = 0,
  totalValid = 0,
}) => {
  const stats = [
    { label: "Templates", value: totalTemplates, icon: Award },
    { label: "Active", value: activeTemplates, icon: Award },
    { label: "Issued", value: totalIssued, icon: FileCheck2 },
    { label: "Valid", value: totalValid, icon: FileCheck2 },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{stat.label}</p>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Icon size={18} />
              </div>
            </div>
            <p className="mt-3 text-2xl font-semibold text-slate-900">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
};

export default CertificateStats;
