import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GuideRegistration = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [languages, setLanguages] = useState(""); // comma separated
  const [experience, setExperience] = useState(""); // in years

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!name.trim()) return "Full name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (!location.trim()) return "Location is required.";
    if (!gender) return "Please select your gender.";
    const ageNum = Number(age);
    if (!age || Number.isNaN(ageNum) || ageNum < 10 || ageNum > 120) return "Enter a valid age (10-120).";
    if (!languages.trim()) return "Languages field is required (e.g. Hindi, English).";
    const expNum = Number(experience);
    if (experience === "" || Number.isNaN(expNum) || expNum < 0) return "Enter a valid experience (>= 0).";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationMsg = validate();
    if (validationMsg) return setError(validationMsg);

    try {
      setLoading(true);
      const payload = {
        name: name.trim(),
        email: email.trim(),
        password,
        location: location.trim(),
        gender,
        age: Number(age),
        languages: languages.trim(), // backend can split if needed
        experience: Number(experience),
      };

      const res = await axios.post(
        "https://project1-backend-vn8m.onrender.com/api/guide/register",
        payload,
        { withCredentials: true }
      );

      if (res.status === 201 || res.status === 200) {
        setSuccess("Registration successful! Redirecting...");
        setTimeout(() => navigate("/logingguide"), 1200);
      } else {
        setError(res.data?.message || "Registration failed.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-gray-900 to-black px-4">
      <div className="w-full max-w-lg bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Guide Registration</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div>
            <label className="text-sm text-gray-300">Full Name</label>
            <input
              type="text"
              className="mt-1 w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              className="mt-1 w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Password</label>
            <input
              type="password"
              className="mt-1 w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Location</label>
            <input
              type="text"
              className="mt-1 w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City / State"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Gender</label>
            <select
              className="mt-1 w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-blue-500"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="" disabled>Select gender</option>
              <option value="Male" className="text-black">Male</option>
              <option value="Female" className="text-black">Female</option>
              <option value="Other" className="text-black">Other</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-300">Age</label>
            <input
              type="number"
              min="10"
              max="120"
              className="mt-1 w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
              required
            />
          </div>

          {/* Languages */}
          <div>
            <label className="text-sm text-gray-300">Languages Known</label>
            <input
              type="text"
              className="mt-1 w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
              placeholder="e.g. Hindi, English, Bengali (comma separated)"
              required
            />
          </div>

          {/* Experience */}
          <div>
            <label className="text-sm text-gray-300">Experience (years)</label>
            <input
              type="number"
              min="0"
              className="mt-1 w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Enter years of experience"
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition"
          >
            {loading ? "Processing..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default GuideRegistration;
