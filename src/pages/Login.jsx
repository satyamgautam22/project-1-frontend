import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL; // e.g. http://localhost:5000

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      // expect: { token, user: { _id, ... } }
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);
      
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-gray-900 to-black px-4">
      <div className="w-full max-w-4xl bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl grid md:grid-cols-2 overflow-hidden">
        {/* Left */}
        <div className="p-8 flex flex-col justify-center bg-gradient-to-b from-blue-800/20 to-transparent">
          <h1 className="text-xl font-semibold text-white mb-4">Welcome Back!</h1>
          <p className="text-gray-300">Login to access your dashboard.</p>
        </div>

        {/* Right (form) */}
        <div className="p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-white mb-6">Login</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-gray-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-1 w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1 w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in…" : "Login"}
            </button>
          </form>

          <p className="text-sm text-gray-400 mt-4">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-blue-400 hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
