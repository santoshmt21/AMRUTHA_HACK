import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../app/contexts/AuthContext.js";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "VitalDecode - AI Health Report Analysis",
  description: "Understand your health reports instantly with AI-powered insights",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}