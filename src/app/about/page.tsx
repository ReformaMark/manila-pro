'use client'
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building, Users, MapPin, Award, Clock, Shield } from "lucide-react"
import TeamMember from "./_components/team-member"
import LocationCard from "./_components/location.card"
import { api } from "../../../convex/_generated/api"
import { useQuery } from "convex/react"
import ManilaProOffice from '@/../public/images/manilaPro.png';
import Pasay from '@/../public/images/pasay.jpg';
import Makati from '@/../public/images/makati.jpg';
import Taguig from '@/../public/images/taguig-BGC.png';
import FooterComponent from "../(landing-page)/_components/FooterComponent"
import { useRouter } from "next/navigation"

export default function AboutPage() {
    const propertyCount = useQuery(api.property.propertiesCount)
    const agentCount = useQuery(api.users.agentCount)
    const router = useRouter()
  return (
    <div className="flex flex-col min-h-screen">

      {/* Hero Section */}
      <section className="hero relative h-[400px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/placeholder.svg?height=800&width=1600')",
          }}
        ></div>

        <div className="container relative z-20 flex flex-col items-center justify-center h-full text-white">
          <Badge className="mb-4 bg-primary hover:bg-primary">About Us</Badge>
          <h1 className="text-5xl font-bold mb-6 text-center">Your Trusted Real Estate Partner</h1>
          <p className="text-xl max-w-2xl text-center">
            Connecting people with their dream properties in the Philippines since 2015
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-12 bg-gray-50">
        <div className="container">
          {/* Company Overview */}
          <section className="mb-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="text-muted-foreground mb-4">
                  ManilaPro was founded in 2015 with a simple mission: to make finding and purchasing property in the
                  Philippines as seamless and transparent as possible. What started as a small team of passionate real
                  estate professionals has grown into one of the most trusted property platforms in Metro Manila.
                </p>
                <p className="text-muted-foreground mb-6">
                  We understand that finding the perfect home is more than just browsing listings—it's about finding a
                  place where memories will be made. That's why we've built a platform that not only showcases the best
                  properties but also provides all the tools and information you need to make informed decisions.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" />
                    <span className="font-medium">{propertyCount}+ Properties</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="font-medium">{agentCount}+ Agents</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span className="font-medium">3 Key Locations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    <span className="font-medium">Award-winning</span>
                  </div>
                </div>
              </div>
              <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={ManilaProOffice}
                  alt="ManilaPro Office"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </section>

          {/* Mission & Values */}
          <section className="mb-20 bg-white p-12 rounded-xl shadow-sm">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Mission & Values</h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                At ManilaPro, we're guided by a set of core principles that shape everything we do. Our mission is to
                transform the real estate experience in the Philippines through technology, transparency, and trust.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Trust & Transparency</h3>
                  <p className="text-muted-foreground">
                    We verify all listings and provide complete information so you can make decisions with confidence.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Customer-Centric</h3>
                  <p className="text-muted-foreground">
                    We put our clients' needs first, offering personalized service and support throughout your journey.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                  <p className="text-muted-foreground">
                    We continuously improve our platform with the latest technology to make property hunting easier.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Team Section */}
          {/* <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Meet Our Leadership Team</h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                Our diverse team of experts is passionate about real estate and committed to providing exceptional
                service.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <TeamMember
                name="Maria Santos"
                role="Founder & CEO"
                image="/placeholder.svg?height=400&width=400"
                bio="With over 15 years in real estate, Maria founded ManilaPro to revolutionize property searching in the Philippines."
              />
              <TeamMember
                name="Juan Reyes"
                role="Chief Operations Officer"
                image="/placeholder.svg?height=400&width=400"
                bio="Juan oversees all operations, ensuring that our platform and services meet the highest standards of quality."
              />
              <TeamMember
                name="Ana Lim"
                role="Head of Property Relations"
                image="/placeholder.svg?height=400&width=400"
                bio="Ana works directly with property developers and agents to bring the best listings to our platform."
              />
            </div>
          </section> */}

          {/* Locations We Serve */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Locations We Serve</h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                We specialize in three of Metro Manila's most sought-after areas, each offering unique living
                experiences.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <LocationCard
                name="Makati"
                image={Makati}
                description="The financial heart of the Philippines, offering luxury condos and a vibrant lifestyle."
                properties={1250}
              />
              <LocationCard
                name="Pasay"
                image={Pasay}
                description="Home to entertainment complexes and convenient access to the airport and transportation."
                properties={850}
              />
              <LocationCard
                name="Taguig"
                image={Taguig}
                description="Modern living in Bonifacio Global City (BGC) with upscale developments and amenities."
                properties={1100}
              />
            </div>
          </section>

          {/* Testimonials */}
          <section className="mb-20 bg-white p-12 rounded-xl shadow-sm">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                Don't just take our word for it—hear from the people who found their dream homes through ManilaPro.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-gray-50">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="mr-4 h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-bold">RC</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Roberto Cruz</h4>
                      <p className="text-sm text-muted-foreground">Makati Condo Owner</p>
                    </div>
                  </div>
                  <p className="italic text-muted-foreground">
                    "ManilaPro made finding my first condo in Makati incredibly easy. Their filtering options helped me
                    narrow down exactly what I was looking for, and their agent was professional and knowledgeable."
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-50">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="mr-4 h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-bold">SG</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Sofia Garcia</h4>
                      <p className="text-sm text-muted-foreground">BGC Property Investor</p>
                    </div>
                  </div>
                  <p className="italic text-muted-foreground">
                    "As an investor, I appreciate the detailed market information ManilaPro provides. I've purchased
                    three properties through their platform, and each transaction was smooth and transparent."
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CTA Section */}
          <section className="mb-12">
            <div className="bg-primary/5 rounded-xl p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Find Your Dream Home?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Whether you're looking to buy, rent, or lease, our platform has thousands of verified properties waiting
                for you to discover.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={() => router.push("/properties")} size="lg" className="px-8">
                  Browse Properties
                </Button>
                <Button size="lg" variant="outline" className="px-8">
                  Contact Us
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
    <FooterComponent/>
    </div>
  )
}
