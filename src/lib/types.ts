import { Doc } from "../../convex/_generated/dataModel";

export interface PropertyTypes extends Doc<"property"> {
  displayImageUrl: string | null;
}

export interface SellerPropertyWithNearbyPlaces extends Doc<'property'> {
  displayImage: string,
  nearbyPlaces: Doc<'nearby_places'>[]
}
export interface PropertyTypesWithImageUrls extends Doc<"property"> {
  displayImageUrl: string | null;
  isSaved: boolean;
  imageUrls: string[] | null;
  agent: UserTypesWithImage | undefined;
}

export interface UserTypesWithImage extends Doc<"users"> {
  userImageUrl: string | undefined;
  ratingsAndReviews: RatingsAndReviews[];
}

export interface RatingsAndReviews extends Doc<"ratings_reviews"> {}
export interface DealsType extends Doc<"deal"> {
  property: PropertyTypesWithImageUrls;
  agent: UserTypesWithImage;
}

export interface Agent extends Doc<"users"> {
  transactions: number;
  rating: number;
  reviews: number;
  imageUrl: string | undefined;
}

export interface AgentType extends Doc<"users"> {
  imageUrl: string | undefined | null;
}

export type DealStatus =
  | "pending_approval"
  | "negotiating"
  | "approved"
  | "rejected"
  | "active"
  | "completed"
  | "cancelled";

export interface ConversationType extends Doc<"conversations"> {
  messages: Doc<"messages">[];
  receiver: AgentType;
  unreadMessages: number;
}
