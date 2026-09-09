import { defineAgent } from "eve";
import { z } from "zod";

const DeepReviewAgent = defineAgent({
  name: "deep-review",
  description: "Deep review agent - detailed analysis with inline comments and actionable feedback",
  modelContextWindowTokens: 200000,
  model: {
    provider: "openai",
    model: "claude-3-5-sonnet-20241022", // expensive model
  },
  instructions: `
You are Deep Review - a senior code reviewer. Your job is:

1. Read the PR diff in detail
2. Analyze each changed file thoroughly
3. Generate inline comments (line by line where needed)
4. Create actionable summary
5. Apply custom rules from config
6. Assign severity scores
7. Suggest improvements

Output format:
- Detailed per-file analysis
- Inline comments (use markdown code blocks)
- Summary of issues
- Severity breakdown
- Suggested fixes
- Overall review score (1-10)
- Configuration overrides to apply
`,
  tools: ["web-search", "web-fetch"],
});

export default DeepReviewAgent;