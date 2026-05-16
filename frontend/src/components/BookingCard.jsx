import { useNavigate } from "react-router-dom";

export default function BookingCard({ booking }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/booking/${booking.id}`)}
      className="bg-white p-4 rounded-xl shadow cursor-pointer hover:scale-105 transition"
    >
      <h3 className="font-bold text-lg">
        {booking.experience_name}
      </h3>

      <p>Ref: {booking.booking_reference}</p>

      <p>Date: {booking.booking_date}</p>

      <p>Tickets: {booking.total_tickets}</p>

      <p>Total: ${booking.total_amount}</p>

      <p className="text-green-600">
        {booking.status}
      </p>

      <button className="mt-3 bg-green-700 text-white px-4 py-2 rounded">
        Continue Booking
      </button>
    </div>
  );
}