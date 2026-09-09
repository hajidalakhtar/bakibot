import { z } from "zod";

// Custom rules engine for review rules
export const RuleSchema = z.object({
  id: z.string(),
  severity: z.enum(["P0", "P1", "P2", "P3"]),
  category: z.enum(["bug", "security", "performance", "ux", "best-practice", "style"]),
  description: z.string(),
  condition: z.string(), // YAML or JS condition
  action: z.string(),
  enabled: z.boolean().default(true),
});

export type Rule = z.infer<typeof RuleSchema>;

export class RulesEngine {
  private rules: Rule[] = [];

  async loadRules() {
    // In production: load from YAML/JSON files
    // For now: return sample rules
    return [
      {
        id: "no-console",
        severity: "P1",
        category: "style",
        description: "Remove console.log statements",
        condition: "contains: console.log",
        action: "replace with proper logging",
        enabled: true,
      },
      {
        id: "async-await",
        severity: "P2",
        category: "best-practice",
        description: "Use async/await instead of promises",
        condition: "contains: .then",
        action: "refactor to async/await",
        enabled: true,
      },
    ];
  }

  async evaluate(diff: string): Promise<Rule[]> {
    const rules = await this.loadRules();
    return rules.filter(rule => {
      // Simple matching - can be enhanced with regex
      return rule.condition.includes("console") || 
             rule.condition.includes("then");
    });
  }
}

export const rulesEngine = new RulesEngine();