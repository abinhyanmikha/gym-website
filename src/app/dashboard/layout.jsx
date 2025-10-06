import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardNav from "@/components/DashboardNav";

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNav />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}