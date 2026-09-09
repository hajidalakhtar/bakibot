import { Octokit } from "@octokit/rest";

export class GitHubService {
  private octokit: Octokit;
  private owner: string;
  private repo: string;

  constructor(token: string, owner: string, repo: string) {
    this.octokit = new Octokit({ auth: token });
    this.owner = owner;
    this.repo = repo;
  }

  async getPullRequest(prNumber: number) {
    const { data: pr } = await this.octokit.pulls.get({
      owner: this.owner,
      repo: this.repo,
      pull_number: prNumber,
    });
    return pr;
  }

  async getDiff(prNumber: number) {
    const { data: pr } = await this.octokit.pulls.get({
      owner: this.owner,
      repo: this.repo,
      pull_number: prNumber,
      mediaType: { format: "diff" },
    });
    return pr;
  }

  async postComment(prNumber: number, body: string, inReplyTo?: number) {
    await this.octokit.issues.createComment({
      owner: this.owner,
      repo: this.repo,
      issue_number: prNumber,
      body,
    });
  }

  async postReview(prNumber: number, body: string, event: "APPROVE" | "REQUEST_CHANGES" | "COMMENT") {
    await this.octokit.pulls.createReview({
      owner: this.owner,
      repo: this.repo,
      pull_number: prNumber,
      body,
      event,
    });
  }

  async createReviewSummary(prNumber: number, summary: string) {
    await this.postComment(prNumber, summary);
  }
}