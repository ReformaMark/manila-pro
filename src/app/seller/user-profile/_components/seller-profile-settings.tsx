import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoForm } from "./personal-info-form";
import { ProfessionalForm } from "./professional-form";
import { SocialMediaForm } from "./sc-form";

export const SellerProfileSettings = () => {
  return (
    <Tabs
      defaultValue="personal-info"
      className="w-full max-w-3xl mx-auto h-full"
    >
      <TabsList className="flex max-sm:flex-col max-sm:h-full md:justify-between md:space-x-9">
        <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
        <TabsTrigger value="professional">Professional</TabsTrigger>
        <TabsTrigger value="sc">Social & Contact</TabsTrigger>
      </TabsList>
      <TabsContent value="personal-info">
        <PersonalInfoForm />
      </TabsContent>
      <TabsContent value="professional">
        <ProfessionalForm />
      </TabsContent>
      <TabsContent value="sc">
        <SocialMediaForm />
      </TabsContent>
    </Tabs>
  );
};
