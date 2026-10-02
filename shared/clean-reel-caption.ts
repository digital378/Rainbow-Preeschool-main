/** Keep the reel's editorial sentences, not Instagram's keyword or hashtag tail. */
export function cleanReelCaption(caption: string | undefined): string {
  const cleaned = (caption ?? "")
    .replace(/\[[^\]\n]*,[^\]\n]*,[^\]\n]*\]/g, "")
    .replace(/#[^\s#.,;!?()[\]{}]+/g, "")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  const bannedMarker = /Admissions are OPEN|CLOSING soon|2026[-–]27|\+?\s?91[\s().-]*[6-9](?:[\s().-]*\d){9}|\b[6-9](?:[\s().-]*\d){9}\b|(?:\+?\s?91[\s().-]*)?0[\s().-]*\d{2,3}(?:[\s().-]*\d){6,8}(?!\d)|(?<!\d)(?:\+?\s?91[\s().-]*)?\d{2,3}[\s.-]+\d{3,4}[\s.-]+\d{4}(?!\d)/i;
  const match = bannedMarker.exec(cleaned);
  if (!match) return cleaned;

  const beforeMarker = cleaned.slice(0, match.index).trim();
  const firstSentence = beforeMarker.match(/^([\s\S]*?[.!?])(?:\s|$)/)?.[1]?.trim();
  return firstSentence || "Classroom moments at Rainbow Preschool International";
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