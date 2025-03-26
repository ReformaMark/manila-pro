import { Doc } from "../../convex/_generated/dataModel";

export interface PropertyTypes extends Doc<'property'> {
 displayImageUrl: string | null;
}
export interface PropertyTypesWithImageUrls extends Doc<'property'> {
    displayImageUrl: string | null;
    imageUrls: string[] | null;
    agent: UserTypesWithImage | undefined
}

export interface UserTypesWithImage extends Doc<'users'> {
    userImageUrl: string | undefined;
    ratingsAndReviews: RatingsAndReviews[];
}

export interface RatingsAndReviews extends Doc<'ratings_reviews'>{

}

export interface Agent extends Doc<'users'> {
    transactions:number,
    rating: number,
    reviews: number,
    imageUrl: string | undefined
}