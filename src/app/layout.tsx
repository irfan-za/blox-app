import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

const sora = Sora({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BloX App",
  description:
    "Manage users & blogs efficiently with BloX App. A centralized dashboard for streamlined content creation and user account management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={sora.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
