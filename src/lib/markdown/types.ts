export interface Choice {
  label: string;
  targetId: string;
}

export interface AdventurePage {
  id: string;
  title: string;
  contentHtml: string;
  choices: Choice[];
  rawMarkdown: string;
}

export interface Adventure {
  slug: string;
  title: string;
  pages: Map<string, AdventurePage>;
  startPageId: string;
}
