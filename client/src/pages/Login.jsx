import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const from = location.state?.from || "/pricing";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0C1023] flex items-center justify-center px-4">
      <div className="bg-[#151a33] p-8 rounded-xl shadow-lg w-full max-w-md text-white">
        <h2 className="text-3xl font-bold mb-6 text-center">Welcome Back 👋</h2>
        {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-300">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 bg-[#1e2544] text-white rounded outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-300">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 bg-[#1e2544] text-white rounded outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white py-3 rounded font-medium"
          >
            Login
          </button>
        </form>
        <p className="text-gray-400 text-sm mt-4 text-center">
          Don't have an account?{" "}
          <span
            className="text-purple-400 cursor-pointer underline"
            onClick={() => navigate("/register")}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
  