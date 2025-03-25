'use client'
import { motion } from 'framer-motion'
import { Input } from './ui/input'
import { Button } from './ui/button'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { cn } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { useFilterStore } from '@/app/properties/store/useFilter'

const housingUnits = ["Apartment","Condominium", "Duplex", "Single Attached house", "Single Detached House", "All Units"]
const transactionTypes = ["All Types", "Buy", "Rent", "Lease"]
export default function SearchProperty() {
    const {location, transactionType, unitType, setLocation, setTransactionType, setUnitType} = useFilterStore()
    // const pathName = usePathname()
    const router = useRouter()
    const handleSearch = () => {
        router.push('/properties')
    }

    console.log(location, transactionType, unitType)
  return (
    <div className="c contents">
            <motion.div 
                className=" flex h-14 gap-x-2 w-full"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                    duration: 0.5,
                    delay: 1
                }}
            >
            <div className="flex h-10 gap-x-2 ">
                <div className="flex h-full">
                    {transactionTypes.map(type => (
                        <Button key={type} size={'default'} 
                            className={cn('hover:bg-gray-300 rounded-none bg-white text-black transition-colors duration-400 ease-in h-full', 
                                transactionType === type && "border-b-4 border-b-orange-500"
                            )} 
                            onClick={()=> setTransactionType(type)}
                        >
                            {type}
                        </Button>
                    ))}
                </div>
                
                <Select defaultValue={unitType} value={unitType} onValueChange={(value) => setUnitType(value)}>
                    <SelectTrigger className="h-full bg-white">
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
                </Select>
            </div>
            </motion.div>
        
         
            <motion.div 
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{   
                    duration: 0.5,
                    delay: 1.5
                }}
                className="flex  gap-x-3 shadow-lg w-full max-w-screen-2xl"
                > 
                <Input 
                    name='location'
                    className='bg-white text-xs md:text-sm py-5'
                    onChange={(e)=> setLocation(e.target.value)}
                    value={location ?? ""}
                    placeholder='Find locations or development names.'
                    />
                <Button variant={'orange'} onClick={handleSearch} className='h-full'>Search</Button>
        </motion.div>
    </div>
  )
}
