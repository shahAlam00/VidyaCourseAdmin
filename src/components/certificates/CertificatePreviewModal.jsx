import {
  X,
  Download,
  Printer,
  QrCode,
  Award,
} from "lucide-react";

const CertificatePreviewModal = ({
  isOpen,
  onClose,
  template,
  studentName = "Alex Johnson",
  courseName,
  completionDate = "September 07, 2026",
  certificateId = "CERT-2026-000123",
}) => {
  if (!isOpen || !template) return null;

  const finalCourseName =
    courseName ||
    template.courseId?.name ||
    template.courseId?.title ||
    "—";

  const logo =
    typeof template.logo === "string"
      ? template.logo
      : template.logo?.preview;

  const signature =
    typeof template.signature === "string"
      ? template.signature
      : template.signature?.preview;

  const background =
    typeof template.background === "string"
      ? template.background
      : template.background?.preview;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    console.log("Download certificate:", template);
    alert("Download functionality will be connected with backend.");
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="flex max-h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-slate-100 shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <Award
                size={19}
                className="text-indigo-600"
              />

              <h2 className="text-lg font-semibold text-slate-900">
                Certificate Preview
              </h2>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Preview how the certificate will appear to students.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Print */}
            <button
              type="button"
              onClick={handlePrint}
              className="hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 sm:flex"
            >
              <Printer size={15} />
              Print
            </button>

            {/* Download */}
            <button
              type="button"
              onClick={handleDownload}
              className="hidden items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-indigo-700 sm:flex"
            >
              <Download size={15} />
              Download
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-5xl">
            {/* Certificate */}
            <div
              id="certificate-preview"
              className="relative aspect-[1.414/1] w-full overflow-hidden bg-white shadow-xl"
            >
              {/* Background */}
              {background ? (
                <img
                  src={background}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-indigo-50" />
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-white/20" />

              {/* Outer Border */}
              <div className="absolute inset-[3%] border-[3px] border-indigo-700/70" />

              {/* Inner Border */}
              <div className="absolute inset-[4%] border border-indigo-300/60" />

              {/* Content */}
              <div className="relative z-10 flex h-full flex-col items-center px-[8%] py-[6%] text-center">
                {/* Logo */}
                <div className="flex h-[14%] min-h-[45px] items-center justify-center">
                  {logo ? (
                    <img
                      src={logo}
                      alt="Organization logo"
                      className="max-h-16 max-w-40 object-contain"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white">
                      <Award size={25} />
                    </div>
                  )}
                </div>

                {/* Certificate Title */}
                <div className="mt-[2%]">
                  <h1 className="text-[clamp(20px,4vw,42px)] font-bold uppercase tracking-[0.12em] text-indigo-900">
                    {template.title ||
                      "Certificate of Completion"}
                  </h1>

                  <div className="mx-auto mt-3 h-0.5 w-24 bg-indigo-600" />
                </div>

                {/* Subtitle */}
                <p className="mt-[3%] text-[clamp(10px,1.5vw,16px)] text-slate-500">
                  {template.subtitle ||
                    "This certificate is proudly presented to"}
                </p>

                {/* Student Name */}
                <h2 className="mt-[1%] border-b border-slate-300 px-8 pb-2 font-serif text-[clamp(20px,3.5vw,38px)] font-semibold italic text-slate-900">
                  {studentName}
                </h2>

                {/* Description */}
                <p className="mt-[3%] max-w-3xl text-[clamp(9px,1.3vw,14px)] leading-relaxed text-slate-600">
                  {template.description ||
                    "For successfully completing the course and demonstrating commitment to learning."}
                </p>

                {/* Course */}
                <div className="mt-[2%]">
                  <p className="text-[clamp(9px,1.2vw,13px)] uppercase tracking-wider text-slate-400">
                    Course
                  </p>

                  <p className="mt-1 text-[clamp(13px,2vw,21px)] font-semibold text-indigo-800">
                    {finalCourseName}
                  </p>
                </div>

                {/* Bottom Section */}
                <div className="mt-auto flex w-full items-end justify-between gap-6">
                  {/* Date */}
                  <div className="min-w-0 flex-1 text-left">
                    <p className="border-b border-slate-400 pb-1 text-[clamp(9px,1.2vw,13px)] text-slate-700">
                      {completionDate}
                    </p>

                    <p className="mt-1 text-[clamp(8px,1vw,11px)] uppercase tracking-wider text-slate-400">
                      Date of Completion
                    </p>
                  </div>

                  {/* Signature */}
                  <div className="flex min-w-0 flex-1 flex-col items-center">
                    <div className="flex h-12 items-end justify-center">
                      {signature ? (
                        <img
                          src={signature}
                          alt="Signature"
                          className="max-h-12 max-w-32 object-contain"
                        />
                      ) : (
                        <div className="font-serif text-lg italic text-slate-400">
                          Signature
                        </div>
                      )}
                    </div>

                    <div className="mt-1 w-full max-w-40 border-t border-slate-400 pt-1">
                      <p className="text-[clamp(8px,1vw,11px)] font-medium text-slate-700">
                        {template.signatoryName ||
                          "Authorized Signatory"}
                      </p>
                    </div>
                  </div>

                  {/* QR */}
                  {template.qrEnabled && (
                    <div className="flex min-w-0 flex-1 flex-col items-end">
                      <div className="flex h-14 w-14 items-center justify-center border border-slate-300 bg-white">
                        <QrCode
                          size={43}
                          className="text-slate-800"
                        />
                      </div>

                      <p className="mt-1 text-right text-[clamp(7px,0.9vw,10px)] text-slate-400">
                        Scan to verify
                      </p>
                    </div>
                  )}
                </div>

                {/* Certificate ID */}
                <div className="absolute bottom-[2.5%] left-0 right-0 text-center">
                  <span className="text-[clamp(7px,0.9vw,10px)] tracking-wide text-slate-400">
                    Certificate ID: {certificateId}
                  </span>
                </div>

                {/* Issuer */}
                <div className="absolute right-[7%] top-[5%]">
                  <p className="text-[clamp(7px,0.9vw,10px)] font-medium uppercase tracking-wider text-slate-500">
                    {template.issuerName || "The Digi Campus"}
                  </p>
                </div>
              </div>
            </div>

            {/* Preview Info */}
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
              <div className="grid gap-3 text-xs sm:grid-cols-3">
                <div>
                  <p className="text-slate-400">
                    Template
                  </p>

                  <p className="mt-1 font-medium text-slate-700">
                    {template.name}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">
                    Course
                  </p>

                  <p className="mt-1 font-medium text-slate-700">
                    {finalCourseName}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">
                    Verification
                  </p>

                  <p className="mt-1 font-medium text-slate-700">
                    {template.qrEnabled
                      ? "QR Enabled"
                      : "QR Disabled"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Footer */}
        <div className="flex shrink-0 gap-2 border-t border-slate-200 bg-white p-4 sm:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-medium text-slate-600"
          >
            <Printer size={15} />
            Print
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2.5 text-xs font-medium text-white"
          >
            <Download size={15} />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificatePreviewModal;