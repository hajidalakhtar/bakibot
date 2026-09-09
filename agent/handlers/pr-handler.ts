import { defineHandler } from "eve/handlers";
import { PipelineAgent } from "../agents/pipeline";
import { GitHubService } from "../services/github";

export const prHandler = defineHandler({
  name: "pr-review-handler",
  description: "Handles GitHub PR events and triggers review",
  async execute({ event, payload, context }) {
    const { owner, repo, pr_number } = payload;

    const github = new GitHubService(
      process.env.GITHUB_TOKEN!,
      owner,
      repo
    );

    // Get PR info
    const pr = await github.getPullRequest(pr_number);

    // Get diff
    const diff = await github.getDiff(pr_number);

    // Run pipeline
    const pipeline = new PipelineAgent();
    const review = await pipeline.run(diff, {
      depth: "deep",
      tone: "professional",
      severity: "all",
    });

    // Post review
    await github.postComment(pr_number, review.summary);

    // Post inline comments if needed
    if (review.inlineComments.length > 0) {
      for (const comment of review.inlineComments) {
        await github.postComment(pr_number, comment.body);
      }
    }

    return { success: true, review };
  },
});