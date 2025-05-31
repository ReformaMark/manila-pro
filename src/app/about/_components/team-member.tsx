import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Facebook, Twitter, Linkedin } from "lucide-react"

interface TeamMemberProps {
  name: string
  role: string
  image: string
  bio: string
}

export default function TeamMember({ name, role, image, bio }: TeamMemberProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-[300px]">
        <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold">{name}</h3>
        <p className="text-primary font-medium mb-2">{role}</p>
        <p className="text-muted-foreground mb-4">{bio}</p>
        <div className="flex gap-3">
          <a href="#" className="text-gray-500 hover:text-primary">
            <Facebook className="h-5 w-5" />
          </a>
          <a href="#" className="text-gray-500 hover:text-primary">
            <Twitter className="h-5 w-5" />
          </a>
          <a href="#" className="text-gray-500 hover:text-primary">
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
