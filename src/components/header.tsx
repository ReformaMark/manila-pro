'use client'
import * as React from "react"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
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
import { Menu } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"

function Header() {
  const buy: { title: string; href: string; description: string }[] = [
  {
    title: "House and Lot",
    href: "/docs/primitives/alert-dialog",
    description: "Explore houses with lots for sale in various locations.",
  },
  {
    title: "Condos",
    href: "/docs/primitives/hover-card",
    description: "Discover condominium units for sale with modern amenities.",
  },
  {
    title: "Apartments",
    href: "/docs/primitives/progress",
    description: "Find apartment buildings or units available for purchase.",
  },
  {
    title: "Lots",
    href: "/docs/primitives/scroll-area",
    description: "Browse empty lots for sale, ideal for building your dream home.",
  },
  {
    title: "Foreclosures",
    href: "/docs/primitives/tabs",
    description: "Check out affordable foreclosed properties for sale.",
  },
  {
    title: "Commercial Units",
    href: "/docs/primitives/tooltip",
    description: "Explore commercial spaces available for business use.",
  },
  {
    title: "All Properties",
    href: "/docs/primitives/tooltip",
    description: "View the full list of all available properties for sale.",
  },
];

const rent: { title: string; href: string; description: string }[] = [
  {
    title: "House and Lot",
    href: "/docs/primitives/alert-dialog",
    description: "Rent houses with spacious lots in your preferred locations.",
  },
  {
    title: "Condos",
    href: "/docs/primitives/hover-card",
    description: "Find condominium units for rent in urban and prime areas.",
  },
  {
    title: "Apartments",
    href: "/docs/primitives/progress",
    description: "Explore apartments for rent, from budget-friendly to luxury options.",
  },
  {
    title: "Lots",
    href: "/docs/primitives/scroll-area",
    description: "Lease vacant lots for short- or long-term use.",
  },
  {
    title: "Foreclosures",
    href: "/docs/primitives/tabs",
    description: "Foreclosed properties available for rent at competitive rates.",
  },
  {
    title: "Commercial Units",
    href: "/docs/primitives/tooltip",
    description: "Browse commercial units available for lease for your business needs.",
  },
  {
    title: "All Properties",
    href: "/docs/primitives/tooltip",
    description: "View the complete list of all rental properties available.",
  },
];

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
  return (
        <motion.div 
            initial={{y:-100, opacity: 0.5}}
            animate={{y:0 , opacity: 1}}
            transition={{
                duration: 1
            }}
            className='absolute z-50 inset-0 h-fit max-w-full flex justify-between items-center w-full bg-primary text-white py-4 px-10 md:px-10 lg:px-36'
        >
            <div className="logo">
                <Link href={'/'}>Manila<span className="text-orange-500 text-xl font-semibold">Pro</span></Link>
            </div>

            <nav>
            <NavigationMenu className="hidden md:block">
                <NavigationMenuList>
                    <NavigationMenuItem  className='w-full'>
                        <NavigationMenuTrigger className="bg-transparent text-white">Buy a property</NavigationMenuTrigger>
                        <NavigationMenuContent className=''>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                        {buy.map((component) => (
                            <ListItem
                            key={component.title}
                            title={component.title}
                            href={component.href}
                            >
                            {component.description}
                            </ListItem>
                        ))}

                        </ul>
                        
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem  className='w-full'>
                        <NavigationMenuTrigger className="bg-transparent text-white">Rent a property</NavigationMenuTrigger>
                        <NavigationMenuContent className=''>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                        {rent.map((component) => (
                            <ListItem
                            key={component.title}
                            title={component.title}
                            href={component.href}
                            >
                            {component.description}
                            </ListItem>
                        ))}

                        </ul>
                        
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem  className='w-full'>
                        <NavigationMenuTrigger className="bg-transparent text-white">Locations</NavigationMenuTrigger>
                        <NavigationMenuContent className=''>
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

        
            <Button variant={'orange'} className="hidden md:block ">
              <Link href={'/auth'}>Sign In</Link>
               
            </Button>
            </div>

            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger className="text-white"><Menu/></SheetTrigger>
                    <SheetContent className="absolute">
                        <SheetHeader>
                            <SheetTitle>Menu</SheetTitle>
                            <SheetDescription>Navigation links</SheetDescription>
                        </SheetHeader>
                        <ul>
                            <li className="p-4">Home</li>
                            <li className="p-4">Buy a property</li>
                            <li className="p-4">Rent a property</li>
                            <li className="p-4">Locations</li>
                        </ul>
                    </SheetContent>
                </Sheet>
            </div>
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