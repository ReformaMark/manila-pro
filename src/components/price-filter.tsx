'use client'
import React, { useState } from 'react'
import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
  } from "@/components/ui/sidebar"
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'

const housingUnits = ["Apartment","Condominium", "Duplex", "Single Attached house", "Single Detached House", "All"]

export default function PriceFilter() {
    const [formData, setFormData] = useState({
        query: "",
        min: 0,
        max: 0,
        unitType: "",
        transactionType: "",
      });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === "min" || e.target.name === "max") {
            setFormData({ ...formData, [e.target.name]: Number(e.target.value) });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };
    const handleClick = ( value: string) => {
        setFormData({...formData, transactionType: value });
      };

    const handleUnitTypeChange = (value: string, name: string) => {
        setFormData({ ...formData, [name]: value })
      };
    const handleSearch = () =>{

    }
  return (
    <SidebarGroup>
        <SidebarGroupLabel>Advance Filter</SidebarGroupLabel>
        <SidebarMenu className='px-3'>
            <div className="flex items-center gap-x-2">
                <span>₱</span>
                <Input
                 name='min'
                    type="number"
                    className=""
                    min={0}
                    max={formData.max ? formData.max : 9999999999}
                    placeholder="min"
                    onChange={handleChange}
                    value={formData.min}
                />
                -
                <span>₱</span><Input
                    name='max'
                    type="number"
                    className=""
                    placeholder="max"
                    min={formData.min ? formData.min : 0}
                    max={9999999999}
                    onChange={handleChange}
                    value={formData.max !== undefined ? formData.max: 0}
                />
            </div>
            <div className="">
            <div className="h-fit">
                <div 
                    className="z-50 flex gap-x-2 w-full"
                
                >
                    <div className=" gap-x-2 ">
                        <h1  className='text-xs font-semibold text-gray-500 my-3'>Transaction Type</h1>
                        <div className="flex h-10 px-3">
                            <Button size={'default'} className={cn('hover:bg-gray-300 rounded-none bg-white text-black transition-colors duration-400 ease-in h-full', formData.transactionType === "buy" && "border-b-4 border-b-orange-500")} onClick={()=> handleClick("buy")}>Buy</Button>
                            <Button size={'default'} className={cn('hover:bg-gray-300 rounded-none bg-white text-black transition-colors duration-400 ease-in h-full ', formData.transactionType === "rent" && "border-b-4 border-b-orange-500")} onClick={()=> handleClick("rent")}>Rent</Button>
                            <Button size={'default'} className={cn('hover:bg-gray-300 rounded-none bg-white text-black transition-colors duration-400 ease-in h-full ', formData.transactionType === "lease" && "border-b-4 border-b-orange-500")} onClick={()=> handleClick("lease")}>Lease</Button>
                        </div>
                        <h1 className='text-xs font-semibold text-gray-500 my-3'>Unit Type</h1>
                        <div className="flex flex-wrap gap-3 px-3">
                           
                        {housingUnits.map(unit => (
                            <Button
                            key={unit}
                            size={'default'}
                            className={cn('hover:bg-gray-300 rounded-none bg-white text-black w-fit transition-colors duration-400 ease-in text-[0.6rem] p-1', formData.unitType === unit && "border-2 border-orange-500")}
                            onClick={() => handleUnitTypeChange(unit, "unitType")}
                            >
                                {unit}
                            </Button>
                        ))}
                        </div>
                
                        {/* <Select defaultValue='All' onValueChange={(value) => handleUnitTypeChange(value, "unitType")}>
                            <SelectTrigger className="h-10 bg-white">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                <SelectLabel>Unit Type</SelectLabel>
                                {housingUnits.map(unit =>(
                                    <SelectItem key={unit} className='capitalize' value={unit}>{unit}</SelectItem>
                                ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select> */}
                        
                    </div>
                </div>


                <div 
                    className="flex  gap-x-3 shadow-lg w-full max-w-screen-2xl"
                > 
                    <Input 
                        name='location'
                        className='bg-white text-xs md:text-sm py-5'
                        onChange={handleChange}
                        value={formData.query}
                        placeholder='Find locations or development names.'
                        />
                    <Button variant={'orange'} onClick={handleSearch} className='h-full'>Search</Button>
                </div>
            </div>
            </div>
        </SidebarMenu>
    </SidebarGroup>
  )
}
