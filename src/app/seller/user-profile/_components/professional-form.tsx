"use client";

import Loading from "@/components/loading";
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
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import {
  AwardIcon,
  Building2Icon,
  LanguagesIcon,
  Loader2Icon,
  MapPin,
  PlusIcon,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "../../../../../convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  title: z.string(),
  agency: z.string(),
  officeAddress: z.string().optional(),
  workingHours: z.object({
    days: z.string(),
    hours: z.string(),
  }),
  experience: z.coerce.number(),
  // specializations: z.array(z.string()),
  // languages: z.array(z.string()),
  // areasServed: z.array(z.string()).optional(),
});

export const ProfessionalForm = () => {
  const currentUser = useQuery(api.users.currentWithDisplayImage);
  const handleProfessionalInfo = useMutation(
    api.agentprofile.handleProfessionalInfo
  );
  const addToAgentInfo = useMutation(api.agentprofile.addToAgentInfo);
  const removeFromAgentInfo = useMutation(api.agentprofile.removeFromAgentInfo);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newSpecialization, setNewSpecialization] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [newArea, setNewArea] = useState("");

  const user = currentUser?.user;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agency: "",
      experience: 0,
      officeAddress: "",
      title: "",
      workingHours: {
        days: "",
        hours: "",
      },
      // languages: [],
      // specializations: [],
      // areasServed: [],
    },
  });

  // Update form values when user data is loaded or changes
  useEffect(() => {
    if (user) {
      form.reset({
        agency: user.agentInfo?.agency || "",
        officeAddress: user.agentInfo?.officeAddress || "",
        experience: user.agentInfo?.experience || 0,
        title: user.agentInfo?.title || "",
        workingHours: user.agentInfo?.workingHours || {
          days: "",
          hours: "",
        },
        // areasServed: Array.isArray(user.agentInfo?.areasServed)
        //   ? user.agentInfo.areasServed
        //   : [],
        // languages: Array.isArray(user?.agentInfo?.languages)
        //   ? user.agentInfo?.languages
        //   : [],
        // specializations: user.agentInfo?.specializations || [],
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
      const result = await handleProfessionalInfo({
        userId: user._id,
        agency: values.agency,
        experience: values.experience,
        title: values.title,
        officeAddress: values.officeAddress,
        workingHours: values.workingHours,
      });

      if (result.success) {
        toast.success(result.message);
        // Reset form to show updated values
        form.reset({
          agency: values.agency,
          experience: values.experience,
          title: values.title,
          officeAddress: values.officeAddress,
          workingHours: values.workingHours,
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update professional information"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleAddSpecialization = async () => {
    if (!newSpecialization.trim()) return;

    try {
      const result = await addToAgentInfo({
        field: "specializations",
        value: newSpecialization.trim(),
      });
      setNewSpecialization("");
      toast.success(result.message);
    } catch (error) {
      toast.error("Failed to add specialization");
    }
  };

  const handleRemoveSpecialization = async (index: number) => {
    if (!user?.agentInfo?.specializations) return;

    const updatedSpecializations = user.agentInfo.specializations.filter(
      (_, i) => i !== index
    );

    try {
      const result = await removeFromAgentInfo({
        field: "specializations",
        values: updatedSpecializations,
      });
      toast.success(result.message);
    } catch (error) {
      toast.error("Failed to remove specialization");
    }
  };

  const handleAddLanguage = async () => {
    if (!newLanguage.trim()) return;

    try {
      const result = await addToAgentInfo({
        field: "languages",
        value: newLanguage.trim(),
      });
      setNewLanguage("");
      toast.success(result.message);
    } catch (error) {
      toast.error("Failed to add language");
    }
  };

  const handleRemoveLanguage = async (index: number) => {
    if (!user?.agentInfo?.languages) return;

    const updatedLanguages = user.agentInfo.languages.filter(
      (_, i) => i !== index
    );

    try {
      const result = await removeFromAgentInfo({
        field: "languages",
        values: updatedLanguages,
      });
      toast.success(result.message);
    } catch (error) {
      toast.error("Failed to remove language");
    }
  };

  const handleAddArea = async () => {
    if (!newArea.trim()) return;

    try {
      const result = await addToAgentInfo({
        field: "areasServed",
        value: newArea.trim(),
      });
      setNewArea("");
      toast.success(result.message);
    } catch (error) {
      toast.error("Failed to add area");
    }
  };

  const handleRemoveArea = async (index: number) => {
    if (!user?.agentInfo?.areasServed) return;

    const updatedAreas = user.agentInfo.areasServed.filter(
      (_, i) => i !== index
    );

    try {
      const result = await removeFromAgentInfo({
        field: "areasServed",
        values: updatedAreas,
      });
      toast.success(result.message);
    } catch (error) {
      toast.error("Failed to remove area");
    }
  };

  if (user === undefined) return <Loading />;

  return (
    <div className="mt-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card>
            <CardContent>
              <div className="my-5">
                <h1 className="flex gap-1 text-xl font-bold">
                  <Building2Icon />
                  Professional Information
                </h1>
                <p className="text-zinc-500 text-sm">
                  Your real estate professional details
                </p>
              </div>

              <Separator className="my-5" />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter professional title..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-5">
                <FormField
                  control={form.control}
                  name="agency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agency/Company</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter agency..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-5">
                <FormField
                  control={form.control}
                  name="officeAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Office Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter office address..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 mt-5">
                <FormField
                  control={form.control}
                  name="workingHours.days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Working Days</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Working Days (Mon-Fri)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workingHours.hours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Working Hours</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Working Hours (9am-5pm)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-5">
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Experience (5)"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
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
        </form>
      </Form>

      <Card className="mt-5">
        <CardContent className="space-y-5">
          <div className="mt-5">
            <h1 className="flex gap-1 text-xl font-bold">
              <AwardIcon />
              Specializations & Languages
            </h1>
          </div>

          <div>
            <Label>Specializations</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newSpecialization}
                onChange={(e) => setNewSpecialization(e.target.value)}
                placeholder="Add specialization (Tip: press enter when submitting)"
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSpecialization();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddSpecialization}
                size="icon"
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {user?.agentInfo?.specializations?.map((spec, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {spec}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleRemoveSpecialization(index)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Languages</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                placeholder="Add language (Tip: press enter when submitting)"
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddLanguage();
                  }
                }}
              />
              <Button type="button" onClick={handleAddLanguage} size="icon">
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {user?.agentInfo?.languages?.map((lang, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  <LanguagesIcon className="h-3 w-3" />
                  {lang}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleRemoveLanguage(index)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Areas Served</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                placeholder="Add service area (Tip: press enter when submitting)"
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddArea();
                  }
                }}
              />
              <Button type="button" onClick={handleAddArea} size="icon">
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {user?.agentInfo?.areasServed?.map((area, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  <MapPin className="h-3 w-3" />
                  {area}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleRemoveArea(index)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
