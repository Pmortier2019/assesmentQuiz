"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Search, CornerDownLeft, FileText, Layers, Tag, ArrowRight,
  LayoutDashboard, BookOpen, Trophy, BarChart2, Calendar, CreditCard, Settings,
  type LucideIcon,
} from "lucide-react";
import { getTests } from "@/lib/api";
import { CATEGORIES, ALL_TYPE_OPTIONS } from "@/components/test/FilterBar";
import { cn } from "@/lib/utils";

type Item = {
  key: string;
  group: string;
  label: string;
  sublabel?: string;
  icon: LucideIcon;
  href: string;
};

const NAV_ITEMS: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Dashboard",  href: "/dashboard",  icon: LayoutDashboard },
  { label: "Tests",      href: "/tests",      icon: BookOpen },
  { label: "Results",    href: "/results",    icon: Trophy },
  { label: "Progress",   href: "/progress",   icon: BarChart2 },
  { label: "Study Plan", href: "/study-plan", icon: Calendar },
  { label: "Pricing",    href: "/pricing",    icon: CreditCard },
  { label: "Settings",   href: "/settings",   icon: Settings },
];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Ctrl/Cmd+K toggles the palette; a custom event (from the navbar
  // hint) opens it.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        setQuery("");
        setActive(0);
      }
    }
    function onOpenEvent() {
      setOpen(true);
      setQuery("");
      setActive(0);
    }
    document.addEventListener("keydown", onKey);
    window.addEventListener("command-palette:open", onOpenEvent);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("command-palette:open", onOpenEvent);
    };
  }, []);

  // Focus the input when the palette opens (DOM side-effect only).
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  // Debounce the live test search.
  useEffect(() => {
    const id = setTimeout(() => setDebounced(query.trim()), 200);
    return () => clearTimeout(id);
  }, [query]);

  const { data: testsPage } = useQuery({
    queryKey: ["commandPalette", "tests", debounced],
    queryFn: () => getTests({ search: debounced }, 1, 5),
    enabled: open && debounced.length >= 2,
    staleTime: 30_000,
  });

  const q = query.trim().toLowerCase();
  const match = (s: string) => s.toLowerCase().includes(q);

  const items: Item[] = [
    // Navigation: shown by default (empty query) and when it matches.
    ...NAV_ITEMS
      .filter((n) => q.length === 0 || match(n.label))
      .map((n): Item => ({
        key: `nav-${n.href}`, group: "Navigation", label: n.label,
        icon: n.icon, href: n.href,
      })),
    // The rest only narrows things down once you've typed something.
    ...(q.length === 0 ? [] : [
      ...(testsPage?.data ?? []).map((t): Item => ({
        key: `test-${t.id}`, group: "Tests", label: t.title,
        sublabel: t.isFree ? "Free" : "Pro", icon: FileText, href: `/tests/${t.id}`,
      })),
      ...CATEGORIES
        .filter((c) => match(c.label) || match(c.term))
        .map((c): Item => ({
          key: `cat-${c.term}`, group: "Categories", label: c.label,
          sublabel: "Browse group", icon: Layers,
          href: `/tests?search=${encodeURIComponent(c.term)}`,
        })),
      ...ALL_TYPE_OPTIONS
        .filter((t) => match(t.label))
        .slice(0, 5)
        .map((t): Item => ({
          key: `type-${t.value}`, group: "Test types", label: t.label,
          sublabel: "Filter library", icon: Tag,
          href: `/tests?type=${encodeURIComponent(t.value)}`,
        })),
    ]),
  ];

  // Keep the active index in range as results change.
  const clampedActive = items.length === 0 ? 0 : Math.min(active, items.length - 1);

  const run = (item: Item | undefined) => {
    if (!item) return;
    setOpen(false);
    router.push(item.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (items.length ? (a + 1) % items.length : 0)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (items.length ? (a - 1 + items.length) % items.length : 0)); }
    else if (e.key === "Enter") { e.preventDefault(); run(items[clampedActive]); }
    else if (e.key === "Escape") { e.preventDefault(); setOpen(false); }
  };

  if (!open) return null;

  // Group items in render order while keeping a flat index for keyboard nav.
  let flatIndex = -1;
  const groups: string[] = [];
  for (const it of items) if (!groups.includes(it.group)) groups.push(it.group);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh] bg-[#0D1B2E]/40 backdrop-blur-sm animate-fade-in"
      onMouseDown={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl bg-surface rounded-2xl border border-line shadow-2xl overflow-hidden"
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-line">
          <Search size={18} className="text-subtle flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0); }}
            onKeyDown={onKeyDown}
            placeholder="Search tests, categories, or jump to a page..."
            className="flex-1 bg-transparent text-sm text-default placeholder-[#94a3b8] outline-none"
            role="combobox"
            aria-expanded
            aria-controls="command-results"
            aria-autocomplete="list"
          />
          <kbd className="hidden sm:inline text-[10px] font-semibold text-subtle bg-surface-muted border border-line rounded px-1.5 py-0.5">ESC</kbd>
        </div>

        {/* Results */}
        <div id="command-results" role="listbox" className="max-h-[55vh] overflow-y-auto py-2">
          {items.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-subtle">No results for &quot;{query}&quot;</p>
          ) : (
            groups.map((group) => (
              <div key={group}>
                <p className="px-4 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-subtle">{group}</p>
                {items.filter((it) => it.group === group).map((it) => {
                  flatIndex++;
                  const i = flatIndex;
                  const Icon = it.icon;
                  return (
                    <button
                      key={it.key}
                      type="button"
                      role="option"
                      aria-selected={i === clampedActive}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => run(it)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                        i === clampedActive ? "bg-[#eef2ff]" : "hover:bg-surface-subtle"
                      )}
                    >
                      <Icon size={16} className="text-[#4f46e5] flex-shrink-0" />
                      <span className="flex-1 text-sm font-medium text-default truncate">{it.label}</span>
                      {it.sublabel && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-subtle flex-shrink-0">{it.sublabel}</span>
                      )}
                      {i === clampedActive
                        ? <CornerDownLeft size={13} className="text-subtle flex-shrink-0" />
                        : <ArrowRight size={13} className="text-transparent flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
