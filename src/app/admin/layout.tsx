import type { Metadata } from "next";
import "@/lib/globals.css"
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server"
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { AdminGuard } from "@/components/auth/admin-guard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Poppins } from "next/font/google"

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
         
              <SidebarProvider>
                <div className="flex min-h-screen flex-col antialiased w-full">
                  <AppSidebar
                      header="Buyer Portal"
                      value="buyer"
                  />
                  <main className="flex-1 min-h-screen pt-[70px]">{children}</main>
                  <Toaster />
                </div>
              </SidebarProvider>
           
          </body>
        </html>
      </ConvexClientProvider>
    </ConvexAuthNextjsServerProvider>
  );
}
