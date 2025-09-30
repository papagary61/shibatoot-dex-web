import "./globals.css";
import type { ReactNode } from "react";
import { Providers } from "../components/Providers";
import { Header } from "../components/Header";

export const metadata = {
  title: "ShibaToot DEX",
  description: "A lightweight DEX with CP pools and referrals"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main className="max-w-5xl mx-auto p-4">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
