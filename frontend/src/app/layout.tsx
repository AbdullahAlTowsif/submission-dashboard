import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/shared/Providers";
// ...keep the generated font imports

export const metadata: Metadata = {
  title: "Project Review Dashboard",
  description: "Submit projects and get mentor feedback",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
