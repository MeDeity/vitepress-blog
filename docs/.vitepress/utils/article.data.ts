import { createContentLoader } from "vitepress";
import { formatDate } from "./formatDate.js";
import { Post } from "./types.js";

declare const data: Post[];
export { data };

/**
 * 返回 src/Notes/ 目录下所有 md 文档信息
 */
export default createContentLoader("/Notes/**/*.md", {
  excerpt: excerptFn,
  transform(rawData): Post[] {
    return rawData
      .map(({ url, frontmatter }) => ({
        url,
        frontmatter,
        date: formatDate(frontmatter.updateTime),
      }))
      .filter((post) => /.html/.test(post.url) && !post.frontmatter.hidden)
      .sort((a, b) => b.date.time - a.date.time);
  },
});

function excerptFn(file: { data: { [key: string]: any }; content: string; excerpt?: string }, options?: any) {
  file.excerpt = file.content.split('<!-- DESC SEP -->')[1];
}
