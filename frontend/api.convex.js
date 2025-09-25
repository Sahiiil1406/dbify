import { anyApi } from "convex/server";

// Export api and internal like before, but no type casting in JS
export const api = anyApi;
export const internal = anyApi;

// In JS you don't define types, so no PublicApiType/InternalApiType
