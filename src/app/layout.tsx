import type { Metadata } from "next";
import { Caveat, Cormorant_Garamond } from "next/font/google";
import localFont from "next/font/local";
import { wedding } from "@/content/wedding";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin", "latin-ext"], weight: ["500", "600"], preload: false });

const general = localFont({
  variable: "--font-general",
  src: [
    { path: "./fonts/GeneralSans-Regular.woff2", weight: "400" },
    { path: "./fonts/GeneralSans-Medium.woff2", weight: "500" },
  ],
});

export const metadata: Metadata = {
  title: `${wedding.bride} & ${wedding.groom} — ${wedding.dateLabel}`,
  description: "Zaproszenie i informacje dla gości weselnych.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true } },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" className={`${cormorant.variable} ${caveat.variable} ${general.variable} antialiased`}>
      <body data-theme="day" className="font-sans text-base leading-relaxed">{children}</body>
    </html>
  );
}
