import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Krushnakant Rutele | Full-Stack & App Developer",
  description: "Portfolio of Krushnakant Rutele, a Full-Stack and Android developer skilled in React, Next.js, Node.js, Express, MongoDB, Flutter, and Dart.",
  keywords: ["Krushnakant Rutele", "Full-Stack Developer", "App Developer", "React", "Next.js", "Node.js", "Flutter", "India"],
  authors: [{ name: "Krushnakant Rutele" }],
  openGraph: {
    title: "Krushnakant Rutele | Full-Stack & App Developer",
    description: "Explore my projects, skills, and experience in web and mobile app development.",
    url: "https://krushnakant1979.vercel.app",
    siteName: "Krushnakant Rutele Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
        suppressHydrationWarning
      >
        <ToastProvider>
          <Header />
          <main className="flex-grow pt-16 sm:pt-20">
            {children}
          </main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
