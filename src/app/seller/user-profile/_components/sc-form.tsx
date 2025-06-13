"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "convex/react";
import { Loader2Icon } from "lucide-react";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../../../../../convex/_generated/api";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Loading from "@/components/loading";

const formSchema = z.object({
  socialMedia: z.object({
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
    X: z.string().optional(),
  }),
});

export const SocialMediaForm = () => {
  const currentUser = useQuery(api.users.currentWithDisplayImage);
  const handleSocials = useMutation(api.agentprofile.handleSocials);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = currentUser?.user;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      socialMedia: {
        facebook: "",
        instagram: "",
        linkedin: "",
        X: "",
      },
    },
  });

  useEffect(() => {
    if (user?.agentInfo?.socialMedia) {
      form.reset({
        socialMedia: {
          facebook: user.agentInfo.socialMedia.facebook || "",
          instagram: user.agentInfo.socialMedia.instagram || "",
          linkedin: user.agentInfo.socialMedia.linkedin || "",
          X: user.agentInfo.socialMedia.X || "",
        },
      });
    }
  }, [user, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast.error("User not found");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await handleSocials({
        userId: user._id,
        socialMedia: values.socialMedia,
      });

      if (result.success) {
        toast.success(result.message);
      }
    } catch (error) {
      console.error("Error updating socials:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update social media links"
      );
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
            <CardContent className="pt-6">
              <div className="mb-6">
                <h1 className="text-xl font-bold">Social Media Links</h1>
                <p className="text-zinc-500 text-sm">
                  Add your social media profile links
                </p>
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="socialMedia.facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Facebook className="h-4 w-4 text-blue-600" />
                        Facebook
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://facebook.com/yourprofile"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialMedia.instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Instagram className="h-4 w-4 text-pink-600" />
                        Instagram
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://instagram.com/yourprofile"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialMedia.linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Linkedin className="h-4 w-4 text-blue-700" />
                        LinkedIn
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://linkedin.com/in/yourprofile"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialMedia.X"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Twitter className="h-4 w-4" />X (Twitter)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://x.com/yourprofile"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end mt-6">
                <Button type="submit" disabled={isSubmitting}>
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
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};
