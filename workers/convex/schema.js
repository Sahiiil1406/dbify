// convex/schema.js
import { defineSchema, defineTable } from "convex/server";
// const { defineSchema, defineTable } = require("convex/server");
import { v } from "convex/values";   
// const { v } =require("convex/values");

export default defineSchema({
  // Real-time logs for dashboard (last 24-48 hours)
  realtimeLogs: defineTable({
    projectId: v.string(),
    apiKey: v.string(),
    operation: v.string(), // "create", "read", "update", "delete"
    tableName: v.string(),
    responseTime: v.string(), // in milliseconds
    statusCode: v.string(),
    timestamp: v.number(),
    userAgent: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
  })
    .index("by_project", ["projectId"])
    .index("by_timestamp", ["timestamp"])
    .index("by_project_timestamp", ["projectId", "timestamp"]),

  // Project stats (aggregated data)
  projectStats: defineTable({
    projectId: v.number(),
    totalRequests: v.number(),
    avgResponseTime: v.number(),
    errorCount: v.number(),
    lastUpdated: v.number(),
    requestsToday: v.number(),
  })
    .index("by_project", ["projectId"]),
});