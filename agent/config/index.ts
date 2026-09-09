import { z } from "zod";
import fs from "fs";
import path from "path";

const ConfigSchema = z.object({
  review: z.object({
    depth: z.enum(["shallow", "medium", "deep"]),
    tone: z.enum(["concise", "professional", "friendly", "direct"]),
    severity: z.enum(["all", "high", "low"]),
  }),
  models: z.object({
    scout: z.string(),
    deepReview: z.string(),
    orchestrator: z.string(),
  }),
  rules: z.object({
    enabled: z.boolean(),
    rulesFile: z.string(),
  }),
  maxChunkSize: z.number(),
  ignorePatterns: z.array(z.string()),
  fileTypes: z.record(z.array(z.string())),
});

export class ConfigLoader {
  private configPath: string;

  constructor(configPath = "./agent/config/review-defaults.yml") {
    this.configPath = configPath;
  }

  async load() {
    try {
      const content = await fs.promises.readFile(this.configPath, "utf-8");
      const config = JSON.parse(content);
      return ConfigSchema.parse(config);
    } catch (error) {
      console.warn("Failed to load config, using defaults:", error);
      return this.getDefaultConfig();
    }
  }

  private getDefaultConfig() {
    return {
      review: {
        depth: "deep",
        tone: "professional",
        severity: "all",
      },
      models: {
        scout: "gpt-4o-mini",
        deepReview: "claude-3-5-sonnet-20241022",
        orchestrator: "gpt-4o",
      },
      rules: {
        enabled: true,
        rulesFile: "rules.yml",
      },
      maxChunkSize: 5000,
      ignorePatterns: ["node_modules", "dist", "build", ".git"],
      fileTypes: {
        js: ["js", "jsx", "ts", "tsx"],
        css: ["css", "scss", "less"],
        json: ["json", "jsonc"],
        markdown: ["md", "mdx"],
      },
    };
  }
}

export const configLoader = new ConfigLoader();