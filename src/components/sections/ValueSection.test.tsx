import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ValueSection } from "./ValueSection";

// Smoke test for the homepage value proposition — the section that tells a
// first-time visitor what they get. If this stops rendering, the landing page
// is broken.
describe("ValueSection", () => {
  it("renders the section heading", () => {
    render(<ValueSection />);
    expect(
      screen.getByRole("heading", { name: /everything you need to get hired/i })
    ).toBeInTheDocument();
  });

  it("shows the free-tier and Pro value props", () => {
    render(<ValueSection />);
    expect(screen.getByText("5 free tests")).toBeInTheDocument();
    // Default currency is USD ($) for the English/default locale.
    expect(screen.getByText("$4/month Pro")).toBeInTheDocument();
    expect(screen.getByText("Profession-specific")).toBeInTheDocument();
  });

  it("localises the Pro price currency", () => {
    render(<ValueSection currency="€" />);
    expect(screen.getByText("€4/month Pro")).toBeInTheDocument();
  });
});
