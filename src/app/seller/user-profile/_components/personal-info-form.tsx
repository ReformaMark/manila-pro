"use client";

import Loading from "@/components/loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "convex/react";
import { CameraIcon, MapPinIcon, User2Icon, Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../../../../../convex/_generated/api";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const formSchema = z.object({
  // profile photo or picture
  image: z.string().optional(),

  // personal info
  fname: z.string().min(2, {
    message: "First name is required.",
  }),
  lname: z.string().min(2, {
    message: "Last name is required.",
  }),
  contact: z.string()
    .min(11, { message: "Contact number must be 11 digits" })
    .max(11, { message: "Contact number must be 11 digits" })
    .regex(/^09\d{9}$/, { message: "Must be a valid Philippine mobile number starting with '09'" }),
  bio: z.string().optional(),

  // address
  houseNumber: z.string().optional(),
  street: z.string().optional(),
  barangay: z.string().optional(),
  city: z.string().optional(),
});

export const PersonalInfoForm = () => {
  const currentUser = useQuery(api.users.currentWithDisplayImage);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const handlePersonalInfo = useMutation(api.agentprofile.handlePersonalInfo);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const user = currentUser?.user

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: "",
      fname: "",
      lname: "",
      contact: "",
      bio: "",
      houseNumber: "",
      street: "",
      barangay: "",
      city: "",
    },
  });

  // Update form values when user data is loaded or changes
  useEffect(() => {
    if (user) {
      form.reset({
        image: user.image || "",
        fname: user.fname || "",
        lname: user.lname || "",
        contact: user.contact || "",
        bio: user.bio || "",
        houseNumber: user.houseNumber || "",
        street: user.street || "",
        barangay: user.barangay || "",
        city: user.city || "",
      });
    }
  }, [user, form]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    // Cleanup previous preview URL if it exists
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    // Create new preview URL
    const newPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(newPreviewUrl);

    setIsUploading(true);
    try {
      const postUrl = await generateUploadUrl();

      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      const { storageId } = await result.json();
      form.setValue("image", storageId);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
      // Cleanup preview URL on error
      URL.revokeObjectURL(newPreviewUrl);
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast.error("User not found");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await handlePersonalInfo({
        userId: user._id,
        fname: values.fname,
        lname: values.lname,
        contact: values.contact,
        bio: values.bio || "",
        houseNumber: values.houseNumber || "",
        street: values.street || "",
        barangay: values.barangay || "",
        city: values.city || "",
        image: values.image || "",
      });

      if (result.success) {
        toast.success(result.message);
        // Reset form to show updated values
        form.reset({
          image: values.image,
          fname: values.fname,
          lname: values.lname,
          contact: values.contact,
          bio: values.bio,
          houseNumber: values.houseNumber,
          street: values.street,
          barangay: values.barangay,
          city: values.city,
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (user === undefined) return <Loading />;

  return (
    <div className="mt-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card>
            <CardContent>
              <div className="my-5">
                <h1 className="flex gap-1 text-xl font-bold">
                  <User2Icon />
                  Personal Information
                </h1>
                <p className="text-zinc-500 text-sm">
                  Update your basic personal information and profile picture
                </p>
              </div>
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    className="avatar-image"
                    src={previewUrl || currentUser?.displayImage || "/placeholder.svg"}
                    alt={`${user?.fname} ${user?.lname}`}
                  />
                  <AvatarFallback className="text-xl bg-zinc-300 font-bold">
                    {user?.fname[0]}
                    {user?.lname[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <input
                    type="file"
                    id="profile-image-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                  <Button
                    variant="outline"
                    className="gap-2"
                    type="button"
                    onClick={() => document.getElementById('profile-image-upload')?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2Icon className="h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <CameraIcon className="h-4 w-4" />
                        Change Photo
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">JPG, PNG or GIF. Max size 2MB.</p>
                </div>
              </div>

              <Separator className="my-5" />

              <div className="grid grid-cols-2 gap-3 mt-5">
                <FormField
                  control={form.control}
                  name="fname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-5">
                <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="09XXXXXXXXX"
                          {...field}
                          type="tel"
                          pattern="[0-9]*"
                          inputMode="numeric"
                          maxLength={11}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter your 11-digit Philippine mobile number starting with '09'
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-5">
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter bio" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="my-5">
                <h1 className="flex gap-1 text-xl font-bold">
                  <MapPinIcon />
                  Address Information
                </h1>
                <p className="text-zinc-500 text-sm">
                  Update your address information
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <FormField
                  control={form.control}
                  name="houseNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>House Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter house number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter street" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <FormField
                  control={form.control}
                  name="barangay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Barangay</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter barangay" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
