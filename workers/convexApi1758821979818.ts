import { type FunctionReference, anyApi } from "convex/server";
import { type GenericId as Id } from "convex/values";

export const api: PublicApiType = anyApi as unknown as PublicApiType;
export const internal: InternalApiType = anyApi as unknown as InternalApiType;

export type PublicApiType = {
  task: {
    get: FunctionReference<"query", "public", { projectId: string }, any>;
    storeLog: FunctionReference<
      "mutation",
      "public",
      {
        apiKey: string;
        errorMessage?: string;
        ipAddress?: string;
        operation: string;
        projectId: string;
        responseTime: string;
        statusCode: string;
        tableName: string;
        userAgent?: string;
      },
      any
    >;
  };
};
export type InternalApiType = {};
