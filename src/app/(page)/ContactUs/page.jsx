"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    try {
      const res = await fetch("/api/ContactUs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setForm({ name: "", email: "", message: "" });
        setSuccess("Message sent successfully ✅");
      } else {
        setSuccess(data.error || "Something went wrong");
      }
    } catch (error) {
      setSuccess("Server error");
    }

    setLoading(false);
  };

return (
  <div>
    <Navbar />

    <div className="max-w-5xl mx-auto px-4 pt-24 pb-20 flex flex-col md:flex-row gap-12">

      {/* Left Section */}
      <div
        className="flex-1 text-gray-600"
        style={{ fontFamily: "Times New Roman, serif" }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-black">
          Contact Us
        </h1>

        <p className="mt-4 leading-relaxed">
          Have questions about our gym, membership or trainers?
          <br />
          Feel free to reach out!
          <br />
          We are here to help you on your fitness journey.
        </p>

        <p className="mt-4">Bhaktapur, Nepal</p>

        <p className="flex items-center gap-2 mt-3">
          <img src="/phone.svg" alt="Phone Icon" width={20} height={20} />
          +977 9800000000
        </p>

        <p className="flex items-center gap-2 mt-3">
          <img src="/email.svg" alt="Email Icon" width={20} height={20} />
          support@gym.com
        </p>
      </div>

      {/* Right Section (Form) */}
      <div className="flex-1">
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
          />

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows="4"
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
          />

          <button
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>

          {success && (
            <p className="text-sm text-green-600 text-center">{success}</p>
          )}
        </form>
      </div>

    </div>
  </div>
);

}
