"use client";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({
    name: "",
    rating: 5,
    comment: "",
  });

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error("Reviews fetch error:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Handle form change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit review
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to submit review");
      setForm({ name: "", rating: 5, comment: "" });
      fetchReviews();
    } catch (err) {
      console.error("Review submit error:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-24 pb-20">
      <Navbar />
      <h1 className="text-3xl font-bold text-center mb-6">Reviews</h1>

      {/* Review Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 p-4 border rounded-lg space-y-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />

        <select
          name="rating"
          value={form.rating}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          {[5, 4, 3, 2, 1].map((num) => (
            <option key={num} value={num}>
              {num} Star{num > 1 && "s"}
            </option>
          ))}
        </select>

        <textarea
          name="comment"
          placeholder="Write your review"
          value={form.comment}
          onChange={handleChange}
          required
          rows={4}
          className="w-full border px-3 py-2 rounded"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Submit Review
        </button>
      </form>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="p-4 border rounded-lg">
            <div className="flex justify-between">
              <h3 className="font-semibold">{review.name}</h3>
              <span className="text-yellow-500">
                {"★".repeat(review.rating)}
              </span>
            </div>
            <p className="text-gray-700 mt-1">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
