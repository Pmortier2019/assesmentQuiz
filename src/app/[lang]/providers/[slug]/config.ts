import type { Locale } from "@/lib/locales";

export interface ProviderPageConfig {
  /** Brand name, e.g. "SHL". */
  name: string;
  title: string;
  headline: string;
  description: string;
  metaDescription: string;
  keywords: string[];
  /** Pill label shown in the hero / OG card. */
  category: string;
  bullets: string[];
  faqs: { q: string; a: string }[];
  /** Practice-page slugs this provider's assessments map to (internal links). */
  relatedSlugs: string[];
}

/** Each provider page carries its content per locale. Slugs stay locale-stable. */
export type LocalizedProviderPage = Record<Locale, ProviderPageConfig>;

export const PROVIDER_PAGES: Record<string, LocalizedProviderPage> = {
  shl: {
    en: {
      name: "SHL",
      title: "SHL Practice Tests",
      headline: "SHL Assessment Practice",
      description:
        "Prepare for SHL assessments with realistic practice tests. SHL is the world's most widely used test provider — covering numerical, verbal and inductive reasoning plus the Verify range and OPQ personality questionnaire.",
      metaDescription:
        "Free SHL practice tests. Realistic numerical, verbal and inductive reasoning questions in the SHL Verify style, used by employers worldwide. Start practising free.",
      keywords: ["SHL practice test", "SHL Verify test", "SHL numerical test", "SHL verbal reasoning", "SHL assessment practice", "SHL test free"],
      category: "Test Provider",
      bullets: [
        "Verify-style numerical reasoning",
        "Verify-style verbal reasoning",
        "Inductive & deductive reasoning",
        "Situational judgement scenarios",
        "Timed practice matching real conditions",
      ],
      faqs: [
        { q: "What is an SHL test?", a: "SHL is the largest provider of psychometric assessments worldwide. Its Verify range of cognitive ability tests — numerical, verbal and inductive reasoning — is used by thousands of employers during graduate and professional hiring." },
        { q: "Which employers use SHL?", a: "Banks, consulting firms, technology companies and large graduate employers across Europe use SHL tests as part of their selection process. If you've been invited to an online assessment, there's a strong chance it is powered by SHL." },
        { q: "How do I prepare for an SHL test?", a: "Practise under timed conditions with questions that mirror the SHL Verify format. Focus on reading data and passages quickly and accurately. Ready to Ace offers unlimited SHL-style practice for €4/month." },
      ],
      relatedSlugs: ["numerical-reasoning", "verbal-reasoning", "logical-reasoning", "situational-judgement"],
    },
    nl: {
      name: "SHL",
      title: "SHL Test Oefenen",
      headline: "SHL Assessment Oefenen",
      description:
        "Bereid je voor op SHL-assessments met realistische oefentests. SHL is wereldwijd de meest gebruikte testaanbieder — met numerieke, verbale en inductieve redeneertests plus de Verify-reeks en de OPQ-persoonlijkheidsvragenlijst.",
      metaDescription:
        "Gratis SHL-test oefenen. Realistische numerieke, verbale en inductieve redeneervragen in SHL Verify-stijl, gebruikt door werkgevers wereldwijd. Gratis starten.",
      keywords: ["SHL test oefenen", "SHL Verify test", "SHL numerieke test", "SHL verbaal redeneren", "SHL assessment oefenen", "SHL test gratis"],
      category: "Testaanbieder",
      bullets: [
        "Numeriek redeneren in Verify-stijl",
        "Verbaal redeneren in Verify-stijl",
        "Inductief & deductief redeneren",
        "Situational judgement-scenario's",
        "Oefenen op tijd, net als de echte test",
      ],
      faqs: [
        { q: "Wat is een SHL-test?", a: "SHL is wereldwijd de grootste aanbieder van psychometrische assessments. De Verify-reeks met capaciteitentests — numeriek, verbaal en inductief redeneren — wordt door duizenden werkgevers gebruikt bij sollicitaties en traineeships." },
        { q: "Welke werkgevers gebruiken SHL?", a: "Banken, consultancybureaus, techbedrijven en grote traineeship-werkgevers in heel Europa gebruiken SHL-tests in hun selectieproces. Ben je uitgenodigd voor een online assessment, dan is de kans groot dat het door SHL wordt verzorgd." },
        { q: "Hoe bereid ik me voor op een SHL-test?", a: "Oefen op tijd met vragen die het SHL Verify-formaat nabootsen. Focus op snel en nauwkeurig gegevens en teksten lezen. Ready to Ace biedt onbeperkt oefenen in SHL-stijl voor €4/maand." },
      ],
      relatedSlugs: ["numerical-reasoning", "verbal-reasoning", "logical-reasoning", "situational-judgement"],
    },
  },
  "korn-ferry": {
    en: {
      name: "Korn Ferry",
      title: "Korn Ferry Practice Tests",
      headline: "Korn Ferry Assessment Practice",
      description:
        "Prepare for Korn Ferry assessments, including the Talent Q Elements numerical, verbal and logical reasoning tests and leadership questionnaires used in professional and executive hiring.",
      metaDescription:
        "Free Korn Ferry practice tests. Talent Q Elements-style numerical, verbal and logical reasoning plus leadership assessment practice. Start free.",
      keywords: ["Korn Ferry assessment", "Korn Ferry practice test", "Talent Q Elements", "Korn Ferry numerical test", "Korn Ferry leadership assessment"],
      category: "Test Provider",
      bullets: [
        "Talent Q Elements numerical reasoning",
        "Talent Q Elements verbal reasoning",
        "Logical & abstract reasoning",
        "Leadership and work-style questionnaires",
        "Adaptive, timed practice",
      ],
      faqs: [
        { q: "What is a Korn Ferry assessment?", a: "Korn Ferry is a global talent firm whose assessments — including the Talent Q Elements range — measure numerical, verbal and logical reasoning as well as leadership potential. They are common in graduate, professional and executive selection." },
        { q: "What is Talent Q Elements?", a: "Talent Q Elements is Korn Ferry's suite of adaptive aptitude tests. Questions adjust in difficulty based on your answers, so accuracy and pacing both matter." },
        { q: "How do I prepare for a Korn Ferry test?", a: "Practise numerical, verbal and logical reasoning under timed, adaptive-style conditions, and review leadership scenario questions. Ready to Ace provides unlimited practice for €4/month." },
      ],
      relatedSlugs: ["numerical-reasoning", "verbal-reasoning", "logical-reasoning", "leadership-assessment"],
    },
    nl: {
      name: "Korn Ferry",
      title: "Korn Ferry Test Oefenen",
      headline: "Korn Ferry Assessment Oefenen",
      description:
        "Bereid je voor op Korn Ferry-assessments, waaronder de Talent Q Elements numerieke, verbale en logische redeneertests en leiderschapsvragenlijsten die worden gebruikt bij professionele en executive-selectie.",
      metaDescription:
        "Gratis Korn Ferry-test oefenen. Numeriek, verbaal en logisch redeneren in Talent Q Elements-stijl plus leiderschapsassessment oefenen. Gratis starten.",
      keywords: ["Korn Ferry assessment", "Korn Ferry test oefenen", "Talent Q Elements", "Korn Ferry numerieke test", "Korn Ferry leiderschapsassessment"],
      category: "Testaanbieder",
      bullets: [
        "Talent Q Elements numeriek redeneren",
        "Talent Q Elements verbaal redeneren",
        "Logisch & abstract redeneren",
        "Leiderschaps- en werkstijlvragenlijsten",
        "Adaptief, op tijd oefenen",
      ],
      faqs: [
        { q: "Wat is een Korn Ferry-assessment?", a: "Korn Ferry is een wereldwijd talentbureau waarvan de assessments — waaronder de Talent Q Elements-reeks — numeriek, verbaal en logisch redeneren en leiderschapspotentieel meten. Ze worden veel gebruikt bij traineeship-, professionele en executive-selectie." },
        { q: "Wat is Talent Q Elements?", a: "Talent Q Elements is de reeks adaptieve capaciteitentests van Korn Ferry. De moeilijkheid van vragen past zich aan op basis van je antwoorden, dus zowel nauwkeurigheid als tempo tellen mee." },
        { q: "Hoe bereid ik me voor op een Korn Ferry-test?", a: "Oefen numeriek, verbaal en logisch redeneren onder adaptieve tijdsdruk en bekijk leiderschapsscenario's. Ready to Ace biedt onbeperkt oefenen voor €4/maand." },
      ],
      relatedSlugs: ["numerical-reasoning", "verbal-reasoning", "logical-reasoning", "leadership-assessment"],
    },
  },
  "cut-e": {
    en: {
      name: "cut-e (Aon)",
      title: "cut-e Practice Tests",
      headline: "cut-e (Aon) Assessment Practice",
      description:
        "Prepare for cut-e assessments by Aon. cut-e is known for short, adaptive 'scales' tests covering numerical, verbal and logical reasoning as well as situational judgement — where speed and accuracy are key.",
      metaDescription:
        "Free cut-e (Aon) practice tests. Numerical, verbal and logical reasoning in the adaptive cut-e scales style, plus situational judgement. Start free.",
      keywords: ["cut-e test", "cut-e practice test", "Aon assessment", "cut-e scales", "cut-e numerical test", "cut-e test oefenen"],
      category: "Test Provider",
      bullets: [
        "scales numerical (numerical reasoning)",
        "scales verbal (verbal reasoning)",
        "scales logical (inductive reasoning)",
        "Situational judgement scenarios",
        "Short, time-pressured adaptive practice",
      ],
      faqs: [
        { q: "What is a cut-e test?", a: "cut-e (now part of Aon) is a major European assessment provider. Its 'scales' tests are short and adaptive, measuring numerical, verbal and logical reasoning under tight time limits — speed and accuracy matter equally." },
        { q: "Which employers use cut-e?", a: "Many European employers in aviation, finance, retail and graduate recruitment use cut-e/Aon assessments as an early screening step." },
        { q: "How do I prepare for a cut-e test?", a: "Because cut-e tests are short and time-pressured, practise working quickly without sacrificing accuracy. Ready to Ace offers unlimited reasoning practice for €4/month." },
      ],
      relatedSlugs: ["numerical-reasoning", "verbal-reasoning", "logical-reasoning", "situational-judgement", "data-interpretation"],
    },
    nl: {
      name: "cut-e (Aon)",
      title: "cut-e Test Oefenen",
      headline: "cut-e (Aon) Assessment Oefenen",
      description:
        "Bereid je voor op cut-e-assessments van Aon. cut-e staat bekend om korte, adaptieve 'scales'-tests voor numeriek, verbaal en logisch redeneren plus situational judgement — waarbij snelheid en nauwkeurigheid cruciaal zijn.",
      metaDescription:
        "Gratis cut-e (Aon)-test oefenen. Numeriek, verbaal en logisch redeneren in de adaptieve cut-e scales-stijl, plus situational judgement. Gratis starten.",
      keywords: ["cut-e test", "cut-e test oefenen", "Aon assessment", "cut-e scales", "cut-e numerieke test", "cut-e oefenen gratis"],
      category: "Testaanbieder",
      bullets: [
        "scales numerical (numeriek redeneren)",
        "scales verbal (verbaal redeneren)",
        "scales logical (inductief redeneren)",
        "Situational judgement-scenario's",
        "Korte, adaptieve oefening onder tijdsdruk",
      ],
      faqs: [
        { q: "Wat is een cut-e-test?", a: "cut-e (nu onderdeel van Aon) is een grote Europese testaanbieder. De 'scales'-tests zijn kort en adaptief en meten numeriek, verbaal en logisch redeneren onder strakke tijdslimieten — snelheid en nauwkeurigheid wegen even zwaar." },
        { q: "Welke werkgevers gebruiken cut-e?", a: "Veel Europese werkgevers in luchtvaart, finance, retail en traineeship-werving gebruiken cut-e/Aon-assessments als vroege screeningstap." },
        { q: "Hoe bereid ik me voor op een cut-e-test?", a: "Omdat cut-e-tests kort zijn en onder tijdsdruk staan, oefen je vooral snel werken zonder in te leveren op nauwkeurigheid. Ready to Ace biedt onbeperkt oefenen voor €4/maand." },
      ],
      relatedSlugs: ["numerical-reasoning", "verbal-reasoning", "logical-reasoning", "situational-judgement", "data-interpretation"],
    },
  },
};
