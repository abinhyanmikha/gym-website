import React from "react";
import LogoutButton from "@/components/LogoutButton";

const PageHeader = ({ title, showLogout = true }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      {showLogout && <LogoutButton />}
    </div>
  );
};

export default PageHeader;
