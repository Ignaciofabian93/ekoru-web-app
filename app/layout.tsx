import { Cabin } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/Toast/ToastProvider";

const cabin = Cabin({
  variable: "--font-cabin",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${cabin.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground overflow-x-hidden">
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
