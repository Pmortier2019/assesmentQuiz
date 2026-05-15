"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, Upload, CheckCircle2, AlertCircle, ArrowRight, RotateCcw } from "lucide-react";
import { importTest } from "@/lib/api";
import type { Test } from "@/lib/types";

type Status = "idle" | "loading" | "success" | "error";

const EXAMPLE_JSON = `{
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
  "questions": [
    {
      "orderIndex": 1,
      "questionText": "A company's revenue grew from €2.4M in Q1 to €3.0M in Q2. What is the percentage increase?",
      "explanation": "Percentage change = (new − old) ÷ old × 100 = (3.0 − 2.4) ÷ 2.4 × 100 = 0.6 ÷ 2.4 × 100 = 25%.",
      "answers": [
        { "answerText": "25%",   "isCorrect": true,  "orderIndex": 1 },
        { "answerText": "20%",   "isCorrect": false, "orderIndex": 2 },
        { "answerText": "30%",   "isCorrect": false, "orderIndex": 3 },
        { "answerText": "15%",   "isCorrect": false, "orderIndex": 4 }
      ]
    }
  ]
}`;

export default function AdminImportPage() {
  const [raw, setRaw] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [imported, setImported] = useState<Test | null>(null);
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

    setStatus("loading");
    setErrorMsg("");
    try {
      const test = await importTest(parsed);
      setImported(test);
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Import failed");
      setStatus("error");
    }
  };

  const reset = () => {
    setRaw("");
    setStatus("idle");
    setImported(null);
    setErrorMsg("");
    setParseError("");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] flex items-center justify-center">
              <Zap size={13} className="text-white fill-white" />
            </div>
            <span className="font-display font-bold text-[#0D1B2E]">
              Mortier <span className="gradient-text">Asses</span>
            </span>
          </Link>
          <span className="text-xs font-semibold text-[#64748b] bg-[#f1f5f9] px-3 py-1 rounded-full">
            Admin — Test Import
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-6">

        {status === "success" && imported ? (
          /* ── Success state ── */
          <div className="bg-white rounded-2xl border border-emerald-200 p-8 flex flex-col items-center gap-4 text-center animate-fade-up">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 size={28} className="text-emerald-600" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-[#0D1B2E] mb-1">Test imported!</h1>
              <p className="text-sm text-[#64748b]">"{imported.title}" is now live in the platform.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mt-2">
              {[
                { label: "Type", value: imported.type.replace(/_/g, " ") },
                { label: "Difficulty", value: imported.difficulty },
                { label: "Questions", value: String(imported.questionCount ?? imported.questions.length) },
                { label: "Time", value: `${imported.estimatedTime} min` },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl bg-[#f8fafc] border border-[#e2e8f0] p-3 text-center">
                  <p className="text-xs text-[#94a3b8] mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-[#0D1B2E] capitalize">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-2">
              <button
                onClick={reset}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#e2e8f0] text-sm font-semibold text-[#475569] hover:bg-[#f8fafc] transition-colors"
              >
                <RotateCcw size={14} />
                Import another
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
              <h1 className="font-display font-bold text-2xl text-[#0D1B2E] mb-1">Import a test</h1>
              <p className="text-sm text-[#64748b]">
                Paste the JSON output from the AI generation prompt below. The test goes live immediately.
              </p>
            </div>

            {/* Instructions */}
            <div className="rounded-xl bg-[#eef2ff] border border-[#c7d2fe] p-4 text-sm text-[#4338ca] leading-relaxed">
              <p className="font-semibold mb-1">How to use</p>
              <ol className="list-decimal list-inside flex flex-col gap-1 text-[#4f46e5]">
                <li>Generate a test using the AI prompt (ChatGPT / Claude)</li>
                <li>Copy the entire JSON output</li>
                <li>Paste it in the field below and click Import</li>
              </ol>
            </div>

            {/* Textarea */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#475569]">JSON</label>
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
                placeholder='Paste your JSON here, e.g. { "title": "...", "questions": [...] }'
                className="w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-xs font-mono text-[#334155] placeholder-[#94a3b8] focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/10 transition-all resize-none"
              />
              {parseError && (
                <p className="text-xs text-[#e11d48] flex items-center gap-1">
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
                </div>
              </div>
            )}

            <button
              onClick={handleImport}
              disabled={!raw.trim() || !!parseError || status === "loading"}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white font-semibold text-sm shadow-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {status === "loading" ? (
                "Importing..."
              ) : (
                <>
                  <Upload size={16} />
                  Import test
                </>
              )}
            </button>
          </>
        )}
      </main>
    </div>
  );
}
