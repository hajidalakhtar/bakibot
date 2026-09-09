# PR Code Review Agent

**AI-Powered Pull Request Code Reviewer** — built with [eve framework](https://eve.dev)

---

## ✨ Overview

**PR Code Review Agent** adalah agen AI yang otomatis mereview pull request dari GitHub. Agen ini menggunakan **multi-model pipeline** (Scout + Deep Review) untuk memberikan feedback kode yang cepat, akurat, dan actionable.

### 🎯 Tujuan
- Review PR dengan cepat menggunakan Scout Agent
- Analisis mendalam menggunakan Deep Review Agent
- Integrasi langsung dengan GitHub (Webhook + API)
- Custom rules engine untuk review sesuai perusahaan

---

## 📋 Fitur Lengkap

### ✅ MVP Features
- **GitHub Webhook Integration** — Review otomatis saat PR dibuka, di-update, atau di-review
- **Multi-Model Review Pipeline** — Scout (cheap model) → Deep Review (expensive model)
- **Hybrid Review Output** — Inline comments + Summary comments
- **Custom Rules Engine** — YAML support untuk rules review perusahaan
- **Delta Review** — Hanya review file yang berubah
- **PR Size Handling** — Chunking untuk PR besar
- **Severity Scoring** — P0/P1/P2/P3
- **Configurable Review** — Depth, tone, criteria

### ✅ Phase 4 Additions
- Error handling dengan retry
- Config loader dengan validation
- Chunking utilities
- Inline comments generator
- Rules engine integration

---

## 🛠️ Cara Menggunakan

### 1. Development (Local)

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Ganti .env dengan GITHUB_TOKEN dan RESEARCH_API_KEY

# Start development server
eve dev
```

### 2. Configuration

#### Agent Configuration (`agent/agent.ts`)
```ts
// Model configuration
model: aiHajidDev.chat("builder"), // bisa diganti ke claude-3-5-sonnet atau gpt-4o
```

#### Review Defaults (`agent/config/review-defaults.yml`)
```yaml
review:
  depth: "deep"        # shallow | medium | deep
  tone: "professional" # concise | professional | friendly | direct
  severity: "all"      # all | high | low

models:
  scout: "gpt-4o-mini"
  deepReview: "claude-3-5-sonnet-20241022"
  orchestrator: "gpt-4o"

custom_rules:
  enabled: true
  rulesFile: "rules.yml"
```

#### Custom Rules (`agent/config/rules/rules.yml`)
```yaml
- id: "no-hardcoded-credentials"
  severity: "P0"
  category: "security"
  description: "Remove hardcoded credentials"
  condition: "contains: process.env or contains: API_KEY or contains: SECRET"
  action: "Use environment variables instead"
  enabled: true
```

### 3. Environment Variables

```bash
# GitHub
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxx
GITHUB_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx

# AI Models
RESEARCH_API_KEY=your-research-api-key
```

---

## 🔗 GitHub Integration

### Setup Webhook
1. Go to your GitHub repo → Settings → Webhooks
2. Add webhook URL:
   ```
   https://your-vercel-project.vercel.app/api/webhook
   ```
3. Select events:
   - `pull_request`
   - `pull_request_review_comment`
   - `issue_comment`

### Webhook Events Handled
- `pull_request` — Review otomatis saat PR dibuka/updated
- `pull_request_review_comment` — Review komentar review
- `issue_comment` — Review komentar issue

---

## 🚀 Deployment ke Vercel

```bash
# Link project
eve link --project <your-vercel-project>

# Deploy
eve deploy --yes
```

### Environment Variables di Vercel
- GITHUB_TOKEN (Repo Secret)
- GITHUB_WEBHOOK_SECRET (Repo Secret)
- RESEARCH_API_KEY (Project Secret)

---

## 🧪 Testing

### Test dengan Eve TUI
```bash
eve dev
```

Send message seperti:
```
Review this PR: [paste PR link]
```

### Test dengan Webhook
Gunakan GitHub webhook tester online untuk test tanpa push PR.

---

## 📁 Project Structure

```
bakibot/
├── agent/
│   ├── agent.ts              # Model configuration
│   ├── instructions.md        # Agent identity & behavior
│   ├── channels/
│   │   ├── eve.ts            # Main channel
│   │   └── github.ts         # GitHub integration
│   ├── agents/
│   │   ├── scout.ts          # Fast triage
│   │   ├── deep-review.ts    # Detailed analysis
│   │   ├── pipeline.ts       # Orchestrator
│   │   └── rules-engine.ts   # Custom rules
│   ├── handlers/
│   │   ├── pr-handler.ts
│   │   └── webhook-handler.ts
│   ├── services/
│   │   └── github.ts         # Octokit service
│   ├── config/
│   │   ├── review-defaults.yml
│   │   ├── rules/
│   │   │   ├── index.ts
│   │   │   └── rules.yml
│   │   └── index.ts          # Config loader
│   └── utils/
│       ├── chunking.ts
│       └── review.ts
├── docs/
│   └── roadmap.md
├── README.md
└── .env.example
```

---

## 🔧 Custom Rules Engine

### Supported Rule Types
- **Security**: Hardcoded credentials, API keys, secrets
- **Best Practices**: Async/await, error handling, naming
- **Style**: Unused imports, console.log, formatting
- **Performance**: Large functions, inefficient loops
- **UX**: Accessibility, user interface issues

### Rule Format
```yaml
- id: "rule-name"
  severity: "P0"        # P0 | P1 | P2 | P3
  category: "security"  # security | best-practice | style | performance | ux
  description: "Rule description"
  condition: "rule condition"
  action: "suggested fix"
  enabled: true
```

---

## 🛠️ Development

### Adding New Features
1. Create new agent in `agent/agents/`
2. Add tool in `agent/tools/`
3. Add handler in `agent/handlers/`
4. Update `agent/channels/` for integration
5. Update `agent/config/` for configuration

### Testing
- Use `eve dev` for local testing
- Test webhook handlers with GitHub webhook tester
- Use `npm test` for unit tests (if added)

---

## 📞 Support

For questions or issues, please open a GitHub issue or contact the maintainer.

---

*Built with ❤️ using [eve framework](https://eve.dev)*