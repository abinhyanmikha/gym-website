import "./globals.css";
import { SessionProvider } from "@/providers/SessionProvider";

export const metadata = {
  title: "My Gym Website",
  description: "Subscription management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning={true}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
