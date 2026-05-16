import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const slots = [
  {
    id: 1,
    name: "Morning Heritage Walk",
    time: "Entry Time: 09:00hrs",
    desc: "Begin your journey through ancient artifacts and colonial-era galleries.",
  },
  {
    id: 2,
    name: "Archaeological Gallery",
    time: "Entry Time: 10:00hrs",
    desc: "Explore India's archaeological wonders, from Harappan seals to Mughal relics.",
  },
  {
    id: 3,
    name: "Naturalia & Geology",
    time: "Entry Time: 11:30hrs",
    desc: "Discover the natural world — fossils, minerals, and ecological specimens.",
  },
  {
    id: 4,
    name: "Textile & Decorative Arts",
    time: "Entry Time: 13:00hrs",
    desc: "Immerse in centuries of Indian craftsmanship, weaving, and ornamental traditions.",
  },
  {
    id: 5,
    name: "Egyptian & World Cultures",
    time: "Entry Time: 14:30hrs",
    desc: "A rare collection bridging India with Egypt and other ancient civilisations.",
  },
];

const TICKET_PRICE = 20;

const days = [
  { month: "May", day: 1 },
  { month: "May", day: 2 },
  { month: "May", day: 3 },
  { month: "May", day: 4 },
  { month: "May", day: 5 },
  { month: "May", day: 6 },
  { month: "May", day: 7 },
  { month: "May", day: 8 },
  { month: "May", day: 9 },
];

const SlotIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#e8f0ec" />
    <polygon points="16,8 20,14 12,14" fill="#6b7280" />
    <rect x="10" y="17" width="5" height="5" rx="1" fill="#6b7280" />
    <rect x="17" y="17" width="5" height="5" rx="1" fill="#6b7280" />
  </svg>
);

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(2);
  const [adults, setAdults] = useState(1);

  const total = adults * TICKET_PRICE;
  const handlePayment = async ()=>{
    try {
      const res = await api.post("/api/create-payment",{
        amount :total
      });
      const order = res.data;
      openRazorpay(order);
      console.log(order);
    }
    catch (error){
      console.log(error);
    }
  };
  const openRazorpay = (order) =>{
  const options ={
    key : "YOUR_RAZORPAY_KEY",
    amount:order.amount,
    currency:order.currency,
    order_id: order.order_id,
    name :"MuseumBooking",
  
    handler: async function (response){
      await verifyPayment(response,order);
    }
  };
  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
  };
  const verifyPayment = async (response,order) =>{
    try {
      const res = await api.post("/api/verify-payment",{
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature
      }); navigate("/success");
    } catch (error) {
      console.log(error);
      navigate("/failed")
    }
  };
  return (
     <div className="body">
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#f0f7f2",
        fontFamily: "'Lora', 'Georgia', serif",
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          border: "2px solid #7c5cbf",
          background: "#f0f7f2",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <div className="p-4 md:p-8 lg:p-12">
          {/* Header */}
          <h1
            className="text-3xl md:text-4xl font-black mb-1 tracking-tight"
            style={{ color: "#111", fontFamily: "'Lora', serif" }}
          >
            Indian Museum Tour
          </h1>
          <p className="text-sm mb-6" style={{ color: "#555" }}>
            Other Details
          </p>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column */}
            <div className="flex-1">
              {/* Date Picker */}
              <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
                {days.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedDay(i)}
                    className="flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl transition-all duration-200"
                    style={{
                      background:
                        selectedDay === i ? "#1a5c40" : "transparent",
                      color: selectedDay === i ? "#fff" : "#333",
                      border:
                        selectedDay === i
                          ? "2px solid #1a5c40"
                          : "2px solid transparent",
                      minWidth: "52px",
                    }}
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider opacity-70">
                      {d.month}
                    </span>
                    <span className="text-2xl font-black">{d.day}</span>
                  </button>
                ))}
              </div>

              {/* Slot List */}
              <div className="flex flex-col gap-3">
                {slots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot.id)}
                    className="flex items-center gap-4 text-left p-3 rounded-xl transition-all duration-200 w-full"
                    style={{
                      background:
                        selectedSlot === slot.id ? "#fff" : "transparent",
                      border:
                        selectedSlot === slot.id
                          ? "2px solid #1a5c40"
                          : "2px solid transparent",
                      borderBottom:
                        selectedSlot !== slot.id
                          ? "1px solid #d1ddd5"
                          : undefined,
                    }}
                  >
                    <div className="flex-shrink-0">
                      <SlotIcon />
                    </div>
                    <div>
                      <p
                        className="font-semibold text-sm"
                        style={{ color: "#111" }}
                      >
                        {slot.name}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "#666" }}>
                        {slot.time}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "#888" }}>
                        {slot.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column — Summary */}
            <div className="w-full lg:w-96 flex flex-col gap-4">
              <div
                className="rounded-2xl p-5"
                style={{ background: "#fff", border: "1px solid #d1ddd5" }}
              >
                {/* Ticket Summary */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm font-medium" style={{ color: "#333" }}>
                      Museum Entry Ticket
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs" style={{ color: "#666" }}>
                        Adults:
                      </span>
                      <button
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="w-5 h-5 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ background: "#e8f0ec", color: "#1a5c40" }}
                      >
                        −
                      </button>
                      <span className="text-sm font-semibold w-4 text-center">
                        {adults}
                      </span>
                      <button
                        onClick={() => setAdults(adults + 1)}
                        className="w-5 h-5 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ background: "#e8f0ec", color: "#1a5c40" }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <p className="font-bold text-lg" style={{ color: "#111" }}>
                    ${adults * TICKET_PRICE}
                  </p>
                </div>

                <hr style={{ borderColor: "#d1ddd5" }} />

                <div className="flex justify-between items-center mt-3">
                  <p className="font-bold text-base" style={{ color: "#111" }}>
                    Total
                  </p>
                  <p className="font-black text-xl" style={{ color: "#111" }}>
                    ${total}
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <button
                className="w-full py-4 rounded-full font-bold text-base tracking-wide transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{ background: "#1a5c40", color: "#fff" }}
              >
                Add to Cart
              </button>
              <button onClick = {handlePayment}
                className="w-full py-4 rounded-full font-bold text-base tracking-wide transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{ background: "#1a5c40", color: "#fff" }}
              >
                Buy Now
              </button>

              {/* Info note */}
              <p
                className="text-xs text-center mt-1"
                style={{ color: "#888" }}
              >
                Tickets are non-refundable once booked.
              </p>
            </div>
          </div>
        </div>
      </div>

     <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        html, body, #root { margin: 0; padding: 0; width: 100%; overflow-x: hidden; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style></div>
    </div>
  );
}