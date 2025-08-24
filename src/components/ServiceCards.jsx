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
  return (
    <div className="bg-white rounded-lg p-6 shadow-md flex items-center space-x-4 min-w-[200px]">
      <h3 className="text-gray-800 text-lg font-semibold">{title}</h3>
    </div>
  );
};

export default ServiceCards;
