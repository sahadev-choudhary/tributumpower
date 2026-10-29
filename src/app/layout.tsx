import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AtmosPOLE® — Clean Air. Smart Streets. New India.",
  description:
    "India's air pollution crisis demands an urgent answer. AtmosPOLE® is a solar-powered smart pole that replaces ordinary street lamps while actively purifying the air around it — no disruption, only transformation.",
  keywords: ["AtmosPOLE", "Tributum Power", "India air pollution", "AQI India", "smart pole", "clean air", "smart cities India"],
  openGraph: {
    title: "AtmosPOLE® — Clean Air. Smart Streets. New India.",
    description:
      "India's air pollution crisis demands an urgent answer. AtmosPOLE® replaces ordinary street lamps with solar-powered smart infrastructure that actively fights pollution.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,200;0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;0,14..32,900;1,14..32,300;1,14..32,400&family=DM+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
