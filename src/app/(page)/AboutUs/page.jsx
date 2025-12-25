"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceCards from "@/components/ServiceCards";

export default function AboutUs() {
  const [trainers, setTrainers] = useState([]);
  const [newTrainerName, setNewTrainerName] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch trainers from MongoDB on page load
  useEffect(() => {
    fetch("/api/trainers")
      .then((res) => res.json())
      .then((data) => setTrainers(data.trainers))
      .catch(console.error);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => setImage(reader.result);
  };

  const handleUpload = async () => {
    if (!image || !newTrainerName) return alert("Enter name and select image");
    setLoading(true);

    try {
      const res = await fetch("/api/trainers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTrainerName, imageBase64: image }),
      });
      const data = await res.json();
      if (data.trainer) {
        setTrainers([data.trainer, ...trainers]);
        setImage(null);
        setNewTrainerName("");
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Upload error");
    }

    setLoading(false);
  };

  return (
    <div className="w-screen bg-gray-100">
      <Navbar />

      {/* Hero Section */}
      <div className="relative w-full h-[250px]">
        <Image src="/gym.PNG" alt="About Us" priority fill />
      </div>

      {/* Upload Form */}
      <div className="flex flex-col items-center gap-4 mt-6 p-6 bg-gray-200 rounded-lg">
        <input
          type="text"
          placeholder="Trainer Name"
          value={newTrainerName}
          onChange={(e) => setNewTrainerName(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button
          onClick={handleUpload}
          disabled={loading || !image || !newTrainerName}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Uploading..." : "Upload Trainer"}
        </button>
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
