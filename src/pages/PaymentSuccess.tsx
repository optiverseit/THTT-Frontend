import { CheckCircle2, Home, ReceiptText } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const bookingId = searchParams.get("booking_id");
  const workPermitId = searchParams.get("work_permit_id");
  const transactionId = searchParams.get("transaction_id");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-5">
          <CheckCircle2 size={44} className="text-green-500" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-[#2D1347]">
          Payment Successful
        </h1>

        <p className="text-sm text-gray-500 mt-2">
          Your payment has been completed successfully.
        </p>

        <div className="mt-6 bg-gray-50 border border-gray-100 rounded-2xl p-4 text-left space-y-3">
          {bookingId && (
            <div className="flex justify-between gap-4">
              <span className="text-xs font-semibold text-gray-500">Booking ID</span>
              <span className="text-xs font-bold text-[#2D1347]">{bookingId}</span>
            </div>
          )}

          {workPermitId && (
            <div className="flex justify-between gap-4">
              <span className="text-xs font-semibold text-gray-500">Work Permit ID</span>
              <span className="text-xs font-bold text-[#2D1347]">{workPermitId}</span>
            </div>
          )}

          {transactionId && (
            <div className="flex justify-between gap-4">
              <span className="text-xs font-semibold text-gray-500">Transaction ID</span>
              <span className="text-xs font-bold text-[#2D1347] break-all text-right">
                {transactionId}
              </span>
            </div>
          )}

          <div className="flex justify-between gap-4">
            <span className="text-xs font-semibold text-gray-500">Payment Status</span>
            <span className="text-xs font-bold text-green-600">PAID</span>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          {bookingId && (
            <button
              onClick={() => navigate(`/booking/${bookingId}`)}
              className="flex-1 rounded-xl bg-[#E91E63] hover:bg-pink-600 text-white py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ReceiptText size={16} />
              View Booking
            </button>
          )}

          <button
            onClick={() => navigate("/")}
            className="flex-1 rounded-xl bg-[#2D1347] hover:bg-purple-950 text-white py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Home size={16} />
            Back to Home
          </button>
        </div>

        <p className="text-[11px] text-gray-400 mt-5">
          A confirmation email will be sent to your registered email address.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;