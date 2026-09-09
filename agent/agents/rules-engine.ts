import { defineAgent } from "eve";
import { z } from "zod";
import { RulesEngine } from "../config/rules/index";

const RulesEngineAgent = defineAgent({
  name: "rules-engine",
  description: "Applies custom rules to review findings",
  modelContextWindowTokens: 16000,
  model: {
    provider: "openai",
    model: "gpt-4o-mini",
  },
  instructions: `
You are Rules Engine - apply custom review rules to findings.

Rules:
- Security rules
- Best practices rules
- Style rules
- Performance rules

Output format:
- Rule violations found
- Severity per rule
- Suggested fixes
`,
});

export default RulesEngineAgent;