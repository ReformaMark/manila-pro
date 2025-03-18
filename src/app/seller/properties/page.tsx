import { PropertiesDashboard } from "@/components/seller/properties-dashboard";
import { getDummyProperties } from "../../../../data/dummy-properties";

const PropertiesPage = () => {
    const properties = getDummyProperties()

    return (
        <div className="container mx-auto py-8 px-3 md:px-6">
            <PropertiesDashboard initialProperties={properties} />
        </div>
    )
}

export default PropertiesPage;