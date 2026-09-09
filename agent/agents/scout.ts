import { defineAgent } from "eve";
import { z } from "zod";

const ScoutAgent = defineAgent({
  name: "scout",
  description: "Fast scout agent - analyzes PR quickly to identify changed files and categorize issues",
  modelContextWindowTokens: 128000,
  model: {
    provider: "openai", // configurable via agent.ts
    model: "gpt-4o-mini", // cheap model for scout
  },
  instructions: `
You are Scout - a fast, lightweight reviewer. Your job is to:

1. Read the PR diff quickly
2. Identify all changed files
3. Categorize issues: bugs, security, performance, UX, etc.
4. Filter files that NEED deep review (skip obvious clean files)
5. Assign severity: P0 (must fix), P1 (should fix), P2 (nice to have)
6. Return structured findings

Output format:
- Summary of changes
- File changes map
- Issue categories with severity
- Files to send to Deep Review
- Confidence score (0-100)
`,
  tools: ["web-search", "web-fetch"], // use tools for research if needed
});

export default ScoutAgent;