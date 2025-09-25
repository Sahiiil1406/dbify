import { v } from "convex/values";
import { mutation,query } from "./_generated/server";

export const get = query({
  args: { projectId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("realtimeLogs")
      .withIndex("by_project", q => q.eq("projectId", args.projectId))
      .order("desc") // Optional: get most recent logs first if you want
      .take(100);
  },
});