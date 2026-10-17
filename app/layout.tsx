import type { Metadata } from "next";
import { Newsreader, Instrument_Sans } from "next/font/google";
import "./globals.css";

const serif = Newsreader({ subsets: ["latin"], variable: "--font-serif-display" });
const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-sans-body" });

export const metadata: Metadata = { title: "Where did I see that?", description: "Find what you remember" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
