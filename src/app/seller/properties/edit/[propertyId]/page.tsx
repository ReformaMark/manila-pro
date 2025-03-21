import { useQuery } from "convex/react"
import { Id } from "../../../../../../convex/_generated/dataModel"
import { api } from "../../../../../../convex/_generated/api"
import { EditPropertyForm } from "@/components/seller/edit-property-form/edit-property-form"

interface EditPropertySellerPageProps {
    params: {
        propertyId: Id<'property'>
    }
}

const EditPropertySellerPage = ({ params }: EditPropertySellerPageProps) => {
    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-orange-500">
                    Edit Property
                </h1>
                <p className="text-muted-foreground mt-1">
                    Fill out the form below to change your property details.
                </p>
            </div>

            <EditPropertyForm params={params} />
        </div>
    )
}

export default EditPropertySellerPage;