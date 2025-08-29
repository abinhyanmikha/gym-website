import "dotenv/config";

import dbConnect from "../lib/mongodb.js";
import Subscription from "../models/Subscription.js";

const plans = [
  {
    name: "Monthly Plan With Cardio",
    price: 3500,
    duration: "Monthly",
    includesCardio: true,
    features: [
      "Full Gym Access",
      "Cardio Machines",
      "Weight Training",
      "Personal Trainer Guidance",
    ],
  },
  {
    name: "Monthly Plan Without Cardio",
    price: 2500,
    duration: "Monthly",
    includesCardio: false,
    features: ["Full Gym Access", "Weight Training"],
  },
  {
    name: "Quarterly Plan With Cardio",
    price: 9500,
    duration: "Quarterly",
    includesCardio: true,
    features: [
      "Full Gym Access",
      "Cardio Machines",
      "Weight Training",
      "Personal Trainer Guidance",
    ],
  },
  {
    name: "Quarterly Plan Without Cardio",
    price: 7000,
    duration: "Quarterly",
    includesCardio: false,
    features: ["Full Gym Access", "Weight Training"],
  },
  {
    name: "Semiannual Plan With Cardio",
    price: 18000,
    duration: "Semiannual",
    includesCardio: true,
    features: [
      "Full Gym Access",
      "Cardio Machines",
      "Weight Training",
      "Personal Trainer Guidance",
    ],
  },
  {
    name: "Semiannual Plan Without Cardio",
    price: 13000,
    duration: "Semiannual",
    includesCardio: false,
    features: ["Full Gym Access", "Weight Training"],
  },
  {
    name: "Annual Plan With Cardio",
    price: 34000,
    duration: "Annual",
    includesCardio: true,
    features: [
      "Full Gym Access",
      "Cardio Machines",
      "Weight Training",
      "Personal Trainer Guidance",
    ],
  },
  {
    name: "Annual Plan Without Cardio",
    price: 25000,
    duration: "Annual",
    includesCardio: false,
    features: ["Full Gym Access", "Weight Training"],
  },
];
async function initSubscriptions() {
  try {
    await dbConnect();
    const existingPlans = await Subscription.find({});
    if (existingPlans.length === 0) {
      await Subscription.insertMany(plans);
      console.log("Subscription plans initialized.");
    } else {
      console.log("Subscription plans already exist. No action taken.");
    }
  } catch (error) {
    console.error("Error initializing subscription plans:", error);
  }
}
initSubscriptions();
