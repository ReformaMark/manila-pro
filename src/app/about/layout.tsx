import { ConvexClientProvider } from "@/components/convex-client-provider";
import { Header } from "@/components/header";
import "@/lib/globals.css";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";

const poppinsFont = Poppins({
  subsets: ["latin"],
  weight: "400",
})

export const metadata: Metadata = {
  title: "ManilaPro",
  description: "ManilaPro is a real estate platform for 3 cities in the philippines",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <body
          className={`${poppinsFont.className} antialiased flex flex-col min-h-screen mx-auto`}
        >
          <ConvexClientProvider>
            <Header/>
            {children}
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
