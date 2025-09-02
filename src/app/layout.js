import { JetBrains_Mono } from "next/font/google";
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import SessionProviderClient from "./components/SessionProviderClient";
import "./globals.css";
import Footer from "@/app/components/Footer";
import AnnouncementBar from "@/app/components/AnnouncementBar";
import Navbar from "./components/Navbar";
import { Providers } from "./providers";


const geistMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Black Wizard - Fashion Store",
  description:
    "A modern e-commerce application built with Next.js and Razorpay integration",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/logo.jpeg" />
        <script src="https://checkout.razorpay.com/v1/checkout.js" />
      </head>
      <body
        className={`bg-white ${geistMono.variable} antialiased`}
      >
   <Providers>
        <SessionProviderClient>
          
                <AnnouncementBar/>
                <Navbar />
                {children}
                <Footer/>
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light"
                />
             
        </SessionProviderClient>
      </Providers>
      </body>
    </html>
  );
}
