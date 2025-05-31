import Image, { StaticImageData } from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building, MapPin } from "lucide-react"

interface LocationCardProps {
  name: string
  image: string | StaticImageData
  description: string
  properties: number
}

export default function LocationCard({ name, image, description, properties }: LocationCardProps) {
  return (
    <Card className="overflow-hidden group">
      <div className="relative h-[200px] overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
          <div className="flex items-center text-white/90">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">Metro Manila, Philippines</span>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Building className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{properties} Properties</span>
          </div>
          <Badge variant="outline" className="hover:bg-primary/5 cursor-pointer">
            View Properties
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
