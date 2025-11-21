import type { Metadata } from "next";
import "./globals.css";
import { personalData } from "@/lib/data";

export const metadata: Metadata = {
  title: `${personalData.name} - ${personalData.role}`,
  description: personalData.description,
  keywords: ["portfolio", "developer", "full stack", "web development"],
  authors: [{ name: personalData.name }],
  openGraph: {
    title: `${personalData.name} - ${personalData.role}`,
    description: personalData.description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=JetBrains+Mono:wght@100..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
