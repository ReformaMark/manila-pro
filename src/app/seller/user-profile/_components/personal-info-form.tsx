"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import Loading from "@/components/loading";
import { User2Icon, UserIcon } from "lucide-react";

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
  contact: z.string(),
  bio: z.string().optional(),

  // address
  houseNumber: z.string().optional(),
  street: z.string().optional(),
  barangay: z.string().optional(),
  city: z.string().optional(),
});

export const PersonalInfoForm = () => {
  const user = useQuery(api.users.current);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fname: user?.fname || "",
      lname: user?.lname || "",
      contact: user?.contact || "",
      bio: user?.bio || "",

      // address
      houseNumber: user?.houseNumber || "",
      street: user?.street || "",
      barangay: user?.barangay || "",
      city: user?.city || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  if (user === undefined) return <Loading />;

  return (
    <div className="mt-5">
      <div className="mb-5">
        <h1 className="flex gap-1 text-xl font-bold">
          <User2Icon />
          Personal Information
        </h1>
        <p className="text-zinc-500 text-sm">
          Update your basic personal information and profile picture
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2">
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

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};
