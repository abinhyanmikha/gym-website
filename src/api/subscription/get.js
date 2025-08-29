import dbConnect from "@/lib/mongodb";
import Subscription from "@/models/Subscription";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await dbConnect();

    const subscriptions = await Subscription.find({});
    return res.status(200).json(subscriptions);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
