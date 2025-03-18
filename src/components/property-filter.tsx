'use client'
import React, { useState } from 'react'
import { cn } from "@/lib/utils"
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'
import { Search } from 'lucide-react'
import { motion } from 'framer-motion'
import { containerVariants, itemVariants } from '@/app/(landing-page)/_components/framerVariants'

const housingUnits = ["Apartment","Condominium", "Duplex", "Single Attached house", "Single Detached House", "All"]

export default function PropertyFilter() {
    const [formData, setFormData] = useState({
        location: "",
        min: 0,
        max: 0,
        unitType: "",
        transactionType: "",
      });

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.name === "min" || e.target.name === "max") {
    //         setFormData({ ...formData, [e.target.name]: Number(e.target.value) });
    //     } else {
    //         setFormData({ ...formData, [e.target.name]: e.target.value });
    //     }
    // };
    // const handleClick = ( value: string) => {
    //     setFormData({...formData, transactionType: value });
    //   };

    const handleUnitTypeChange = (value: string, name: string) => {
        setFormData({ ...formData, [name]: value })
      };

      console.log(formData)
    const handleSearch = () =>{

    }
  return (
    <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{once: true}}
        variants={itemVariants}
     
    >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 items-center">
            {/* <Select onValueChange={(value) => handleUnitTypeChange(value, "min")}>
                <SelectTrigger className="h-6 text-xs bg-white text-muted-foreground">
                    <SelectValue placeholder="Min Price" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                    <SelectLabel>Min Price</SelectLabel>
                    {["1000", "5000", "10000", "50000", "100000"].map(unit =>(
                        <SelectItem key={unit} className='capitalize' value={unit}>₱{unit}+</SelectItem>
                    ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Select onValueChange={(value) => handleUnitTypeChange(value, "max")}>
                <SelectTrigger className="h-6 text-xs bg-white text-muted-foreground">
                    <SelectValue placeholder="Min Price" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                    <SelectLabel>Transaction Type</SelectLabel>
                    {["100000", "300000", "500000", "1000000", "5000000","999999999"].map(unit =>(
                        <SelectItem key={unit} className='capitalize' value={unit}>₱{unit}+</SelectItem>
                    ))}
                    </SelectGroup>
                </SelectContent>
            </Select> */}
        
            <Select onValueChange={(value) => handleUnitTypeChange(value, "transactionType")}>
                <SelectTrigger className="h-6 text-xs bg-white text-muted-foreground">
                    <SelectValue placeholder="Transaction type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                    <SelectLabel>Transaction Type</SelectLabel>
                    {["Buy", "Rent", "Lease"].map(unit =>(
                        <SelectItem key={unit} className='capitalize' value={unit}>{unit}</SelectItem>
                    ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Select onValueChange={(value) => handleUnitTypeChange(value, "unitType")}>
                <SelectTrigger className="h-6 text-xs bg-white text-muted-foreground">
                    <SelectValue placeholder="Unit type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                    <SelectLabel>Unit Type</SelectLabel>
                    {housingUnits.map(unit =>(
                        <SelectItem key={unit} className='capitalize' value={unit}>{unit}</SelectItem>
                    ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Select onValueChange={(value) => handleUnitTypeChange(value, "location")}>
                <SelectTrigger className="h-6 text-xs bg-white text-muted-foreground">
                    <SelectValue placeholder="Find Location" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Location</SelectLabel>
                        {["Makati", "Taguig", "Pasay"].map(unit =>(
                            <SelectItem key={unit} className='capitalize' value={unit}>{unit}</SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        
            <button  className=' lg:hidden p-0 w-fit ml-auto lg:w-fit text-muted-foreground text-xs'>
            
                Show more filters
            </button>
           
            <div className=" h-7 flex justify-end"> 
                
                <Button variant={'orange'} onClick={handleSearch} className='h-full w-full lg:w-1/2'>Search</Button>
            </div>
        </div>
        <div className="hidden  h-7 w-full  lg:flex flex-col items-end justify-between">
            <Button variant={'link'} className='h-full w-full lg:w-fit text-muted-foreground text-xs'>
               
               Show more filters
           </Button>
        </div>
      
    </motion.div>
  
  )
}
