import { eveChannel } from "eve/channels/eve";
import { vercelOidc, localDev, placeholderAuth } from "eve/channels/auth";
import { Octokit } from "@octokit/rest";
import { webhookHandler } from "../handlers/webhook-handler";

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

export default githubChannel;