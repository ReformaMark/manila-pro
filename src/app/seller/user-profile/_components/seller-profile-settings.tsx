import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoForm } from "./personal-info-form";
import { ProfessionalForm } from "./professional-form";

export const SellerProfileSettings = () => {
  return (
    <Tabs defaultValue="personal-info" className="max-sm:w-full h-full">
      <TabsList className="flex max-sm:flex-col max-sm:h-full md:justify-between md:space-x-9">
        <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
        <TabsTrigger value="professional">Professional</TabsTrigger>
        <TabsTrigger value="sc">Social & Contact</TabsTrigger>
        <TabsTrigger value="credentials">Credentials</TabsTrigger>
      </TabsList>
      <TabsContent value="personal-info">
        <PersonalInfoForm />
      </TabsContent>
      <TabsContent value="professional">
        <ProfessionalForm />
      </TabsContent>
      <TabsContent value="sc">sc form</TabsContent>
      <TabsContent value="credentials">Credentials Form</TabsContent>
    </Tabs>
  );
};
