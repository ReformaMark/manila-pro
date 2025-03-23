"use client"
import {  Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import {
    Sidebar,
    SidebarContent,
    SidebarRail,
} from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCurrentUser } from '@/hooks/use-current-user';
import { NavGroupItems } from './nav-group-items';
import { Button } from '../ui/button';
import { discoverItems, resourceItems, transactionItems } from './items';


export function BuyerSideNav({
    header = "Buyer Portal",
    value = "buyer",
    ...props
}: React.ComponentProps<typeof Sidebar> & {
    header?: string,
    value?: "admin" | "buyer" | "seller"
}) {
    const pathname = usePathname()


    const { user } = useCurrentUser();

    if (!user) return null;

    const SidebarContents = () => (
        <div className="bg-brand-black mt-16" style={{ height: `calc(100vh - var(--header-height))`}}>
        

            <SidebarContent className="flex-1 overflow-y-auto ">
                <NavGroupItems items={discoverItems} groupLabel='discover' />
                <NavGroupItems items={transactionItems} groupLabel='transactions' />
                <NavGroupItems items={resourceItems} groupLabel='resources' />
            </SidebarContent>
        </div>
    );

    return (
        <div className='mt-16 bg-brand-black' style={{ maxHeight: `calc(100vh - var(--header-height))`, paddingTop: '4rem'}}>
            {/* Desktop Sidebar */}
            <div 
       
                className="hidden md:block z-40  relative"
               
       
            >
                <Sidebar collapsible="icon" {...props} className="bg-white">
                    <SidebarContents />
                    <SidebarRail />
                </Sidebar>
            </div>

            {/* Mobile Sheet */}
            <div className={cn("md:hidden fixed top-3 left-4 z-[9999]")}>
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
                    <SheetContent side="right" className="p-0 w-[300px] z-[9999]">
                        <SidebarContents />
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    )
}
