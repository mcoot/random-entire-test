import type { AdventurePage } from "@/lib/markdown/types";
import ChoiceButton from "./ChoiceButton";

interface AdventureRendererProps {
  page: AdventurePage;
  slug: string;
}

export default function AdventureRenderer({
  page,
  slug,
}: AdventureRendererProps) {
  return (
    <article className="mx-auto max-w-2xl px-4 py-8">
      <div
        className="prose prose-lg"
        dangerouslySetInnerHTML={{ __html: page.contentHtml }}
      />
      {page.choices.length > 0 && (
        <nav className="mt-8 flex flex-col gap-3" aria-label="Choices">
          {page.choices.map((choice) => (
            <ChoiceButton
              key={choice.targetId}
              slug={slug}
              targetId={choice.targetId}
              label={choice.label}
            />
          ))}
        </nav>
      )}
    </article>
  );
}
