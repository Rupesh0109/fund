import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { register } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await register(name, email, password);
      navigate("/pricing");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0C1023] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#151a33] p-8 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Create Your Account</h2>
        {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full p-3 rounded bg-[#0f1327] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full p-3 rounded bg-[#0f1327] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 rounded bg-[#0f1327] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded font-semibold text-white hover:opacity-90 transition"
          >
            Register & Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
