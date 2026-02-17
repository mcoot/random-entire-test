import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import type { Root, Code } from "mdast";
import type { AdventurePage, Choice } from "./types";

function parseChoicesFromBlock(content: string): Choice[] {
  const choices: Choice[] = [];
  const linkRegex = /\[(.+?)\]\((.+?)\)/g;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    choices.push({ label: match[1], targetId: match[2] });
  }
  return choices;
}

function extractFirstHeading(markdown: string): string | undefined {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match?.[1];
}

export async function parseAdventurePage(
  markdown: string,
  fallbackId: string
): Promise<AdventurePage> {
  const { data: frontmatter, content } = matter(markdown);

  const id = frontmatter.id ?? fallbackId;
  const title =
    frontmatter.title ?? extractFirstHeading(content) ?? fallbackId;

  // Parse to AST to extract and remove choices blocks
  const tree = unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .parse(content) as Root;

  let choices: Choice[] = [];

  // Walk AST to find and remove choices code blocks
  tree.children = tree.children.filter((node) => {
    if (node.type === "code" && (node as Code).lang === "choices") {
      choices = parseChoicesFromBlock((node as Code).value);
      return false;
    }
    return true;
  });

  // Convert remaining AST to HTML
  const file = await unified()
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .run(tree);

  const contentHtml = unified().use(rehypeStringify).stringify(file);

  return {
    id,
    title,
    contentHtml,
    choices,
    rawMarkdown: markdown,
  };
}
