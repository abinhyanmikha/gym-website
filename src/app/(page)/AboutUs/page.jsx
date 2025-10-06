"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ServiceCards from "@/components/ServiceCards";
import Image from "next/image";

export default function AboutUs() {
  return (
    <div className="w-screen bg-gray-100">
      <header>
        <Navbar />
      </header>
      {/* Hero Image */}
      <div className="relative w-full h-[250px]">
        <Image src="/gym.PNG" alt="About Us" priority fill />
      </div>

      {/* Intro Section */}
      <div className="w-full flex flex-col lg:flex-row gap-6 p-6">
        <div className="w-full lg:w-1/2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-4 text-center lg:text-left">
            Transform Your Body, Transform Your Life - Only at Ajima
          </h1>
          <p className="text-base sm:text-lg mt-4 text-center lg:text-left">
            At <b>Ajima Physical Fitness</b>, we believe you don’t need fancy
            machines to build real strength. What matters is the right guidance,
            consistency, and equipment that works. That’s why we focus on
            providing a personalized training experience led by a dedicated
            trainer, using tried-and-true equipment that effectively targets
            every muscle group.
          </p>
          <p className="text-base sm:text-lg mt-2 text-center lg:text-left">
            Our gym may not have the newest high-tech machines, but we have
            everything you need to achieve real results. From strength training
            to endurance building, every workout is designed to match your
            fitness level and personal goals.
          </p>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <Image
            src="/2574152.jpg"
            alt="Gym Equipment"
            width={500}
            height={400}
            className="rounded-2xl shadow-lg"
          />
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-blue-600 mt-4 p-6 rounded-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-center">
          Our Mission
        </h2>
        <p className="text-base sm:text-lg mt-4 text-center">
          <b>
            “Our mission is to guide every individual towards strength,
            confidence, and a healthier lifestyle through personalized training
            and effective workouts with essential equipment.”
          </b>
        </p>
      </div>

      {/* Why Choose Us Section */}
      <section className="w-full flex flex-col lg:flex-row items-center justify-center bg-gray-100 p-6 gap-6">
        <div className="w-full lg:w-1/2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            Why Choose Ajima?
          </h1>
          <p className="mt-2 text-base sm:text-lg">
            At <b>Ajima Physical Fitness</b>, you get more than just a gym
            membership – you get personal guidance from a dedicated trainer who
            truly cares about your progress. With customized workout plans and
            one-on-one support, your fitness journey is always tailored to your
            goals and abilities.
          </p>
          <p className="mt-2 text-base sm:text-lg">
            We may not have the latest flashy machines, but we have everything
            needed to target every muscle group effectively. Combined with the
            right training, motivation, and a friendly environment, Ajima is the
            perfect place to build strength, confidence, and a healthier
            lifestyle.
          </p>
        </div>

        <div className="w-full lg:w-1/2 bg-gray-200 p-4 rounded-lg">
          <ServiceCards />
        </div>
      </section>

      {/* Trainers Section */}
      <section className="w-full p-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mt-8">
          Meet Our Trainer
        </h1>
        <div className="flex flex-wrap justify-center gap-12 mt-8">
          <div className="flex flex-col items-center text-center">
            <Image
              src="/trainer.jpg"
              alt="Ram Krishna Tamakhu"
              width={200}
              height={200}
              className="rounded-full object-cover"
            />
            <h2 className="text-xl sm:text-2xl font-bold mt-2">
              Ram Krishna Tamakhu
            </h2>
          </div>

          <div className="flex flex-col items-center text-center">
            <Image
              src="/trainer1.jpg"
              alt="Keshab Naga"
              width={200}
              height={200}
              className="rounded-full object-cover"
            />
            <h2 className="text-xl sm:text-2xl font-bold mt-2">Keshab Naga</h2>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
