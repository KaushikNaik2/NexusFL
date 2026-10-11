import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-dm-sans",
});

export const metadata = {
  title: "NexusFL — Federated Intelligence Matrix",
  description: "Decentralized Cross-Bank Federated Intelligence Matrix for real-time fraud detection and privacy-preserving model aggregation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}

