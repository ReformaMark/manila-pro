import { CreatePropertyForm } from "@/components/seller/property-form/create-property-form";

export const metadata = {
    title: "Add New Property | Real Estate Platform",
    description: "List a new property for sale on our platform",
}

const NewPropertyPage = () => {
    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-orange-500">
                    Add New Property
                </h1>
                <p className="text-muted-foreground mt-1">
                    Fill out the form below to list your property for sale
                </p>
            </div>

            <CreatePropertyForm />
        </div>
    )
}

export default NewPropertyPage;
