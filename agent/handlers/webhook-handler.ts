import { defineHandler } from "eve/handlers";
import { prHandler } from "./pr-handler";

export const webhookHandler = defineHandler({
  name: "github-webhook-handler",
  description: "Handles incoming GitHub webhooks",
  async execute({ event, payload, context }) {
    console.log(`Received GitHub event: ${event}`);

    switch (event) {
      case "pull_request":
        return await prHandler.execute({ event, payload, context });
      case "pull_request_review_comment":
        return { success: true, message: "Review comment received" };
      case "issue_comment":
        return { success: true, message: "Issue comment received" };
      default:
        return { success: false, message: `Unhandled event: ${event}` };
    }
  },
});