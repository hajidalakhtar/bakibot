export function chunkText(text: string, maxSize: number): string[] {
  const chunks: string[] = [];
  let currentChunk = "";
  const lines = text.split("\n");

  for (const line of lines) {
    if ((currentChunk + line).length > maxSize && currentChunk.length > 0) {
      chunks.push(currentChunk);
      currentChunk = line + "\n";
    } else {
      currentChunk += line + "\n";
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
}

export function estimateLinesPerFile(diff: string): Map<string, number> {
  const fileLines = new Map<string, number>();
  const lines = diff.split("\n");

  let currentFile = "";
  let lineCount = 0;

  for (const line of lines) {
    if (line.startsWith("diff --git")) {
      // Extract file path
      const fileMatch = line.match(/b\/(.+)$/);
      if (fileMatch) {
        currentFile = fileMatch[1];
        lineCount = 0;
      }
    } else if (line.startsWith("@@") && currentFile) {
      // Count lines in hunk
      const match = line.match(/\+(\d+),(\d+)/) || line.match(/\-(\d+),(\d+)/);
      if (match) {
        const added = parseInt(match[2]);
        lineCount += added;
      }
    } else if (line.startsWith("+") || line.startsWith("-") || line.startsWith(" ")) {
      if (currentFile) {
        lineCount++;
      }
    }
  }

  if (currentFile) {
    fileLines.set(currentFile, lineCount);
  }

  return fileLines;
}