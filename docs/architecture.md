# PR Code Review Agent Architecture

**Project**: GitHub PR Code Review Agent  
**Framework**: eve (Vercel)  
**Model**: Multi-model (Scout → Deep Review)  
**Deployment**: Vercel  

## 1. Overview

Agent ini otomatis review PR yang di-push ke GitHub. Ada dua tier model:
- **Scout**: model murah (cheap) untuk triage cepat
- **Deep Review**: model mahal (expensive) untuk analisis mendalam

## 2. Architecture Flow

```
Webhook (GitHub)
    │
    ▼
GitHub Channel (eve)
    │
    ▼
Scout Agent (cheap model)
    │
    ├── Triage changed files
    ├── Categorize issues (bugs, security, etc)
    └── Filter files for deep review
    │
    ▼
Deep Review Agent (expensive model)
    ├── Detailed analysis per file
    ├── Inline comments
    ├── Summary comment (actionable P0/P1/P2)
    └── Review completion
    │
    ▼
GitHub API
    ├── Post inline comments
    ├── Post summary comment
    └── Update labels (reviewed, needs-changes)
```

## 3. Configurable Components

### 3.1 Review Depth
- Default: medium (configurable)
- Can be overridden per-repo via `.eve/review.yml`

### 3.2 Review Output
- **Hybrid**: Inline comments + Summary comment
- Summary format: Overall score + Top issues + Actionable items

### 3.3 Review Criteria
- Custom rules per repo (YAML + Markdown)
- Default criteria: bugs, security, performance, naming, code smells, test coverage

### 3.4 Delta Review
- Track last reviewed SHA via GitHub comment + local state
- Only review changed files since last review

### 3.5 Model Tiers
- Scout: cheap model (default: GPT-4o-mini or Claude 3.5 Sonnet)
- Deep: expensive model (default: Claude 3.5 Sonnet or GPT-4o)

## 4. Configuration Files

### 4.1 Agent-level Config (`config/review-defaults.yml`)
```yaml
review:
  depth: medium
  criteria:
    bugs: true
    security: true
    performance: true
    naming: true
    code_smells: true
    test_coverage: true

models:
  scout: "claude-3-5-sonnet-20240620"  # or gpt-4o-mini
  deep: "claude-3-5-sonnet-20240620"   # or gpt-4o

behavior:
  format: hybrid
  tone: concise
  max_files_per_chunk: 50
  retry_count: 3
```

### 4.2 Repo-level Config (`.eve/review.yml`)
```yaml
review:
  depth: deep
  rules:
    - "never allow console.log in production code"
    - "always use Prisma query validation"
```

## 5. Custom Rules Format

### YAML Structure
```yaml
rules:
  - pattern: "console.log"
    severity: medium
    category: style
    description: "Production code should not have console.log"
    fix: "Remove console.log"

  - pattern: ".*\\.sql"
    severity: high
    category: security
    description: "Raw SQL queries should be parameterized"
```

### Markdown Rules
```markdown
# Security Rules
## Never allow raw SQL queries
## Always validate Prisma queries
## Check for rate limiting
```

## 6. Review Categories

| Category       | Description                          | Scout Triage | Deep Review | Severity |
|----------------|--------------------------------------|--------------|-------------|----------|
| Bugs           | Runtime errors, logic errors          | ✓            | ✓           | P0       |
| Security       | Vulnerabilities, auth issues          | ✓            | ✓           | P0       |
| Performance    | N+1 queries, memory leaks             | ✓            | ✓           | P1       |
| Style          | Naming, formatting, comments           | ✓            | ✓           | P2       |
| Test Coverage  | Missing tests                         | ✓            | ✓           | P1       |
| Architecture   | Design issues, maintainability        |             | ✓           | P1       |

## 7. Project Structure

```
my-agent/
├── agent/
│   ├── agent.ts                    # Agent config
│   ├── instructions.md             # Behavior instructions
│   ├── channels/
│   │   ├── github.ts               # GitHub webhook channel
│   │   └── eve.ts                  # HTTP channel
│   ├── tools/
│   │   ├── review-pr.ts            # Main review orchestrator
│   │   ├── scout.ts                # Cheap model scout
│   │   ├── deep-review.ts          # Expensive model review
│   │   ├── post-comments.ts        # Inline & summary comments
│   │   └── github-api.ts           # GitHub helpers
│   ├── lib/
│   │   ├── github.ts               # GitHub API helpers
│   │   ├── review-engine.ts        # Pipeline logic
│   │   ├── rules-parser.ts         # YAML + Markdown parser
│   │   ├── delta-tracker.ts        # SHA tracking
│   │   └── config-loader.ts        # Config loading
│   ├── config/
│   │   └── review-defaults.yml     # Default config
│   └── types/
│       └── review.ts               # TypeScript types
├── docs/
│   └── architecture.md             # This file
├── .vercel/
└── package.json
```

## 8. Deployment

1. **Local**: `eve dev`
2. **Vercel**: `eve build && eve start`
3. **GitHub App**: Setup via Vercel Connect or manual

## 9. Next Steps

- Setup GitHub channel with Vercel Connect
- Create config files
- Implement scout and deep review agents
- Add custom rules support
- Deploy to Vercel