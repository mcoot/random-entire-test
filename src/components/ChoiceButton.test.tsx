import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ChoiceButton from "./ChoiceButton";

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

describe("ChoiceButton", () => {
  it("renders the label text", () => {
    render(
      <ChoiceButton slug="demo" targetId="north" label="Go north" />
    );
    expect(screen.getByText("Go north")).toBeInTheDocument();
  });

  it("links to the correct adventure page", () => {
    render(
      <ChoiceButton slug="demo" targetId="north" label="Go north" />
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/adventure/demo?page=north");
  });
});
