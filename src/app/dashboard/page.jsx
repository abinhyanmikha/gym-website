import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Redirect based on user role
  if (session.user.role === "admin") {
    redirect("/dashboard/admin");
  } else {
    redirect("/dashboard/user");
  }
}
