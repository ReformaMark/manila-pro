"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { User, MapPin, Mail, Phone, Calendar, Edit, Save, Heart, Home, MessageSquare, CheckCircle, Pencil, PencilIcon } from "lucide-react"
import { useCurrentUser } from "@/hooks/use-current-user"
import { formatDateListed } from "@/lib/utils"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { useUnreadMessage } from "@/hooks/use-unread-message"
import PropertyCard from "../properties/_components/PropertyCard"
import { PropertyTypesWithImageUrls } from "@/lib/types"
import Loading from "@/components/loading"
import { toast } from "sonner"
import { useConvexMutation } from "@convex-dev/react-query"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
    const {user: currentUser, isLoading: loadingUser} = useCurrentUser()

    const {count: unreadMessageCount} = useUnreadMessage()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [imageStorageId, setImageStorageId] = useState<string | undefined>("");
    const [isEditing, setIsEditing] = useState<boolean>(false)


    const [formData, setFormData] = useState({
        fname: currentUser?.fname ,
        lname: currentUser?.lname ,
        email: currentUser?.email ,
        phone: currentUser?.contact ,
        bio: currentUser?.bio ,
        location: currentUser?.city ,
    })

    const imageUrl = useQuery(
        api.files.getStorageUrl,
        imageStorageId ? { storageId: imageStorageId } : "skip"
    );

    const savedProperties = useQuery(api.property.getSavedProperties)
    const updateProfile = useMutation(api.users.updateProfile)
    const generateUploadUrl = useConvexMutation(api.files.generateUploadUrl);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }



    // function to be able to read and upload the image to our own database
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsLoading(true);
    try {
      const postUrl = await generateUploadUrl();

      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      const { storageId } = await result.json();
      setImageStorageId(storageId);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload Image");
      console.error("Upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleSaveProfile = () => {
    toast.promise(updateProfile({
        image: imageStorageId ?? "",
        fname: formData.fname ?? "",
        lname: formData.lname ?? "",
        email: formData.email ?? "",
        contact: formData.phone ?? "",
        bio: formData.bio ?? "",
        city: formData.location ?? ""
    }), {
        loading: "Updating your profile.",
        success: "Profile updated successfully..",
        error: "Unable to update your profile."
    })
    setIsEditing(false)
  }



  return (
    <div className="min-h-screen text-white">
   
      {/* Main Content */}
      <div>
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Sidebar */}
            <div className="md:w-1/3">
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={imageUrl ?? undefined} alt={currentUser?.lname} />
                      <AvatarFallback className="bg-brand-orange text-white text-xl">
                        {currentUser?.lname
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                      <div  onClick={() =>
                          document.getElementById("user-image")?.click()
                        } className="bg-black/10 w-full h-full absolute bottom-0 flex items-center justify-center opacity-0 hover:opacity-70 hover:cursor-pointer transition-all duration-300 ease-in-out">
                        <PencilIcon className="text-white h-7"/>
                         <Input
                            id="user-image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                      </div>
                    </Avatar>

                    <h2 className="text-xl font-bold text-gray-900">{currentUser?.fname}</h2>

                    <div className="flex items-center mt-1 mb-2">
                      <Badge className="bg-brand-orange text-white capitalize">{currentUser?.role}</Badge>
                      {currentUser?.emailVerified && (
                        <Badge variant="outline" className="ml-2 border-green-500 text-green-600 flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>

                    <div className="w-full space-y-3 mt-4">
                      <div className="flex items-center text-gray-700">
                        <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                        <span>{currentUser?.city || "Location not specified"}</span>
                      </div>

                      <div className="flex items-center text-gray-700">
                        <Mail className="h-4 w-4 text-gray-500 mr-2" />
                        <span>{currentUser?.email}</span>
                      </div>

                      <div className="flex items-center text-gray-700">
                        <Phone className="h-4 w-4 text-gray-500 mr-2" />
                        <span>{currentUser?.contact}</span>
                      </div>

                      <div className="flex items-center text-gray-700">
                        <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                        <span>Member since {currentUser?._creationTime ? formatDateListed(currentUser?._creationTime) : "-"}</span>
                      </div>
                    </div>

                    <div className="w-full mt-6">
                      <Button
                        variant="outline"
                        className="w-full border-brand-orange text-brand-orange hover:bg-brand-orange/10"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-sm mt-6">
                <CardHeader>
                  <CardTitle className="text-gray-900">Activity Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-700">
                        <Heart className="h-4 w-4 text-brand-orange mr-2" />
                        <span>Saved Properties</span>
                      </div>
                      <Badge variant="outline" className="bg-gray-50">
                        {savedProperties?.length}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-700">
                        <MessageSquare className="h-4 w-4 text-brand-orange mr-2" />
                        <span>Messages</span>
                      </div>
                      <Badge variant="outline" className="bg-gray-50">
                        {unreadMessageCount}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="md:w-2/3">
              {isEditing ? (
                <Card className="border border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Edit Profile</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <Label htmlFor="fname" className="text-gray-700">
                                    First Name
                                </Label>
                                <Input
                                    id="fname"
                                    name="fname"
                                    value={formData.fname}
                                    onChange={handleInputChange}
                                    className="bg-white border-gray-300 text-gray-900"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lname" className="text-gray-700">
                                    Last Name
                                </Label>
                                <Input
                                    id="lname"
                                    name="lname"
                                    value={formData.lname}
                                    onChange={handleInputChange}
                                    className="bg-white border-gray-300 text-gray-900"
                                />
                            </div>
                        </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          disabled
                          value={formData.email}
                          onChange={handleInputChange}
                          className="bg-white border-gray-300 text-gray-900"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-700">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="bg-white border-gray-300 text-gray-900"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-gray-700">
                          Location
                        </Label>
                        <Input
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="bg-white border-gray-300 text-gray-900"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-gray-700">
                          Bio
                        </Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          rows={4}
                          className="bg-white border-gray-300 text-gray-900 resize-none"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          className="border-gray-300 text-gray-700"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          onClick={handleSaveProfile}
                          className="bg-brand-orange hover:bg-brand-orange/90 text-white"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <Card className="border border-gray-200 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-gray-900">About Me</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{currentUser?.bio || "No bio information provided yet."}</p>
                    </CardContent>
                  </Card>

                  <div className="mt-6">
                    <Tabs defaultValue="saved">
                      <TabsList className="bg-gray-100 text-gray-600">
                        <TabsTrigger
                          value="saved"
                          className="data-[state=active]:bg-brand-orange data-[state=active]:text-white"
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          Saved Properties
                        </TabsTrigger>
                 
                      </TabsList>

                      <TabsContent value="saved" className="mt-4">
                        {savedProperties ? savedProperties?.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {savedProperties?.slice(0, 4).map((property) => (
                              <PropertyCard key={property._id} property={property as PropertyTypesWithImageUrls} onClick={() => {}} />
                            ))}
                          </div>
                        ) : (
                          <Card className="border border-gray-200">
                            <CardContent className="p-6 text-center">
                              <Heart className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                              <h3 className="text-lg font-medium text-gray-900 mb-1">No saved properties</h3>
                              <p className="text-gray-500">
                                You haven't saved any properties yet. Browse listings and click the heart icon to save
                                properties.
                              </p>
                            </CardContent>
                          </Card>
                        ) : (
                            <Loading/>
                        )}

                       
                      </TabsContent>

                    </Tabs>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

