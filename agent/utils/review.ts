export function generateInlineComments(diff: string, analysis: any): string[] {
  const comments: string[] = [];
  
  // Simple heuristic - could be enhanced with AI analysis
  const fileChanges = new Map();
  const lines = diff.split("\n");

  let currentFile = "";
  let inDiff = false;

  for (const line of lines) {
    if (line.startsWith("diff --git")) {
      const match = line.match(/b\/(.+)$/);
      if (match) currentFile = match[1];
      inDiff = true;
    } else if (line.startsWith("---") || line.startsWith("+++")) {
      inDiff = false;
    } else if (inDiff && line.startsWith("@@")) {
      // Count lines in hunk
      const match = line.match(/\+(\d+),(\d+)/) || line.match(/\-(\d+),(\d+)/);
      if (match) {
        const added = parseInt(match[2]);
        for (let i = 0; i < added; i++) {
          comments.push(`// TODO: Review line ${i + 1} in ${currentFile}`);
        }
      }
    }
  }

  return comments;
}