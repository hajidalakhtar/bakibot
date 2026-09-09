# Configuration Guide

## Overview

All configuration lives in `config/` directory. There are two types:
- **Agent-level config** — applies to all repos
- **Repo-level config** — overrides for specific repositories

## 1. Agent-level Configuration

**Location**: `agent/config/review-defaults.yml`

```yaml
# Default review configuration
review:
  depth: medium                    # shallow | medium | deep
  criteria:
    bugs: true
    security: true
    performance: true
    naming: true
    code_smells: true
    test_coverage: true
    architecture: false

models:
  scout: "claude-3-5-sonnet-20240620"  # cheap model for scouting
  deep: "claude-3-5-sonnet-20240620"   # expensive model for deep review

behavior:
  format: hybrid                    # hybrid | inline | summary
  tone: concise                     # concise | friendly | direct | professional
  max_files_per_chunk: 50           # chunk large PRs
  retry_count: 3                    # retry failed reviews
  delta_review: true                # only review changed files

labels:
  reviewed: "reviewed"
  needs_changes: "needs-changes"
  in_review: "in-review"
```

## 2. Repo-level Configuration

**Location**: `.eve/review.yml` (in target GitHub repo)

```yaml
# Per-repo overrides
review:
  depth: deep
  rules:
    - pattern: "console\\.log"
      severity: medium
      category: style
      description: "Production code should not have console.log"
      fix: "Remove console.log"

    - pattern: "\\.sql"
      severity: high
      category: security
      description: "Raw SQL queries should be parameterized"
      fix: "Use parameterized queries or ORM"

    - pattern: ".*\\.test\\.js"
      severity: low
      category: test_coverage
      description: "Add tests for new endpoints"

# Model overrides
models:
  scout: "gpt-4o-mini"  # override scout model
  deep: "claude-3-5-sonnet-20240620"

# Behavior overrides
behavior:
  tone: direct
  max_files_per_chunk: 30
```

## 3. Custom Rules Format

### YAML Rules
```yaml
rules:
  - pattern: "<regex>"
    severity: <low|medium|high|critical>
    category: <style|security|performance|bugs|test_coverage|architecture>
    description: "<explanation>"
    fix: "<how to fix>"
```

### Markdown Rules
```markdown
# Security Rules
## Never allow raw SQL queries
## Always validate Prisma queries
## Check for rate limiting

# Performance Rules
## Check for N+1 queries
## Always use proper indexes
```

## 4. Config Loading Priority

1. **Agent-level config** (`review-defaults.yml`)
2. **Repo-level config** (`.eve/review.yml`)
3. **Environment variables** (overrides)

## 5. Environment Variables

```bash
# Model overrides
export REVIEW_SCOUT_MODEL="gpt-4o-mini"
export REVIEW_DEEP_MODEL="claude-3-5-sonnet-20240620"

# Behavior overrides
export REVIEW_DEPTH="deep"
export REVIEW_TONE="direct"
export REVIEW_MAX_FILES="30"
```

## 6. Config File Location

```
my-agent/
├── agent/
│   └── config/
│       └── review-defaults.yml     # Agent-level config
├── <target-repo>/
│   └── .eve/
│       └── review.yml              # Repo-level config
```

## 7. Validation

Config files are validated on startup. Errors will cause the agent to fail to start.

## 8. Example Usage

```yaml
# Deep review for a specific repo
review:
  depth: deep
  rules:
    - pattern: ".*\\.prisma"
      severity: high
      category: security
      description: "Always check Prisma schema for security implications"
```

## 9. Common Configuration Patterns

### For Security-Focused Repos
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
```

### For Performance-Critical Repos
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

## 10. Troubleshooting

| Issue | Solution |
|-------|----------|
| Config file not found | Create `.eve/review.yml` or use agent-level config |
| Invalid YAML | Fix syntax errors in rules |
| Model not found | Check model name spelling or add to LLM registry |
| Permission denied | Check GitHub App permissions for the repo |