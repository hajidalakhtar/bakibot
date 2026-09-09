import { createOpenAI } from "@ai-sdk/openai";
import { defineAgent } from "eve";

const aiHajidDev = createOpenAI({
  baseURL: "https://ai.hajid.dev/v1",
  apiKey: process.env.RESEARCH_API_KEY,
});

export default defineAgent({
  model: aiHajidDev.chat("builder"),
  modelContextWindowTokens: 128000,
});
