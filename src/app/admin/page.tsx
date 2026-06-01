"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Zap, Users, BookOpen, BarChart3, Sparkles, Trash2, Lock, Unlock,
  RefreshCw, Upload, AlertCircle, CheckCircle2, ChevronRight, Plus, Search,
} from "lucide-react";
import {
  getAdminStats, getAdminUsers, getAdminTests, getGenerationStatus,
  generateTestOfType, deleteTest, setTestFree,
  ALL_GENERATE_TYPES, ALL_DIFFICULTIES,
  AdminStats, AdminUser,
} from "@/lib/api";
import { isAdmin, isLoggedIn } from "@/lib/auth";
import { ASSESSMENT_TYPE_ICONS } from "@/lib/utils";
import type { Test } from "@/lib/types";

const DIFF_COLORS: Record<string, string> = {
  EASY:   "bg-emerald-100 text-emerald-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  HARD:   "bg-red-100 text-red-700",
};

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [genStatus, setGenStatus] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");
  const [generating, setGenerating] = useState<string | null>(null);
  const [defaultFree, setDefaultFree] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [togglingFree, setTogglingFree] = useState<string | null>(null);
  const [genError, setGenError] = useState<string | null>(null);
  const [bulkGenerating, setBulkGenerating] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{ done: number; total: number; current: string } | null>(null);
  const [perCombo, setPerCombo] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn() || !isAdmin()) {
      router.replace("/dashboard");
    }
  }, [router]);

  const refresh = useCallback(async () => {
    const [s, u, t, gs] = await Promise.all([
      getAdminStats(),
      getAdminUsers(),
      getAdminTests(),
      getGenerationStatus(),
    ]);
    setStats(s);
    setUsers(u);
    setTests(t);
    setGenStatus(gs);
    setLoading(false);
  }, []);

  useEffect(() => {
    void (async () => {
      await refresh();
    })();
  }, [refresh]);

  async function handleGenerate(type: string, difficulty: string, isFree = defaultFree) {
    const key = `${type}__${difficulty}`;
    setGenerating(key);
    setGenError(null);
    try {
      await generateTestOfType(type, difficulty, isFree);
      await refresh();
    } catch (e) {
      setGenError(`Generation failed for ${type} ${difficulty}: ${e instanceof Error ? e.message : "Unknown error"}`);
    } finally {
      setGenerating(null);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await deleteTest(id);
      setTests((prev) => prev.filter((t) => t.id !== id));
      setStats((prev) => prev ? { ...prev, totalTests: prev.totalTests - 1 } : prev);
    } finally {
      setDeleting(null);
    }
  }

  const countMap = tests.reduce((acc, t) => {
    const key = `${t.type}__${t.difficulty}`;
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  async function handleGenerateAll() {
    const todo: { type: string; diff: string; label: string }[] = [];
    for (const { type, label } of ALL_GENERATE_TYPES) {
      for (const diff of ALL_DIFFICULTIES) {
        const have = countMap[`${type}__${diff}`] ?? 0;
        const need = perCombo - have;
        for (let n = 0; n < need; n++) todo.push({ type, diff, label });
      }
    }
    if (todo.length === 0) return;
    setBulkGenerating(true);
    setGenError(null);
    setBulkProgress({ done: 0, total: todo.length, current: "" });
    for (let i = 0; i < todo.length; i++) {
      const { type, diff, label } = todo[i];
      setBulkProgress({ done: i, total: todo.length, current: `${label} — ${diff}` });
      try {
        await generateTestOfType(type, diff, defaultFree);
        if (i < todo.length - 1) await new Promise((r) => setTimeout(r, 3000));
      } catch (e) {
        setGenError(`Failed at ${label} ${diff}: ${e instanceof Error ? e.message : "error"}`);
        setBulkGenerating(false);
        setBulkProgress(null);
        return;
      }
    }
    setBulkGenerating(false);
    setBulkProgress(null);
    await refresh();
  }

  async function handleToggleFree(id: string, currentFree: boolean) {
    setTogglingFree(id);
    try {
      const updated = await setTestFree(id, !currentFree);
      setTests((prev) => prev.map((t) => t.id === id ? { ...t, isFree: updated.isFree } : t));
    } finally {
      setTogglingFree(null);
    }
  }

  const filteredTests = tests.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.type.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#4f46e5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] flex items-center justify-center">
                <Zap size={13} className="text-white fill-white" />
              </div>
              <span className="font-display font-bold text-[#0D1B2E]">Ready to Ace</span>
            </Link>
            <ChevronRight size={14} className="text-[#94a3b8]" />
            <span className="text-sm font-semibold text-[#4f46e5]">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/import"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#e2e8f0] text-sm font-semibold text-[#475569] hover:bg-[#f8fafc] transition-colors"
            >
              <Upload size={14} />
              Import
            </Link>
            <button
              onClick={refresh}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#4f46e5] text-white text-sm font-semibold hover:bg-[#4338ca] transition-colors"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: "Total tests",   value: stats?.totalTests,   icon: BookOpen, color: "text-[#4f46e5]", bg: "bg-[#eef2ff]" },
            { label: "Free tests",    value: stats?.freeTests,    icon: Unlock,   color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "AI generated",  value: stats?.aiTests,      icon: Sparkles, color: "text-[#7c3aed]", bg: "bg-[#f5f3ff]" },
            { label: "Users",         value: stats?.totalUsers,   icon: Users,    color: "text-[#0891b2]", bg: "bg-cyan-50" },
            { label: "Results",       value: stats?.totalResults, icon: BarChart3,color: "text-amber-600", bg: "bg-amber-50" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl border border-[#e2e8f0] p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={18} className={color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0D1B2E]">{value ?? "—"}</p>
                <p className="text-xs text-[#94a3b8]">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Generation status grid */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div>
              <h2 className="font-display font-semibold text-base text-[#0D1B2E]">Test Library Coverage</h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">Click a missing cell to generate that test</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-xs text-[#64748b] font-medium whitespace-nowrap">Per combo:</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={perCombo}
                  onChange={(e) => setPerCombo(Math.max(1, Math.min(20, Number(e.target.value))))}
                  disabled={bulkGenerating}
                  className="w-14 px-2 py-1.5 rounded-lg border border-[#e2e8f0] text-sm text-center font-semibold text-[#0D1B2E] focus:outline-none focus:border-[#4f46e5]"
                />
                <button
                  onClick={handleGenerateAll}
                  disabled={bulkGenerating || !!generating}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {bulkGenerating ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  {bulkGenerating ? "Generating…" : `Fill to ${perCombo}`}
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#64748b]">
                <span className="font-medium">New tests:</span>
                <div className="flex rounded-lg border border-[#e2e8f0] overflow-hidden font-semibold">
                  <button
                    onClick={() => setDefaultFree(true)}
                    className={`px-3 py-1.5 transition-colors ${defaultFree ? "bg-emerald-500 text-white" : "bg-white text-[#64748b] hover:bg-[#f8fafc]"}`}
                  >
                    Free
                  </button>
                  <button
                    onClick={() => setDefaultFree(false)}
                    className={`px-3 py-1.5 transition-colors ${!defaultFree ? "bg-[#4f46e5] text-white" : "bg-white text-[#64748b] hover:bg-[#f8fafc]"}`}
                  >
                    Pro
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#64748b]">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300 inline-block" /> Exists</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#f1f5f9] border border-[#e2e8f0] inline-block" /> Missing</span>
              </div>
            </div>
          </div>

          {bulkProgress && (
            <div className="mb-4 rounded-lg bg-[#eef2ff] border border-[#c7d2fe] px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-[#4f46e5]">
                  Generating {bulkProgress.done + 1} / {bulkProgress.total}
                </span>
                <span className="text-xs text-[#64748b]">{bulkProgress.current}</span>
              </div>
              <div className="w-full h-2 bg-[#c7d2fe] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#4f46e5] rounded-full transition-all duration-300"
                  style={{ width: `${(bulkProgress.done / bulkProgress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {genError && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 flex items-center gap-2 text-sm text-red-700">
              <AlertCircle size={14} />
              {genError}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left text-xs font-semibold text-[#94a3b8] pb-3 w-56">Type</th>
                  {ALL_DIFFICULTIES.map((d) => (
                    <th key={d} className="text-center text-xs font-semibold text-[#94a3b8] pb-3 w-32">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {ALL_GENERATE_TYPES.map(({ type, label }) => (
                  <tr key={type}>
                    <td className="py-2.5 pr-4">
                      <div className="flex items-center gap-2">
                        <span>{ASSESSMENT_TYPE_ICONS[type.toLowerCase() as keyof typeof ASSESSMENT_TYPE_ICONS] ?? "📋"}</span>
                        <span className="text-sm font-medium text-[#334155]">{label}</span>
                      </div>
                    </td>
                    {ALL_DIFFICULTIES.map((diff) => {
                      const key = `${type}__${diff}`;
                      const count = countMap[key] ?? 0;
                      const isGenerating = generating === key;
                      return (
                        <td key={diff} className="py-2.5 text-center">
                          <button
                            onClick={() => handleGenerate(type, diff)}
                            disabled={!!generating || bulkGenerating}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
                              count > 0
                                ? "bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                                : "bg-[#f8fafc] border border-[#e2e8f0] text-[#64748b] hover:bg-[#eef2ff] hover:border-[#c7d2fe] hover:text-[#4f46e5]"
                            }`}
                          >
                            {isGenerating ? (
                              <RefreshCw size={11} className="animate-spin" />
                            ) : count > 0 ? (
                              <CheckCircle2 size={11} />
                            ) : (
                              <Plus size={11} />
                            )}
                            {isGenerating ? "…" : count > 0 ? `${count}` : "Generate"}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Test library */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-base text-[#0D1B2E]">
              Test Library <span className="text-[#94a3b8] font-normal text-sm ml-1">({filteredTests.length})</span>
            </h2>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tests…"
                className="pl-8 pr-3 py-2 rounded-lg border border-[#e2e8f0] text-sm text-[#334155] focus:outline-none focus:border-[#4f46e5] w-52"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f1f5f9]">
                  {["Title", "Type", "Difficulty", "Questions", "Free", "Actions"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-[#94a3b8] pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f8fafc]">
                {filteredTests.map((t) => (
                  <tr key={t.id} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        {t.isGeneratedByAI && (
                          <span className="text-[10px] font-bold text-[#7c3aed] bg-[#f5f3ff] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 flex-shrink-0">
                            <Sparkles size={8} /> AI
                          </span>
                        )}
                        <span className="font-medium text-[#0D1B2E] truncate max-w-[200px]">{t.title}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-xs text-[#64748b] capitalize">{t.type.replace(/_/g, " ").toLowerCase()}</td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DIFF_COLORS[t.difficulty] ?? "bg-[#f1f5f9] text-[#64748b]"}`}>
                        {t.difficulty}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-sm text-[#475569]">
                      {t.questionCount ?? t.questions.length}
                      {t.displayQuestionCount && t.displayQuestionCount > 0 && (
                        <span className="text-xs text-[#94a3b8] ml-1">/{t.displayQuestionCount} shown</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <button
                        onClick={() => handleToggleFree(t.id, t.isFree)}
                        disabled={togglingFree === t.id}
                        className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg transition-colors ${
                          t.isFree
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"
                        }`}
                      >
                        {t.isFree ? <Unlock size={11} /> : <Lock size={11} />}
                        {t.isFree ? "Free" : "Paid"}
                      </button>
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => handleDelete(t.id, t.title)}
                        disabled={deleting === t.id}
                        className="p-1.5 rounded-lg text-[#94a3b8] hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
                        title="Delete test"
                      >
                        {deleting === t.id
                          ? <RefreshCw size={14} className="animate-spin" />
                          : <Trash2 size={14} />
                        }
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredTests.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-sm text-[#94a3b8]">
                      No tests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Users table */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
          <h2 className="font-display font-semibold text-base text-[#0D1B2E] mb-5">
            Users <span className="text-[#94a3b8] font-normal text-sm ml-1">({users.length})</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f1f5f9]">
                  {["Name", "Email", "Role target", "Tests done", "Avg score", "Joined"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-[#94a3b8] pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f8fafc]">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="py-3 pr-4 font-medium text-[#0D1B2E]">{u.name}</td>
                    <td className="py-3 pr-4 text-[#64748b]">{u.email}</td>
                    <td className="py-3 pr-4 text-[#64748b]">{u.targetRole ?? <span className="text-[#94a3b8] italic">none</span>}</td>
                    <td className="py-3 pr-4 text-[#475569]">{u.resultCount}</td>
                    <td className="py-3 pr-4">
                      {u.resultCount > 0 ? (
                        <span className={`font-semibold ${u.avgScore >= 70 ? "text-emerald-600" : u.avgScore >= 50 ? "text-amber-600" : "text-red-500"}`}>
                          {u.avgScore}%
                        </span>
                      ) : (
                        <span className="text-[#94a3b8]">—</span>
                      )}
                    </td>
                    <td className="py-3 text-xs text-[#94a3b8]">
                      {new Date(u.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-sm text-[#94a3b8]">No users yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
