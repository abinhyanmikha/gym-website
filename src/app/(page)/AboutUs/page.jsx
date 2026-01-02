"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceCards from "@/components/ServiceCards";

export default function AboutUs() {
  const [trainers, setTrainers] = useState([]);

  // Fetch trainers from MongoDB on page load
  useEffect(() => {
    fetch("/api/trainers")
      .then((res) => res.json())
      .then((data) => setTrainers(data.trainers))
      .catch(console.error);
  }, []);

  return (
    <div className="w-screen bg-gray-100">
      <Navbar />

      {/* Hero Section */}
      <div className="relative w-full h-[250px]">
        <Image src="/gym.PNG" alt="About Us" priority fill />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-center mb-2 pb-1.5">
          Welcome to Ajima Physical Fitness
        </h1>
        <p className="text-lg text-black-300 mx-auto  font-stretch-condensed">
          Welcome to Ajima Physical Fitness At <b>Ajima Physical Fitness</b>,
          we’re passionate about helping you build strength, boost confidence,
          and live a healthier lifestyle. Located in the heart of Bhaktapur,
          Nepal, our fitness center is a community-focused space where people of
          all ages and fitness levels can train, improve, and transform their
          bodies.
        </p>
      </div>
      {/* Trainers Section */}
      <section className="w-full p-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mt-8">
          Meet Our Trainers
        </h1>
        <div className="flex flex-wrap justify-center gap-12 mt-8">
          {trainers.map((trainer) => (
            <div
              key={trainer._id}
              className="flex flex-col items-center text-center"
            >
              <Image
                src={trainer.imageUrl}
                alt={trainer.name}
                width={200}
                height={200}
                className="rounded-full object-cover"
              />
              <h2 className="text-xl sm:text-2xl font-bold mt-2">
                {trainer.name}
              </h2>
            </div>
          ))}
        </div>
      </section>

      <ServiceCards />
      <Footer />
    </div>
  );
}
