"use client";

import { useState } from "react";
import { useLocaleRouter } from "@/components/ui/LocaleLink";
import { Download, Trash2, AlertTriangle, ShieldCheck } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { exportMyData, deleteMyAccount } from "@/lib/api";
import { useT } from "@/lib/i18n";

export default function SettingsPage() {
  const { t } = useT();
  const router = useLocaleRouter();

  const [exporting, setExporting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmWord = t("settings_delete_confirm_word");
  const canDelete = confirmText.trim().toUpperCase() === confirmWord.toUpperCase();

  async function handleExport() {
    setExporting(true);
    setError(null);
    try {
      const data = await exportMyData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ready-to-ace-data-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError(t("settings_action_failed"));
    } finally {
      setExporting(false);
    }
  }

  async function handleDelete() {
    if (!canDelete) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteMyAccount();
      router.replace("/");
    } catch {
      setError(t("settings_action_failed"));
      setDeleting(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden"><Navbar /></div>
        <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
          <header>
            <h1 className="font-display text-2xl font-bold text-default">{t("settings_title")}</h1>
            <p className="text-sm text-muted mt-1">{t("settings_subtitle")}</p>
          </header>

          {error && (
            <div role="alert" className="flex items-center gap-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
              <AlertTriangle size={16} />
              {error}
            </div>
          )}

          {/* Data export */}
          <section className="bg-surface border border-line rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#2D7BFF]" />
              <h2 className="font-display font-semibold text-default">{t("settings_data_title")}</h2>
            </div>
            <p className="text-sm text-muted">{t("settings_data_desc")}</p>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="inline-flex items-center gap-2 self-start px-4 py-2.5 rounded-xl text-sm font-medium bg-[#2D7BFF] text-white hover:bg-[#1D63E6] disabled:opacity-60 transition-colors"
            >
              <Download size={16} />
              {exporting ? t("settings_exporting") : t("settings_download")}
            </button>
          </section>

          {/* Danger zone */}
          <section className="bg-surface border border-rose-200 rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-rose-600" />
              <h2 className="font-display font-semibold text-rose-700">{t("settings_danger_title")}</h2>
            </div>
            <p className="text-sm text-muted">{t("settings_danger_desc")}</p>
            <button
              onClick={() => { setConfirmOpen(true); setConfirmText(""); }}
              className="inline-flex items-center gap-2 self-start px-4 py-2.5 rounded-xl text-sm font-medium border border-rose-300 text-rose-700 hover:bg-rose-50 transition-colors"
            >
              <Trash2 size={16} />
              {t("settings_delete")}
            </button>
          </section>
        </main>
      </div>

      {/* Delete confirmation modal */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-title"
        >
          <div className="bg-surface rounded-2xl shadow-xl border border-line w-full max-w-md p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <AlertTriangle size={20} className="text-rose-600" />
              <h3 id="delete-title" className="font-display text-lg font-bold text-default">
                {t("settings_delete_confirm_title")}
              </h3>
            </div>
            <p className="text-sm text-muted">{t("settings_delete_confirm_desc")}</p>
            <label className="text-sm text-default flex flex-col gap-1.5">
              {t("settings_delete_confirm_label", { word: confirmWord })}
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                autoFocus
                className="border border-line rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </label>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setConfirmOpen(false)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-sm font-medium text-muted hover:bg-[#f1f5f9] transition-colors"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleDelete}
                disabled={!canDelete || deleting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50 transition-colors"
              >
                <Trash2 size={16} />
                {deleting ? t("settings_deleting") : t("settings_delete_confirm_cta")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
