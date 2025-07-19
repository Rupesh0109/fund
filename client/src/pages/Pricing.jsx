import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCheckout = async (plan) => {
    if (!user?.email) return navigate("/login", { state: { from: "/" } });

    try {
      const res = await api.post("/stripe/create-checkout-session", {
        plan,
        email: user.email,
      });
      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
      if (
        err.response?.status === 400 &&
        err.response.data.message?.includes("unused payment")
      ) {
        alert("You’ve already paid. Proceed to campaign registration.");
        navigate("/register-campaign");
      } else {
        alert("Something went wrong during checkout.");
      }
    }
  };

  return (
    <div className="bg-[#0C1023] text-white min-h-screen">
      {/* ✅ Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-6 py-12 max-w-6xl mx-auto">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Create Fundraiser Campaigns <br /> With Ease 💡
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            No Tip Fundraiser helps you launch transparent campaigns with document
            verification and secure payments.
          </p>
          <p className="mt-2 text-yellow-400 font-semibold">
            🎯 No Tipping. No Platform Fees. 100%* of the donation goes to you.
          </p>
          <button
            onClick={() => document.getElementById("pricing").scrollIntoView({ behavior: "smooth" })}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded text-white font-semibold shadow hover:opacity-90 transition"
          >
            Get Started
          </button>
        </div>
        <img
          src="https://images.unsplash.com/photo-1607746882042-944635dfe10e"
          alt="Hero"
          className="w-full md:w-1/2 rounded-lg shadow-lg"
        />
      </section>

      {/* ✅ Features */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-300">
          <div className="bg-[#151a33] p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-white">1. Select a Plan</h3>
            <p className="mt-2">Choose the pricing tier based on your needs. Basic, Standard, or Video.</p>
          </div>
          <div className="bg-[#151a33] p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-white">2. Verify Documents</h3>
            <p className="mt-2">Upload valid ID, utility bills, and campaign documents securely.</p>
          </div>
          <div className="bg-[#151a33] p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-white">3. Launch Your Campaign</h3>
            <p className="mt-2">Once approved, your fundraiser goes live.</p>
          </div>
        </div>
      </section>

      {/* ✅ Pricing Plans */}
      <section id="pricing" className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-2 text-center">Choose Your Plan</h2>
        <p className="text-center text-gray-400 mb-10">
          You keep <span className="text-green-400 font-semibold">100% of the donation</span> amount you raise*
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-white">
          {["basic", "standard", "video"].map((plan) => (
            <div key={plan} className="bg-[#1c223a] p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-2xl font-semibold capitalize mb-2">{plan} Plan</h3>
              <p className="text-xl mb-4 font-bold">
                ${plan === "standard" ? 40 : 20}
              </p>
              <button
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 px-6 rounded hover:opacity-90 transition"
                onClick={() => handleCheckout(plan)}
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Final CTA */}
      <section className="text-center py-12 bg-[#0F1327]">
        <h3 className="text-2xl font-semibold">Ready to Raise Funds with Confidence?</h3>
        <p className="mt-2 text-sm text-gray-400">Join hundreds using a no-tip fundraising platform.</p>
        <button
          onClick={() => navigate(user ? "/register-campaign" : "/login")}
          className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded text-white font-semibold"
        >
          {user ? "Register Campaign" : "Login to Continue"}
        </button>
      </section>

      {/* ✅ Footer Disclaimer */}
      <footer className="text-center py-6 text-gray-400 text-sm bg-[#0C1023] border-t border-gray-800">
        *You keep 100% of donations <strong>less standard payment processing fees</strong> (e.g., Stripe fees). No tips. No platform cuts.
      </footer>
    </div>
  );
};

export default Pricing;
