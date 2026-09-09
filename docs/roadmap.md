# PR Code Review Agent - Roadmap

**Status**: Planning & Setup Phase  
**Target Date**: 2-3 hari  
**Version**: 1.0 (MVP)

---

## 📋 Roadmap Overview

| Phase | Tujuan | Status | Estimasi |
|-------|--------|--------|----------|
| 1 | Foundation & GitHub Setup | ✅ In Progress | 1-2 jam |
| 2 | Core Agents (Scout + Deep Review) | Pending | 2-3 jam |
| 3 | GitHub Integration | Pending | 2-3 jam |
| 4 | Polish & Deployment | Pending | 1-2 jam |

---

## 🗂️ Phase 1: Foundation & GitHub Setup

**Tujuan**: Setup environment dan GitHub channel

### Tasks:
1. **GitHub Channel Setup**
   - [ ] `eve add channel/github` dengan Vercel Connect
   - [ ] Setup GitHub App connection
   - [ ] Test webhook endpoint

2. **Project Structure**
   - [ ] Create project directory structure
   - [ ] Setup config files (`review-defaults.yml`)
   - [ ] Setup TypeScript configuration
   - [ ] Setup package.json

3. **Multi-Model Support**
   - [ ] Setup cheap model (scout) in `agent/agent.ts`
   - [ ] Setup expensive model (deep review)
   - [ ] Configure model switching logic

4. **Configuration**
   - [ ] Create `agent/config/review-defaults.yml`
   - [ ] Create `agent/config/rules/` directory
   - [ ] Setup rule parser

### Dependencies:
- `eve` framework
- `@vercel/connect/eve`
- `typescript`
- `zod` (for schemas)

---

## 🗂️ Phase 2: Core Agents

**Tujuan**: Implement review pipeline

### Tasks:
1. **Scout Agent**
   - [ ] Read PR diff
   - [ ] Identify changed files
   - [ ] Categorize issues (bugs, security, performance, etc.)
   - [ ] Filter files for deep review
   - [ ] Implement chunking for large PRs

2. **Deep Review Agent**
   - [ ] Detailed analysis per file
   - [ ] Generate inline comments
   - [ ] Create actionable summary
   - [ ] Implement severity scoring (P0/P1/P2)

3. **Pipeline Orchestrator**
   - [ ] Scout → Triage → Deep Review flow
   - [ ] Model switching logic
   - [ ] Result aggregation

4. **Custom Rules Engine**
   - [ ] YAML rule parser
   - [ ] Markdown rule parser
   - [ ] Rule matching engine
   - [ ] Severity assignment

---

## 🗂️ Phase 3: GitHub Integration

**Tujuan**: Connect dengan GitHub

### Tasks:
1. **Webhook Handler**
   - [ ] Handle `pull_request` events
   - [ ] Handle `issue_comment` events
   - [ ] Handle `pull_request_review_comment` events
   - [ ] Validate GitHub webhook signatures

2. **Comment Posting**
   - [ ] Post inline comments using GitHub API
   - [ ] Post summary comments
   - [ ] Handle comment threads
   - [ ] Update PR labels

3. **Delta Review**
   - [ ] Track last reviewed SHA
   - [ ] Compare current vs last reviewed
   - [ ] Only review changed files
   - [ ] Update review metadata

4. **PR Size Handling**
   - [ ] Chunk large PRs
   - [ ] Handle max files limit
   - [ ] Generate summary for large PRs

---

## 🗂️ Phase 4: Polish & Deployment

**Tujuan**: Finalisasi dan deploy

### Tasks:
1. **Error Handling**
   - [ ] Retry logic (3x retry)
   - [ ] Error comments on PR
   - [ ] Notification system (Slack/email)
   - [ ] Config validation

2. **Config Loader**
   - [ ] Agent-level config
   - [ ] Repo-level config
   - [ ] Environment variable overrides
   - [ ] Config validation

3. **Deployment**
   - [ ] Build for Vercel
   - [ ] Deploy to Vercel
   - [ ] Setup monitoring
   - [ ] Setup CI/CD

4. **Testing**
   - [ ] Unit tests
   - [ ] Evals
   - [ ] Integration tests
   - [ ] End-to-end tests

---

## 📊 Feature List

### MVP Features:
1. **GitHub Webhook Integration**
   - PR opened, synchronized, closed events
   - Comment-based invocation
   - Review comment events

2. **Multi-Model Review Pipeline**
   - Scout agent (cheap model)
   - Deep review agent (expensive model)
   - Model switching logic

3. **Hybrid Review Output**
   - Inline comments (per line)
   - Summary comments (actionable)
   - Review labels management

4. **Custom Rules Engine**
   - YAML rules support
   - Markdown rules support
   - Pattern matching engine

5. **Delta Review**
   - Track last reviewed SHA
   - Only review changed files
   - Update review metadata

6. **PR Size Handling**
   - Chunk large PRs
   - Max files limit
   - Summaries for large PRs

7. **Configurable Review**
   - Depth (shallow/medium/deep)
   - Criteria toggle
   - Tone (concise/friendly/direct)
   - Model selection

8. **Error Handling**
   - Retry logic
   - Error comments on PR
   - Logging

---

## 📝 Status Tracking

| Phase | Status | Progress | Next Action |
|-------|--------|----------|-------------|
| 1 | In Progress | 30% | Deploy to Vercel |
| 2 | Pending | 0% | - |
| 3 | Pending | 0% | - |
| 4 | Pending | 0% | - |

---

## 📅 Timeline

| Milestone | Target Date | Status |
|-----------|-------------|--------|
| GitHub Channel Setup | Hari 1 | ✅ In Progress |
| Agent Structure Complete | Hari 1-2 | Pending |
| Scout Agent Complete | Hari 2 | Pending |
| Deep Review Agent Complete | Hari 2 | Pending |
| Pipeline Integration | Hari 2-3 | Pending |
| Deployment to Vercel | Hari 3 | Pending |

---

## 🔧 Dependencies

```bash
# Core
eve
typescript
zod
@vercel/connect/eve

# GitHub
@octokit/rest
```

---

## 🏁 Next Steps

1. **Phase 1** → Deploy GitHub channel
2. **Phase 1** → Setup project structure
3. **Phase 1** → Setup config files
4. **Phase 2** → Implement Scout Agent
5. **Phase 2** → Implement Deep Review Agent
6. **Phase 3** → GitHub Integration
7. **Phase 4** → Polish & Deploy

---

## 📊 Feature List (JSON)

```json
{
  "project": "pr-code-review-agent",
  "version": "1.0",
  "mvp_features": [
    "github-webhook-integration",
    "multi-model-review-pipeline",
    "hybrid-review-output",
    "custom-rules-engine",
    "delta-review",
    "pr-size-handling",
    "configurable-review",
    "error-handling"
  ],
  "phases": {
    "phase1": {
      "name": "Foundation & GitHub Setup",
      "status": "in-progress",
      "tasks": [
        "github-channel-setup",
        "project-structure",
        "multi-model-support",
        "configuration"
      ]
    },
    "phase2": {
      "name": "Core Agents",
      "status": "pending",
      "tasks": [
        "scout-agent",
        "deep-review-agent",
        "pipeline-orchestrator",
        "custom-rules-engine"
      ]
    },
    "phase3": {
      "name": "GitHub Integration",
      "status": "pending",
      "tasks": [
        "webhook-handler",
        "comment-posting",
        "delta-review",
        "pr-size-handling"
      ]
    },
    "phase4": {
      "name": "Polish & Deployment",
      "status": "pending",
      "tasks": [
        "error-handling",
        "config-loader",
        "deployment",
        "testing"
      ]
    }
  }
}
```

---

Roadmap udah ditaruh di `docs/roadmap.md`. Mau lanjut ke Phase 1 sekarang? 🔥