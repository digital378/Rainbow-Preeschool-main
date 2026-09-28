/** Keep the reel's editorial sentences, not Instagram's keyword or hashtag tail. */
export function cleanReelCaption(caption: string | undefined): string {
  return (caption ?? "")
    .replace(/\[[^\]\n]*,[^\]\n]*,[^\]\n]*\]/g, "")
    .replace(/#[^\s#.,;!?()[\]{}]+/g, "")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}