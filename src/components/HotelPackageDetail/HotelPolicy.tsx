import React from "react";
import {
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  RefreshCcw,
  BedDouble,
  AlertCircle,
  CreditCard,
  Baby,
  ClipboardList,
} from "lucide-react";
import HotelPricing from "./HotelPricing";
import { useOutletContext } from "react-router-dom";

interface HotelPolicyContext {
  pkg: any;
}

interface PolicyCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  children: React.ReactNode;
}

const PolicyCard: React.FC<PolicyCardProps> = ({ icon, iconBg, title, children }) => (
  <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-3">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-xl ${iconBg}`}>{icon}</div>
      <h2 className="text-lg sm:text-xl font-black text-[#200B3B]">{title}</h2>
    </div>
    <div className="space-y-2 pt-1 text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
      {children}
    </div>
  </div>
);

const Rule: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-start gap-2">
    <CheckCircle2 size={15} className="text-[#E91E63] mt-0.5 flex-shrink-0" />
    <span>{children}</span>
  </div>
);

const HotelPolicy: React.FC = () => {
  const { pkg } = useOutletContext<HotelPolicyContext>();

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ── LEFT POLICY CARDS (8 cols) ── */}
        <div className="lg:col-span-8 space-y-5">

          {/* 1. Booking Policy */}
          <PolicyCard
            icon={<ShieldCheck size={20} />}
            iconBg="bg-pink-50 text-[#E91E63]"
            title="Reservation & Booking Policy"
          >
            <Rule>Advance booking is recommended at least 24 hours before check-in date.</Rule>
            <Rule>A confirmation deposit of 30% secures your room; remaining balance is settled upon arrival.</Rule>
            <Rule>All bookings are subject to room availability at the time of confirmation.</Rule>
            <Rule>Group bookings of 5+ rooms require a minimum 72-hour advance notice.</Rule>
            <Rule>All major credit/debit cards, bank transfers, and cash payments are accepted.</Rule>
          </PolicyCard>

          {/* 2. Cancellation Policy */}
          <PolicyCard
            icon={<RotateCcw size={20} />}
            iconBg="bg-emerald-50 text-emerald-600"
            title="Cancellation Policy"
          >
            <Rule>Free cancellation with a 100% refund if cancelled at least 48 hours before check-in.</Rule>
            <Rule>Cancellations made between 24–48 hours before check-in incur a 50% charge of the first night.</Rule>
            <Rule>No-show or cancellation within 24 hours of check-in will be charged the full first night's rate.</Rule>
            <Rule>Peak season bookings (Oct–Dec, Apr–May) require 72-hour cancellation notice for full refund.</Rule>
            <Rule>Weather-related or flight cancellation emergencies are accommodated with free date changes.</Rule>
          </PolicyCard>

          {/* 3. Return & Refund Policy */}
          <PolicyCard
            icon={<RefreshCcw size={20} />}
            iconBg="bg-blue-50 text-blue-600"
            title="Return & Refund Policy"
          >
            <Rule>Refunds for eligible cancellations are processed within 5–7 working days to the original payment method.</Rule>
            <Rule>Deposits paid via bank transfer are refunded after deducting applicable bank transfer fees.</Rule>
            <Rule>Partial refunds apply when a guest checks out early after at least one night has been consumed.</Rule>
            <Rule>Non-refundable promotional or discounted rate bookings are clearly indicated at time of reservation.</Rule>
            <Rule>Any dispute regarding refunds should be raised within 30 days of the check-out date.</Rule>
          </PolicyCard>

          {/* 4. Room Assignment Policy */}
          <PolicyCard
            icon={<BedDouble size={20} />}
            iconBg="bg-purple-50 text-purple-600"
            title="Room Assignment Policy"
          >
            <Rule>Room category (Superior, Deluxe, Suite) is assigned based on availability at time of check-in.</Rule>
            <Rule>Specific room numbers or floor preferences are honored subject to availability — not guaranteed.</Rule>
            <Rule>Complimentary room upgrades are offered when the booked category is unavailable.</Rule>
            <Rule>Connecting rooms for families must be requested at time of booking, not upon arrival.</Rule>
            <Rule>Mountain view, pool view, or garden view rooms carry a supplemental rate and are subject to availability.</Rule>
          </PolicyCard>

          {/* 5. Payment Policy */}
          <PolicyCard
            icon={<CreditCard size={20} />}
            iconBg="bg-amber-50 text-amber-600"
            title="Payment Policy"
          >
            <Rule>Accepted payment methods: Visa, MasterCard, American Express, eSewa, Khalti, and cash (NPR/USD).</Rule>
            <Rule>A valid credit card is required as a security deposit at check-in for incidental charges.</Rule>
            <Rule>Foreign currency payments are accepted at the prevailing exchange rate on the day of payment.</Rule>
            <Rule>Invoices and VAT receipts are issued for all corporate and business bookings upon request.</Rule>
            <Rule>Minibar, room service, and spa charges are settled at check-out and are non-refundable.</Rule>
          </PolicyCard>

          {/* 6. No-Show Policy */}
          <PolicyCard
            icon={<AlertCircle size={20} />}
            iconBg="bg-red-50 text-red-500"
            title="No-Show Policy"
          >
            <Rule>A no-show will result in automatic cancellation of the entire remaining reservation.</Rule>
            <Rule>The full first night's room rate will be charged in the event of a no-show.</Rule>
            <Rule>If you are delayed, please contact the hotel front desk or Trip Himalaya before your expected check-in.</Rule>
            <Rule>Late arrivals after midnight must be pre-notified; otherwise the booking may be released after 11:00 PM.</Rule>
          </PolicyCard>

          {/* 7. Child & Extra Bed Policy */}
          <PolicyCard
            icon={<Baby size={20} />}
            iconBg="bg-sky-50 text-sky-600"
            title="Child & Extra Bed Policy"
          >
            <Rule>Children below 5 years old stay free of charge when sharing a room with parents (no extra bed).</Rule>
            <Rule>Children aged 6–12 are charged 50% of the adult room rate when an extra bed is required.</Rule>
            <Rule>Maximum one extra bed per room; extra bed charge is NPR 1,500–3,000 per night depending on category.</Rule>
            <Rule>Cribs/cots are available on request at no extra charge, subject to room size limitations.</Rule>
          </PolicyCard>

          {/* 8. Restrictions & Notes */}
          <PolicyCard
            icon={<ClipboardList size={20} />}
            iconBg="bg-gray-100 text-gray-600"
            title="Restrictions & Notes"
          >
            <Rule>Valid government-issued photo ID or passport is required at check-in for all guests.</Rule>
            <Rule>Check-in from 2:00 PM; check-out by 12:00 PM (noon). Early/late arrangements require prior request.</Rule>
            <Rule>Strictly no smoking inside rooms or indoor common areas — designated outdoor smoking zones available.</Rule>
            <Rule>Pets are not permitted unless prior written approval has been obtained from hotel management.</Rule>
            <Rule>Quiet hours observed between 10:00 PM and 7:00 AM for the comfort of all guests.</Rule>
            <Rule>Outside food and beverages are not permitted in hotel restaurants and dining areas.</Rule>
            <Rule>The hotel is not liable for loss of valuables not deposited in the in-room safe or front desk locker.</Rule>
          </PolicyCard>

        </div>

        {/* ── RIGHT STICKY PRICING SIDEBAR (4 cols) ── */}
        <div className="lg:col-span-4 lg:sticky lg:top-[135px] self-start space-y-6">
          <HotelPricing pkg={pkg} />
        </div>
      </div>
    </div>
  );
};

export default HotelPolicy;
