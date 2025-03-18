'use client'
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import Image from "next/image"
import { useEffect, useState } from "react"

  interface ImageCarouseProps {
    images: string[] | undefined
  }
function ImageCarousel({images}:ImageCarouseProps) {
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)
   
    useEffect(() => {
      if (!api) {
        return
      }
   
      setCount(api.scrollSnapList().length)
      setCurrent(api.selectedScrollSnap() + 1)
   
      api.on("select", () => {
        setCurrent(api.selectedScrollSnap() + 1)
      })
    }, [api])


  return (
    <div className="">
        
        <Carousel setApi={setApi}  className="w-full max-h-[60vh]  relative">
            <CarouselContent className="">
                {images?.map((image) => (
                    <CarouselItem key={image} className="max-h-[60vh]">
                        <Image src={image} alt="Image" width={500} height={500} className="size-full object-fill"/>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="hover:bg-white/20 bg-transparent border-none text-black/30 h-full ml-10 rounded-none opacity-5 hover:opacity-100 transition-all duration-500 ease-in-out"/>
            <CarouselNext  className="hover:bg-white/20 bg-transparent border-none text-black/30 h-full mr-10 rounded-none opacity-5 hover:opacity-100 transition-all duration-500 ease-in-out"/>
        </Carousel>
        <div className="py-2 text-center text-xs text-muted-foreground">
            Image {current} of {count}
        </div>
    </div>
  )
}

export default ImageCarousel