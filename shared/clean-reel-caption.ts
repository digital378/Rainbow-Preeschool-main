/** Keep the reel's editorial sentences, not Instagram's keyword or hashtag tail. */
export function cleanReelCaption(caption: string | undefined): string {
  return (caption ?? "")
    .replace(/\[[^\]\n]*,[^\]\n]*,[^\]\n]*\]/g, "")
    .replace(/#[^\s#.,;!?()[\]{}]+/g, "")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Neutral, editorial excerpts for centre pages; the linked Instagram post is unchanged. */
export function cleanBranchReelCaption(caption: string | undefined): string {
  return cleanReelCaption(caption)
    .replace(/\bunderstood best\b/gi, "understood")
    .replace(/\bthe best part\b/gi, "a memorable part")
    .replace(/\bis best learned\b/gi, "is learned")
    .replace(/\bhappens best\b/gi, "happens")
    .replace(/\bbest moves\b/gi, "moves")
    .replace(/\bthe best bond\b/gi, "a special bond");
}