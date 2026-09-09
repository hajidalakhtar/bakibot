# Usage Guide

## 1. Setup

### 1.1 GitHub Channel Setup

```bash
# Using Vercel Connect (recommended)
eve add channel/github

# Manual GitHub App setup
# Create GitHub App
# Set env vars:
#   GITHUB_APP_ID=your_app_id
#   GITHUB_APP_PRIVATE_KEY=your_private_key
#   GITHUB_WEBHOOK_SECRET=your_webhook_secret
```

### 1.2 Deploy to Vercel

```bash
# Build
eve build

# Deploy
eve start
```

## 2. Configuration

### 2.1 Agent-level Configuration

Create `agent/config/review-defaults.yml` (see `docs/config.md` for format).

### 2.2 Repo-level Configuration

Create `.eve/review.yml` in your target GitHub repo (see `docs/config.md` for format).

## 3. Agent Behavior

### 3.1 Scout Agent
- Reads PR diff
- Identifies changed files
- Categorizes issues (bugs, security, performance, etc.)
- Filters files for deep review

### 3.2 Deep Review Agent
- Analyzes each file in detail
- Generates inline comments
- Creates actionable summary comment
- Updates PR labels

## 4. Review Process Flow

```
1. GitHub webhook receives PR event
2. Scout agent reads diff and triage
3. Deep review agent analyzes relevant files
4. Inline comments posted
5. Summary comment posted
6. PR labeled as reviewed
```

## 5. Custom Rules

### 5.1 Define Rules in `.eve/review.yml`

```yaml
review:
  rules:
    - pattern: "console\\.log"
      severity: medium
      category: style
      description: "Production code should not have console.log"
```

### 5.2 Rules Engine
- Parses YAML and Markdown rules
- Matches patterns in code
- Assigns severity levels
- Generates review comments

## 6. Configuration Examples

### Example 1: Security-Focused Repo
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

### Example 2: Performance-Focused Repo
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

## 7. Error Handling

### Common Errors
| Error | Handling |
|-------|----------|
| Model not found | Use default model |
| GitHub API error | Retry 3 times, then comment error |
| Invalid config | Fail to start agent |

## 8. Testing

### 8.1 Unit Tests
```bash
npm test
```

### 8.2 Evals
```bash
eve evals
```

## 9. Troubleshooting

### 9.1 Agent Not Starting
- Check config file syntax
- Verify model names are valid
- Check GitHub App permissions

### 9.2 Review Not Posted
- Check GitHub webhook setup
- Verify bot token permissions
- Check rate limits

### 9.3 Custom Rules Not Working
- Check rule format
- Verify pattern matching
- Check severity levels

## 10. Next Steps

1. Setup GitHub channel with Vercel Connect
2. Create config files (`agent/config/review-defaults.yml`)
3. Create `.eve/review.yml` in target repo
4. Deploy to Vercel
5. Test with sample PRs
6. Add custom rules for your codebase