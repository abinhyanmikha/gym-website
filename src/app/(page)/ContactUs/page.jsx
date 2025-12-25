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
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-20 flex">
        <div className="font-family-times-new-roman flex-1 text-600">
          <h1 className="text-3xl font-bold">Contact Us</h1>
          <p className="mt-4">
            Have questions about our gym, membership or trainers?
            <br />
            Feel free to reach out!
            <br />
            we are here to help you on your fitness journey.
          </p>
          <p className="mt-4">Bhaktapur,Nepal</p>
          <p className="flex items-center gap-2 mt-3">
            <img
              src="/phone.svg"
              alt="Phone Icon"
              width={20}
              height={20}
              className="mt-3"
            />
            +977 9800000000
          </p>
          <p className="flex items-center gap-2 mt-3">
            <img src="/email.svg" alt="Email Icon" width={20} height={20} />
            support@gym.com
          </p>
        </div>
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full border rounded-lg px-4 py-3"
            />

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="w-full border rounded-lg px-4 py-3"
            />

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your Message"
              rows="4"
              className="w-full border rounded-lg px-4 py-3"
            />

            <button
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
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
