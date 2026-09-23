/**
 * DashboardDocumentsSection.tsx
 * ──────────────────────────────
 * Attached document display for User Dashboard -> Services -> View Details.
 *
 * List-row design (matching the booking modal document attachments style):
 *  - File icon + title + description in one clean row
 *  - Required / Optional badge on the right
 *  - Two action buttons: [View Document] [Download]
 *  - Full document preview in a Lightbox modal (triggered by View)
 *  - Supports JPG, PNG, JPEG, PDF validated formats
 */

import React, { useState } from "react";
import {
  FileText,
  Download,
  Eye,
  X as XIcon,
  CheckCircle2,
  Loader2,
  File,
} from "lucide-react";
import {
  BookingDocument,
  getRequiredDocumentsForBooking,
  generateDocumentSvgDataUrl,
  downloadSingleDocument,
  FORMAT_BADGE_CONFIG,
  DOCUMENT_STATUS_CONFIG,
} from "./dashboardDocumentUtils";

interface Props {
  booking: {
    id: string;
    serviceType: string;
    submissionNumber: string;
    name: string;
    email?: string;
    nationality?: string;
    passportNo?: string;
    travelDate?: string;
    submittedAt?: string;
  };
  serviceLabel: string;
}

export const DashboardDocumentsSection: React.FC<Props> = ({ booking, serviceLabel }) => {
  const documents = getRequiredDocumentsForBooking(booking);

  const [activeDocForLightbox, setActiveDocForLightbox] = useState<BookingDocument | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  const bookingInfo = {
    name: booking.name,
    submissionNumber: booking.submissionNumber,
    serviceName: serviceLabel,
  };

  const handleDownload = async (doc: BookingDocument) => {
    setDownloadingId(doc.id);
    try {
      await downloadSingleDocument(doc, bookingInfo);
      setDownloadSuccessId(doc.id);
      setTimeout(() => setDownloadSuccessId(null), 2500);
    } catch (err) {
      console.error("Failed to download attached document:", err);
    } finally {
      setDownloadingId(null);
    }
  };

  if (!documents || documents.length === 0) {
    return null;
  }

  return (
    <div id="dashboard-attached-documents" className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      {/* ── Section Header ── */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <FileText size={14} className="text-[#FF2A75]" />
          Attached Documents
        </h3>
        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
          {documents.length} {documents.length === 1 ? "Document" : "Documents"}
        </span>
      </div>

      {/* ── Document List ── */}
      <div className="divide-y divide-slate-50">
        {documents.map((doc) => {
          const formatCfg = FORMAT_BADGE_CONFIG[doc.fileType] || FORMAT_BADGE_CONFIG.jpg;
          const statusCfg = DOCUMENT_STATUS_CONFIG[doc.status] || DOCUMENT_STATUS_CONFIG.Approved;
          const isDownloading = downloadingId === doc.id;
          const isSuccess = downloadSuccessId === doc.id;

          return (
            <div
              key={doc.id}
              className="flex items-center gap-3 px-5 py-4 hover:bg-slate-50/60 transition-colors"
            >
              {/* File Icon */}
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-pink-50 border border-pink-100">
                <File size={16} className="text-[#FF2A75]" />
              </div>

              {/* Doc Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[13px] font-bold text-[#1E293B] leading-tight">
                    {doc.title}
                  </p>
                  {doc.isRequired ? (
                    <span className="text-[10px] font-bold text-red-500 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded shrink-0">
                      Required
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded shrink-0">
                      Optional
                    </span>
                  )}
                </div>
                {doc.description && (
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {doc.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.5 rounded border uppercase tracking-wider ${formatCfg.bg} ${formatCfg.text} ${formatCfg.border}`}
                  >
                    {formatCfg.label}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{doc.fileSize}</span>
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${statusCfg.badgeCls}`}
                  >
                    {statusCfg.label}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {/* View Button */}
                <button
                  type="button"
                  id={`view-doc-${doc.id}`}
                  onClick={() => setActiveDocForLightbox(doc)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-[11px] font-bold transition-all cursor-pointer shadow-sm hover:border-[#8B2CFF] hover:text-[#8B2CFF]"
                  title="View Document"
                >
                  <Eye size={13} />
                  <span className="hidden sm:inline">View</span>
                </button>

                {/* Download Button */}
                <button
                  type="button"
                  id={`download-attached-doc-${doc.id}`}
                  onClick={() => handleDownload(doc)}
                  disabled={isDownloading}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#8B2CFF] to-[#FF2A75] text-white text-[11px] font-bold transition-all cursor-pointer shadow-sm hover:opacity-90 active:scale-95 disabled:opacity-60"
                  title="Download Document"
                >
                  {isDownloading ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : isSuccess ? (
                    <CheckCircle2 size={13} className="text-emerald-200" />
                  ) : (
                    <Download size={13} />
                  )}
                  <span className="hidden sm:inline">
                    {isDownloading ? "Saving..." : isSuccess ? "Done!" : "Download"}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ════════════════════════════════════════════════════════
          DOCUMENT LIGHTBOX MODAL
         ════════════════════════════════════════════════════════ */}
      {activeDocForLightbox && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveDocForLightbox(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              id="doc-lightbox-close-btn"
              onClick={() => setActiveDocForLightbox(null)}
              className="absolute -top-4 -right-2 z-10 w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer"
            >
              <XIcon size={18} className="text-white" />
            </button>

            {/* Document Title Bar */}
            <div className="w-full mb-3 flex items-center justify-between gap-3 px-1">
              <p className="text-white font-bold text-sm truncate">
                {activeDocForLightbox.title}
              </p>
              <span className="text-white/60 text-xs font-mono shrink-0">
                {activeDocForLightbox.fileSize} &bull; {activeDocForLightbox.fileType.toUpperCase()}
              </span>
            </div>

            {/* Full document image */}
            <img
              src={
                activeDocForLightbox.dataUrl ||
                generateDocumentSvgDataUrl(activeDocForLightbox, bookingInfo)
              }
              alt={activeDocForLightbox.title}
              className="w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl bg-white"
            />

            {/* Lightbox action bar */}
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                id={`doc-lightbox-download-btn-${activeDocForLightbox.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(activeDocForLightbox);
                }}
                disabled={downloadingId === activeDocForLightbox.id}
                className="flex items-center gap-2 px-6 py-2.5 bg-white text-slate-800 rounded-xl text-xs font-bold hover:bg-slate-100 active:scale-95 transition-all cursor-pointer shadow-lg disabled:opacity-75"
              >
                {downloadingId === activeDocForLightbox.id ? (
                  <>
                    <Loader2 size={14} className="animate-spin text-[#8B2CFF]" />
                    <span>Downloading...</span>
                  </>
                ) : downloadSuccessId === activeDocForLightbox.id ? (
                  <>
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span>Document Downloaded!</span>
                  </>
                ) : (
                  <>
                    <Download size={14} />
                    <span>Download ({activeDocForLightbox.fileType.toUpperCase()})</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveDocForLightbox(null)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 text-white rounded-xl text-xs font-bold hover:bg-white/20 transition-all cursor-pointer"
              >
                <XIcon size={14} />
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardDocumentsSection;

