import { defineTool } from "eve/tools";
import { z } from "zod";

const API_BASE = "https://ai.hajid.dev/v1";

interface FetchResponse {
  provider: string;
  url: string;
  title: string;
  content: {
    format: string;
    text: string;
    length: number;
  };
  metadata: {
    author: string | null;
    published_at: string | null;
    language: string | null;
  };
  usage: {
    fetch_cost_usd: number;
  };
  metrics: {
    response_time_ms: number;
    upstream_latency_ms: number;
  };
}

export default defineTool({
  description:
    "Fetch and extract the full content of a web page as markdown. Use this after web_search to read the detailed content of a specific URL.",
  inputSchema: z.object({
    url: z.string().url().describe("The URL to fetch"),
    maxCharacters: z
      .number()
      .int()
      .min(0)
      .default(5000)
      .describe(
        "Maximum characters to return (0 for no limit, default 5000)"
      ),
  }),
  async execute({ url, maxCharacters }) {
    const apiKey = process.env.RESEARCH_API_KEY;
    if (!apiKey) {
      throw new Error("RESEARCH_API_KEY environment variable is not set");
    }

    const response = await fetch(`${API_BASE}/web/fetch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "exa",
        url,
        format: "markdown",
        max_characters: maxCharacters,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Fetch API returned ${response.status}: ${response.statusText}`
      );
    }

    const data: FetchResponse = await response.json();

    return {
      url: data.url,
      title: data.title,
      content: data.content.text,
      contentLength: data.content.length,
      author: data.metadata.author,
      publishedAt: data.metadata.published_at,
      language: data.metadata.language,
      costUsd: data.usage.fetch_cost_usd,
    };
  },
  toModelOutput(output) {
    const truncated =
      output.content.length > 3000
        ? output.content.slice(0, 3000) + "\n\n... (truncated)"
        : output.content;
    return {
      type: "text" as const,
      value: `# ${output.title}\n\nSource: ${output.url}\n\n${truncated}`,
    };
  },
});
