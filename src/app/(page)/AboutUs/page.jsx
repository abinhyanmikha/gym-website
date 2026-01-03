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
    <div className="w-full bg-gray-100 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <div className="relative w-full h-[250px] flex items-center justify-center bg-black">
        <h1 className=" pt-15 text-3xl sm:text-4xl lg:text-6xl text-white font-bold">
          About Us
        </h1>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 ">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center">
          Welcome to Ajima Physical Fitness
        </h2>
        <p>
          At Ajima Physical Fitness, we’re passionate about helping you build
          strength, boost confidence, and live a healthier lifestyle. Located in
          the heart of Bhaktapur, Nepal, our fitness center is a
          community-focused space where people of all ages and fitness levels
          can train, improve, and transform their bodies.
        </p>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center">
          Who we are
        </h2>
        <p>
          Established with the belief that fitness should be accessible,
          supportive, and effective, Ajima Physical Fitness offers a clean,
          welcoming environment equipped with well-maintained strength and
          conditioning equipment. Our center is known for its friendly
          atmosphere, personalized guidance, and trainers who are dedicated to
          helping you reach your goals safely and efficiently.
        </p>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center">
          {" "}
          Our Missions:
        </h2>
        <ul>
          <li>
            To empower each member to achieve their personal fitness goals
          </li>
          <li>To promote health through structured training and motivation</li>
          <li>To create a community where fitness is enjoyed and celebrated</li>
          <li>
            Whether you’re aiming to gain muscle, improve endurance, or enhance
            overall wellbeing, we provide the tools and support you need to
            succeed.
          </li>
        </ul>
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
