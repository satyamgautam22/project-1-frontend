import React, { useEffect, useMemo, useState } from "react";
import api from "../api.js";

export default function GuideBooking() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    location: "",
    date: "",
    time: "",
    budget: "",
    experience: "", // NEW: min experience filter
  });

  const [meta, setMeta] = useState({
    locations: [],
    experiences: [], // e.g., [0,1,2,3,5,7,10]
  });

  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const canSearch = useMemo(() => {
    return (
      form.name &&
      form.email &&
      form.mobile &&
      form.location &&
      form.date &&
      form.time &&
      form.budget
    );
  }, [form]);

  // ---- Fetch meta (locations & experiences) from backend ----
  useEffect(() => {
    const getMeta = async () => {
      try {
        const res = await api.get(`${import.meta.env.VITE_API_URL}/api/guide/meta`);
        const { locations = [], experiences = [] } = res.data || {};
        setMeta({
          locations: Array.isArray(locations) ? locations : [],
          experiences: Array.isArray(experiences) ? experiences : [],
        });
      } catch {
        // Graceful fallback: no meta endpoint available
        setMeta({ locations: [], experiences: [] });
      }
    };
    getMeta();
  }, []);

  const searchGuides = async (e) => {
    e.preventDefault();
    if (!canSearch) return setError("Please fill all fields before searching.");
    setSearching(true);
    setError("");

    try {
      let res;

      if (form.experience) {
        const params = new URLSearchParams({
          location: form.location,
          minExp: String(form.experience),
          budget: String(form.budget)
        });
        try {
          res = await api.get(
            `${import.meta.env.VITE_API_URL}/api/guide/search?${params.toString()}`
          );
        } catch {
          // Fallback to old endpoint without experience filter
          res = await api.get(
            `${import.meta.env.VITE_API_URL}/api/guide/${encodeURIComponent(form.location,form.experience,form.budget)}`
          );
        }
      } else {
        // Original endpoint (location only)
        res = await api.get(
          `${import.meta.env.VITE_API_URL}/api/guide/${encodeURIComponent(form.location,form.experience,form.budget)}`
        );
      }

      const list = res.data?.guides || [];
      setGuides(list);
      if (list.length === 0) setError("No guide found with these filters.");
    } catch (err) {
      setGuides([]);
      setError(err?.response?.data?.message || "No guide found in this location.");
    } finally {
      setSearching(false);
    }
  };

  const bookGuide = async (guideId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("You must be logged in to book a guide.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      // create booking
      const create = await api.post(
        `${import.meta.env.VITE_API_URL}/api/booking/createbooking`,
        { ...form, guideId, userId }
      );
      const bookingId = create.data?.booking?._id;

      // Stripe checkout
      const checkout = await api.post(
        `${import.meta.env.VITE_API_URL}/api/booking/create-checkout-session`,
        { bookingId }
      );
      window.location.href = checkout.data.url;
    } catch (err) {
      setError(err?.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-white/10">
        <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute -top-16 right-0 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="mx-auto max-w-6xl px-4 py-12 text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold text-white">
            Book a Local Guide
          </h1>
          <p className="mt-2 text-slate-300">
            Tell us your plan and we’ll show available guides at your destination.
          </p>
        </div>
      </header>

      {/* Form + Results */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Form */}
          <form
            onSubmit={searchGuides}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-slate-600">Name</label>
                <input
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20"
                  name="name"
                  placeholder="Your full name"
                  onChange={onChange}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-slate-600">Email</label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20"
                  name="email"
                  placeholder="you@example.com"
                  onChange={onChange}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-slate-600">Mobile</label>
                <input
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20"
                  name="mobile"
                  placeholder="9876543210"
                  onChange={onChange}
                  required
                />
              </div>

              {/* Location: prefer backend-provided options, fallback to free text */}
              <div>
                <label className="mb-1 block text-sm text-slate-600">Location</label>
                {meta.locations.length > 0 ? (
                  <select
                    name="location"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 bg-white"
                    value={form.location}
                    onChange={onChange}
                    required
                  >
                    <option value="">Select a location</option>
                    {meta.locations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20"
                    name="location"
                    placeholder="e.g., Agra"
                    onChange={onChange}
                    required
                  />
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm text-slate-600">Date</label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20"
                  name="date"
                  onChange={onChange}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-slate-600">Time</label>
                <input
                  type="time"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20"
                  name="time"
                  onChange={onChange}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm text-slate-600">Budget (₹)</label>
                <input
                  type="number"
                  min="0"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20"
                  name="budget"
                  placeholder="1500"
                  onChange={onChange}
                  required
                />
              </div>

              {/* Experience filter (from backend meta) */}
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm text-slate-600">
                  Minimum Experience (years)
                </label>
                {meta.experiences.length > 0 ? (
                  <select
                    name="experience"
                    value={form.experience}
                    onChange={onChange}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 bg-white"
                  >
                    <option value="">Any</option>
                    {meta.experiences.map((yr) => (
                      <option key={yr} value={yr}>{yr}+ years</option>
                    ))}
                  </select>
                ) : (
                  <input
                    name="experience"
                    type="number"
                    min="0"
                    placeholder="Any"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20"
                    onChange={onChange}
                  />
                )}
              </div>
            </div>

            {error && (
              <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-amber-800">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!canSearch || searching}
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-sky-500 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {searching ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                  Searching…
                </span>
              ) : (
                "Search Guides"
              )}
            </button>
          </form>

          {/* Results */}
          <section>
            {guides.length > 0 ? (
              <>
                <h2 className="mb-3 text-lg font-semibold text-white">Available Guides</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {guides.map((g) => (
                    <article key={g._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-full border border-slate-200 bg-slate-100" />
                        <div>
                          <h3 className="text-base font-semibold text-slate-900">{g.name}</h3>
                          {/* Location from backend */}
                          <p className="text-xs text-slate-600">Location: {g.location ?? form.location}</p>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                        {/* Experience from backend */}
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
                          <p className="text-slate-600">Experience</p>
                          <p className="font-semibold">{g.experience ?? "—"} yrs</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
                          <p className="text-slate-600">Language</p>
                          <p className="font-semibold">{g.language ?? form.language}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-between items-center">
                        <p className="text-sm text-slate-600">
                          {/* Optional: show guide's rate if backend provides it */}
                          {g.rate ? <>Rate: <span className="font-semibold">₹{g.rate}</span></> : <span>&nbsp;</span>}
                        </p>
                        <button
                          onClick={() => bookGuide(g._id)}
                          disabled={loading}
                          className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                          title={loading ? "Processing…" : "Proceed to payment"}
                        >
                          {loading ? (
                            <span className="inline-flex items-center gap-2">
                              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                              </svg>
                              Processing…
                            </span>
                          ) : (
                            "Book this guide"
                          )}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                <p className="text-slate-300">Search to see available guides here.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
