import React, { useState } from "react";
import { Plus, Trash2, GripVertical, Save, RotateCcw, FileText, CheckCircle2, AlertCircle, Edit3, X, Check } from "lucide-react";
import { InsuranceDocumentField, DEFAULT_DOCUMENT_CONFIG } from "./insuranceDocumentConfig";

interface InsuranceDocumentAdminProps {
  /** Current list of document fields */
  documents: InsuranceDocumentField[];
  /** Called whenever the admin saves changes */
  onChange: (updated: InsuranceDocumentField[]) => void;
}

const generateId = () => `doc_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

const InsuranceDocumentAdmin: React.FC<InsuranceDocumentAdminProps> = ({ documents, onChange }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<InsuranceDocumentField | null>(null);
  const [saved, setSaved] = useState(false);

  const startEdit = (doc: InsuranceDocumentField) => {
    setEditingId(doc.id);
    setDraft({ ...doc });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft(null);
  };

  const commitEdit = () => {
    if (!draft) return;
    onChange(documents.map((d) => (d.id === draft.id ? draft : d)));
    setEditingId(null);
    setDraft(null);
    flash();
  };

  const addDocument = () => {
    const newDoc: InsuranceDocumentField = {
      id: generateId(),
      title: "New Document",
      subtitle: "Description of this document",
      required: true,
      accept: ".jpg,.jpeg,.png,.pdf",
    };
    const updated = [...documents, newDoc];
    onChange(updated);
    startEdit(newDoc);
  };

  const removeDocument = (id: string) => {
    onChange(documents.filter((d) => d.id !== id));
    flash();
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...documents];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
    flash();
  };

  const moveDown = (index: number) => {
    if (index === documents.length - 1) return;
    const next = [...documents];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
    flash();
  };

  const resetToDefault = () => {
    onChange([...DEFAULT_DOCUMENT_CONFIG]);
    setEditingId(null);
    setDraft(null);
    flash();
  };

  const flash = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-6 py-4 bg-gradient-to-r from-[#200B3B] to-[#3B145C] text-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
            <FileText size={16} />
          </div>
          <div>
            <h3 className="text-sm font-black">Document Requirements</h3>
            <p className="text-[10px] text-purple-300">Manage required uploads for insurance applications</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-900/30 px-2.5 py-1 rounded-full">
              <CheckCircle2 size={11} /> Saved
            </span>
          )}
          <button
            type="button"
            onClick={resetToDefault}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-all cursor-pointer"
          >
            <RotateCcw size={12} />
            Reset
          </button>
          <button
            type="button"
            onClick={addDocument}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E91E63] hover:bg-pink-600 text-white text-[11px] font-bold transition-all cursor-pointer shadow-sm"
          >
            <Plus size={13} />
            Add Document
          </button>
        </div>
      </div>

      {/* Document List */}
      <div className="divide-y divide-gray-100">
        {documents.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">
            <FileText size={32} className="mx-auto mb-2 opacity-30" />
            <p className="font-medium">No documents configured.</p>
            <p className="text-xs mt-1">Click "Add Document" to get started.</p>
          </div>
        )}

        {documents.map((doc, index) => (
          <div key={doc.id} className="group">
            {editingId === doc.id && draft ? (
              /* ── EDIT ROW ── */
              <div className="p-4 bg-purple-50/60 border-l-4 border-[#E91E63] space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Document Title <span className="text-[#E91E63]">*</span></label>
                    <input
                      type="text"
                      value={draft.title}
                      onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-[#200B3B] focus:outline-none focus:border-[#E91E63] focus:ring-2 focus:ring-pink-100 transition-all bg-white"
                      placeholder="e.g. Passport / NID"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Accepted File Types</label>
                    <input
                      type="text"
                      value={draft.accept}
                      onChange={(e) => setDraft({ ...draft, accept: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-[#200B3B] focus:outline-none focus:border-[#E91E63] focus:ring-2 focus:ring-pink-100 transition-all bg-white"
                      placeholder=".jpg,.jpeg,.png,.pdf"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Subtitle / Hint</label>
                  <input
                    type="text"
                    value={draft.subtitle}
                    onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-[#200B3B] focus:outline-none focus:border-[#E91E63] focus:ring-2 focus:ring-pink-100 transition-all bg-white"
                    placeholder="Brief description shown under the title"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <div
                      onClick={() => setDraft({ ...draft, required: !draft.required })}
                      className={`w-10 h-5 rounded-full transition-all cursor-pointer relative ${draft.required ? "bg-[#E91E63]" : "bg-gray-200"}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${draft.required ? "left-5" : "left-0.5"}`} />
                    </div>
                    <span className="text-xs font-bold text-gray-700">
                      {draft.required ? <span className="text-[#E91E63]">Required</span> : <span className="text-gray-400">Optional</span>}
                    </span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={cancelEdit} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-[11px] font-bold transition-all cursor-pointer">
                      <X size={11} /> Cancel
                    </button>
                    <button type="button" onClick={commitEdit} disabled={!draft.title.trim()} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#E91E63] hover:bg-pink-600 text-white text-[11px] font-bold transition-all cursor-pointer disabled:opacity-40">
                      <Check size={11} /> Save
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* ── VIEW ROW ── */
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/60 transition-colors">
                {/* Drag handle / order controls */}
                <div className="flex flex-col gap-0.5 flex-shrink-0">
                  <button type="button" onClick={() => moveUp(index)} disabled={index === 0} className="text-gray-300 hover:text-gray-500 disabled:opacity-20 cursor-pointer transition-colors leading-none text-[10px] font-black">▲</button>
                  <GripVertical size={14} className="text-gray-300" />
                  <button type="button" onClick={() => moveDown(index)} disabled={index === documents.length - 1} className="text-gray-300 hover:text-gray-500 disabled:opacity-20 cursor-pointer transition-colors leading-none text-[10px] font-black">▼</button>
                </div>

                {/* Icon */}
                <div className="w-8 h-8 rounded-xl bg-pink-50 text-[#E91E63] flex items-center justify-center flex-shrink-0">
                  <FileText size={15} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs font-bold text-[#200B3B] truncate">{doc.title}</p>
                    {doc.required ? (
                      <span className="text-[9px] font-black text-[#E91E63] bg-pink-50 px-1.5 py-0.5 rounded-full border border-pink-100">Required</span>
                    ) : (
                      <span className="text-[9px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">Optional</span>
                    )}
                    <span className="text-[9px] text-gray-400 font-mono bg-gray-100 px-1.5 py-0.5 rounded-full hidden sm:inline">{doc.accept}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 truncate mt-0.5">{doc.subtitle}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => startEdit(doc)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-[#3B145C] text-[10px] font-bold transition-colors cursor-pointer"
                  >
                    <Edit3 size={11} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => removeDocument(doc.id)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 text-[10px] font-bold transition-colors cursor-pointer"
                  >
                    <Trash2 size={11} /> Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer info */}
      <div className="px-5 py-3 bg-amber-50/60 border-t border-amber-100 flex items-start gap-2">
        <AlertCircle size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-[10px] text-amber-700 leading-relaxed">
          <strong>Admin Note:</strong> Changes here reflect immediately on the insurance application modal for all users.
          When your API is ready, connect <code className="bg-amber-100 px-1 rounded">DEFAULT_DOCUMENT_CONFIG</code> in{" "}
          <code className="bg-amber-100 px-1 rounded">insuranceDocumentConfig.ts</code> to your backend endpoint.
        </p>
      </div>
    </div>
  );
};

export default InsuranceDocumentAdmin;
