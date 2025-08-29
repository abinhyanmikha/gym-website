// src/components/MembershipCard.jsx
"use client";

export default function MembershipCard({
  title,
  features,
  price,
  color,
  duration,
  onChoose,
}) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border-t-4 ${color}`}
    >
      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">
        {title}
      </h2>

      {/* Price */}
      <p className="text-2xl sm:text-3xl font-bold mb-4 text-center">
        RS {Number(price).toLocaleString()} / {duration}
      </p>

      {/* Features */}
      {features && features.length > 0 && (
        <ul className="mb-6 space-y-2 text-gray-700">
          {features.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}

      {/* Button */}
      <button
        className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
        onClick={() => (window.location.href = `/checkout?plan=${title}`)}
      >
        Choose Plan
      </button>
    </div>
  );
}
