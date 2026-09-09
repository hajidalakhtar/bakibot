# Reference Guide

## 1. Configuration Schema

### 1.1 Review Configuration
```yaml
review:
  depth: <string>                    # shallow, medium, deep
  criteria: <object>
    bugs: <boolean>
    security: <boolean>
    performance: <boolean>
    naming: <boolean>
    code_smells: <boolean>
    test_coverage: <boolean>
    architecture: <boolean>
  behavior: <object>
    format: <string>                  # hybrid, inline, summary
    tone: <string>                   # concise, friendly, direct, professional
    max_files_per_chunk: <number>
    retry_count: <number>
    delta_review: <boolean>
  labels: <object>
    reviewed: <string>
    needs_changes: <string>
    in_review: <string>
  rules: <array>
    - pattern: <string>
      severity: <string>
      category: <string>
      description: <string>
      fix: <string>
```

### 1.2 Model Configuration
```yaml
models:
  scout: <string>                    # model name for scout
  deep: <string>                     # model name for deep review
```

### 1.3 Behavior Configuration
```yaml
behavior:
  format: <string>
  tone: <string>
  max_files_per_chunk: <number>
  retry_count: <number>
  delta_review: <boolean>
```

## 2. API Reference

### 2.1 Tools

| Tool Name | Description |
|-----------|-------------|
| `review_pr` | Main review orchestrator |
| `scout` | Cheap model scout |
| `deep_review` | Expensive model reviewer |
| `post_inline_comments` | Post inline review comments |
| `post_summary_comment` | Post summary comment |
| `github_api` | GitHub API helpers |

### 2.2 GitHub Channel Events

| Event | Trigger |
|-------|---------|
| `pull_request` | PR opened, synchronized, closed, etc. |
| `issue_comment` | Comments on PR |
| `pull_request_review_comment` | Review comments |

## 3. Error Codes

| Code | Description |
|------|-------------|
| `CONFIG_INVALID` | Invalid configuration file |
| `MODEL_NOT_FOUND` | Model name not found |
| `GITHUB_API_ERROR` | GitHub API error |
| `REVIEW_FAILED` | Review process failed |
| `RULE_PARSING_FAILED` | Failed to parse rules |

## 4. Config File Locations

### Agent-level
```
my-agent/agent/config/review-defaults.yml
```

### Repo-level
```
<target-repo>/.eve/review.yml
```

## 5. Environment Variables

| Variable | Description |
|----------|-------------|
| `REVIEW_SCOUT_MODEL` | Override scout model |
| `REVIEW_DEEP_MODEL` | Override deep model |
| `REVIEW_DEPTH` | Override review depth |
| `REVIEW_TONE` | Override tone |
| `REVIEW_MAX_FILES` | Override max files per chunk |
| `REVIEW_RETRY_COUNT` | Override retry count |

## 6. YAML Rules Reference

### Severity Levels
- `low`
- `medium`
- `high`
- `critical`

### Categories
- `style`
- `security`
- `performance`
- `bugs`
- `test_coverage`
- `architecture`

## 7. Markdown Rules Reference

### Security Rules
- Always check for rate limiting
- Never allow raw SQL queries
- Always validate Prisma queries

### Performance Rules
- Check for N+1 queries
- Always use proper indexes
- Check memory usage

## 8. Configuration Examples

### Example: Security Repo
```yaml
review:
  depth: deep
  criteria:
    security: true
    bugs: true
  rules:
    - pattern: "password"
      severity: critical
      category: security
      description: "Never hardcode credentials"
    - pattern: "\\.sql"
      severity: high
      category: security
      description: "Raw SQL queries should be parameterized"
```

### Example: Performance Repo
```yaml
review:
  depth: deep
  criteria:
    performance: true
    architecture: true
  rules:
    - pattern: "\\.get\\(\\)"
      severity: high
      category: performance
      description: "Use batch operations instead of individual queries"
```

## 9. TypeScript Types

```ts
interface ReviewConfig {
  depth: 'shallow' | 'medium' | 'deep';
  criteria: Record<string, boolean>;
  behavior: {
    format: 'hybrid' | 'inline' | 'summary';
    tone: string;
    maxFilesPerChunk: number;
    retryCount: number;
    deltaReview: boolean;
  };
  labels: Record<string, string>;
  rules: Rule[];
}

interface Rule {
  pattern: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  description: string;
  fix?: string;
}
```

## 10. Model Registry

### Available Models
- `claude-3-5-sonnet-20240620` (default)
- `gpt-4o`
- `gpt-4o-mini`
- `claude-3-5-haiku-20241022`

### Model Selection
```ts
// In agent/agent.ts
const ai = createOpenAI({
  baseURL: "https://ai.hajid.dev/v1",
  apiKey: process.env.RESEARCH_API_KEY,
});

export default defineAgent({
  model: ai.chat("builder"),
});
```

## 11. GitHub Channel Configuration

### Vercel Connect Setup
```ts
import { githubChannel } from "eve/channels/github";
import { connectGitHubCredentials } from "@vercel/connect/eve";

export default githubChannel({
  botName: "my-agent",
  credentials: connectGitHubCredentials("github/my-agent"),
});
```

### Manual Setup
```ts
import { githubChannel } from "eve/channels/github";

export default githubChannel({
  botName: "my-agent",
  credentials: {
    appId: process.env.GITHUB_APP_ID,
    privateKey: process.env.GITHUB_APP_PRIVATE_KEY,
    webhookSecret: process.env.GITHUB_WEBHOOK_SECRET,
  },
});
```

## 12. Delta Review Implementation

### SHA Tracking
```ts
interface DeltaTracker {
  lastReviewedSha?: string;
  getCurrentSha(): Promise<string>;
  isDeltaChanged(): Promise<boolean>;
}
```

### Review Flow
```ts
async function shouldReviewDelta(ctx: any): Promise<boolean> {
  const tracker = new DeltaTracker();
  const isChanged = await tracker.isDeltaChanged();
  return isChanged;
}
```

## 13. Chunked Review Implementation

### Chunking Strategy
```ts
interface ChunkedReview {
  files: File[];
  chunks: File[][];
  maxFilesPerChunk: number;
  getChunks(): File[][];
}
```

### Chunking Logic
```ts
class FileChunker {
  private files: File[];
  private maxFilesPerChunk: number;

  constructor(files: File[], maxFilesPerChunk: number) {
    this.files = files;
    this.maxFilesPerChunk = maxFilesPerChunk;
  }

  getChunks(): File[][] {
    const chunks: File[][] = [];
    let currentChunk: File[] = [];

    for (const file of this.files) {
      if (currentChunk.length >= this.maxFilesPerChunk) {
        chunks.push(currentChunk);
        currentChunk = [];
      }
      currentChunk.push(file);
    }

    if (currentChunk.length > 0) {
      chunks.push(currentChunk);
    }

    return chunks;
  }
}
```

## 14. Review Categories Reference

| Category       | Severity | Example Issues |
|----------------|----------|----------------|
| bugs           | P0       | Null reference, logic error |
| security       | P0       | Authentication bypass, SQL injection |
| performance    | P1       | N+1 queries, memory leaks |
| style          | P2       | Naming conventions, formatting |
| test_coverage  | P1       | Missing tests |
| architecture   | P1       | Design issues, maintainability |