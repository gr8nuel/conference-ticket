"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "../context/BookingContext";
import ProgressBar from "../../components/ProgressBar";

export default function TicketSelection() {
  const router = useRouter();
  const { updateBookingData } = useBooking();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const tickets = [
    { type: "Free", price: 0, label: "REGULAR ACCESS", available: "15/100 Left" },
    { type: "$100", price: 100, label: "VIP ACCESS", available: "35/60 Left" },
    { type: "$150", price: 150, label: "VVIP ACCESS", available: "20/40 Left" },
  ];

  // Load persisted state from localStorage on mount
  useEffect(() => {
    const storedTicket = localStorage.getItem("selectedTicket");
    const storedQuantity = localStorage.getItem("ticketQuantity");
    if (storedTicket !== null) {
      setSelectedTicket(JSON.parse(storedTicket));
    }
    if (storedQuantity !== null) {
      setQuantity(JSON.parse(storedQuantity));
    }
  }, []);

  // Save state changes to localStorage
  useEffect(() => {
    localStorage.setItem("selectedTicket", JSON.stringify(selectedTicket));
    localStorage.setItem("ticketQuantity", JSON.stringify(quantity));
  }, [selectedTicket, quantity]);

  const handleNext = () => {
    if (selectedTicket === null) return;
    updateBookingData({
      ticket: tickets[selectedTicket],
      quantity: quantity,
    });
    router.push("/tickets/details");
  };

  return (
    <div className="container">
      <div className="header">
        <h3>Ticket Selection</h3>
        <p>Step 1/3</p>
      </div>
      <ProgressBar currentStep={1} totalSteps={3} />

      <div className="child-container">
        <div className="description-container">
          <h1>Tech Nation</h1>
          <p>
            Join us for an unforgettable experience at Tech Nation! Secure your spot
            now.
          </p>
          <p>
            📍Ikeja, Lagos|| March 20, 2025 | 6:00 PM
          </p>
        </div>
        <p>Select Ticket Type:</p>
        <div className="ticket-options">
          <div className="button-container">
            {tickets.map((ticket, index) => (
              <button
                key={index}
                className={`ticket-button ${selectedTicket === index ? "selected" : ""}`}
                onClick={() => setSelectedTicket(index)}
                aria-pressed={selectedTicket === index}
                aria-label={`Select ${ticket.label} ticket costing ${ticket.type}`}
              >
                <p className="ticket-type">{ticket.type}</p>
                <p className="ticket-label">{ticket.label}</p>
                <p className="ticket-available">{ticket.available}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="custom-select-container">
          <label htmlFor="ticket-quantity">Number of Tickets:</label>
          <select
            id="ticket-quantity"
            className="custom-select"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
          >
            {[...Array(5).keys()].map((num) => (
              <option key={num} value={num + 1}>
                {num + 1}
              </option>
            ))}
          </select>
        </div>
        <div className="bottom-button">
          <button
            type="button"
            onClick={() => router.back()}
            className="cancel-button"
            aria-label="Cancel Ticket Selection"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={selectedTicket === null}
            onClick={handleNext}
            className="next-button"
            aria-label="Proceed to Attendee Details"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}