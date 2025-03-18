"use client"

import Image from "next/image"
import { useState } from "react"
import { Button } from "../ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface PropertyImageGalleryProps {
    displayImage: string
    otherImages: string[]
    propertyName: string
}

export const PropertyImageGallery = ({
    displayImage,
    otherImages,
    propertyName,
}: PropertyImageGalleryProps) => {
    const allImages = [displayImage, ...otherImages].filter(Boolean)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const goToPrevious = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
    }

    const goToNext = () => {
        setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
    }

    const selectImage = (index: number) => {
        setCurrentImageIndex(index)
    }

    if (allImages.length === 0) {
        return (
            <div className="relative h-64 md:h-80 w-full rounded-md overflow-hidden bg-muted">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    No images available
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="relative h-64 md:h-80 w-full rounded-md overflow-hidden group">
                <Image
                    src={allImages[currentImageIndex]}
                    alt={`${propertyName} - Image ${currentImageIndex + 1}`}
                    fill
                    className="object-cover"
                />

                <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                    {currentImageIndex + 1} / {allImages.length}
                </div>

                {allImages.length > 1 && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={goToPrevious}
                        >
                            <ChevronLeft className="h-6 w-6" />
                            <span className="sr-only">Previous image</span>
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={goToNext}
                        >
                            <ChevronRight className="h-6 w-6" />
                            <span className="sr-only">Next image</span>
                        </Button>
                    </>
                )}
            </div>

            {allImages.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                    {allImages.map((imgUrl, index) => (
                        <div
                            key={index}
                            className={cn(
                                "relative h-14 rounded-md overflow-hidden cursor-pointer transition-all duration-200 hover:opacity-90",
                                currentImageIndex === index ? "ring-2 ring-orange-500 ring-offset-2" : "border border-orange-100",
                            )}
                            onClick={() => selectImage(index)}
                        >
                            <Image
                                src={imgUrl}
                                alt={`${propertyName} - Thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}