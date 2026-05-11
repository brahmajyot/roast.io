import "./globals.css";

import { Toaster } from "sonner";

export const metadata = {
  title:     "ROAST.IO — AI Portfolio Reviewer & Brutal Developer Portfolio Roast Tool",


  description:
     "AI-powered portfolio reviewer for developers. Get brutal portfolio roasts, recruiter feedback, SEO analysis, performance insights, and actionable improvements instantly with ROAST.IO.",


     icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body>
        <Toaster richColors />

        {children}
      </body>
    </html>
  );
}