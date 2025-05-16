/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as admin from "../admin.js";
import type * as auth from "../auth.js";
import type * as conversations from "../conversations.js";
import type * as deal from "../deal.js";
import type * as files from "../files.js";
import type * as http from "../http.js";
import type * as messsages from "../messsages.js";
import type * as property from "../property.js";
import type * as ratings_reviews from "../ratings_reviews.js";
import type * as saved_properties from "../saved_properties.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  auth: typeof auth;
  conversations: typeof conversations;
  deal: typeof deal;
  files: typeof files;
  http: typeof http;
  messsages: typeof messsages;
  property: typeof property;
  ratings_reviews: typeof ratings_reviews;
  saved_properties: typeof saved_properties;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
