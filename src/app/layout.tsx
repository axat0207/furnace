import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Sidebar } from "@/components/layout/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FURNACE",
  description: "Refine yourself in the fire. High-performance personal OS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-16 md:ml-72 transition-all duration-300 p-8 overflow-y-auto h-screen">
              <div className="max-w-4xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
