import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">

      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 text-center">

        <div className="flex justify-center mb-5">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle
              size={70}
              className="text-green-600"
            />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800">
          Payment Successful
        </h1>

        <p className="text-gray-500 mt-3">
          Your museum ticket has been booked successfully.
        </p>

        <div className="bg-green-50 rounded-xl mt-6 p-4">
          <p className="text-sm text-gray-600">
            Booking confirmation has been sent.
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white py-3 rounded-full font-semibold transition"
        >
          Back to Home
        </button>
      </div>

    </div>
  );
}