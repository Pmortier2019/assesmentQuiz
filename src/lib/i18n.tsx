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
    dash_recommended_for: "Recommended for {role}",
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
    dash_loading:       "Loading dashboard…",
    dash_this_week_count: "this week",
    dash_ex_logic:      "5-minute logic drill",
    dash_ex_numerical:  "Quick numerical warm-up",
    dash_ex_verbal:     "Verbal inference practice",
    dash_ready_level_up:"Ready to level up?",
    dash_level_up_sub:  "You're consistently above 80% — try intermediate next",
    dash_badge_leveled_up: "Leveled up",
    dash_badge_best_match: "Best match",
    dash_badge_popular: "Popular",
    dash_badge_new:     "New",
    dash_frequently_used_at: "Frequently used at {company}",
    dash_candidates_practise: "Candidates applying here practise these",
    dash_pro_tests:     "Pro Tests",
    dash_personal_coaching: "Personal coaching",
    dash_coming_soon:   "Coming soon",
    dash_coach_desc:    "Soon your coach will detect weak skills, generate company-specific test series, adapt difficulty in real time, and build a daily practice schedule — all from your performance data.",
    dash_get_early_access: "Get early access",

    // Tests page
    tests_title:        "Practice Tests",
    tests_library_title:"Test Library",
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
    tests_n_free:       "{n} free",
    tests_n_pro:        "{n} Pro",
    tests_n_new:        "{n} new",
    tests_n_recommended:"{n} recommended for you",
    tests_n_total:      "{n} tests",
    tests_load_more:    "Load more",
    tests_loading_more: "Loading…",
    error_title:        "Something went wrong",
    error_desc:         "We couldn't load this. Please check your connection and try again.",
    error_retry:        "Try again",
    tests_generate_as:  "Generate as:",
    tests_generate_full:"Generate full library",
    tests_gen_failed_all: "Generation failed — try again in a moment.",
    tests_gen_failed_some_one: "{n} combination failed — the rest were generated.",
    tests_gen_failed_some_other: "{n} combinations failed — the rest were generated.",
    tests_paywall_all_title: "You've used all {limit} free tests",
    tests_paywall_all_desc: "Upgrade to Pro for unlimited access to all tests — €4/month.",
    tests_paywall_near_desc: "Upgrade to Pro for unlimited access and fresh weekly tests.",
    tests_free_remaining_one: "{n} free test remaining",
    tests_free_remaining_other: "{n} free tests remaining",
    tests_none_found:   "No tests found",
    tests_none_found_desc: "Try adjusting your filters or search term. More fresh tests are coming soon.",
    tests_clear_filters:"Clear all filters",
    tests_best_matches: "Best Matches",
    tests_n_for_you:    "{n} for you",
    tests_showing_aligned: "Showing tests aligned with",
    tests_free_heading: "Free Tests",
    tests_free_available: "{n} available — no account needed",
    tests_pro_heading:  "Pro Tests",
    tests_pro_count_one: "{n} test · €4/mo",
    tests_pro_count_other: "{n} tests · €4/mo",
    tests_fresh:        "Fresh",
    tests_pro_unlock:   "Upgrade to Pro to unlock all tests below",
    tests_coming_soon_title: "More fresh tests coming soon",
    tests_coming_soon_desc: "New practice tests are generated weekly, modelled on real assessments from top employers.",

    // Difficulty (display)
    diff_beginner:      "Beginner",
    diff_intermediate:  "Intermediate",
    diff_advanced:      "Advanced",

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

    // Test-taking
    tt_all_results:     "All results",
    tt_passed:          "🎉 Passed!",
    tt_not_passed:      "Not passed yet — keep practising!",
    tt_pass_mark:       "Pass mark: {mark}% · {correct} of {total} correct",
    tt_your_score:      "Your score",
    tt_under_target:    "{time} under target",
    tt_over_target:     "{time} over target",
    tt_correct:         "Correct",
    tt_incorrect:       "Incorrect",
    tt_feedback:        "Feedback",
    tt_tips:            "Tips to improve",
    tt_try_again:       "Try again",
    tt_test_not_available: "Test not available",
    tt_free_limit_title:"Free limit reached",
    tt_pro_test_title:  "Pro test",
    tt_free_limit_desc: "You've used all {limit} free tests. Upgrade to Pro for unlimited access to every test — €4/month.",
    tt_pro_test_desc:   "This test is part of the Pro plan. Upgrade to access all premium assessments.",
    tt_upgrade_price:   "Upgrade to Pro — €4/mo",
    tt_cancel_anytime:  "Cancel anytime · No credit card needed to start",
    tt_loading:         "Loading test…",
    tt_questions:       "Questions",
    tt_answered_of:     "{a} of {t} answered",
    tt_legend_answered: "Answered",
    tt_legend_current:  "Current",
    tt_legend_not_answered: "Not yet answered",
    tt_q_title:         "Q{n} — {state}",
    tt_question_title:  "Question {n} — {state}",
    tt_kbd_hint:        "Tip: use ← → to move between questions and number keys to pick an answer.",
    tt_answer_option:   "Option {label}: {text}",
    tt_questions_left_one: "{n} question left",
    tt_questions_left_other: "{n} questions left",
    tt_previous:        "Previous",
    tt_next:            "Next",
    tt_finish:          "Finish test",
    tt_submitting:      "Submitting…",
    tt_all_answered:    "All questions answered",
    tt_submit:          "Submit test",

    // Settings & account
    nav_settings:       "Settings",
    settings_title:     "Settings",
    settings_subtitle:  "Manage your account and data.",
    settings_data_title:"Your data",
    settings_data_desc: "Download a copy of all the personal data we hold about you (profile and test results) as a JSON file.",
    settings_download:  "Download my data",
    settings_exporting: "Preparing…",
    settings_danger_title: "Delete account",
    settings_danger_desc: "Permanently delete your account and all associated data — profile, test results and subscription. This cannot be undone.",
    settings_delete:    "Delete my account",
    settings_delete_confirm_title: "Delete your account?",
    settings_delete_confirm_desc: "This permanently erases your profile, test results and subscription. There is no way to recover it.",
    settings_delete_confirm_label: "Type {word} to confirm",
    settings_delete_confirm_word: "DELETE",
    settings_delete_confirm_cta: "Permanently delete",
    settings_deleting:  "Deleting…",
    settings_action_failed: "Something went wrong. Please try again.",

    // Legal
    legal_home:         "Home",
    legal_terms:        "Terms of Service",
    legal_privacy:      "Privacy Policy",

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
    dash_recommended_for: "Aanbevolen voor {role}",
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
    dash_loading:       "Dashboard laden…",
    dash_this_week_count: "deze week",
    dash_ex_logic:      "Logica-oefening van 5 minuten",
    dash_ex_numerical:  "Snelle numerieke warming-up",
    dash_ex_verbal:     "Verbale redeneeroefening",
    dash_ready_level_up:"Klaar voor het volgende niveau?",
    dash_level_up_sub:  "Je scoort consistent boven 80% — probeer nu gemiddeld",
    dash_badge_leveled_up: "Niveau omhoog",
    dash_badge_best_match: "Beste match",
    dash_badge_popular: "Populair",
    dash_badge_new:     "Nieuw",
    dash_frequently_used_at: "Vaak gebruikt bij {company}",
    dash_candidates_practise: "Kandidaten die hier solliciteren oefenen deze",
    dash_pro_tests:     "Pro-tests",
    dash_personal_coaching: "Persoonlijke coaching",
    dash_coming_soon:   "Binnenkort",
    dash_coach_desc:    "Binnenkort spoort je coach zwakke vaardigheden op, genereert bedrijfsspecifieke testreeksen, past de moeilijkheidsgraad in realtime aan en bouwt een dagelijks oefenschema — allemaal op basis van jouw prestaties.",
    dash_get_early_access: "Vroege toegang krijgen",

    // Tests page
    tests_title:        "Oefentests",
    tests_library_title:"Testbibliotheek",
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
    tests_n_free:       "{n} gratis",
    tests_n_pro:        "{n} Pro",
    tests_n_new:        "{n} nieuw",
    tests_n_recommended:"{n} aanbevolen voor jou",
    tests_n_total:      "{n} tests",
    tests_load_more:    "Meer laden",
    tests_loading_more: "Laden…",
    error_title:        "Er ging iets mis",
    error_desc:         "We konden dit niet laden. Controleer je verbinding en probeer het opnieuw.",
    error_retry:        "Opnieuw proberen",
    tests_generate_as:  "Genereren als:",
    tests_generate_full:"Volledige bibliotheek genereren",
    tests_gen_failed_all: "Genereren mislukt — probeer het zo nog eens.",
    tests_gen_failed_some_one: "{n} combinatie mislukt — de rest is gegenereerd.",
    tests_gen_failed_some_other: "{n} combinaties mislukt — de rest is gegenereerd.",
    tests_paywall_all_title: "Je hebt alle {limit} gratis tests gebruikt",
    tests_paywall_all_desc: "Upgrade naar Pro voor onbeperkte toegang tot alle tests — €4/maand.",
    tests_paywall_near_desc: "Upgrade naar Pro voor onbeperkte toegang en wekelijks nieuwe tests.",
    tests_free_remaining_one: "Nog {n} gratis test over",
    tests_free_remaining_other: "Nog {n} gratis tests over",
    tests_none_found:   "Geen tests gevonden",
    tests_none_found_desc: "Pas je filters of zoekterm aan. Er komen binnenkort meer nieuwe tests.",
    tests_clear_filters:"Alle filters wissen",
    tests_best_matches: "Beste matches",
    tests_n_for_you:    "{n} voor jou",
    tests_showing_aligned: "Tests die passen bij",
    tests_free_heading: "Gratis tests",
    tests_free_available: "{n} beschikbaar — geen account nodig",
    tests_pro_heading:  "Pro-tests",
    tests_pro_count_one: "{n} test · €4/mnd",
    tests_pro_count_other: "{n} tests · €4/mnd",
    tests_fresh:        "Nieuw",
    tests_pro_unlock:   "Upgrade naar Pro om alle onderstaande tests te ontgrendelen",
    tests_coming_soon_title: "Binnenkort meer nieuwe tests",
    tests_coming_soon_desc: "Er worden wekelijks nieuwe oefentests gegenereerd, gemodelleerd op echte assessments van topwerkgevers.",

    // Difficulty (display)
    diff_beginner:      "Beginner",
    diff_intermediate:  "Gemiddeld",
    diff_advanced:      "Gevorderd",

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

    // Test-taking
    tt_all_results:     "Alle resultaten",
    tt_passed:          "🎉 Geslaagd!",
    tt_not_passed:      "Nog niet geslaagd — blijf oefenen!",
    tt_pass_mark:       "Slaaggrens: {mark}% · {correct} van {total} goed",
    tt_your_score:      "Jouw score",
    tt_under_target:    "{time} onder streeftijd",
    tt_over_target:     "{time} boven streeftijd",
    tt_correct:         "Goed",
    tt_incorrect:       "Fout",
    tt_feedback:        "Feedback",
    tt_tips:            "Tips om te verbeteren",
    tt_try_again:       "Opnieuw proberen",
    tt_test_not_available: "Test niet beschikbaar",
    tt_free_limit_title:"Gratis limiet bereikt",
    tt_pro_test_title:  "Pro-test",
    tt_free_limit_desc: "Je hebt alle {limit} gratis tests gebruikt. Upgrade naar Pro voor onbeperkte toegang tot elke test — €4/maand.",
    tt_pro_test_desc:   "Deze test hoort bij het Pro-abonnement. Upgrade om alle premium-assessments te openen.",
    tt_upgrade_price:   "Upgrade naar Pro — €4/mnd",
    tt_cancel_anytime:  "Altijd opzegbaar · Geen creditcard nodig om te starten",
    tt_loading:         "Test laden…",
    tt_questions:       "Vragen",
    tt_answered_of:     "{a} van {t} beantwoord",
    tt_legend_answered: "Beantwoord",
    tt_legend_current:  "Huidige",
    tt_legend_not_answered: "Nog niet beantwoord",
    tt_q_title:         "V{n} — {state}",
    tt_question_title:  "Vraag {n} — {state}",
    tt_kbd_hint:        "Tip: gebruik ← → om tussen vragen te wisselen en cijfertoetsen om een antwoord te kiezen.",
    tt_answer_option:   "Optie {label}: {text}",
    tt_questions_left_one: "Nog {n} vraag",
    tt_questions_left_other: "Nog {n} vragen",
    tt_previous:        "Vorige",
    tt_next:            "Volgende",
    tt_finish:          "Test afronden",
    tt_submitting:      "Inleveren…",
    tt_all_answered:    "Alle vragen beantwoord",
    tt_submit:          "Test inleveren",

    // Settings & account
    nav_settings:       "Instellingen",
    settings_title:     "Instellingen",
    settings_subtitle:  "Beheer je account en gegevens.",
    settings_data_title:"Jouw gegevens",
    settings_data_desc: "Download een kopie van alle persoonsgegevens die we van je bewaren (profiel en testresultaten) als JSON-bestand.",
    settings_download:  "Mijn gegevens downloaden",
    settings_exporting: "Voorbereiden…",
    settings_danger_title: "Account verwijderen",
    settings_danger_desc: "Verwijder je account en alle bijbehorende gegevens definitief — profiel, testresultaten en abonnement. Dit kan niet ongedaan worden gemaakt.",
    settings_delete:    "Mijn account verwijderen",
    settings_delete_confirm_title: "Account verwijderen?",
    settings_delete_confirm_desc: "Dit wist je profiel, testresultaten en abonnement definitief. Herstellen is niet mogelijk.",
    settings_delete_confirm_label: "Typ {word} om te bevestigen",
    settings_delete_confirm_word: "VERWIJDER",
    settings_delete_confirm_cta: "Definitief verwijderen",
    settings_deleting:  "Verwijderen…",
    settings_action_failed: "Er is iets misgegaan. Probeer het opnieuw.",

    // Legal
    legal_home:         "Home",
    legal_terms:        "Algemene voorwaarden",
    legal_privacy:      "Privacybeleid",

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

/** A pair of keys for singular/plural selection via Intl.PluralRules. */
export interface PluralKey {
  one: TranslationKey;
  other: TranslationKey;
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  /** Picks the right plural form for `count` (locale-aware) and interpolates it as {n}. */
  plural: (count: number, keys: PluralKey, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "en",
  setLocale: () => {},
  t: (key) => key,
  plural: (_count, keys) => keys.other,
});

const STORAGE_KEY = "assesspro_locale";

const localeListeners = new Set<() => void>();

const pluralRules: Record<Locale, Intl.PluralRules> = {
  en: new Intl.PluralRules("en"),
  nl: new Intl.PluralRules("nl"),
};

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
    let str: string = translations[locale][key] ?? translations.en[key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replace(`{${k}}`, String(v));
      }
    }
    return str;
  }

  function plural(count: number, keys: PluralKey, vars?: Record<string, string | number>): string {
    const category = pluralRules[locale].select(count); // "one" | "other" for en/nl
    const key = category === "one" ? keys.one : keys.other;
    return t(key, { n: count, ...vars });
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, plural }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useT() {
  return useContext(I18nContext);
}
