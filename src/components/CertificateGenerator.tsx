import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type Props = {
  username: string;
  courseName?: string;
  dateStr?: string;
  issuerName?: string;
  logoSrc?: string; // optional logo URL
  sealSrc?: string; // optional seal URL
  aliasName?: string;
};

export default function CertificateGenerator({
  username,
  courseName = "Certificate of Completion",
  dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
  issuerName = "Your Organization",
  logoSrc,
  sealSrc,
  aliasName
}: Props) {
  const certificateRef = useRef<HTMLDivElement | null>(null);

  const downloadPDF = async () => {
    if (!certificateRef.current) return;

    const element = certificateRef.current;
    const originalBackground = element.style.backgroundColor;
    element.style.backgroundColor = "#ffffff";

    const scale = 2;

    try {
      const canvas = await html2canvas(element, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgProps = { width: canvas.width, height: canvas.height };
      const imgRatio = imgProps.width / imgProps.height;

      let renderWidth = pageWidth;
      let renderHeight = pageWidth / imgRatio;
      if (renderHeight > pageHeight) {
        renderHeight = pageHeight;
        renderWidth = pageHeight * imgRatio;
      }

      const x = (pageWidth - renderWidth) / 2;
      const y = (pageHeight - renderHeight) / 2;

      pdf.addImage(imgData, "PNG", x, y, renderWidth, renderHeight);
      pdf.setProperties({ title: `${username} - Certificate` });
      pdf.save(`${username.replace(/\s+/g, "_")}_certificate.pdf`);
    } catch (err) {
      console.error("Failed to export PDF", err);
      alert("Could not generate PDF. Check console for details.");
    } finally {
      element.style.backgroundColor = originalBackground;
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <div
        ref={certificateRef}
        className="w-[1000px] h-[710px] p-10 rounded-2xl shadow-2xl bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200"
      >
        <div
          className="w-full h-full rounded-xl border-4 border-dashed border-gray-300 p-8 flex flex-col justify-between"
          style={{ backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.0), rgba(255,255,255,0.0))" }}
        >
          <header className="flex flex-col items-center justify-center text-center gap-2">
            {logoSrc ? (
              <img src={logoSrc} alt="logo" className="w-24 h-24 object-contain" />
            ) : (
              <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-100 text-3xl font-bold">
                {issuerName.slice(0, 1)}
              </div>
            )}
            <div>
              <h4 className="text-sm uppercase tracking-widest text-gray-500">Certificate</h4>
              <h2 className="text-2xl font-semibold text-black">{issuerName}</h2>
            </div>
          </header>

          <main className="flex-1 flex flex-col items-center justify-center text-center px-10">
            <h3 className="text-lg text-gray-600 uppercase tracking-wider">This is to certify that</h3>
            <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-black">{username}</h1>
            <h1 className="mt-6 text-xl font-bold text-gray-500">({aliasName})</h1>

            <p className="mt-6 max-w-2xl text-gray-700 text-lg">
              has successfully completed the <span className="font-semibold">{courseName}</span>.
            </p>

            <div className="mt-8 w-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-sm text-gray-500">Date</div>
                <div className="mt-1 text-base font-medium text-black">{dateStr}</div>
              </div>
            </div>
          </main>

          <footer className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <div className="text-xs text-gray-500">Verified By</div>
                <div className="text-sm font-medium text-black">{issuerName}</div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-xs text-gray-500 text-right">
                <div>Signature</div>
                <div className="mt-2 font-medium">______________________</div>
              </div>
            </div>
          </footer>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={downloadPDF}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md shadow"
        >
          Download PDF
        </button>

      </div>

    </div>
  );
}
