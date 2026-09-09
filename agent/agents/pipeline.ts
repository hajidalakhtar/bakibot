import { defineAgent } from "eve";
import { z } from "zod";
import ScoutAgent from "./scout";
import DeepReviewAgent from "./deep-review";

const PipelineAgent = defineAgent({
  name: "review-pipeline",
  description: "Orchestrator that runs Scout -> Triage -> Deep Review pipeline",
  modelContextWindowTokens: 128000,
  model: {
    provider: "openai",
    model: "gpt-4o", // main model for orchestration
  },
  instructions: `
You are Pipeline Orchestrator - the brain of the review system.

Workflow:
1. Take PR diff from user
2. Send to Scout Agent (fast analysis)
3. Scout returns findings -> Triage
4. Filter files for Deep Review
5. Deep Review Agent analyzes in detail
6. Aggregate results
7. Return final review with inline comments

Model switching logic:
- Scout uses cheap model (gpt-4o-mini)
- Deep Review uses expensive model (claude-3-5-sonnet)
- Orchestrator uses main model

Config overrides: Use from agent/config/rules/
`,
  tools: ["web-search", "web-fetch"],
});

export default PipelineAgent;