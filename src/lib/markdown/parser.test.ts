import { describe, it, expect } from "vitest";
import { parseAdventurePage } from "./parser";

describe("parseAdventurePage", () => {
  it("parses frontmatter id and title", async () => {
    const md = `---
id: forest-clearing
title: The Forest Clearing
---

# The Forest Clearing

Some narrative text.
`;
    const page = await parseAdventurePage(md, "fallback");
    expect(page.id).toBe("forest-clearing");
    expect(page.title).toBe("The Forest Clearing");
  });

  it("falls back to filename for id when frontmatter id is missing", async () => {
    const md = `---
title: A Page
---

# A Page

Text here.
`;
    const page = await parseAdventurePage(md, "my-file");
    expect(page.id).toBe("my-file");
  });

  it("falls back to first heading for title when frontmatter title is missing", async () => {
    const md = `---
id: some-page
---

# The Heading Title

Text here.
`;
    const page = await parseAdventurePage(md, "fallback");
    expect(page.title).toBe("The Heading Title");
  });

  it("falls back to fallbackId for title when no frontmatter title or heading", async () => {
    const md = `---
id: some-page
---

Just some text without a heading.
`;
    const page = await parseAdventurePage(md, "fallback");
    expect(page.title).toBe("fallback");
  });

  it("extracts choices from choices code block", async () => {
    const md = `---
id: test-page
title: Test
---

Some text.

\`\`\`choices
- [Go north](north-room)
- [Go south](south-room)
\`\`\`
`;
    const page = await parseAdventurePage(md, "fallback");
    expect(page.choices).toEqual([
      { label: "Go north", targetId: "north-room" },
      { label: "Go south", targetId: "south-room" },
    ]);
  });

  it("removes choices block from rendered HTML", async () => {
    const md = `---
id: test-page
title: Test
---

Some text.

\`\`\`choices
- [Go north](north-room)
\`\`\`
`;
    const page = await parseAdventurePage(md, "fallback");
    expect(page.contentHtml).not.toContain("Go north");
    expect(page.contentHtml).not.toContain("choices");
    expect(page.contentHtml).toContain("Some text.");
  });

  it("returns empty choices for pages without choices block", async () => {
    const md = `---
id: ending
title: The End
---

# The End

You have reached the end.
`;
    const page = await parseAdventurePage(md, "fallback");
    expect(page.choices).toEqual([]);
  });

  it("renders narrative markdown as HTML", async () => {
    const md = `---
id: test
title: Test
---

# Hello World

A paragraph with **bold** text.
`;
    const page = await parseAdventurePage(md, "fallback");
    expect(page.contentHtml).toContain("<h1>Hello World</h1>");
    expect(page.contentHtml).toContain("<strong>bold</strong>");
  });

  it("preserves rawMarkdown", async () => {
    const md = `---
id: test
title: Test
---

Some content.
`;
    const page = await parseAdventurePage(md, "fallback");
    expect(page.rawMarkdown).toBe(md);
  });
});
