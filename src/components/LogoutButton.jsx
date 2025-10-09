"use client"; // must be at the top

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const handleLogout = async () => {
    console.log('Logging out with callback URL:', `${window.location.origin}/login`);
    await signOut({ 
      callbackUrl: `${window.location.origin}/login`,
      redirect: true 
    });
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: "10px",
        backgroundColor: "#ff0000",
        color: "#fff",
        border: "none",
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  );
}
