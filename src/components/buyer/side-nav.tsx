"use client"
import {  Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import {
    Sidebar,
    SidebarContent,
    SidebarRail,
} from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { useCurrentUser } from '@/hooks/use-current-user';
import { NavGroupItems } from './nav-group-items';
import { Button } from '../ui/button';
import { discoverItems, resourceItems, transactionItems } from './items';
import { useIsMobile } from '@/hooks/use-mobile';
import Link from 'next/link';


export function BuyerSideNav({
    header = "Buyer Portal",
    value = "buyer",
    ...props
}: React.ComponentProps<typeof Sidebar> & {
    header?: string,
    value?: "admin" | "buyer" | "seller"
}) {
    const pathname = usePathname()
    const isMobile = useIsMobile()


    const { user } = useCurrentUser();

    if (!user) return null;

    const SidebarContents = () => (
        <div className={cn(isMobile ? "mt-0" : " mt-16" ,"bg-brand-black")} style={{ height: `calc(100vh - var(--header-height))`}}>
        

            <SidebarContent className="flex-1 overflow-y-auto ">
                <NavGroupItems items={discoverItems} groupLabel='discover' />
                <NavGroupItems items={transactionItems} groupLabel='transactions' />
                <NavGroupItems items={resourceItems} groupLabel='resources' />
            </SidebarContent>
        </div>
    );

    return (
        <div className='mt-16 bg-brand-black max-h-[50vh] overflow-hidden' >
            {/* Desktop Sidebar */}
            <div 
       
                className="hidden md:block z-30  relative"
               
       
            >
                <Sidebar collapsible="icon" {...props} className="bg-brand-black z-30">
                    <SidebarContents />
                    <SidebarRail />
                </Sidebar>
            </div>

            {/* Mobile Sheet */}
            <div className={cn("md:hidden fixed top-3 left-4 z-50 bg-brand-black text-white")}>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-gray-800 md:hidden"
             
                        >
                        <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="p-0 w-[300px] z-[9999] bg-brand-black text-white">
                        <SheetHeader className='text-white text-center p-5'>
                            <Link href="/" className="flex items-center gap-2 text-center">
                                <h1 className="font-bold text-xl text-white">Manila<span className="text-xl font-extrabold text-brand-orange">Pro</span></h1>
                            </Link>
                        </SheetHeader>
                        <SidebarContents />
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    )
}
