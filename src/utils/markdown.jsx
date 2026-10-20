/**
 * Strips Markdown syntax from a string to return plain text.
 * @param {string} markdown - The markdown content to strip.
 * @returns {string} - The plain text content.
 */
export const stripMarkdown = (markdown) => {
  if (!markdown) return "";
  return markdown
    .replace(/^#+\s+/gm, "") // headings
    .replace(/\*\*(.*?)\*\*/g, "$1") // bold
    .replace(/\*(.*?)\*/g, "$1") // italic
    .replace(/__(.*?)__/g, "$1") // bold
    .replace(/_(.*?)_/g, "$1") // italic
    .replace(/~~(.*?)~~/g, "$1") // strikethrough
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // links
    .replace(/!\[(.*?)\]\(.*?\)/g, "$1") // images
    .replace(/`{1,3}.*?`{1,3}/gs, "") // code blocks
    .replace(/^\s*[-*+]\s+/gm, "") // list items
    .replace(/^\s*\d+\.\s+/gm, "") // numbered list items
    .replace(/>\s+/gm, "") // blockquotes
    // remove html tags but keep content
    .replace(/<[^>]*>/g, "")
    // remove more than 2 consecutive newlines
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};
