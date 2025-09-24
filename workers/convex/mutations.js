// convex/mutations.js
import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const storeLog = mutation({
  args: {
    projectId: v.string(),
    apiKey: v.string(),
    operation: v.string(),
    tableName: v.string(),
    responseTime: v.string(),
    statusCode: v.string(),
    userAgent: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("realtimeLogs", {
      ...args,
      timestamp: Date.now(),
    });
  },
});