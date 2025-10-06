import React from "react";

// This is the main component that renders all the cards
const ServiceCards = () => {
  const services = [
    {
      title: "Experienced Trainer",
    },
    {
      title: "Gym & Cardio",
    },
    {
      title: "Personal Training",
    },
    {
      title: "Body Building",
    },
    {
      title: "Weight Loss/Gain",
    },
    {
      title: "Diet & Nutrition Plan",
    },
    {
      title: "Weight Training",
    },
  ];

  return (
    <div className="flex flex-wrap gap-12 p-8">
      {services.map((service, index) => (
        <Card key={index} title={service.title} />
      ))}
    </div>
  );
};

// This is the reusable Card component
const Card = ({ title, icon }) => {
  // Simple icon mapping based on title
  const getIconEmoji = (title) => {
    const iconMap = {
      "Experienced Trainer": "👨‍🏫",
      "Gym & Cardio": "🏃‍♂️",
      "Personal Training": "💪",
      "Body Building": "🏋️‍♂️",
      "Weight Loss/Gain": "⚖️",
      "Diet & Nutrition Plan": "🥗",
      "Weight Training": "🏋️"
    };
    return iconMap[title] || "🔍";
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md flex items-center space-x-4 min-w-[200px] hover:shadow-lg transition-shadow">
      <span className="text-2xl" role="img" aria-label={title}>
        {getIconEmoji(title)}
      </span>
      <h3 className="text-gray-800 text-lg font-semibold">{title}</h3>
    </div>
  );
};

export default ServiceCards;
