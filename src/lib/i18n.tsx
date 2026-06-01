"use client";

import { createContext, useContext, useSyncExternalStore, ReactNode } from "react";

export type Locale = "en" | "nl";

// ─── Translations ─────────────────────────────────────────────────────────────

const translations = {
  en: {
    // Nav
    nav_tests:          "Tests",
    nav_pricing:        "Pricing",
    nav_login:          "Login",
    nav_start:          "Start Practicing",
    nav_dashboard:      "Dashboard",
    nav_results:        "Results",
    nav_progress:       "Progress",
    nav_upgrade:        "Upgrade",

    // Dashboard
    dash_good_morning:  "Good morning",
    dash_good_afternoon:"Good afternoon",
    dash_good_evening:  "Good evening",
    dash_preparing_for: "Preparing for",
    dash_in:            "in",
    dash_free_remaining:"{n} free test{s} remaining.",
    dash_used_all:      "You've used all free tests — upgrade to keep going.",
    dash_edit_targets:  "Edit targets",
    dash_tests_completed: "Tests completed",
    dash_avg_score:     "Avg. score",
    dash_day_streak:    "Day streak",
    dash_keep_it_up:    "Keep it up!",
    dash_free_tests:    "Free tests",
    dash_daily_challenge: "Daily Challenge",
    dash_daily_exercises: "Suggested Daily Exercises",
    dash_short_focused: "Short & focused",
    dash_recommended:   "Recommended for you",
    dash_based_on_role: "Based on your role and industry",
    dash_browse_all:    "Browse all",
    dash_popular_for:   "Popular for",
    dash_see_all:       "See all",
    dash_skill_overview:"Skill Overview",
    dash_recent_results:"Recent Results",
    dash_view_all:      "View all",
    dash_no_results:    "No results yet. Start a test to see your progress here.",
    dash_browse_tests:  "Browse tests",
    dash_complete_tests:"Complete tests to see your skill breakdown.",
    dash_free_plan:     "Free plan",
    dash_pro_plan:      "Pro plan",
    dash_this_week:     "this week",
    dash_improvement:   "improvement",

    // Tests page
    tests_title:        "Practice Tests",
    tests_subtitle:     "Choose a test to start practicing",
    tests_search:       "Search tests…",
    tests_filter_type:  "All types",
    tests_filter_diff:  "All difficulties",
    tests_filter_access:"All tests",
    tests_free_only:    "Free only",
    tests_no_results:   "No tests match your filters.",
    tests_generate:     "Generate full test library",
    tests_generating:   "Generating…",
    tests_start:        "Start test",
    tests_free:         "Free",
    tests_questions:    "questions",
    tests_min:          "min",

    // Results page
    results_back:       "Back to tests",
    results_ai_feedback:"Detailed Feedback",
    results_q_review:   "Question Review",
    results_recommended:"Recommended next",
    results_history:    "Your history",
    results_keep_going: "Keep the momentum going",
    results_practice_daily: "Practice daily to see consistent score improvements.",
    results_continue:   "Continue practicing",
    results_explanation:"Explanation",
    results_no_recommendations: "No recommendations yet — complete more tests.",
    results_no_results: "No results yet",
    results_complete_test: "Complete a test to see your results here.",
    results_browse:     "Browse tests",

    // Common
    free:               "Free",
    pro:                "Pro",
    easy:               "Easy",
    medium:             "Medium",
    hard:               "Hard",
    cancel:             "Cancel",
    save:               "Save",
    loading:            "Loading…",
    error:              "Something went wrong",
    upgrade_cta:        "Upgrade to Pro",
    start_free:         "Start for free",
    see_all_tests:      "See all tests",
    minutes:            "min",
    questions:          "questions",
    assessment:         "Assessment",
  },

  nl: {
    // Nav
    nav_tests:          "Tests",
    nav_pricing:        "Prijzen",
    nav_login:          "Inloggen",
    nav_start:          "Begin met oefenen",
    nav_dashboard:      "Dashboard",
    nav_results:        "Resultaten",
    nav_progress:       "Voortgang",
    nav_upgrade:        "Upgraden",

    // Dashboard
    dash_good_morning:  "Goedemorgen",
    dash_good_afternoon:"Goedemiddag",
    dash_good_evening:  "Goedenavond",
    dash_preparing_for: "Je bereidt je voor op",
    dash_in:            "in",
    dash_free_remaining:"{n} gratis test{s} over.",
    dash_used_all:      "Je hebt alle gratis tests gebruikt — upgrade om door te gaan.",
    dash_edit_targets:  "Doelen aanpassen",
    dash_tests_completed: "Tests afgerond",
    dash_avg_score:     "Gem. score",
    dash_day_streak:    "Dagenreeks",
    dash_keep_it_up:    "Blijf zo!",
    dash_free_tests:    "Gratis tests",
    dash_daily_challenge: "Dagelijkse uitdaging",
    dash_daily_exercises: "Aanbevolen dagelijkse oefeningen",
    dash_short_focused: "Kort & gericht",
    dash_recommended:   "Aanbevolen voor jou",
    dash_based_on_role: "Gebaseerd op jouw rol en branche",
    dash_browse_all:    "Alle tests bekijken",
    dash_popular_for:   "Populair voor",
    dash_see_all:       "Alles zien",
    dash_skill_overview:"Vaardigheidsoverzicht",
    dash_recent_results:"Recente resultaten",
    dash_view_all:      "Alles zien",
    dash_no_results:    "Nog geen resultaten. Start een test om je voortgang te zien.",
    dash_browse_tests:  "Tests bekijken",
    dash_complete_tests:"Maak tests af om je vaardigheidsverdeling te zien.",
    dash_free_plan:     "Gratis plan",
    dash_pro_plan:      "Pro plan",
    dash_this_week:     "deze week",
    dash_improvement:   "verbetering",

    // Tests page
    tests_title:        "Oefentests",
    tests_subtitle:     "Kies een test om te beginnen",
    tests_search:       "Zoek tests…",
    tests_filter_type:  "Alle typen",
    tests_filter_diff:  "Alle niveaus",
    tests_filter_access:"Alle tests",
    tests_free_only:    "Alleen gratis",
    tests_no_results:   "Geen tests gevonden voor jouw filters.",
    tests_generate:     "Volledige testbibliotheek genereren",
    tests_generating:   "Genereren…",
    tests_start:        "Test starten",
    tests_free:         "Gratis",
    tests_questions:    "vragen",
    tests_min:          "min",

    // Results page
    results_back:       "Terug naar tests",
    results_ai_feedback:"Gedetailleerde feedback",
    results_q_review:   "Vraagbeoordeling",
    results_recommended:"Aanbevolen volgende",
    results_history:    "Jouw geschiedenis",
    results_keep_going: "Houd het momentum vast",
    results_practice_daily: "Oefen dagelijks voor consistente scoreverbeteringen.",
    results_continue:   "Doorgaan met oefenen",
    results_explanation:"Uitleg",
    results_no_recommendations: "Nog geen aanbevelingen — maak meer tests af.",
    results_no_results: "Nog geen resultaten",
    results_complete_test: "Maak een test af om je resultaten hier te zien.",
    results_browse:     "Tests bekijken",

    // Common
    free:               "Gratis",
    pro:                "Pro",
    easy:               "Makkelijk",
    medium:             "Gemiddeld",
    hard:               "Moeilijk",
    cancel:             "Annuleren",
    save:               "Opslaan",
    loading:            "Laden…",
    error:              "Er is iets misgegaan",
    upgrade_cta:        "Upgraden naar Pro",
    start_free:         "Gratis starten",
    see_all_tests:      "Alle tests bekijken",
    minutes:            "min",
    questions:          "vragen",
    assessment:         "Assessment",
  },
} satisfies Record<Locale, Record<string, string>>;

export type TranslationKey = keyof typeof translations.en;

// ─── Context ──────────────────────────────────────────────────────────────────

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "en",
  setLocale: () => {},
  t: (key) => key,
});

const STORAGE_KEY = "assesspro_locale";

const localeListeners = new Set<() => void>();

function subscribeLocale(callback: () => void) {
  localeListeners.add(callback);
  return () => localeListeners.delete(callback);
}

function readStoredLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "en" || stored === "nl" ? stored : "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore<Locale>(subscribeLocale, readStoredLocale, () => "en");

  function setLocale(l: Locale) {
    localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.lang = l;
    localeListeners.forEach((fn) => fn());
  }

  function t(key: TranslationKey, vars?: Record<string, string | number>): string {
    let str = translations[locale][key] ?? translations.en[key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replace(`{${k}}`, String(v));
      }
    }
    return str;
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useT() {
  return useContext(I18nContext);
}
