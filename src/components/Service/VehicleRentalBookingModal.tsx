import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Calendar,
  Users,
  Phone,
  Mail,
  User,
  MapPin,
  CheckCircle2,
  BadgeCheck,
  AlertCircle,
  Copy,
  Check,
  MessageCircle,
  Printer,
  Globe,
  MessageSquare,
  UploadCloud,
  FileText,
  Trash2,
  Clock,
  Send,
} from "lucide-react";
import THTTLogo from "../../assets/images/THTTLogo.png";
import { COUNTRY_CODES, isoToFlag } from "../../utils/countrycodes";
import { PaymentMethod } from "../reusable/PaymentMethod";
import { useGlobalCurrency, displayPrice } from "../../context/CurrencyContext";
import { createBooking, initiatePayment } from "../../api/BackendApi";

export interface VehicleBookingItem {
  id?: string;
  title: string;
  duration?: string;
  location?: string;
  price?: string;
  image?: string;
  type?: string;
  category?: string;
  vehicleRental?: {
    tripType?: string;
    totalSeats?: number;
    availableSeats?: number;
    fromLocation?: string;
    destination?: string;
    vehicleType?: string;
    fuelType?: string;
    availableFrom?: string;
    availableTo?: string;
    basePrice?: number;
  };
  bagsPerPerson?: string;
  luggageWeightMax?: string;
}

export interface VehicleRentalBookingModalProps {
  item: VehicleBookingItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VehicleRentalBookingModal: React.FC<VehicleRentalBookingModalProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  const { selectedCurrency, nprPerOneDollar, nprPerOneINR } = useGlobalCurrency();

  const [currentStep, setCurrentStep] = useState<"form" | "payment" | "submitted">("form");
  const [submissionId, setSubmissionId] = useState("");
  const [submittedAt, setSubmittedAt] = useState("");
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"paid" | "unpaid">("unpaid");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"esewa" | "pay_later">("esewa");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const vInfo = item?.vehicleRental;
  const tripType = vInfo?.tripType || "One Way";
  const isPrivateTrip = tripType.toLowerCase() === "private";
  const totalSeats = Number(vInfo?.totalSeats) || 10;
  const availableSeats = Number(vInfo?.availableSeats) || 7;
  const maxSeatsSelectable = isPrivateTrip ? totalSeats : Math.max(1, availableSeats);

  const [passengersCount, setPassengersCount] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    nationality: "",
    email: "",
    phoneCode: "+977",
    phone: "",
    travelDateFrom: vInfo?.availableFrom || "",
    travelDateTo: vInfo?.availableTo || "",
    travelDate: vInfo?.availableFrom || "",
    pickupAddress: "",
    specialNotes: "",
    termsAgreed: false,
  });

  // Reset and sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep("form");
      setBookingId(null);

      setSubmissionId("");
      setSubmittedAt("");
      setCopied(false);
      setPaymentStatus("unpaid");
      setSelectedPaymentMethod("esewa");
      setIsProcessingPayment(false);
      setIsSubmitting(false);
      setFormError("");
      setUploadedFiles([]);
      setPassengersCount(1);
      setFormData({
        fullName: "",
        nationality: "",
        email: "",
        phoneCode: "+977",
        phone: "",
        travelDateFrom: vInfo?.availableFrom || "",
        travelDateTo: vInfo?.availableTo || "",
        travelDate: vInfo?.availableFrom || "",
        pickupAddress: "",
        specialNotes: "",
        termsAgreed: false,
      });
    }
  }, [isOpen, item?.id, vInfo?.availableFrom, vInfo?.availableTo]);

  if (!isOpen || !item) return null;

  const basePriceNum = Number(vInfo?.basePrice || item.price || 0);

  // If private trip: flat rate regardless of passengers
  // If sharing/per seat: price per person * passenger count
  const totalNpr = isPrivateTrip ? basePriceNum : basePriceNum * passengersCount;

  const unitPriceFormatted = displayPrice(
    basePriceNum,
    selectedCurrency,
    nprPerOneDollar,
    nprPerOneINR
  );

  const totalPriceFormatted = displayPrice(
    totalNpr,
    selectedCurrency,
    nprPerOneDollar,
    nprPerOneINR
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      setFormError("Please enter your full name.");
      return;
    }
    if (!formData.nationality.trim()) {
      setFormError("Please enter your nationality.");
      return;
    }
    if (!formData.email.trim()) {
      setFormError("Please enter your email address.");
      return;
    }
    if (!formData.phone.trim()) {
      setFormError("Please enter your phone/WhatsApp number.");
      return;
    }

    const effectiveStartDate =
      formData.travelDateFrom || formData.travelDate;

    if (!effectiveStartDate) {
      setFormError("Please select your travel date (From).");
      return;
    }

    if (!formData.termsAgreed) {
      setFormError(
        "Please accept the terms and conditions to proceed."
      );
      return;
    }

    if (!item.id) {
      setFormError("Vehicle information is missing.");
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    const now = new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    try {
      const bookingData = {
        booking_type: "VEHICLE" as const,
        vehicle_id: Number(item.id),
        number_of_people: passengersCount,
        start_date: effectiveStartDate,
        end_date: formData.travelDateTo || null,
        frontend_total_amount: totalNpr,

        payment_method:
          selectedPaymentMethod === "esewa"
            ? "eSewa"
            : "Pay Later",

        customer_name: formData.fullName,
        customer_email: formData.email,
        customer_phone: `${formData.phoneCode} ${formData.phone}`,
        nationality: formData.nationality,
        pickup_address: formData.pickupAddress,

        special_requests: formData.specialNotes
          ? `[Trip Type: ${tripType}] ${formData.specialNotes}`
          : `[Trip Type: ${tripType}]`,
      };

      const response = await createBooking(bookingData);

      const booking = response?.data?.data || response?.data;

      if (!booking?.id) {
        throw new Error("Booking ID was not returned by the backend.");
      }

      // IMPORTANT: save real booking ID for payment initiation
      setBookingId(Number(booking.id));

      // Use backend booking reference
      setSubmissionId(booking.booking_reference || "");

      setSubmittedAt(now);

      // Only go to payment after booking was successfully created
      setCurrentStep("payment");

    } catch (err: any) {
      console.error("Vehicle booking failed:", err);

      setFormError(
        err?.response?.data?.message ||
        err?.response?.data?.errors?.number_of_people?.[0] ||
        err?.message ||
        "Failed to create booking. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEsewaPayment = async () => {
    if (!bookingId) {
      setFormError("Booking ID is missing. Please create the booking first.");
      return;
    }

    try {
      setIsProcessingPayment(true);
      setFormError("");
      setSelectedPaymentMethod("esewa");

      const response = await initiatePayment({
        booking_id: bookingId,
        provider: "ESEWA",
      });

      const data = response?.data?.data;

      if (!data?.payment_url) {
        throw new Error("eSewa payment URL was not returned.");
      }

      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.payment_url;

      const fields = {
        amount: data.amount,
        tax_amount: data.tax_amount,
        total_amount: data.total_amount,
        transaction_uuid: data.transaction_uuid,
        product_code: data.product_code,
        product_service_charge: data.product_service_charge,
        product_delivery_charge: data.product_delivery_charge,
        success_url: data.success_url,
        failure_url: data.failure_url,
        signed_field_names: data.signed_field_names,
        signature: data.signature,
      };

      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value ?? "");
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err: any) {
      console.error("eSewa payment initiation failed:", err);

      setFormError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to initiate eSewa payment."
      );

      setIsProcessingPayment(false);
    }
  };

  const handlePayLater = async () => {
    if (!bookingId) {
      setFormError("Booking ID is missing. Please create the booking first.");
      return;
    }

    try {
      setIsProcessingPayment(true);
      setFormError("");
      setSelectedPaymentMethod("pay_later");

      const response = await initiatePayment({
        booking_id: bookingId,
        provider: "PAYLATER",
      });

      if (!response?.data?.status) {
        throw new Error(
          response?.data?.message || "Failed to select Pay Later."
        );
      }

      setPaymentStatus("unpaid");
      setCurrentStep("submitted");
    } catch (err: any) {
      console.error("Pay Later failed:", err);

      setFormError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to select Pay Later."
      );
    } finally {
      setIsProcessingPayment(false);
    }
  };
  const handleCopyId = () => {
    navigator.clipboard.writeText(submissionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const route = vInfo?.fromLocation && vInfo?.destination
      ? `${vInfo.fromLocation} to ${vInfo.destination}`
      : item.location || "Nepal Route";

    const msg = encodeURIComponent(
      `*Official Vehicle Rental Booking Confirmation*\n\n` +
      `📌 *Booking Reference:* ${submissionId}\n` +
      `🚗 *Vehicle:* ${item.title}\n` +
      `🛣️ *Route:* ${route}\n` +
      `🏷️ *Trip Type:* ${tripType}\n` +
      `👥 *Passengers:* ${passengersCount} Pax\n` +
      `📅 *Travel Date:* ${formData.travelDateFrom || formData.travelDate}${formData.travelDateTo ? ` to ${formData.travelDateTo}` : ""}\n` +
      `📍 *Pickup Location:* ${formData.pickupAddress || "To be confirmed"}\n` +
      `👤 *Lead Passenger:* ${formData.fullName}\n` +
      `📞 *Contact:* ${formData.phoneCode} ${formData.phone}\n` +
      `💰 *Total Rental Fee:* ${totalPriceFormatted}\n` +
      `💳 *Payment Method:* ${selectedPaymentMethod === "esewa" ? "eSewa Digital Wallet" : "Pay Later"}\n` +
      `📊 *Payment Status:* ${paymentStatus.toUpperCase()}\n` +
      `🔍 *Payment Verification:* PENDING\n\n` +
      `Hello Trip Himalaya (Vehicle & Fleet Operations), I have booked a vehicle rental online. Please confirm booking receipt and driver assignment.`
    );
    window.open(
      `https://api.whatsapp.com/send?phone=9779851403761&text=${msg}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handlePrintSlip = () => {
    const route = vInfo?.fromLocation && vInfo?.destination
      ? `${vInfo.fromLocation} to ${vInfo.destination}`
      : item.location || "Nepal Route";

    const travelDateRange = formData.travelDateFrom || formData.travelDate
      ? `${formData.travelDateFrom || formData.travelDate}${formData.travelDateTo ? ` to ${formData.travelDateTo}` : ""}`
      : "Flexible";

    const printContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Vehicle_Rental_Slip_${submissionId}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
          @page {
            size: A4 portrait;
            margin: 0;
          }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            background: #fff;
            color: #0f172a;
            font-size: 11px;
            line-height: 1.45;
          }
          .page {
            width: 210mm;
            min-height: 297mm;
            padding: 12mm 12mm 10mm 12mm;
            display: flex;
            flex-direction: column;
            gap: 0;
            position: relative;
          }

          /* ── WATERMARK ── */
          .watermark-wrapper {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            user-select: none;
            z-index: 999;
          }
          .watermark {
            transform: rotate(-28deg);
            font-size: 42px;
            font-weight: 900;
            color: rgba(0, 0, 0, 0.04);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            line-height: 2.2;
            white-space: nowrap;
            text-align: center;
          }

          /* ── LETTERHEAD ── */
          .letterhead {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 8px;
            border-bottom: 2.5px solid #000;
            margin-bottom: 10px;
          }
          .lh-left {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .logo-img {
            height: 70px;
            width: auto;
            object-fit: contain;
            flex-shrink: 0;
          }
          .company-name-block {
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .company-name-main {
            font-size: 15px;
            font-weight: 900;
            line-height: 1.1;
            color: #000;
          }
          .company-tagline {
            font-size: 9px;
            color: #000;
            font-weight: 600;
            margin-top: 2px;
          }
          .company-contact-row {
            font-size: 8.5px;
            color: #222;
            margin-top: 2px;
            font-weight: 500;
          }
          .lh-right {
            text-align: right;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 3px;
          }
          .official-badge {
            display: inline-block;
            border: 1.5px solid #000;
            color: #000;
            font-size: 8.5px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            padding: 2px 8px;
            border-radius: 3px;
          }
          .slip-date {
            font-size: 8.5px;
            color: #444;
            font-weight: 600;
          }

          /* ── TITLE BAND ── */
          .title-band {
            background: #000;
            color: #fff;
            padding: 8px 12px;
            border-radius: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }
          .title-band h1 {
            font-size: 13px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #fff;
          }
          .title-band .destination {
            font-size: 10px;
            color: #ffb3d9;
            font-weight: 700;
            margin-top: 1px;
          }
          .doc-id { text-align: right; }
          .doc-id-label { font-size: 8px; color: #aaa; text-transform: uppercase; letter-spacing: 0.8px; }
          .doc-id-val { font-family: monospace; font-weight: 900; font-size: 13px; color: #fff; }

          /* ── SECTION HEADING ── */
          .section-heading {
            display: flex;
            align-items: center;
            gap: 6px;
            margin: 10px 0 6px 0;
          }
          .sh-text {
            font-size: 9.5px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: #000;
            white-space: nowrap;
          }
          .sh-line {
            flex: 1;
            height: 1px;
            background: #000;
          }

          /* ── DETAIL TABLE ── */
          .detail-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9.5px;
          }
          .detail-table th, .detail-table td {
            border: 1px solid #cbd5e1;
            padding: 4.5px 7px;
            vertical-align: top;
          }
          .td-label {
            background: #f8fafc;
            font-weight: 700;
            color: #334155;
            width: 22%;
          }
          .td-value {
            color: #0f172a;
            font-weight: 500;
            width: 28%;
          }
          .td-value.accent { font-weight: 700; color: #000; }
          .td-value.mono { font-family: monospace; font-weight: 700; }
          .td-value.fee { font-size: 11px; font-weight: 900; color: #be185d; }

          /* ── NOTICE BOX ── */
          .notice-box {
            background: #fdf4ff;
            border: 1px solid #f0abfc;
            border-left: 4px solid #a855f7;
            padding: 7px 10px;
            border-radius: 4px;
            font-size: 9.5px;
            color: #581c87;
            margin-top: 8px;
            line-height: 1.4;
          }

          /* ── CHECKLIST ── */
          .checklist-box {
            background: #f0fdf4;
            border: 1px solid #86efac;
            padding: 7px 10px;
            border-radius: 4px;
            margin-top: 8px;
            font-size: 9px;
            color: #14532d;
          }
          .checklist-title {
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-size: 9px;
            margin-bottom: 4px;
            color: #166534;
          }
          .checklist-items {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3px 12px;
          }

          /* ── FOOTER ── */
          .doc-footer {
            margin-top: auto;
            padding-top: 8px;
            border-top: 1.5px solid #000000;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 8px;
            color: #444;
          }
        </style>
      </head>
      <body>
        <div class="page">
          <!-- WATERMARK -->
          <div class="watermark-wrapper">
            <div class="watermark">Trip Himalaya Tours and Travels</div>
          </div>

          <!-- LETTERHEAD -->
          <div class="letterhead">
            <div class="lh-left">
              <img src="${THTTLogo}" class="logo-img" alt="Trip Himalaya Tours and Travels" />
              <div class="company-name-block">
                <div class="company-name-main">Trip Himalaya Tours &amp; Travels Pvt. Ltd.</div>
                <div class="company-tagline">Govt. Registered Highway Chauffeur &amp; Tourist Transport Service</div>
                <div class="company-contact-row">Airport, Shambhu Marg, Road No. 04, Kathmandu, Nepal &nbsp;|&nbsp; +977 9851403761 &nbsp;|&nbsp; dev.triphimalayatt@gmail.com</div>
              </div>
            </div>
            <div class="lh-right">
              <div class="official-badge">Official Document</div>
              <div class="slip-date">Issued: ${submittedAt}</div>
            </div>
          </div>

          <!-- DOC TITLE BAND -->
          <div class="title-band">
            <div>
              <h1>Vehicle Rental Booking Slip</h1>
              <div class="destination">Vehicle: ${item.title} &nbsp;/&nbsp; Route: ${route}</div>
            </div>
            <div class="doc-id">
              <div class="doc-id-label">Booking Reference</div>
              <div class="doc-id-val">${submissionId}</div>
            </div>
          </div>

          <!-- PASSENGER DETAILS SECTION -->
          <div class="section-heading">
            <div class="sh-text">Primary Passenger &amp; Contact Details</div>
            <div class="sh-line"></div>
          </div>
          <table class="detail-table">
            <tr>
              <td class="td-label">Full Name</td>
              <td class="td-value accent">${formData.fullName || "—"}</td>
              <td class="td-label">Contact / WhatsApp</td>
              <td class="td-value">${formData.phone ? `${formData.phoneCode} ${formData.phone}` : "—"}</td>
            </tr>
            <tr>
              <td class="td-label">Email Address</td>
              <td class="td-value">${formData.email || "—"}</td>
              <td class="td-label">Nationality</td>
              <td class="td-value">${formData.nationality || "—"}</td>
            </tr>
            <tr>
              <td class="td-label">Pickup Location</td>
              <td class="td-value accent" colspan="3">${formData.pickupAddress || "To be confirmed with fleet coordinator"}</td>
            </tr>
            ${formData.specialNotes ? `
            <tr>
              <td class="td-label">Special Notes</td>
              <td class="td-value" colspan="3">${formData.specialNotes}</td>
            </tr>
            ` : ""}
          </table>

          <!-- VEHICLE & TRIP DETAILS -->
          <div class="section-heading">
            <div class="sh-text">Vehicle &amp; Journey Details</div>
            <div class="sh-line"></div>
          </div>
          <table class="detail-table">
            <tr>
              <td class="td-label">Reserved Vehicle</td>
              <td class="td-value accent">${item.title}</td>
              <td class="td-label">Vehicle Type</td>
              <td class="td-value">${vInfo?.vehicleType || "Chauffeur Transport"}</td>
            </tr>
            <tr>
              <td class="td-label">Trip Route</td>
              <td class="td-value">${route}</td>
              <td class="td-label">Trip Type</td>
              <td class="td-value accent">${tripType}</td>
            </tr>
            <tr>
              <td class="td-label">Travel Date</td>
              <td class="td-value mono accent">${travelDateRange}</td>
              <td class="td-label">Rental Duration</td>
              <td class="td-value">${item.duration || "As per scheduled trip"}</td>
            </tr>
            <tr>
              <td class="td-label">Fuel &amp; Chauffeur</td>
              <td class="td-value">${vInfo?.fuelType || "Standard"} • Included Driver</td>
              <td class="td-label">Passenger Count</td>
              <td class="td-value">${passengersCount} ${passengersCount === 1 ? "Passenger" : "Passengers"}</td>
            </tr>
          </table>

          <!-- PAYMENT INFORMATION -->
          <div class="section-heading">
            <div class="sh-text">Payment Information</div>
            <div class="sh-line"></div>
          </div>
          <table class="detail-table">
            <tr>
              <td class="td-label">Payment Method</td>
              <td class="td-value" style="font-weight:700;">${selectedPaymentMethod === "esewa"
        ? "eSewa Digital Wallet"
        : "Pay Later (Deferred / Pay at Office)"
      }</td>
              <td class="td-label">Total Rental Fee</td>
              <td class="td-value fee">${totalPriceFormatted}</td>
            </tr>
            <tr>
              <td class="td-label">Amount Paid</td>
              <td class="td-value fee" style="color:${paymentStatus === "paid" ? "#047857" : "#b45309"
      };">${paymentStatus === "paid"
        ? totalPriceFormatted
        : selectedCurrency
          ? `${selectedCurrency} 0 (Pay Later)`
          : "NPR 0 (Pay Later)"
      }</td>
              <td class="td-label">Payment Status</td>
              <td class="td-value" style="font-weight:900; font-size:10px; color:${paymentStatus === "paid" ? "#047857" : "#b45309"
      };">${paymentStatus.toUpperCase()}</td>
            </tr>
            <tr>
              <td class="td-label">Payment Verification</td>
              <td class="td-value" colspan="3" style="font-weight:900; font-size:10px; color:#1d4ed8;">PENDING</td>
            </tr>
          </table>

          <!-- NOTICE -->
          <div class="notice-box">
            <strong>Next Step:</strong> Our fleet coordinator will contact you within <strong>15–30 minutes</strong> via WhatsApp or phone call to verify pickup time, coordinate luggage allowances, and share your dedicated driver contact.
          </div>

          <!-- CHECKLIST -->
          <div class="checklist-box">
            <div class="checklist-title">Passenger Checklist for Journey Day:</div>
            <div class="checklist-items">
              <div>✓ Valid Government Photo ID or Passport</div>
              <div>✓ Booking Confirmation Reference (${submissionId})</div>
              <div>✓ Exact Hotel / Landmark Pickup Address</div>
              <div>✓ Keep WhatsApp Active for Driver Live Location</div>
            </div>
          </div>

          <!-- FOOTER -->
          <div class="doc-footer">
            <span>Official Transport Acknowledgement &nbsp;|&nbsp; Trip Himalaya Tours &amp; Travels Pvt. Ltd.</span>
            <span>System Generated &nbsp;•&nbsp; Ref: ${submissionId}</span>
          </div>
        </div>
      </body>
      </html>
    `;

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(printContent);
      doc.close();
      iframe.contentWindow?.focus();
      setTimeout(() => {
        iframe.contentWindow?.print();
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 1200);
      }, 350);
    } else {
      window.print();
    }
  };

  const handleResetAndClose = () => {
    setCurrentStep("form");
    setSubmissionId("");
    setPaymentStatus("unpaid");
    setSelectedPaymentMethod("esewa");
    setIsProcessingPayment(false);
    setBookingId(null);
    onClose();
  };

  return (
    <div className="print:hidden fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-3 sm:my-6 flex flex-col max-h-[92vh]">

        {/* ── MODAL HEADER (Previous design as requested) ── */}
        {currentStep === "submitted" ? (
          <div className="p-4 sm:p-5 bg-gradient-to-r from-[#200B3B] via-[#3B145C] to-[#200B3B] text-white flex items-center justify-between border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center flex-shrink-0 shadow-inner">
                <MapPin size={20} className="text-pink-300" />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FF4FA3] block">
                  SUBMISSION CONFIRMED
                </span>
                <h3 className="text-sm sm:text-base font-black tracking-tight leading-tight text-white">
                  {item.title}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetAndClose}
              aria-label="Close modal"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 border border-white/15 flex items-center justify-center text-white transition-all cursor-pointer hover:rotate-90"
            >
              <X size={16} />
            </button>
          </div>
        ) : currentStep === "payment" ? (
          <div className="relative bg-gradient-to-r from-[#200B3B] via-[#2D1347] to-[#3B145C] text-white p-5 sm:p-6 flex-shrink-0">
            <button
              type="button"
              onClick={handleResetAndClose}
              aria-label="Close dialog"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight pr-8">
              Payment Method
            </h3>
            <p className="text-xs text-gray-200 mt-1">
              {item.title}
            </p>
          </div>
        ) : (
          /* Previous original header design */
          <div className="relative bg-gradient-to-r from-[#200B3B] via-[#2D1347] to-[#3B145C] text-white p-5 sm:p-6">
            <button
              type="button"
              onClick={handleResetAndClose}
              aria-label="Close dialog"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight pr-8">
              Book: {item.title}
            </h3>

            <div className="flex flex-wrap items-center gap-2.5 mt-3 text-xs text-gray-200">
              <span className="bg-white/10 px-3 py-1 rounded-full font-bold backdrop-blur-xs text-pink-300">
                {item.category || "Vehicle Rental"}
              </span>
              {tripType && (
                <span className="bg-white/15 px-3 py-1 rounded-full font-bold backdrop-blur-xs text-yellow-300 border border-white/10">
                  Trip Type: {tripType}
                </span>
              )}
              {item.duration && (
                <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs font-medium">
                  <Clock size={13} className="text-pink-400" />
                  {item.duration}
                </span>
              )}
              {item.location && (
                <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs font-medium">
                  <MapPin size={13} className="text-pink-400" />
                  {item.location}
                </span>
              )}
              {isPrivateTrip ? (
                <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs font-medium text-purple-200">
                  <Users size={12} className="text-purple-300" />
                  {totalSeats} seats (Whole Vehicle)
                </span>
              ) : (
                <span className="flex items-center gap-1 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 rounded-full backdrop-blur-xs font-bold text-emerald-300">
                  <Users size={12} />
                  {availableSeats} / {totalSeats} seats
                </span>
              )}
              <span className="bg-[#E11D48] text-white font-extrabold px-3 py-1 rounded-full shadow-sm ml-auto flex items-baseline gap-1">
                {unitPriceFormatted}
                {!isPrivateTrip && (
                  <span className="text-[10px] font-semibold text-red-200">/ person</span>
                )}
              </span>
            </div>
          </div>
        )}

        {/* ── MODAL BODY SCROLLABLE ── */}
        <div className="p-4 sm:p-5 overflow-y-auto">
          {currentStep === "payment" ? (
            /* =======================================================================
               PAYMENT METHOD VIEW (eSewa & Pay Later)
               ======================================================================= */
            <div className="space-y-3">
              <PaymentMethod
                bookingReference={submissionId}
                packageTitle={item.title}
                category="Vehicle Rental"
                tierName={tripType}
                guestsCount={passengersCount}
                unitPriceFormatted={unitPriceFormatted}
                totalPriceFormatted={totalPriceFormatted}
                travelDate={formData.travelDateFrom ? `Date: ${formData.travelDateFrom}` : undefined}
                isProcessingPayment={isProcessingPayment}
                initialMethod={selectedPaymentMethod}
                onMethodChange={setSelectedPaymentMethod}
                onPayWithEsewa={handleEsewaPayment}
                onPayLater={handlePayLater}
              />
              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep("form")}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium underline transition-colors cursor-pointer"
                >
                  ← Edit Booking Details
                </button>
              </div>
            </div>
          ) : currentStep === "submitted" ? (
            /* =======================================================================
               CONFIRMATION & VOUCHER VIEW
               ======================================================================= */
            <div className="space-y-3 text-center animate-in fade-in zoom-in-95 duration-200">

              {/* Top Greeting & Status */}
              <div className="space-y-1.5 pt-0.5">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl text-white mb-0.5 shadow-md ring-4 ${paymentStatus === "paid"
                  ? "bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-emerald-500/20 ring-emerald-50"
                  : "bg-gradient-to-tr from-amber-500 to-orange-400 shadow-amber-500/20 ring-amber-50"
                  }`}>
                  <CheckCircle2 size={26} className="stroke-[2.5]" />
                </div>
                <div>
                  <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${paymentStatus === "paid"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : "bg-amber-100 text-amber-800 border border-amber-200"
                    }`}>
                    {paymentStatus === "paid" ? "Payment Received • Booking Registered" : "Booking Registered • Payment Pending"}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <h4 className="text-base sm:text-lg font-black text-[#1A0B2E] tracking-tight">
                    Thank you, {formData.fullName || "Valued Passenger"}!
                  </h4>
                  <BadgeCheck size={18} className="text-emerald-600 flex-shrink-0" />
                </div>
                <p className="text-xs text-slate-500">
                  Your reservation for{" "}
                  <strong className="text-slate-800 font-semibold">{item.title}</strong> has been registered.
                </p>
              </div>

              {/* Officer Contact Notice Card */}
              <div className="bg-gradient-to-r from-purple-50/70 via-white to-purple-50/50 border border-purple-100 rounded-xl px-3.5 py-2.5 text-left shadow-2xs">
                <span className="text-xs font-black text-[#1A0B2E] block mb-0.5">
                  Driver Assignment &amp; Live Tracking
                </span>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Our fleet coordinator will contact you on{" "}
                  <strong className="text-slate-800">WhatsApp &amp; Phone</strong> (
                  {formData.phone ? `${formData.phoneCode} ${formData.phone}` : "your number"}
                  ) before travel to coordinate coordinates.
                </p>
              </div>

              {/* Digital E-Receipt Voucher Card */}
              <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs text-left">
                {/* Submission Reference ID Header */}
                <div className="bg-[#FAF8FD] px-3.5 py-2.5 border-b border-purple-100/70 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 block leading-none">
                      OFFICIAL SUBMISSION NUMBER
                    </span>
                    <span className="font-mono font-black text-sm sm:text-base text-[#1A0B2E] tracking-wider mt-0.5 block">
                      {submissionId}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-100/70 hover:bg-purple-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>

                {/* Key Details Grid */}
                <div className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs bg-white">
                  <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Lead Passenger</span>
                    <span className="font-bold text-[#1A0B2E] truncate block text-xs mt-0.5">
                      {formData.fullName || "—"}
                    </span>
                  </div>

                  <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Passengers</span>
                    <span className="font-bold text-[#1A0B2E] truncate block text-xs mt-0.5">
                      {passengersCount} {passengersCount > 1 ? "Passengers" : "Passenger"}
                    </span>
                  </div>

                  <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Trip Type</span>
                    <span className="font-bold text-[#E91E63] truncate block text-xs mt-0.5">
                      {tripType}
                    </span>
                  </div>

                  <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Total Rental Fee</span>
                    <span className="font-black text-[#1A0B2E] text-xs mt-0.5 block">
                      {totalPriceFormatted}
                    </span>
                  </div>

                  <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Travel Date</span>
                    <span className="font-medium text-slate-700 text-xs truncate block mt-0.5">
                      {formData.travelDateFrom || formData.travelDate || "Flexible"}
                    </span>
                  </div>

                  <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Submitted At</span>
                    <span className="font-medium text-slate-700 text-[10.5px] truncate block mt-0.5">
                      {submittedAt}
                    </span>
                  </div>

                  <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Payment Status</span>
                    <span className={`font-black text-xs mt-0.5 block ${paymentStatus === "paid" ? "text-emerald-700" : "text-amber-600"}`}>
                      {paymentStatus.toUpperCase()} ({selectedPaymentMethod === "esewa" ? (paymentStatus === "paid" ? "eSewa" : "eSewa Pending") : "Pay Later"})
                    </span>
                  </div>

                  <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Payment Verification</span>
                    <span className="font-black text-blue-600 text-xs mt-0.5 block">
                      PENDING
                    </span>
                  </div>

                  <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Pickup Location</span>
                    <span className="font-semibold text-slate-700 text-xs truncate block mt-0.5">
                      {formData.pickupAddress || "To be shared"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="flex-1 py-2.5 px-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-500/20 active:scale-98 transition-all cursor-pointer"
                >
                  <MessageCircle size={15} />
                  <span>Chat on WhatsApp</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handlePrintSlip}
                    className="flex-1 py-2.5 px-3.5 bg-white hover:bg-purple-50/70 border border-purple-200 text-[#1A0B2E] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer hover:border-purple-300"
                  >
                    <Printer size={13} className="text-purple-700" />
                    <span>Print Slip</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="flex-1 py-2.5 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* =======================================================================
               VEHICLE RENTAL BOOKING FORM — EXACT PREVIOUS INPUT ARRANGEMENT
               ======================================================================= */
            <form onSubmit={handleSubmitForm} className="space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
                  <AlertCircle size={15} className="flex-shrink-0 text-red-500 mt-0.5" />
                  <span className="leading-snug">{formError}</span>
                </div>
              )}

              {/* 1. Primary Traveller Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Primary Traveller Name <span className="text-[#E11D48]">*</span>
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="e.g. Ram Sharma"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full h-10 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder:text-[11px] placeholder:font-normal placeholder:text-gray-400 focus:bg-white focus:border-[#2D1347] focus:outline-none transition"
                  />
                </div>
              </div>

              {/* 2. Nationality */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nationality <span className="text-[#E11D48]">*</span>
                </label>
                <div className="relative">
                  <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    name="nationality"
                    required
                    placeholder="e.g. Nepali, Indian, American"
                    value={formData.nationality}
                    onChange={handleChange}
                    className="w-full h-10 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder:text-[11px] placeholder:font-normal placeholder:text-gray-400 focus:bg-white focus:border-[#2D1347] focus:outline-none transition"
                  />
                </div>
              </div>

              {/* 3. Email + Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Email Address <span className="text-[#E11D48]">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full h-10 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder:text-[11px] placeholder:font-normal placeholder:text-gray-400 focus:bg-white focus:border-[#2D1347] focus:outline-none transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Phone / WhatsApp <span className="text-[#E11D48]">*</span>
                  </label>
                  <div className="flex items-stretch border border-gray-200 rounded-xl bg-white focus-within:border-[#2D1347] focus-within:ring-2 focus-within:ring-purple-100 transition-all overflow-hidden h-10">
                    <select
                      name="phoneCode"
                      value={formData.phoneCode}
                      onChange={handleChange}
                      className="flex-shrink-0 bg-gray-50 border-r border-gray-200 px-2 text-xs font-bold text-[#2D1347] focus:outline-none cursor-pointer"
                      style={{ maxWidth: "110px" }}
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.iso} value={c.code}>
                          {isoToFlag(c.iso)} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="9851400000"
                      value={formData.phone}
                      onChange={handleChange}
                      className="flex-1 min-w-0 px-3 bg-white text-xs text-gray-800 placeholder:text-[11px] placeholder:font-normal placeholder:text-gray-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Travel Date: From Required, To Optional */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Travel Date (From) <span className="text-[#E11D48]">*</span>
                  </label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      name="travelDateFrom"
                      required
                      value={formData.travelDateFrom || formData.travelDate}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          travelDateFrom: e.target.value,
                          travelDate: e.target.value,
                        }));
                      }}
                      className="w-full h-10 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:border-[#2D1347] focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Travel Date (To) <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      name="travelDateTo"
                      value={formData.travelDateTo || ""}
                      min={formData.travelDateFrom || formData.travelDate || undefined}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          travelDateTo: e.target.value,
                        }));
                      }}
                      className="w-full h-10 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:border-[#2D1347] focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Passengers Count (Only if non-private sharing vehicle) */}
              {!isPrivateTrip && (
                <div className="bg-gray-50/90 border border-gray-200 rounded-xl p-3 sm:p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-xs font-bold text-gray-800">
                        No. of Passengers (Seats)
                      </label>
                    </div>

                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1 shadow-2xs">
                      <button
                        type="button"
                        disabled={passengersCount <= 1}
                        onClick={() => setPassengersCount((prev) => Math.max(1, prev - 1))}
                        className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-sm text-[#2D1347] flex items-center justify-center transition-all cursor-pointer"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-black text-sm text-[#200B3B]">
                        {passengersCount}
                      </span>
                      <button
                        type="button"
                        disabled={passengersCount >= maxSeatsSelectable}
                        onClick={() => {
                          if (passengersCount < maxSeatsSelectable) {
                            setPassengersCount((prev) => prev + 1);
                          }
                        }}
                        className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-sm text-[#2D1347] flex items-center justify-center transition-all cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {passengersCount >= availableSeats && (
                    <p className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1">
                      Maximum available seats reached ({availableSeats} available).
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-1.5 border-t border-gray-200 text-xs">
                    <span className="text-gray-600 font-medium text-[11px]">
                      {unitPriceFormatted} × {passengersCount} passenger{passengersCount > 1 ? "s" : ""}:
                    </span>
                    <span className="font-extrabold text-[#E11D48] text-xs">
                      {totalPriceFormatted}
                    </span>
                  </div>
                </div>
              )}

              {/* Private trip info badge */}
              {isPrivateTrip && (
                <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-purple-800">Private Vehicle Booking</p>
                    <p className="text-[10.5px] text-purple-600 font-medium mt-0.5">
                      Reserves the whole vehicle — capacity up to {totalSeats} seats. Fixed flat rate.
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-base font-black text-[#E11D48]">{unitPriceFormatted}</span>
                    <span className="text-[10px] font-semibold text-gray-400 block">/ full vehicle</span>
                  </div>
                </div>
              )}

              {/* 5. Pickup Location */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Pickup / Hotel in Nepal <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    name="pickupAddress"
                    placeholder="e.g. Kathmandu Airport or Thamel Hotel"
                    value={formData.pickupAddress}
                    onChange={handleChange}
                    className="w-full h-10 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder:text-[11px] placeholder:font-normal placeholder:text-gray-400 focus:bg-white focus:border-[#2D1347] focus:outline-none transition"
                  />
                </div>
              </div>

              {/* 6. Dietary or Health Notes */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Dietary / Health Notes <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <MessageSquare size={14} className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                  <textarea
                    name="specialNotes"
                    rows={2}
                    placeholder="e.g. Vegetarian meals, high-altitude preparation, extra porter…"
                    value={formData.specialNotes}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder:text-[11px] placeholder:font-normal placeholder:text-gray-400 focus:bg-white focus:border-[#2D1347] focus:outline-none transition resize-none"
                  />
                </div>
              </div>

              {/* 7. Attach Documents */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Attach Documents <span className="text-gray-400 font-normal">(ID / Passport / Student Card)</span>
                </label>
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 hover:border-[#E11D48] rounded-xl p-3 text-center bg-gray-50/50 hover:bg-pink-50/20 transition cursor-pointer"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf,.docx"
                  />
                  <UploadCloud size={18} className="mx-auto text-gray-400 mb-1" />
                  <p className="text-xs text-gray-500">
                    Drag &amp; drop or <span className="text-[#E11D48] font-semibold">Browse</span>
                    <span className="text-gray-400 ml-1">· JPG, PNG, PDF up to 10MB</span>
                  </p>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText size={13} className="text-[#E11D48] flex-shrink-0" />
                          <span className="text-xs font-medium text-gray-700 truncate">{file.name}</span>
                          <span className="text-[10px] text-gray-400 flex-shrink-0">({(file.size / 1024).toFixed(0)} KB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(idx)}
                          className="text-gray-400 hover:text-red-500 transition-colors ml-2 flex-shrink-0 cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 8. Price / Estimated Total */}
              <div className="flex items-center justify-between bg-[#FAF8FF] border border-purple-100 rounded-xl px-4 py-3">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {isPrivateTrip
                      ? "Vehicle Flat Rate (Whole Vehicle Reservation)"
                      : `Estimated Total (${passengersCount} Passenger${passengersCount > 1 ? "s" : ""} × ${unitPriceFormatted})`}
                  </p>
                  <p className="text-xl font-black text-[#2D1347]">{totalPriceFormatted}</p>
                </div>
              </div>

              {/* Seat Availability Notice */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-2 flex items-start gap-2">
                <span className="flex-shrink-0 mt-0.5 w-4 h-4 rounded bg-amber-500 flex items-center justify-center">
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M2 5.5L4 7.5L8 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                <p className="text-[11px] text-amber-800 font-medium leading-snug">
                  <span className="font-bold">Seat availability is not real-time.</span> Confirm via{" "}
                  <span className="font-extrabold text-amber-900">WhatsApp</span> before | after booking for confirmation.
                </p>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="termsAgreed"
                  checked={formData.termsAgreed}
                  onChange={handleChange}
                  className="mt-0.5 rounded text-[#E11D48] focus:ring-[#E11D48] cursor-pointer"
                />
                <span>
                  I agree to Trip Himalaya's booking terms, 24-hour cancellation policy, and confirm the traveler information is accurate.
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-pink-900/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Send size={15} className="animate-pulse" />
                    <span>Processing Booking…</span>
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    <span>Book This Trip</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleRentalBookingModal;
