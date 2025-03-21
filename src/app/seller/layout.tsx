import { SellerGuard } from "@/components/auth/seller-guard";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { SellerSidebar } from "@/components/seller/layouts/seller-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import "@/lib/globals.css";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { AdminHeader } from "../admin/_components/admin-header";

const poppinsFont = Poppins({
  subsets: ["latin"],
  weight: "400",
})

export const metadata: Metadata = {
  title: "ManilaPro - Buyer",
  description: "This is the buyer page",
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
            <SellerGuard>
              <SidebarProvider>
                <div className="flex min-h-screen flex-col antialiased w-full">
                  <AdminHeader />
                  <div className="md:flex">
                    <SellerSidebar />
                    <main className="flex-1 min-h-screen pt-[70px] overflow-hidden">{children}</main>
                    <Toaster />
                  </div>
                </div>
              </SidebarProvider>
            </SellerGuard>
          </body>
        </html>
      </ConvexClientProvider>
    </ConvexAuthNextjsServerProvider>
  );
}
