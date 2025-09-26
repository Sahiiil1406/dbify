// index.js
import express from "express";
import { agent, agentGraph, Tool } from "@inkeep/agents-sdk";
import pkg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { llmresponse } from "./llm.js";
import cors from "cors";
dotenv.config();
const { Pool } = pkg;

// Postgres connection
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const app = express();
app.use(express.json());
app.use(cors());

// Serve frontend from /public
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// Suggest SQL tool
const suggestSqlTool = new Tool({
  id: "suggest-sql",
  name: "Suggest SQL",
  description: "Convert NL → SQL",
  input: {
    type: "object",
    properties: { prompt: { type: "string" } },
    required: ["prompt"],
  },
  execute: async ({ prompt }) => {
    const systemPrompt = `You are an expert SQL generator. Given a natural language request, generate the corresponding SQL query. Only return the SQL query, nothing else.`;
    prompt =
      systemPrompt +
      "\n\nUser: " +
      prompt +
      "\nSQL:.Return only the SQL query.";

    const sql = await llmresponse(prompt);
    console.log("Generated SQL:", sql);
    return { sql };
  },
});

// Execute SQL tool
const executeSqlTool = new Tool({
  id: "execute-sql",
  name: "Execute SQL",
  description: "Run SQL against Postgres",
  input: {
    type: "object",
    properties: { sql: { type: "string" } },
    required: ["sql"],
  },
  execute: async ({ sql }) => {
    try {
      const { rows } = await pool.query(sql);
      return { rows };
    } catch (err) {
      return { error: err.message };
    }
  },
});


const scrapeDataTool = new Tool({
  id: "scrape-data",
  name: "Scrape Data",
  description: "Scrape data from a given URL",
  input: {
    type: "object",
    properties: { url: { type: "string" } },
    required: ["url"],
  },
  execute: async ({ url }) => {
    
    return { data: `Scraped data from ${url}` };
  },
});
// Agent + graph
const sqlAgent = agent({
  id: "sql-agent",
  name: "SQL Agent",
  description: "Agent that can propose and execute SQL",
  tools: () => [suggestSqlTool, executeSqlTool],
});
const questionAgent = agent({
  id: "question-agent",
  name: "Question Agent",
  description: "Agent that can answer questions by scraping data",
  tools: () => [scrapeDataTool],
});

app.post("/ai",async(req,res)=>{
  const {prompt}=req.body;
  const response=await llmresponse(prompt);
  //clear the response from unwanted characters
  const cleanedResponse=response.replace(/[^a-zA-Z0-9 .,!?'"()-]/g, "");
  res.json({response: cleanedResponse});
});
const graph = agentGraph({
  id: "graph",
  name: "dbify Graph",
  defaultAgent: sqlAgent,
  agents: () => [sqlAgent, questionAgent],
});

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Start serve
const PORT = process.env.PORT || 5002;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
