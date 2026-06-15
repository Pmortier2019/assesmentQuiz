"use client";

import { useState } from "react";
import Link from "next/link";
import { Upload, CheckCircle2, AlertCircle, ArrowRight, RotateCcw, Shuffle } from "lucide-react";
import { importTest } from "@/lib/api";
import { AdminGuard } from "@/components/auth/AdminGuard";
import type { Test } from "@/lib/types";
import { LogoMark } from "@/components/ui/Logo";

type Status = "idle" | "loading" | "success" | "error";

const EXAMPLE_JSON = `[
  {
    "title": "Quarterly Revenue Analysis",
    "description": "Test your ability to interpret financial data under time pressure.",
    "type": "NUMERICAL_REASONING",
    "difficulty": "MEDIUM",
    "category": "FINANCE_CONSULTING",
    "subcategory": "Data Interpretation",
    "targetRoles": ["Finance", "Consulting"],
    "targetIndustries": ["Finance", "Consulting"],
    "recommendedForCompanies": ["Deloitte", "KPMG"],
    "skillsMeasured": ["percentage change", "ratio analysis", "data interpretation"],
    "isFree": true,
    "estimatedTimeMinutes": 12,
    "displayQuestionCount": 5,
    "questions": [
      {
        "orderIndex": 1,
        "questionText": "A company's revenue grew from €2.4M in Q1 to €3.0M in Q2. What is the percentage increase?",
        "explanation": "Percentage change = (new − old) ÷ old × 100 = (3.0 − 2.4) ÷ 2.4 × 100 = 0.6 ÷ 2.4 × 100 = 25%.",
        "answers": [
          { "answerText": "25%",  "isCorrect": true,  "orderIndex": 1 },
          { "answerText": "20%",  "isCorrect": false, "orderIndex": 2 },
          { "answerText": "30%",  "isCorrect": false, "orderIndex": 3 },
          { "answerText": "15%",  "isCorrect": false, "orderIndex": 4 }
        ]
      }
    ]
  }
]`;

export default function AdminImportPage() {
  const [raw, setRaw] = useState("");
  const [displayCount, setDisplayCount] = useState<string>("");
  const [status, setStatus] = useState<Status>("idle");
  const [imported, setImported] = useState<Test[]>([]);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [parseError, setParseError] = useState("");

  const handleChange = (value: string) => {
    setRaw(value);
    setParseError("");
    if (value.trim()) {
      try {
        JSON.parse(value);
      } catch {
        setParseError("Invalid JSON — check for missing commas or brackets.");
      }
    }
  };

  const handleImport = async () => {
    setParseError("");
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      setParseError("Invalid JSON — fix the syntax before importing.");
      return;
    }

    // Normalise to array
    const items: unknown[] = Array.isArray(parsed) ? parsed : [parsed];
    const overrideCount = displayCount !== "" ? parseInt(displayCount, 10) : null;

    // Apply displayQuestionCount override if set
    const toImport = items.map((item) => {
      if (overrideCount !== null && overrideCount > 0 && typeof item === "object" && item !== null) {
        return { ...(item as Record<string, unknown>), displayQuestionCount: overrideCount };
      }
      return item;
    });

    setStatus("loading");
    setErrorMsg("");
    setProgress({ done: 0, total: toImport.length });

    const results: Test[] = [];
    for (let i = 0; i < toImport.length; i++) {
      try {
        const test = await importTest(toImport[i]);
        results.push(test);
        setProgress({ done: i + 1, total: toImport.length });
      } catch (err) {
        setErrorMsg(
          `Failed on test ${i + 1}: ${err instanceof Error ? err.message : "Unknown error"}`
        );
        setStatus("error");
        setImported(results);
        return;
      }
    }

    setImported(results);
    setStatus("success");
    setProgress(null);
  };

  const reset = () => {
    setRaw("");
    setDisplayCount("");
    setStatus("idle");
    setImported([]);
    setProgress(null);
    setErrorMsg("");
    setParseError("");
  };

  // Detect how many tests are in the pasted JSON
  let previewCount = 0;
  if (raw.trim() && !parseError) {
    try {
      const p = JSON.parse(raw);
      previewCount = Array.isArray(p) ? p.length : 1;
    } catch { /* ignore */ }
  }

  return (
    <AdminGuard>
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <LogoMark size={30} className="shrink-0" />
            <span className="font-display font-bold text-[#2F5233]">
              Ready to <span className="text-[#EF96BD]">Ace</span>
            </span>
          </Link>
          <span className="text-xs font-semibold text-[#64748b] bg-[#f1f5f9] px-3 py-1 rounded-full">
            Admin — Test Import
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-6">

        {status === "success" ? (
          /* ── Success state ── */
          <div className="bg-white rounded-2xl border border-emerald-200 p-8 flex flex-col items-center gap-5 text-center animate-fade-up">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 size={28} className="text-emerald-600" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-[#0D1B2E] mb-1">
                {imported.length === 1 ? "Test imported!" : `${imported.length} tests imported!`}
              </h1>
              <p className="text-sm text-[#64748b]">All tests are now live in the platform.</p>
            </div>

            <div className="w-full flex flex-col gap-2">
              {imported.map((t) => {
                const poolSize = t.questionCount ?? t.questions.length;
                const shown = t.displayQuestionCount && t.displayQuestionCount > 0
                  ? t.displayQuestionCount
                  : poolSize;
                return (
                  <div key={t.id} className="flex items-center justify-between rounded-xl bg-[#f8fafc] border border-[#e2e8f0] px-4 py-3 text-left">
                    <div>
                      <p className="text-sm font-semibold text-[#0D1B2E]">{t.title}</p>
                      <p className="text-xs text-[#94a3b8] capitalize">
                        {t.type.replace(/_/g, " ")} · {t.difficulty}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
                      <Shuffle size={12} className="text-[#4f46e5]" />
                      <span>{shown}/{poolSize} vragen</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={reset}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#e2e8f0] text-sm font-semibold text-[#475569] hover:bg-[#f8fafc] transition-colors"
              >
                <RotateCcw size={14} />
                Import more
              </button>
              <Link
                href="/tests"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                View in Tests
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : (
          /* ── Import form ── */
          <>
            <div>
              <h1 className="font-display font-bold text-2xl text-[#0D1B2E] mb-1">Import tests</h1>
              <p className="text-sm text-[#64748b]">
                Paste a single test or an array of tests. They go live immediately.
              </p>
            </div>

            {/* Instructions */}
            <div className="rounded-xl bg-[#eef2ff] border border-[#c7d2fe] p-4 text-sm leading-relaxed">
              <p className="font-semibold text-[#4338ca] mb-1">How to use</p>
              <ol className="list-decimal list-inside flex flex-col gap-1 text-[#4f46e5]">
                <li>Generate tests using the AI prompt (ChatGPT / Claude)</li>
                <li>Ask for an array of tests: <code className="bg-[#e0e7ff] px-1 rounded text-xs">[ {"{ ... }"}, {"{ ... }"} ]</code></li>
                <li>Paste the JSON below, set the question pool size, and import</li>
              </ol>
            </div>

            {/* Question pool setting */}
            <div className="rounded-xl bg-white border border-[#e2e8f0] p-4 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Shuffle size={16} className="text-amber-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#0D1B2E] mb-0.5">Questions per attempt</p>
                <p className="text-xs text-[#64748b] mb-3">
                  Store a large pool but show only N random questions each time. Leave empty to show all questions.
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={displayCount}
                    onChange={(e) => setDisplayCount(e.target.value)}
                    placeholder="e.g. 8"
                    className="w-24 px-3 py-2 rounded-lg border border-[#e2e8f0] text-sm text-[#0D1B2E] focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/10 transition-all"
                  />
                  <span className="text-xs text-[#94a3b8]">
                    {displayCount
                      ? `→ user sees ${displayCount} random questions per attempt`
                      : "→ all questions shown (no randomisation)"}
                  </span>
                </div>
              </div>
            </div>

            {/* Textarea */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#475569]">
                  JSON
                  {previewCount > 0 && (
                    <span className="ml-2 text-[#4f46e5] font-medium">
                      · {previewCount} {previewCount === 1 ? "test" : "tests"} detected
                    </span>
                  )}
                </label>
                <button
                  onClick={() => handleChange(EXAMPLE_JSON)}
                  className="text-xs text-[#4f46e5] hover:underline font-medium"
                >
                  Load example
                </button>
              </div>
              <textarea
                value={raw}
                onChange={(e) => handleChange(e.target.value)}
                rows={20}
                placeholder={'Paste your JSON here, e.g. [ { "title": "...", "questions": [...] } ]'}
                className="w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-xs font-mono text-[#334155] placeholder-[#94a3b8] focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/10 transition-all resize-none"
              />
              {parseError && (
                <p className="text-xs text-[#e11d48] flex items-center gap-1.5">
                  <AlertCircle size={12} /> {parseError}
                </p>
              )}
            </div>

            {/* Error from backend */}
            {status === "error" && (
              <div className="rounded-xl bg-[#fff1f2] border border-[#fecdd3] px-4 py-3 flex items-start gap-2">
                <AlertCircle size={16} className="text-[#e11d48] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-[#e11d48]">Import failed</p>
                  <p className="text-xs text-[#9f1239] mt-0.5">{errorMsg}</p>
                  {imported.length > 0 && (
                    <p className="text-xs text-[#9f1239] mt-1">
                      {imported.length} {imported.length === 1 ? "test was" : "tests were"} imported before the error.
                    </p>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={handleImport}
              disabled={!raw.trim() || !!parseError || status === "loading"}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white font-semibold text-sm shadow-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {status === "loading" && progress ? (
                `Importing ${progress.done} / ${progress.total}…`
              ) : (
                <>
                  <Upload size={16} />
                  {previewCount > 1 ? `Import ${previewCount} tests` : "Import test"}
                </>
              )}
            </button>
          </>
        )}
      </main>
    </div>
    </AdminGuard>
  );
}
