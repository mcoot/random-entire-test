import Link from "next/link";
import path from "path";
import { listAdventures } from "@/lib/adventure/loader";

export default async function HomePage() {
  const contentDir = path.join(process.cwd(), "content");
  const adventures = await listAdventures(contentDir);

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold">Choose Your Own Adventure</h1>
      <p className="mb-8 text-lg text-gray-600">
        Select an adventure to begin your journey.
      </p>
      <div className="flex flex-col gap-4">
        {adventures.map((adventure) => (
          <Link
            key={adventure.slug}
            href={`/adventure/${adventure.slug}`}
            className="rounded-lg border border-gray-300 bg-white px-6 py-4 text-xl font-medium shadow-sm transition-colors hover:border-blue-500 hover:bg-blue-50"
          >
            {adventure.title}
          </Link>
        ))}
      </div>
    </main>
  );
}
