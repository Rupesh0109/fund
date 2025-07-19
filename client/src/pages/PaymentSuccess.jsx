import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const email = query.get("email");
    const plan = query.get("plan");
    const session_id = query.get("session_id");

    if (!email || !plan || !session_id) {
      setError("Missing payment information.");
      return;
    }

    const recordPayment = async () => {
      try {
        const response = await api.get(
          `/stripe/record-payment?email=${encodeURIComponent(email)}&plan=${plan}&session_id=${session_id}`
        );
        console.log("response ", response);
        if (response.data.success) {
          await api.get("/auth/me");
          navigate("/register-campaign");
          if (response.data.message && response.data.message !== "Payment recorded successfully") {
            alert(response.data.message);
          }
        } else {
          setError("Failed to record payment. Please contact support.");
        }
      } catch (err) {
        console.error("Error recording payment:", err);
        setError("Failed to record payment. Please contact support.");
      }
    };

    recordPayment();
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen bg-[#0C1023] flex items-center justify-center px-4">
      <div className="bg-[#151a33] p-8 rounded-xl shadow-lg w-full max-w-lg text-white text-center">
        {error ? (
          <div className="text-red-500 text-lg font-medium">{error}</div>
        ) : (
          <>
            <div className="loader mb-6 mx-auto border-4 border-purple-600 border-t-transparent w-12 h-12 rounded-full animate-spin"></div>
            <p className="text-lg">Processing your payment, please wait...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
