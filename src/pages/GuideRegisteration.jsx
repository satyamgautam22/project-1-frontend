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
    if (!age || Number.isNaN(ageNum) || ageNum < 10 || ageNum > 120)
      return "Enter a valid age (10-120).";
    if (!languages.trim())
      return "Languages field is required (e.g. Hindi, English).";
    const expNum = Number(experience);
    if (experience === "" || Number.isNaN(expNum) || expNum < 0)
      return "Enter a valid experience (>= 0).";
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
        languages: languages.trim(),
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
    <div className="min-h-screen flex items-center justify-center bg-[#F5F2EB] px-4">
      <div className="w-full max-w-3xl bg-[#FDF7EC] border border-[#E2D7C5] rounded-2xl shadow-xl p-8 md:p-10">
        <h2 className="text-3xl font-semibold text-[#3A2417] mb-2 text-center">
          Guide Registration
        </h2>
        <p className="text-sm text-[#5C4330] text-center mb-6">
          Become a verified local guide and help travelers explore India&apos;s
          heritage.
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-5"
          noValidate
        >
          {/* Full Name */}
          <div>
            <label className="text-sm text-[#5C4330]">Full Name</label>
            <input
              type="text"
              className="mt-1 w-full p-3 rounded-lg bg-[#F5F2EB] border border-[#D8C8AF] text-[#3A2417] placeholder-[#A0896F] focus:ring-2 focus:ring-[#C58F48] focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-[#5C4330]">Email</label>
            <input
              type="email"
              className="mt-1 w-full p-3 rounded-lg bg-[#F5F2EB] border border-[#D8C8AF] text-[#3A2417] placeholder-[#A0896F] focus:ring-2 focus:ring-[#C58F48] focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-[#5C4330]">Password</label>
            <input
              type="password"
              className="mt-1 w-full p-3 rounded-lg bg-[#F5F2EB] border border-[#D8C8AF] text-[#3A2417] placeholder-[#A0896F] focus:ring-2 focus:ring-[#C58F48] focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-sm text-[#5C4330]">Location</label>
            <input
              type="text"
              className="mt-1 w-full p-3 rounded-lg bg-[#F5F2EB] border border-[#D8C8AF] text-[#3A2417] placeholder-[#A0896F] focus:ring-2 focus:ring-[#C58F48] focus:outline-none"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City / State"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className="text-sm text-[#5C4330]">Gender</label>
            <select
              className="mt-1 w-full p-3 rounded-lg bg-[#F5F2EB] border border-[#D8C8AF] text-[#3A2417] focus:ring-2 focus:ring-[#C58F48] focus:outline-none"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="" disabled>
                Select gender
              </option>
              <option value="Male" className="text-black">
                Male
              </option>
              <option value="Female" className="text-black">
                Female
              </option>
              <option value="Other" className="text-black">
                Other
              </option>
            </select>
          </div>

          {/* Age */}
          <div>
            <label className="text-sm text-[#5C4330]">Age</label>
            <input
              type="number"
              min="10"
              max="120"
              className="mt-1 w-full p-3 rounded-lg bg-[#F5F2EB] border border-[#D8C8AF] text-[#3A2417] placeholder-[#A0896F] focus:ring-2 focus:ring-[#C58F48] focus:outline-none"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
              required
            />
          </div>

          {/* Languages */}
          <div className="md:col-span-2">
            <label className="text-sm text-[#5C4330]">Languages Known</label>
            <input
              type="text"
              className="mt-1 w-full p-3 rounded-lg bg-[#F5F2EB] border border-[#D8C8AF] text-[#3A2417] placeholder-[#A0896F] focus:ring-2 focus:ring-[#C58F48] focus:outline-none"
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
              placeholder="e.g. Hindi, English, Bengali (comma separated)"
              required
            />
          </div>

          {/* Experience */}
          <div className="md:col-span-2 md:max-w-xs">
            <label className="text-sm text-[#5C4330]">Experience (years)</label>
            <input
              type="number"
              min="0"
              className="mt-1 w-full p-3 rounded-lg bg-[#F5F2EB] border border-[#D8C8AF] text-[#3A2417] placeholder-[#A0896F] focus:ring-2 focus:ring-[#C58F48] focus:outline-none"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Enter years of experience"
              required
            />
          </div>

          {/* Messages */}
          <div className="md:col-span-2 space-y-1">
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3 rounded-full bg-[#8B5E3C] text-white font-semibold hover:bg-[#6C452A] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Register"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-sm text-[#5C4330] text-center">
          Already have an account?{" "}
          <a href="/login" className="text-[#8B5E3C] hover:underline font-medium">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default GuideRegistration;
