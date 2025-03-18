'use client'
import * as React from "react"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
  } from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  } from "@/components/ui/sheet"
  
import { cn } from "@/lib/utils"
import { motion } from 'framer-motion'
import { Menu, Search } from "lucide-react"
import Link from "next/link"
import UserAvatar from "./user-avatar"
import { Separator } from "./ui/separator"
import SearchProperty from "./search-property"
import { usePathname } from "next/navigation"
import { Input } from "./ui/input"

function Header() {

const locations:  { title: string; href: string; description: string }[] = [
    {
        title: "Pasay City",
        href: "/docs/primitives/alert-dialog",
        description: "Rent houses with spacious lots in your preferred locations.",
    },
    {
        title: "Makaty City",
        href: "/docs/primitives/hover-card",
        description: "Find condominium units for rent in urban and prime areas.",
    },
    {
        title: "Taguig City",
        href: "/docs/primitives/progress",
        description: "Explore apartments for rent, from budget-friendly to luxury options.",
    },
    ]

    const pathName = usePathname()
  return (
        <motion.div 
            initial={{y:-100, opacity: 0.5}}
            animate={{y:0 , opacity: 1}}
            transition={{
                duration: 1
            }}
            className='absolute z-50 inset-0 h-fit max-w-full flex justify-between items-center gap-x-5 w-full bg-primary text-white py-4 px-10 md:px-10 lg:px-36'
        >
            <div className="logo">
                <Link href={'/'}>Manila<span className="text-orange-500 text-xl font-semibold">Pro</span></Link>
            </div>
               <nav>
               <NavigationMenu className="hidden md:block">
                   <NavigationMenuList>
                     <NavigationMenuItem>
                       <Link href="/docs" legacyBehavior passHref>
                         <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent text-white")}>
                           Buy a property
                         </NavigationMenuLink>
                       </Link>
                     </NavigationMenuItem>
                     <NavigationMenuItem>
                       <Link href="/docs" legacyBehavior passHref>
                         <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent text-white")}>
                         Rent a property
                         </NavigationMenuLink>
                       </Link>
                     </NavigationMenuItem>
                     <NavigationMenuItem>
                       <Link href="/docs" legacyBehavior passHref>
                         <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent text-white")}>
                         Lease a property
                         </NavigationMenuLink>
                       </Link>
                     </NavigationMenuItem>
                  
                     <NavigationMenuItem  className='w-full'>
                         <NavigationMenuTrigger className="z-[1000] bg-transparent text-white">Locations</NavigationMenuTrigger>
                         <NavigationMenuContent className='z-[1000]'>
                         <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                         {locations.map((component) => (
                             <li
                                 key={component.title}
                                 className="cursor-pointer block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                             >
                                 {component.title}
                             </li>
                         ))}
   
                         </ul>
                         
                         </NavigationMenuContent>
                     </NavigationMenuItem>
                     {/* <NavigationMenuItem>
                         <Link href="/docs" legacyBehavior passHref>
                             <NavigationMenuLink className={cn(navigationMenuTriggerStyle(),"bg-transparent text-white" )}>
                                 About Us
                             </NavigationMenuLink>
                         </Link>
                     </NavigationMenuItem> */}
                 </NavigationMenuList>
               </NavigationMenu>
               </nav>
            <div className=" flex justify-around gap-5">

              <div className="hidden md:block">
                <UserAvatar/>
              </div>
            </div>
            {pathName === '/' && (
                <div className="md:hidden">
                <Sheet>
                    <SheetTrigger className="text-white"><Menu/></SheetTrigger>
                    <SheetContent className="absolute">
                        <SheetHeader>
                            <SheetTitle>Menu</SheetTitle>
                            <SheetDescription className="flex items-start"> <UserAvatar/></SheetDescription>
                        </SheetHeader>
                        <Separator className=" my-5"/>
                        <ul className="transition-all duration-600 ease-linear mt-5">
                        <h3 className="text-sm font-semibold">Browse & Acquire</h3>
                        <Separator/>
                          <Link href={"/"} >
                            <li className="p-2 pl-4 hover:bg-orange-500/10">Home</li>
                          </Link>
                          <Link href={"/properties/buy"} >
                            <li className="p-2 pl-4 hover:bg-orange-500/10">Buy a property</li>
                          </Link>
                          <Link href={"/properties/rent"} >
                            <li className="p-2 pl-4 hover:bg-orange-500/10">Rent a property</li>
                          </Link>
                          <Link href={"/properties/lease"} >
                            <li className="p-2 pl-4 hover:bg-orange-500/10">Lease a property</li>
                          </Link>
                          <h3 className="text-sm font-semibold">Locations</h3>
                          <Separator/>
                          <Link href={"/properties/all/Makati"} >
                            <li className="p-2 pl-4 hover:bg-orange-500/10">Makati</li>
                          </Link>
                          <Link href={"/properties/all//Pasay"} >
                            <li className="p-2 pl-4 hover:bg-orange-500/10">Pasay</li>
                          </Link>
                          <Link href={"/properties/all/Taguig"} >
                            <li className="p-2 pl-4 hover:bg-orange-500/10">Taguig</li>
                          </Link>
                       
                        </ul>
                       
                        
                    </SheetContent>
                </Sheet>
            </div>
            )}
          
        </motion.div>
  )
}

const ListItem = React.forwardRef<
  React.ComponentRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

export default Header