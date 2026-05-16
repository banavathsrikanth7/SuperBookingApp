import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FailedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4">

      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 text-center">

        <div className="flex justify-center mb-5">
          <div className="bg-red-100 p-4 rounded-full">
            <XCircle
              size={70}
              className="text-red-600"
            />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800">
          Payment Failed
        </h1>

        <p className="text-gray-500 mt-3">
          Something went wrong while processing your payment.
        </p>

        <div className="bg-red-50 rounded-xl mt-6 p-4">
          <p className="text-sm text-gray-600">
            Don't worry. No amount was deducted permanently if the transaction failed.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-8">

          <button
            onClick={() => navigate(-1)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-full font-semibold"
          >
            Try Again
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex-1 border border-gray-300 py-3 rounded-full font-semibold"
          >
            Home
          </button>

        </div>

      </div>

    </div>
  );
}