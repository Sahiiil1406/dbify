import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey:
    process.env.GEMINI_API_KEY,
});

export const llmresponse = async (prompt) => {
  const systemMessage = {
    role: "system",
    content:
      "You are a highly knowledgeable assistant specializing in databases and SQL and backend.Also helpful in tradeoffss between different databases and approaches.Keep responses small (Max 100 words).",
  };

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${systemMessage.content}\nUser: ${prompt}`,
  });
  console.log("LLM Response:", response.text);
  return response.text;
};
