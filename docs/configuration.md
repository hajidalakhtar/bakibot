# Konfigurasi PR Code Review Agent

Dokumentasi lengkap tentang konfigurasi untuk **PR Code Review Agent** yang dibangun dengan [eve framework](https://eve.dev).

---

## 📋 Daftar Isi

- [Ikhtisar](#ikhtisar)
- [Struktur File Konfigurasi](#struktur-file-konfigurasi)
- [1. Agent Configuration](#1-agent-configuration)
- [2. Review Defaults](#2-review-defaults)
- [3. Custom Rules Engine](#3-custom-rules-engine)
- [4. Channel Configuration](#4-channel-configuration)
- [5. Environment Variables](#5-environment-variables)
- [6. TypeScript Configuration](#6-typescript-configuration)
- [7. Package Configuration](#7-package-configuration)
- [Troubleshooting](#troubleshooting)

---

## Ikhtisar

PR Code Review Agent menggunakan sistem konfigurasi berlapis yang memungkinkan:

- **Konfigurasi Model AI** — Pilih model untuk setiap agen
- **Pengaturan Review** — Kedalaman, nada, dan kriteria review
- **Custom Rules** — Rules review sesuai kebutuhan perusahaan
- **Integrasi** — Konfigurasi GitHub dan channel lainnya

---

## Struktur File Konfigurasi

```
bakibot/
├── agent/
│   ├── agent.ts                    # Konfigurasi model utama
│   ├── config/
│   │   ├── index.ts                # Config loader dengan validasi
│   │   ├── review-defaults.yml     # Default review settings
│   │   └── rules/
│   │       ├── index.ts            # Rules engine
│   │       └── rules.yml           # Custom rules definition
│   └── channels/
│       ├── eve.ts                  # Main channel config
│       └── github.ts               # GitHub integration
├── tsconfig.json                   # TypeScript config
├── package.json                    # Dependencies & scripts
└── .env / .env.local              # Environment variables
```

---

## 1. Agent Configuration

**File:** `agent/agent.ts`

### Model Configuration

```typescript
import { createOpenAI } from "@ai-sdk/openai";
import { defineAgent } from "eve";

const aiHajidDev = createOpenAI({
  baseURL: "https://ai.hajid.dev/v1",
  apiKey: process.env.RESEARCH_API_KEY,
});

export default defineAgent({
  name: "pr-code-review-agent",
  description: "PR Code Review Agent with Scout + Deep Review pipeline",
  model: aiHajidDev.chat("builder"),
  modelContextWindowTokens: 128000,
  // ... agents and config
});
```

### Parameter Konfigurasi

| Parameter | Tipe | Default | Deskripsi |
|-----------|------|---------|-----------|
| `name` | string | `"pr-code-review-agent"` | Nama unik agent |
| `description` | string | - | Deskripsi agent |
| `model` | Model | - | Model AI utama untuk orchestrator |
| `modelContextWindowTokens` | number | `128000` | Maksimum token konteks |
| `agents` | object | - | Sub-agents (scout, deepReview, pipeline) |
| `config` | object | - | Review configuration overrides |

### Model yang Tersedia

```typescript
// Provider: OpenAI (default)
model: "gpt-4o"           // Model utama
model: "gpt-4o-mini"      // Model ringan (Scout)

// Provider: Anthropic
model: "claude-3-5-sonnet-20241022"  // Deep Review

// Custom Provider
const customProvider = createOpenAI({
  baseURL: "https://your-api.com/v1",
  apiKey: process.env.CUSTOM_API_KEY,
});
model: customProvider.chat("model-name")
```

### Sub-Agents

Agent ini menggunakan arsitektur multi-agent:

```typescript
agents: {
  scout: ScoutAgent,        // Fast analysis (gpt-4o-mini)
  deepReview: DeepReviewAgent,  // Detailed review (claude-3-5-sonnet)
  pipeline: PipelineAgent,  // Orchestrator (gpt-4o)
}
```

---

## 2. Review Defaults

**File:** `agent/config/review-defaults.yml`

### Struktur Konfigurasi

```yaml
review:
  depth: "deep"          # shallow | medium | deep
  tone: "professional"   # concise | professional | friendly | direct
  severity: "all"        # all | high | low

models:
  scout: "gpt-4o-mini"
  deepReview: "claude-3-5-sonnet-20241022"
  orchestrator: "gpt-4o"

custom_rules:
  enabled: true
  rulesFile: "rules.yml"

max_chunk_size: 5000     # Max lines per file untuk chunking

ignore_patterns:
  - node_modules
  - dist
  - build
  - .git

file_types:
  js: ["js", "jsx", "ts", "tsx"]
  css: ["css", "scss", "less"]
  json: ["json", "jsonc"]
  markdown: ["md", "mdx"]
```

### Opsi Review Depth

| Depth | Deskripsi | Use Case |
|-------|-----------|----------|
| `shallow` | Review cepat, hanya issue kritis | PR kecil, hotfix |
| `medium` | Review standar | PR normal |
| `deep` | Review mendalam dengan analisis detail | PR besar, feature baru |

### Opsi Tone

| Tone | Contoh Output |
|------|---------------|
| `concise` | "Remove unused import." |
| `professional` | "This import appears to be unused and should be removed for code cleanliness." |
| `friendly` | "Hey, I noticed this import isn't being used — might want to clean that up! 😊" |
| `direct` | "❌ Unused import. Remove it." |

### Opsi Severity

| Severity | Deskripsi |
|----------|-----------|
| `all` | Tampilkan semua issue (P0-P3) |
| `high` | Hanya P0 dan P1 |
| `low` | Hanya P2 dan P3 |

---

## 3. Custom Rules Engine

**File:** `agent/config/rules/rules.yml`

### Format Rule

```yaml
- id: "rule-name"                    # Unique identifier
  severity: "P0"                     # P0 | P1 | P2 | P3
  category: "security"               # Kategori rule
  description: "Rule description"    # Deskripsi rule
  condition: "kondisi trigger"       # Kapan rule aktif
  action: "suggested fix"            # Saran perbaikan
  enabled: true                      # Aktif/nonaktif
```

### Severity Levels

| Level | Label | Deskripsi | Action Required |
|-------|-------|-----------|-----------------|
| **P0** | Critical | Bug/security issue yang harus fix | Wajib fix sebelum merge |
| **P1** | High | Issue penting | Sebaiknya fix |
| **P2** | Medium | Improvement | Nice to have |
| **P3** | Low | Minor/style | Opsional |

### Categories

| Category | Deskripsi | Contoh |
|----------|-----------|--------|
| `security` | Keamanan | Hardcoded credentials, SQL injection |
| `bug` | Bug potensial | Null pointer, race condition |
| `performance` | Performa | N+1 query, inefficient loop |
| `best-practice` | Best practice | Async/await, error handling |
| `style` | Style/convention | Naming, unused imports |
| `ux` | User experience | Accessibility, responsive |

### Contoh Rules

```yaml
# Security Rules
- id: "no-hardcoded-credentials"
  severity: "P0"
  category: "security"
  description: "Remove hardcoded credentials"
  condition: "contains: process.env or contains: API_KEY or contains: SECRET"
  action: "Use environment variables instead"
  enabled: true

# Best Practice Rules
- id: "max-lines-per-function"
  severity: "P2"
  category: "best-practice"
  description: "Functions should not exceed 50 lines"
  condition: "function line_count > 50"
  action: "Break down the function"
  enabled: true

# Style Rules
- id: "no-unused-imports"
  severity: "P1"
  category: "style"
  description: "Remove unused imports"
  condition: "unused import detected"
  action: "Clean up imports"
  enabled: true

# Error Handling
- id: "consistent-error-handling"
  severity: "P1"
  category: "best-practice"
  description: "Use consistent error handling patterns"
  condition: "mixed error handling"
  action: "Standardize error handling"
  enabled: true
```

### Menambah Rule Baru

1. Edit `agent/config/rules/rules.yml`
2. Tambah rule baru dengan format yang benar
3. Restart agent (`eve dev`)

---

## 4. Channel Configuration

### Main Channel (`agent/channels/eve.ts`)

```typescript
import { eveChannel } from "eve/channels/eve";
import { localDev, placeholderAuth, vercelOidc } from "eve/channels/auth";

export default eveChannel({
  name: "main-channel",
  auth: [
    vercelOidc(),       // Production (Vercel)
    localDev(),         // Development (localhost)
    placeholderAuth(),  // Placeholder untuk auth lain
  ],
  channels: {
    github: githubChannel,
  },
});
```

### GitHub Channel (`agent/channels/github.ts`)

```typescript
import { eveChannel } from "eve/channels/eve";

const githubChannel = eveChannel({
  name: "github",
  description: "GitHub integration for PR reviews",
  auth: [
    vercelOidc(),
    localDev(),
    placeholderAuth(),
  ],
  webhook: {
    enabled: true,
    secret: process.env.GITHUB_WEBHOOK_SECRET,
    events: [
      "pull_request",
      "pull_request_review_comment",
      "issue_comment",
    ],
    handler: webhookHandler,
  },
});
```

### Webhook Events

| Event | Trigger | Action |
|-------|---------|--------|
| `pull_request` | PR dibuka/diupdate | Review otomatis |
| `pull_request_review_comment` | Komentar review | Reply/analyze |
| `issue_comment` | Komentar issue | Reply/analyze |

---

## 5. Environment Variables

### Required Variables

```bash
# GitHub Integration
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxx
GITHUB_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx

# AI Models
RESEARCH_API_KEY=your-research-api-key
```

### Optional Variables

```bash
# Custom Provider (jika menggunakan provider lain)
CUSTOM_API_KEY=your-custom-api-key
CUSTOM_BASE_URL=https://your-api.com/v1

# Debug
DEBUG=true
LOG_LEVEL=info
```

### Setup di Vercel

1. Buka Vercel Dashboard → Project → Settings → Environment Variables
2. Tambah variable:
   - `GITHUB_TOKEN` (Repository Secret)
   - `GITHUB_WEBHOOK_SECRET` (Repository Secret)
   - `RESEARCH_API_KEY` (Project Secret)

### Setup Lokal

```bash
# Copy template
cp .env.example .env

# Edit .env
nano .env

# Atau export langsung
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxx
export GITHUB_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx
export RESEARCH_API_KEY=your-research-api-key
```

---

## 6. TypeScript Configuration

**File:** `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "esnext",
    "moduleResolution": "bundler",
    "types": ["node", "eve/workflow-modules"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noEmit": true,
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "paths": {
      "@/*": ["./*"]
    },
    "plugins": [{ "name": "next" }]
  },
  "include": [
    "agent/**/*.ts",
    "evals/**/*.ts",
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

### Key Settings

| Setting | Value | Deskripsi |
|---------|-------|-----------|
| `target` | `ES2022` | Target JavaScript version |
| `module` | `esnext` | Module system |
| `strict` | `true` | Strict type checking |
| `jsx` | `react-jsx` | JSX transform |
| `paths` | `@/*` | Path alias untuk imports |

---

## 7. Package Configuration

**File:** `package.json`

### Scripts

```json
{
  "scripts": {
    "build": "eve build",
    "deploy": "eve deploy",
    "dev": "eve dev",
    "eval": "eve eval",
    "start": "eve start",
    "typecheck": "tsc"
  }
}
```

### Commands

| Command | Deskripsi |
|---------|-----------|
| `npm run dev` | Start development server |
| `npm run build` | Build untuk production |
| `npm run deploy` | Deploy ke Vercel |
| `npm run eval` | Run evaluations |
| `npm run start` | Start production server |
| `npm run typecheck` | Type check tanpa emit |

### Dependencies

```json
{
  "dependencies": {
    "eve": "^0.52.2",
    "ai": "^7.0.82",
    "@ai-sdk/openai": "^4.0.60",
    "next": "^16.3.0-preview.6",
    "react": "^19.2.6",
    "zod": "^4.5.4"
  }
}
```

---

## Troubleshooting

### Issue: Config not loading

**Solusi:**
```bash
# Pastikan file config ada
ls -la agent/config/

# Validasi YAML syntax
cat agent/config/review-defaults.yml

# Restart agent
npm run dev
```

### Issue: Environment variables not recognized

**Solusi:**
```bash
# Cek variables
echo $GITHUB_TOKEN
echo $RESEARCH_API_KEY

# Reload .env
source .env

# Atau restart terminal
```

### Issue: TypeScript errors

**Solusi:**
```bash
# Type check
npm run typecheck

# Clear cache
rm -rf node_modules/.cache
npm install
```

### Issue: Webhook not receiving events

**Solusi:**
1. Pastikan webhook URL benar
2. Cek `GITHUB_WEBHOOK_SECRET` match
3. Verify events yang dipilih di GitHub
4. Check logs di Vercel

---

## Referensi

- [Eve Framework Docs](https://eve.dev/docs)
- [GitHub Webhooks](https://docs.github.com/en/webhooks)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Zod Validation](https://zod.dev/)

---

*Terakhir diperbarui: Oktober 2024*
