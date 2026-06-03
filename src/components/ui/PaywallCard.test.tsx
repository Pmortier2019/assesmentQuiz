import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PaywallCard } from "./PaywallCard";

// Smoke test for the paywall — the conversion surface shown when a free user
// hits the limit. next/navigation is stubbed globally in vitest.setup.ts so the
// embedded UpgradeButton (which calls useRouter) mounts without a router.
describe("PaywallCard", () => {
  it("renders the default upgrade messaging and CTA", () => {
    render(<PaywallCard />);

    expect(
      screen.getByRole("heading", { name: /unlock unlimited practice/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /upgrade to pro/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/no credit card required/i)).toBeInTheDocument();
  });

  it("renders a custom title when provided", () => {
    render(<PaywallCard title="Custom paywall heading" />);

    expect(
      screen.getByRole("heading", { name: "Custom paywall heading" })
    ).toBeInTheDocument();
  });
});
