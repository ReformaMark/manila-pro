import { Id } from "../../../../../convex/_generated/dataModel";
import { SoloPropertyInfo } from "../_components/solo-property-info";

interface PropertyPageProps {
  params: {
    propertyId: Id<"property">;
  };
}

const PropertyPage = ({ params }: PropertyPageProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SoloPropertyInfo propertyId={params.propertyId} />
      </div>
    </div>
  );
};

export default PropertyPage;
