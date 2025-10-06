"use client"; // must be at the top

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
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
