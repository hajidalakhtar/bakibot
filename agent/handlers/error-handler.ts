import { defineHandler } from "eve/handlers";

export const errorHandler = defineHandler({
  name: "error-handler",
  description: "Handles errors and posts them to GitHub PR",
  async execute({ error, context }) {
    const { pr_number, owner, repo } = context;

    if (!pr_number) return;

    try {
      const github = context.github || new (await import("../services/github")).GitHubService(
        process.env.GITHUB_TOKEN!,
        owner,
        repo
      );

      const errorMessage = error instanceof Error ? error.message : String(error);
      
      await github.postComment(pr_number, `❌ Review failed: ${errorMessage}\n\nPlease check the logs.`);
    } catch (err) {
      console.error("Failed to post error to PR:", err);
    }
  },
});