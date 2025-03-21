import { Doc } from "../../convex/_generated/dataModel";

export interface PropertyTypes extends Doc<'property'> {
 displayImageUrl: string | null;
}
export interface PropertyTypesWithImageUrls extends Doc<'property'> {
    displayImageUrl: string | null;
    imageUrls: string[] | null;
}