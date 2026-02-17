import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AdventureRenderer from "./AdventureRenderer";
import type { AdventurePage } from "@/lib/markdown/types";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const makePage = (overrides: Partial<AdventurePage> = {}): AdventurePage => ({
  id: "test-page",
  title: "Test Page",
  contentHtml: "<h1>Test Page</h1><p>Some narrative text.</p>",
  choices: [
    { label: "Go left", targetId: "left" },
    { label: "Go right", targetId: "right" },
  ],
  rawMarkdown: "",
  ...overrides,
});

describe("AdventureRenderer", () => {
  it("renders page content HTML", () => {
    render(<AdventureRenderer page={makePage()} slug="demo" />);
    expect(screen.getByText("Some narrative text.")).toBeInTheDocument();
  });

  it("renders choice buttons", () => {
    render(<AdventureRenderer page={makePage()} slug="demo" />);
    expect(screen.getByText("Go left")).toBeInTheDocument();
    expect(screen.getByText("Go right")).toBeInTheDocument();
  });

  it("renders choices with correct links", () => {
    render(<AdventureRenderer page={makePage()} slug="demo" />);
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/adventure/demo?page=left");
    expect(links[1]).toHaveAttribute("href", "/adventure/demo?page=right");
  });

  it("does not render choices nav for ending pages", () => {
    render(
      <AdventureRenderer page={makePage({ choices: [] })} slug="demo" />
    );
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });
});
