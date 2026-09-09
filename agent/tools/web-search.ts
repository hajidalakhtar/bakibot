import { defineTool } from "eve/tools";
import { z } from "zod";

const API_BASE = "https://ai.hajid.dev/v1";

interface SearchResult {
  title: string;
  url: string;
  display_url: string;
  snippet: string;
  position: number;
  published_at: string | null;
  content: string | null;
  metadata: {
    author: string | null;
    language: string | null;
    source_type: string | null;
    image_url: string | null;
  };
}

interface SearchResponse {
  provider: string;
  query: string;
  results: SearchResult[];
  answer: string | null;
  usage: {
    queries_used: number;
    search_cost_usd: number;
  };
  metrics: {
    response_time_ms: number;
    upstream_latency_ms: number;
    total_results_available: number;
  };
  errors: string[];
}

export default defineTool({
  description:
    "Search the web for information. Returns a list of results with titles, URLs, snippets, and metadata. Use this to find relevant web pages before fetching their full content.",
  inputSchema: z.object({
    query: z.string().min(1).describe("The search query"),
    maxResults: z
      .number()
      .int()
      .min(1)
      .max(10)
      .default(5)
      .describe("Maximum number of results to return (1-10, default 5)"),
  }),
  async execute({ query, maxResults }) {
    const apiKey = process.env.RESEARCH_API_KEY;
    if (!apiKey) {
      throw new Error("RESEARCH_API_KEY environment variable is not set");
    }

    const response = await fetch(`${API_BASE}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "exa",
        query,
        search_type: "web",
        max_results: maxResults,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Search API returned ${response.status}: ${response.statusText}`
      );
    }

    const data: SearchResponse = await response.json();

    if (data.errors.length > 0) {
      throw new Error(`Search errors: ${data.errors.join(", ")}`);
    }

    return {
      query: data.query,
      provider: data.provider,
      totalResults: data.metrics.total_results_available,
      results: data.results.map((r) => ({
        title: r.title,
        url: r.url,
        snippet: r.snippet || r.content || "",
        publishedAt: r.published_at,
        author: r.metadata.author,
      })),
      usage: {
        queriesUsed: data.usage.queries_used,
        costUsd: data.usage.search_cost_usd,
      },
    };
  },
  toModelOutput(output) {
    const lines = output.results.map(
      (r, i) =>
        `${i + 1}. **${r.title}**\n   ${r.url}\n   ${r.snippet || "(no snippet)"}`
    );
    return {
      type: "text" as const,
      value: `Search results for "${output.query}" (${output.totalResults} total):\n\n${lines.join("\n\n")}`,
    };
  },
});
