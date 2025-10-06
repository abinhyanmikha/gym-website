"use client";

import { SessionProvider as NextAuthProvider } from "next-auth/react";

export function SessionProvider({ children }) {
  return (
    <NextAuthProvider 
      refetchInterval={0} 
      refetchOnWindowFocus={false}
      onError={(error) => {
        console.log("Auth session error handled:", error);
      }}
    >
      {children}
    </NextAuthProvider>
  );
}
