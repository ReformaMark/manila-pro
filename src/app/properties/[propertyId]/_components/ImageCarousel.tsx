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
  images: string[] | null
  setCurrentImageIndex: (value: number) => void
  currentImageIndex: number
  setApi: (value: CarouselApi) => void
  api: CarouselApi
}
function ImageCarousel({ images, currentImageIndex, setCurrentImageIndex, api, setApi}: ImageCarouseProps) {
 
  const [, setCount] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrentImageIndex(api.selectedScrollSnap() + 1)

    api.on("select", () => {
    
      setCurrentImageIndex(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <div className="">
      <Carousel setApi={setApi} className="w-full max-h-[60vh] relative">
        <CarouselContent className="">
          {images?.map((image) => (
            <CarouselItem key={image} className="max-h-[60vh]">
              <Image src={image} alt="Image" width={500} height={500} className="size-full object-fill" />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious size={'icon'}  color="white" className=" bg-black/90 text-white border-none text-black/30 size-12 rounded-full ml-14  hover:bg-black transition-all duration-500 ease-in-out" />
        <CarouselNext size={'icon'}  color="white" className=" bg-black/90 text-white border-none text-black/30 size-12 rounded-full mr-14  hover:bg-black transition-all duration-500 ease-in-out" />
      </Carousel>
      <div className="py-2 text-center text-xs text-muted-foreground">
        <div className="flex justify-start gap-2">
            {images?.map((image, index) => (
            <button
              key={index}
              className={`size-20  ${
              index + 1 === currentImageIndex ? "border-brand-orange border-4 " : "bg-white/50"
              } transition-colors duration-150 ease-linear`}
              onClick={() => api?.scrollTo(index)} // Scroll to the selected image
            >
              <Image src={image} alt="Image" width={500} height={500} className="size-full object-fill" />
            </button>
            ))}
        </div>
      </div>
    </div>
  )
}

export default ImageCarousel
