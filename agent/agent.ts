import { createOpenAI } from "@ai-sdk/openai";
import { defineAgent } from "eve";
import PipelineAgent from "./agents/pipeline";
import ScoutAgent from "./agents/scout";
import DeepReviewAgent from "./agents/deep-review";

const aiHajidDev = createOpenAI({
  baseURL: "https://ai.hajid.dev/v1",
  apiKey: process.env.RESEARCH_API_KEY,
});

export default defineAgent({
  name: "pr-code-review-agent",
  description: "PR Code Review Agent with Scout + Deep Review pipeline",
  model: aiHajidDev.chat("builder"),
  modelContextWindowTokens: 128000,
  agents: {
    scout: ScoutAgent,
    deepReview: DeepReviewAgent,
    pipeline: PipelineAgent,
  },
  config: {
    reviewDepth: "deep",
    tone: "professional",
    severity: "all",
  },
});
