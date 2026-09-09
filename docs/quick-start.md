# Quick Start

## 1. Setup

### 1.1 Install Dependencies

```bash
npm install
```

### 1.2 Setup GitHub Channel

```bash
eve add channel/github
```

### 1.3 Deploy to Vercel

```bash
eve build
eve start
```

## 2. Configuration

### 2.1 Agent-level Config

Create `agent/config/review-defaults.yml` (see `docs/config.md` for format).

### 2.2 Repo-level Config

Create `.eve/review.yml` in your target GitHub repo.

## 3. Basic Usage

```bash
# Start agent locally
eve dev

# Trigger review via webhook
# Add @my-agent to PR comment
```

## 4. Common Commands

| Command | Description |
|---------|-------------|
| `eve dev` | Run locally with hot reload |
| `eve build` | Build for production |
| `eve start` | Start production server |
| `eve evals` | Run evals |
| `eve add channel/github` | Setup GitHub channel |

## 5. Next Steps

1. Setup GitHub channel
2. Create config files
3. Deploy to Vercel
4. Test with sample PRs
5. Add custom rules

## 6. Troubleshooting

### 9.1 Agent Not Starting
- Check config file syntax
- Verify model names
- Check GitHub App permissions

### 9.2 Review Not Posted
- Check webhook setup
- Verify bot token
- Check rate limits

### 9.3 Custom Rules Not Working
- Check rule format
- Verify pattern matching