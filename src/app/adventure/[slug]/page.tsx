import path from "path";
import { notFound } from "next/navigation";
import { loadAdventure, listAdventures } from "@/lib/adventure/loader";
import AdventureRenderer from "@/components/AdventureRenderer";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  const contentDir = path.join(process.cwd(), "content");
  const adventures = await listAdventures(contentDir);
  return adventures.map((a) => ({ slug: a.slug }));
}

export default async function AdventurePage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const { page: pageId } = await searchParams;

  const contentDir = path.join(process.cwd(), "content", slug);

  let adventure;
  try {
    adventure = await loadAdventure(contentDir);
  } catch {
    notFound();
  }

  const currentPageId = pageId ?? adventure.startPageId;
  const currentPage = adventure.pages.get(currentPageId);

  if (!currentPage) {
    notFound();
  }

  return <AdventureRenderer page={currentPage} slug={slug} />;
}
