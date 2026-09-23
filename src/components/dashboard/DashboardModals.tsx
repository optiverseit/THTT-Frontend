/**
 * DashboardModals.tsx
 * ────────────────────
 * Reusable modal dialogs for the Dashboard page:
 *
 * 1. UpdateDetailsModal
 *    Triggered by "UPDATE DETAILS" (account verification card) and
 *    the camera badge on the welcome banner. Allows updating name,
 *    email, and phone. Shows a success state before auto-closing.
 *
 * 2. BookingDetailsModal
 *    Triggered by "VIEW" on the Booking Card and "View Details" on
 *    Booking tab rows. Shows full trip details: destination, travelers,
 *    dates, special instructions, and a close button.
 *
 * Both modals use a backdrop blur overlay and scale-in animation.
 * Pressing Escape or clicking the × button closes the modal.
 */

import React, { useState, useEffect } from "react";
import { X, ShieldCheck, Check, Luggage, MapPin, Calendar, Users } from "lucide-react";

// ─── UPDATE DETAILS MODAL ─────────────────────────────────────────────────────

interface UpdateDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    name: string;
    email: string;
    phone: string;
    gender?: string;
    nationality?: string;
    address?: string;
    emergencyContact?: string;
    avatar?: string;
  };
  onSave: (data: {
    name: string;
    email: string;
    phone: string;
    gender?: string;
    nationality?: string;
    address?: string;
    emergencyContact?: string;
    avatar?: string;
  }) => void;
}

export const UpdateDetailsModal: React.FC<UpdateDetailsModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
}) => {
  const [form, setForm] = useState({
    name: initialData.name || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    gender: initialData.gender || "Male",
    nationality: initialData.nationality || "Nepali",
    address: initialData.address || "",
    emergencyContact: initialData.emergencyContact || "",
  });
  const [saved, setSaved] = useState(false);

  // Sync if parent passes fresh initialData after mount
  useEffect(() => {
    if (isOpen) {
      setForm({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        gender: initialData.gender || "Male",
        nationality: initialData.nationality || "Nepali",
        address: initialData.address || "",
        emergencyContact: initialData.emergencyContact || "",
      });
    }
  }, [isOpen, initialData]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1300);
  };

  return (
    <div
      id="update-details-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="update-details-modal-title"
      className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        id="update-details-modal"
        className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-2xl border border-slate-100 relative"
      >
        {/* Close button */}
        <button
          type="button"
          id="update-details-close-btn"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 pr-8">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#8B2CFF] flex items-center justify-center shrink-0">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h3 id="update-details-modal-title" className="text-base font-black text-slate-900">
              Update Account Details
            </h3>
            <p className="text-xs text-slate-500">Verify traveler information for Himalayan permits</p>
          </div>
        </div>

        {/* Success state */}
        {saved ? (
          <div className="py-10 text-center space-y-2.5">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <Check size={24} className="stroke-[3]" />
            </div>
            <h4 className="text-sm font-black text-slate-900">Details Saved Successfully!</h4>
            <p className="text-xs text-slate-500">Your profile has been updated.</p>
          </div>
        ) : (
          <form id="update-details-form" onSubmit={handleSubmit} className="space-y-3.5 pt-4">
            <div>
              <label htmlFor="modal-name" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                id="modal-name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF2A75]/30 focus:border-[#FF2A75] text-xs font-semibold text-slate-900 transition"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="modal-gender" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Gender
                </label>
                <select
                  id="modal-gender"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF2A75]/30 focus:border-[#FF2A75] text-xs font-semibold text-slate-900 bg-white transition"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label htmlFor="modal-nationality" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Nationality
                </label>
                <input
                  id="modal-nationality"
                  type="text"
                  value={form.nationality}
                  onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF2A75]/30 focus:border-[#FF2A75] text-xs font-semibold text-slate-900 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="modal-address" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Residential Address
              </label>
              <input
                id="modal-address"
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF2A75]/30 focus:border-[#FF2A75] text-xs font-semibold text-slate-900 transition"
                required
              />
            </div>

            <div>
              <label htmlFor="modal-email" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                id="modal-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF2A75]/30 focus:border-[#FF2A75] text-xs font-semibold text-slate-900 transition"
                required
              />
            </div>

            <div>
              <label htmlFor="modal-phone" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input
                id="modal-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF2A75]/30 focus:border-[#FF2A75] text-xs font-semibold text-slate-900 transition"
                required
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                id="modal-cancel-btn"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="modal-save-btn"
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#FF2A75] to-[#E91E63] text-white text-xs font-black uppercase tracking-wider shadow-md shadow-pink-500/25 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                Save Updates
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// ─── BOOKING DETAILS MODAL ────────────────────────────────────────────────────

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking?: {
    bookingRef?: string;
    packageName?: string;
    destination?: string;
    dates?: string;
    travelers?: number;
    amount?: string;
    remarks?: string;
  };
}

export const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  isOpen,
  onClose,
  booking = {},
}) => {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const {
    bookingRef = "THTT-2026-8941",
    packageName = "Everest Base Camp Trek & Kala Patthar",
    destination = "Khumbu Region, Nepal",
    dates = "Oct 12, 2026 – Oct 26, 2026 (14 Days)",
    travelers = 2,
    amount = "NPR 285,000",
    remarks = "Bring passport, arrive 30 mins early at Tribhuvan International Airport Domestic Terminal for Lukla flight.",
  } = booking;

  return (
    <div
      id="booking-details-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-details-modal-title"
      className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        id="booking-details-modal"
        className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-7 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto"
      >
        {/* Close */}
        <button
          type="button"
          id="booking-details-close-btn"
          onClick={onClose}
          aria-label="Close booking details"
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 pb-4 border-b border-slate-100 pr-8">
          <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#FF2A75] flex items-center justify-center shrink-0">
            <Luggage size={22} />
          </div>
          <div className="min-w-0">
            <h3 id="booking-details-modal-title" className="text-base font-black text-slate-900 leading-snug">
              {packageName}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-50 text-[#8B2CFF] border border-purple-200 uppercase tracking-wider">
                {bookingRef}
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 uppercase tracking-wider">
                Confirmed & Paid
              </span>
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div className="space-y-3 pt-5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#F8F9FC] rounded-2xl p-3.5 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Destination</span>
              <p className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                <MapPin size={12} className="text-[#FF2A75] shrink-0" />
                {destination}
              </p>
            </div>
            <div className="bg-[#F8F9FC] rounded-2xl p-3.5 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Travelers</span>
              <p className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                <Users size={12} className="text-[#8B2CFF] shrink-0" />
                {travelers} Person{travelers > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="bg-[#F8F9FC] rounded-2xl p-3.5 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Travel Dates</span>
            <p className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
              <Calendar size={12} className="text-[#2563EB] shrink-0" />
              {dates}
            </p>
          </div>

          <div className="bg-[#F8F9FC] rounded-2xl p-3.5 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Amount</span>
            <p className="font-black text-slate-900 text-sm mt-0.5">{amount}</p>
          </div>

          <div className="bg-purple-50/50 rounded-2xl p-3.5 border border-purple-100">
            <span className="text-[10px] font-bold text-[#8B2CFF] uppercase tracking-wider block">Special Instructions & Remarks</span>
            <p className="text-slate-700 font-semibold mt-1 leading-snug">{remarks}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-5 mt-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            id="booking-details-dismiss-btn"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
