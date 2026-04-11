import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solaris Health — Patient Booking Portal",
  description:
    "Book an appointment with your doctor in under a minute. Browse specialists, pick a time, confirm.",
  openGraph: {
    title: "Solaris Health — Patient Booking Portal",
    description: "Modern patient scheduling for independent practices and clinics.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 font-sans text-slate-900 antialiased transition-colors dark:bg-slate-950 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
