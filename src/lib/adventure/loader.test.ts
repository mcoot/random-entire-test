import { describe, it, expect, beforeAll, afterAll } from "vitest";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { loadAdventure, listAdventures } from "./loader";

let tmpDir: string;

beforeAll(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "adventure-test-"));

  const advDir = path.join(tmpDir, "test-adventure");
  await fs.mkdir(advDir, { recursive: true });

  await fs.writeFile(
    path.join(advDir, "start.md"),
    `---
id: start
title: The Beginning
---

# The Beginning

You stand at a crossroads.

\`\`\`choices
- [Go left](left-path)
- [Go right](right-path)
\`\`\`
`
  );

  await fs.writeFile(
    path.join(advDir, "left-path.md"),
    `---
id: left-path
title: Left Path
---

# Left Path

You went left. The end.
`
  );

  await fs.writeFile(
    path.join(advDir, "right-path.md"),
    `---
id: right-path
title: Right Path
---

# Right Path

You went right.

\`\`\`choices
- [Go back](start)
\`\`\`
`
  );
});

afterAll(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
});

describe("loadAdventure", () => {
  it("loads all pages from a directory", async () => {
    const adventure = await loadAdventure(path.join(tmpDir, "test-adventure"));
    expect(adventure.pages.size).toBe(3);
    expect(adventure.pages.has("start")).toBe(true);
    expect(adventure.pages.has("left-path")).toBe(true);
    expect(adventure.pages.has("right-path")).toBe(true);
  });

  it("sets the start page correctly", async () => {
    const adventure = await loadAdventure(path.join(tmpDir, "test-adventure"));
    expect(adventure.startPageId).toBe("start");
  });

  it("uses directory name as slug", async () => {
    const adventure = await loadAdventure(path.join(tmpDir, "test-adventure"));
    expect(adventure.slug).toBe("test-adventure");
  });

  it("uses start page title as adventure title", async () => {
    const adventure = await loadAdventure(path.join(tmpDir, "test-adventure"));
    expect(adventure.title).toBe("The Beginning");
  });

  it("correctly parses choices for each page", async () => {
    const adventure = await loadAdventure(path.join(tmpDir, "test-adventure"));
    const startPage = adventure.pages.get("start")!;
    expect(startPage.choices).toEqual([
      { label: "Go left", targetId: "left-path" },
      { label: "Go right", targetId: "right-path" },
    ]);

    const leftPage = adventure.pages.get("left-path")!;
    expect(leftPage.choices).toEqual([]);
  });
});

describe("listAdventures", () => {
  it("lists adventure directories", async () => {
    const adventures = await listAdventures(tmpDir);
    expect(adventures).toHaveLength(1);
    expect(adventures[0].slug).toBe("test-adventure");
    expect(adventures[0].title).toBe("The Beginning");
  });
});
