import { AlertCircle, Home, RotateCcw } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentFailure = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const bookingId = searchParams.get("booking_id");
  const workPermitId = searchParams.get("work_permit_id");

  const handleTryAgain = () => {
    if (bookingId) {
      navigate(`/booking/${bookingId}`);
      return;
    }

    if (workPermitId) {
      navigate(`/work-permit`);
      return;
    }

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-5">
          <AlertCircle size={44} className="text-red-500" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-[#2D1347]">
          Payment Failed
        </h1>

        <p className="text-sm text-gray-500 mt-2">
          We couldn't complete your payment. No successful payment was recorded.
        </p>

        <div className="mt-6 bg-red-50/50 border border-red-100 rounded-2xl p-4 text-left space-y-3">
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

          <div className="flex justify-between gap-4">
            <span className="text-xs font-semibold text-gray-500">Payment Status</span>
            <span className="text-xs font-bold text-red-500">FAILED</span>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleTryAgain}
            className="flex-1 rounded-xl bg-[#E91E63] hover:bg-pink-600 text-white py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw size={16} />
            Try Again
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex-1 rounded-xl bg-[#2D1347] hover:bg-purple-950 text-white py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Home size={16} />
            Back to Home
          </button>
        </div>

        <p className="text-[11px] text-gray-400 mt-5">
          If money was deducted but the payment failed, please contact our support team.
        </p>
      </div>
    </div>
  );
};

export default PaymentFailure;