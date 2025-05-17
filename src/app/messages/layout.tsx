import type { Metadata } from "next";
import "@/lib/globals.css"
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server"
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Poppins } from "next/font/google"
import { Header } from "@/components/header";
import { BuyerSideNav } from "@/components/buyer/side-nav";
import { BuyerGuard } from "@/components/auth/buyer-guard";

const poppinsFont = Poppins({
    subsets: ["latin"],
    weight: "400",
})

export const metadata: Metadata = {
  title: "ManilaPro - Messages",
  description: "This is the manilaPro property page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <ConvexClientProvider>
        <html lang="en">
          <body
            className={`${poppinsFont.className} antialiased`}
          >
            <SidebarProvider>
            <BuyerGuard>
            <div className="antialiased w-full ">
              <Header/>
                <div className="flex " >
                  <BuyerSideNav/> 
             
                  <main className="flex-1 relative pt-2 ">
                    <SidebarTrigger className="hidden md:block pl-2 rounded-l-none absolute inset-0  "/>
                      {children}
                  </main>
              </div>
             
            </div>
            <Toaster/>
            </BuyerGuard>
            </SidebarProvider>
          </body>
        </html>
      </ConvexClientProvider>
    </ConvexAuthNextjsServerProvider>
  );
}
