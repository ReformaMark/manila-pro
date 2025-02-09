import { ConvexClientProvider } from "@/components/convex-client-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import "@/lib/globals.css";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { AdminHeader } from "./_components/admin-header";
import { AdminSidebar } from "./_components/admin-sidebar";

const poppinsFont = Poppins({
  subsets: ["latin"],
  weight: "400",
})

export const metadata: Metadata = {
  title: "ManilaPro - Admin",
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
            className={`${poppinsFont.className} antialiased bg-[#F6F6F6]`}
          >

            {/* <AdminGuard> */}
            <SidebarProvider>
              <div className="flex min-h-screen flex-col antialiased w-full">
                <AdminHeader />
                <div className="md:flex">
                  <AdminSidebar />
                  <main className="flex-1 min-h-screen pt-[70px]">{children}</main>
                  <Toaster />
                </div>
              </div>
            </SidebarProvider>
            {/* </AdminGuard> */}

          </body>
        </html>
      </ConvexClientProvider>
    </ConvexAuthNextjsServerProvider>
  );
}
