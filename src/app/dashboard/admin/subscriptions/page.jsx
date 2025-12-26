import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminSubscriptionsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Check if user is admin
  if (session.user.role !== "admin") {
    redirect("/dashboard/user");
  }

  redirect("/dashboard/admin?tab=subscriptions");
}
