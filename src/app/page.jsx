"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import ServiceCards from "@/components/ServiceCards";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleUpload = async () => {
    if (!file) return alert("Please select an image first.");

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: reader.result }),
      });

      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
      } else {
        alert("Upload failed!");
      }
    };
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white pt-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="/wp4065867.jpg"
            alt="Gym Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            AJIMA PHYSICAL FITNESS
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Transform Your Body, Transform Your Life
          </p>
          <p className="text-lg md:text-xl mb-12 text-gray-300 max-w-2xl mx-auto">
            Join Nepal's premier fitness center and embark on your journey to a
            healthier, stronger you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/Membership-Plans">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition duration-300 transform hover:scale-105">
                View Membership Plans
              </button>
            </Link>
            <Link href="/ContactUs">
              <button className="border-2 border-white hover:bg-white hover:text-black text-white font-bold py-4 px-8 rounded-lg text-lg transition duration-300 transform hover:scale-105">
                Contact Us Today
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Upload Section for Trainers */}
      <section className="py-16 bg-gray-100 text-center">
        <h2 className="text-4xl font-bold mb-6">Upload Trainer Image ☁️</h2>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-4"
        />
        <button
          onClick={handleUpload}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md"
        >
          Upload
        </button>

        {imageUrl && (
          <div className="mt-6">
            <p className="mb-2">Uploaded Image:</p>
            <img
              src={imageUrl}
              alt="Trainer"
              width="200"
              className="mx-auto rounded-md shadow-lg"
            />
          </div>
        )}
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our comprehensive range of fitness services designed to
              help you reach your goals
            </p>
          </div>
          <ServiceCards />
        </div>
      </section>

      <Footer />
    </div>
  );
}
