/**
 * DashboardPayments.tsx
 * ─────────────────────
 * Content panel shown when the "PAYMENTS" sidebar tab is active.
 * Displays:
 *  - Summary cards: Total Paid, Pending Balance, Payment Verification
 *  - Full transaction history table with invoice IDs, dates, descriptions,
 *    amounts, statuses, and PDF receipt download button.
 *
 * Demo data mirrors the project's payment flow. Replace static data with
 * an API call when the payment endpoint is available.
 */

import React from "react";
import { CreditCard, CheckCircle2, Download, ShieldCheck } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PaymentTransaction {
  id: string;
  invoiceId: string;
  date: string;
  description: string;
  method: string;
  amount: string;
  status: "Verified" | "Processing" | "Refunded";
}

// ─── Demo data ────────────────────────────────────────────────────────────────

const DEMO_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: "tx-1",
    invoiceId: "INV-2026-9042",
    date: "Oct 01, 2026",
    description: "Everest Base Camp Trek Deposit",
    method: "ConnectIPS / Bank Transfer",
    amount: "NPR 150,000",
    status: "Verified",
  },
  {
    id: "tx-2",
    invoiceId: "INV-2026-9043",
    date: "Oct 10, 2026",
    description: "Final Expedition Clearance & National Park Permits",
    method: "Online Card Payment",
    amount: "NPR 135,000",
    status: "Verified",
  },
];

// ─── Status badge helper ───────────────────────────────────────────────────

const txStatusCls: Record<PaymentTransaction["status"], string> = {
  Verified: "bg-emerald-50 text-emerald-600 border-emerald-200",
  Processing: "bg-amber-50 text-amber-600 border-amber-200",
  Refunded: "bg-blue-50 text-blue-600 border-blue-200",
};

// ─── Component ────────────────────────────────────────────────────────────────

const DashboardPayments: React.FC = () => {
  return (
    <section id="dashboard-payments" aria-label="Payments and receipts" className="space-y-6">

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <CreditCard size={24} className="text-[#10B981]" />
            <span>Payments & Receipts</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            View transaction history, tax invoices, and verified payment clearances.
          </p>
        </div>

        <span
          id="payment-cleared-badge"
          className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-black px-4 py-2 rounded-full flex items-center gap-1.5 uppercase tracking-wider self-start sm:self-auto"
        >
          <CheckCircle2 size={15} />
          All Dues Paid
        </span>
      </div>

      {/* Summary cards — 1 col on mobile, 3 on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div id="payment-total-paid" className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Paid
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">NPR 285,000</div>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 block">100% Cleared</span>
        </div>

        <div id="payment-pending-balance" className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Pending Balance
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">NPR 0.00</div>
          <span className="text-[11px] text-slate-400 font-medium mt-1 block">
            No outstanding invoices
          </span>
        </div>

        <div id="payment-verification-status" className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Payment Verification
          </span>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-1 flex items-center gap-1.5">
            <ShieldCheck size={22} />
            <span>Verified</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium mt-1 block">
            Government tax invoice issued
          </span>
        </div>
      </div>

      {/* Transaction history */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100">
          <h3 className="font-black text-sm sm:text-base text-slate-900 uppercase tracking-wider">
            Transaction History
          </h3>
        </div>

        {/* ── Desktop table (sm+) ── */}
        <div className="hidden sm:block overflow-x-auto">
          <table
            id="dashboard-transactions-table"
            className="w-full text-left text-xs"
            aria-label="Payment transaction history"
          >
            <thead className="bg-[#F8F9FC] text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th scope="col" className="px-5 py-4">Invoice #</th>
                <th scope="col" className="px-5 py-4">Date</th>
                <th scope="col" className="px-5 py-4">Description</th>
                <th scope="col" className="px-5 py-4">Payment Method</th>
                <th scope="col" className="px-5 py-4">Amount</th>
                <th scope="col" className="px-5 py-4">Status</th>
                <th scope="col" className="px-5 py-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {DEMO_TRANSACTIONS.map((tx) => (
                <tr
                  key={tx.id}
                  id={`transaction-row-${tx.id}`}
                  className="hover:bg-slate-50/60 transition-colors font-medium"
                >
                  <td className="px-5 py-4 font-black text-slate-900">{tx.invoiceId}</td>
                  <td className="px-5 py-4 text-slate-500 whitespace-nowrap">{tx.date}</td>
                  <td className="px-5 py-4 font-semibold text-slate-800">{tx.description}</td>
                  <td className="px-5 py-4 text-slate-500 whitespace-nowrap">{tx.method}</td>
                  <td className="px-5 py-4 font-black text-slate-900 whitespace-nowrap">{tx.amount}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${txStatusCls[tx.status]}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      id={`download-receipt-${tx.id}`}
                      onClick={() => alert(`Downloading receipt for ${tx.invoiceId}`)}
                      title={`Download receipt for ${tx.invoiceId}`}
                      className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer inline-flex items-center"
                    >
                      <Download size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Mobile cards (< sm) ── */}
        <div className="sm:hidden divide-y divide-slate-100">
          {DEMO_TRANSACTIONS.map((tx) => (
            <div key={tx.id} id={`transaction-card-${tx.id}`} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900">{tx.invoiceId}</span>
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${txStatusCls[tx.status]}`}>
                  {tx.status}
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-700 leading-snug">{tx.description}</p>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 block">{tx.date} · {tx.method}</span>
                  <span className="text-sm font-black text-slate-900">{tx.amount}</span>
                </div>
                <button
                  type="button"
                  id={`download-receipt-mobile-${tx.id}`}
                  onClick={() => alert(`Downloading receipt for ${tx.invoiceId}`)}
                  title={`Download receipt for ${tx.invoiceId}`}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer inline-flex items-center"
                >
                  <Download size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DashboardPayments;
