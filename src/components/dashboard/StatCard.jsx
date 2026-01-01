import React from "react";

const StatCard = ({ title, value, bgColor = "bg-blue-100", textColor = "text-gray-800" }) => {
  return (
    <div className={`${bgColor} p-4 rounded-lg shadow`}>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
    </div>
  );
};

export default StatCard;
