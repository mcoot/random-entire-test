import fs from "fs/promises";
import path from "path";
import { parseAdventurePage } from "@/lib/markdown/parser";
import type { Adventure, AdventurePage } from "@/lib/markdown/types";

export async function loadAdventure(dirPath: string): Promise<Adventure> {
  const entries = await fs.readdir(dirPath);
  const mdFiles = entries.filter((f) => f.endsWith(".md"));

  const pages = new Map<string, AdventurePage>();
  let startPageId: string | undefined;

  for (const file of mdFiles) {
    const filePath = path.join(dirPath, file);
    const raw = await fs.readFile(filePath, "utf-8");
    const fallbackId = path.basename(file, ".md");
    const page = await parseAdventurePage(raw, fallbackId);
    pages.set(page.id, page);

    if (fallbackId === "start" || page.id === "start") {
      startPageId = page.id;
    }
  }

  if (!startPageId) {
    // Use the first page if no "start" page is found
    startPageId = pages.keys().next().value!;
  }

  const slug = path.basename(dirPath);
  const startPage = pages.get(startPageId)!;

  return {
    slug,
    title: startPage.title,
    pages,
    startPageId,
  };
}

export async function listAdventures(
  contentDir: string
): Promise<{ slug: string; title: string }[]> {
  const entries = await fs.readdir(contentDir, { withFileTypes: true });
  const dirs = entries.filter((e) => e.isDirectory());

  const adventures: { slug: string; title: string }[] = [];

  for (const dir of dirs) {
    const dirPath = path.join(contentDir, dir.name);
    const adventure = await loadAdventure(dirPath);
    adventures.push({ slug: adventure.slug, title: adventure.title });
  }

  return adventures;
}
