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
        "Prepare for SHL assessments with realistic practice tests. SHL is the world's most widely used test provider, covering numerical, verbal and inductive reasoning plus the Verify range and OPQ personality questionnaire.",
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
        { q: "What is an SHL test?", a: "SHL is the largest provider of psychometric assessments worldwide. Its Verify range of cognitive ability tests (numerical, verbal and inductive reasoning) is used by thousands of employers during graduate and professional hiring." },
        { q: "Which employers use SHL?", a: "Banks, consulting firms, technology companies and large graduate employers across Europe use SHL tests as part of their selection process. If you've been invited to an online assessment, there's a strong chance it is powered by SHL." },
        { q: "How do I prepare for an SHL test?", a: "Practise under timed conditions with questions that mirror the SHL Verify format. Focus on reading data and passages quickly and accurately. Ready to Ace offers unlimited SHL-style practice for $4/month." },
      ],
      relatedSlugs: ["numerical-reasoning", "verbal-reasoning", "logical-reasoning", "situational-judgement"],
    },
    nl: {
      name: "SHL",
      title: "SHL Test Oefenen",
      headline: "SHL Assessment Oefenen",
      description:
        "Bereid je voor op SHL-assessments met realistische oefentests. SHL is wereldwijd de meest gebruikte testaanbieder, met numerieke, verbale en inductieve redeneertests plus de Verify-reeks en de OPQ-persoonlijkheidsvragenlijst.",
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
        { q: "Wat is een SHL-test?", a: "SHL is wereldwijd de grootste aanbieder van psychometrische assessments. De Verify-reeks met capaciteitentests (numeriek, verbaal en inductief redeneren) wordt door duizenden werkgevers gebruikt bij sollicitaties en traineeships." },
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
        { q: "What is a Korn Ferry assessment?", a: "Korn Ferry is a global talent firm whose assessments (including the Talent Q Elements range) measure numerical, verbal and logical reasoning as well as leadership potential. They are common in graduate, professional and executive selection." },
        { q: "What is Talent Q Elements?", a: "Talent Q Elements is Korn Ferry's suite of adaptive aptitude tests. Questions adjust in difficulty based on your answers, so accuracy and pacing both matter." },
        { q: "How do I prepare for a Korn Ferry test?", a: "Practise numerical, verbal and logical reasoning under timed, adaptive-style conditions, and review leadership scenario questions. Ready to Ace provides unlimited practice for $4/month." },
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
        { q: "Wat is een Korn Ferry-assessment?", a: "Korn Ferry is een wereldwijd talentbureau waarvan de assessments (waaronder de Talent Q Elements-reeks) numeriek, verbaal en logisch redeneren en leiderschapspotentieel meten. Ze worden veel gebruikt bij traineeship-, professionele en executive-selectie." },
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
        "Prepare for cut-e assessments by Aon. cut-e is known for short, adaptive 'scales' tests covering numerical, verbal and logical reasoning as well as situational judgement, where speed and accuracy are key.",
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
        { q: "What is a cut-e test?", a: "cut-e (now part of Aon) is a major European assessment provider. Its 'scales' tests are short and adaptive, measuring numerical, verbal and logical reasoning under tight time limits. Speed and accuracy matter equally." },
        { q: "Which employers use cut-e?", a: "Many European employers in aviation, finance, retail and graduate recruitment use cut-e/Aon assessments as an early screening step." },
        { q: "How do I prepare for a cut-e test?", a: "Because cut-e tests are short and time-pressured, practise working quickly without sacrificing accuracy. Ready to Ace offers unlimited reasoning practice for $4/month." },
      ],
      relatedSlugs: ["numerical-reasoning", "verbal-reasoning", "logical-reasoning", "situational-judgement", "data-interpretation"],
    },
    nl: {
      name: "cut-e (Aon)",
      title: "cut-e Test Oefenen",
      headline: "cut-e (Aon) Assessment Oefenen",
      description:
        "Bereid je voor op cut-e-assessments van Aon. cut-e staat bekend om korte, adaptieve 'scales'-tests voor numeriek, verbaal en logisch redeneren plus situational judgement, waarbij snelheid en nauwkeurigheid cruciaal zijn.",
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
        { q: "Wat is een cut-e-test?", a: "cut-e (nu onderdeel van Aon) is een grote Europese testaanbieder. De 'scales'-tests zijn kort en adaptief en meten numeriek, verbaal en logisch redeneren onder strakke tijdslimieten. Snelheid en nauwkeurigheid wegen even zwaar." },
        { q: "Welke werkgevers gebruiken cut-e?", a: "Veel Europese werkgevers in luchtvaart, finance, retail en traineeship-werving gebruiken cut-e/Aon-assessments als vroege screeningstap." },
        { q: "Hoe bereid ik me voor op een cut-e-test?", a: "Omdat cut-e-tests kort zijn en onder tijdsdruk staan, oefen je vooral snel werken zonder in te leveren op nauwkeurigheid. Ready to Ace biedt onbeperkt oefenen voor €4/maand." },
      ],
      relatedSlugs: ["numerical-reasoning", "verbal-reasoning", "logical-reasoning", "situational-judgement", "data-interpretation"],
    },
  },
  ccat: {
    en: {
      name: "CCAT",
      title: "CCAT Practice Test",
      headline: "CCAT (Criteria) Practice",
      description:
        "Prepare for the Criteria Cognitive Aptitude Test (CCAT): 50 questions in 15 minutes covering math and logic, verbal, and spatial reasoning. It's fast and demanding, so practicing your pacing is everything.",
      metaDescription:
        "Free CCAT practice test. Realistic Criteria Cognitive Aptitude Test questions: math, verbal and spatial reasoning under real time pressure. Start practicing free.",
      keywords: ["CCAT practice test", "Criteria Cognitive Aptitude Test", "CCAT prep", "CCAT questions", "Criteria assessment practice", "CCAT free"],
      category: "Test Provider",
      bullets: [
        "Math and logic word problems",
        "Verbal reasoning and analogies",
        "Spatial reasoning and patterns",
        "50 questions in 15 minutes, built for pacing",
        "Timed practice matching real conditions",
      ],
      faqs: [
        { q: "What is the CCAT?", a: "The Criteria Cognitive Aptitude Test (CCAT) measures problem-solving, learning ability and critical thinking. It has 50 questions across math/logic, verbal and spatial reasoning, with a strict 15-minute limit. Most candidates don't finish, so accuracy and speed both matter." },
        { q: "Which employers use the CCAT?", a: "The CCAT is widely used by U.S. technology, sales and finance employers for early screening, often through Criteria Corp. If you're applying to a fast-growing company, there's a good chance you'll see it." },
        { q: "What is a good CCAT score?", a: "Scores are reported out of 50 and compared to role-specific benchmarks. Practicing under timed conditions is the most reliable way to raise your score. Ready to Ace offers unlimited reasoning practice for $4/month." },
      ],
      relatedSlugs: ["numerical-reasoning", "verbal-reasoning", "logical-reasoning", "critical-reasoning"],
    },
    nl: {
      name: "CCAT",
      title: "CCAT Test Oefenen",
      headline: "CCAT (Criteria) Oefenen",
      description:
        "Bereid je voor op de Criteria Cognitive Aptitude Test (CCAT): 50 vragen in 15 minuten over reken- en logicavragen, verbaal en ruimtelijk redeneren. De test is snel en pittig, dus je tempo oefenen is cruciaal.",
      metaDescription:
        "Gratis CCAT-test oefenen. Realistische Criteria Cognitive Aptitude Test-vragen: reken-, verbaal en ruimtelijk redeneren onder echte tijdsdruk. Gratis starten.",
      keywords: ["CCAT test oefenen", "Criteria Cognitive Aptitude Test", "CCAT voorbereiden", "CCAT vragen", "Criteria assessment oefenen", "CCAT gratis"],
      category: "Testaanbieder",
      bullets: [
        "Reken- en logica-woordvraagstukken",
        "Verbaal redeneren en analogieën",
        "Ruimtelijk redeneren en patronen",
        "50 vragen in 15 minuten, draait om tempo",
        "Oefenen op tijd, net als de echte test",
      ],
      faqs: [
        { q: "Wat is de CCAT?", a: "De Criteria Cognitive Aptitude Test (CCAT) meet probleemoplossend vermogen, leersnelheid en kritisch denken. De test heeft 50 vragen over reken/logica, verbaal en ruimtelijk redeneren, met een strakke limiet van 15 minuten. De meeste kandidaten halen het einde niet, dus nauwkeurigheid én snelheid tellen." },
        { q: "Welke werkgevers gebruiken de CCAT?", a: "De CCAT wordt veel gebruikt door Amerikaanse tech-, sales- en finance-werkgevers voor vroege screening, vaak via Criteria Corp. Solliciteer je bij een snelgroeiend bedrijf, dan is de kans groot dat je 'm tegenkomt." },
        { q: "Wat is een goede CCAT-score?", a: "Scores worden gerapporteerd op een schaal van 50 en vergeleken met rol-specifieke benchmarks. Oefenen onder tijdsdruk is de betrouwbaarste manier om je score te verhogen. Ready to Ace biedt onbeperkt oefenen voor €4/maand." },
      ],
      relatedSlugs: ["numerical-reasoning", "verbal-reasoning", "logical-reasoning", "critical-reasoning"],
    },
  },
  wonderlic: {
    en: {
      name: "Wonderlic",
      title: "Wonderlic Practice Test",
      headline: "Wonderlic Test Practice",
      description:
        "Prepare for the Wonderlic test (WonScore / WPT): a 50-question, 12-minute cognitive ability assessment covering numerical, verbal and logical reasoning, used in U.S. hiring for decades.",
      metaDescription:
        "Free Wonderlic practice test. Realistic 50-question cognitive ability questions: numerical, verbal and logical reasoning under time pressure. Start practicing free.",
      keywords: ["Wonderlic practice test", "Wonderlic test prep", "WonScore", "Wonderlic Personnel Test", "Wonderlic sample questions", "Wonderlic free"],
      category: "Test Provider",
      bullets: [
        "Numerical word problems",
        "Verbal reasoning and vocabulary",
        "Logical reasoning and sequences",
        "50 questions in 12 minutes, speed is key",
        "Timed practice matching real conditions",
      ],
      faqs: [
        { q: "What is the Wonderlic test?", a: "The Wonderlic is a short cognitive ability test (50 questions in 12 minutes) measuring how quickly you learn, reason and solve problems. It's used across U.S. industries and is well known from its use in sports recruitment." },
        { q: "How is the Wonderlic scored?", a: "Your score is the number of correct answers out of 50. Because the time limit is tight, very few people answer every question. Pacing and accuracy together determine your result." },
        { q: "How do I prepare for the Wonderlic?", a: "Practice numerical, verbal and logical questions at speed, and get comfortable skipping and returning to hard items. Ready to Ace offers unlimited timed practice for $4/month." },
      ],
      relatedSlugs: ["numerical-reasoning", "verbal-reasoning", "logical-reasoning"],
    },
    nl: {
      name: "Wonderlic",
      title: "Wonderlic Test Oefenen",
      headline: "Wonderlic Test Oefenen",
      description:
        "Bereid je voor op de Wonderlic-test (WonScore / WPT): een capaciteitentest van 50 vragen in 12 minuten over numeriek, verbaal en logisch redeneren, al decennia gebruikt bij Amerikaanse werving.",
      metaDescription:
        "Gratis Wonderlic-test oefenen. Realistische capaciteitentest van 50 vragen: numeriek, verbaal en logisch redeneren onder tijdsdruk. Gratis starten.",
      keywords: ["Wonderlic test oefenen", "Wonderlic voorbereiden", "WonScore", "Wonderlic Personnel Test", "Wonderlic voorbeeldvragen", "Wonderlic gratis"],
      category: "Testaanbieder",
      bullets: [
        "Numerieke woordvraagstukken",
        "Verbaal redeneren en woordenschat",
        "Logisch redeneren en reeksen",
        "50 vragen in 12 minuten, snelheid is bepalend",
        "Oefenen op tijd, net als de echte test",
      ],
      faqs: [
        { q: "Wat is de Wonderlic-test?", a: "De Wonderlic is een korte capaciteitentest (50 vragen in 12 minuten) die meet hoe snel je leert, redeneert en problemen oplost. De test wordt in veel Amerikaanse sectoren gebruikt en is bekend van toepassing in de sportwereld." },
        { q: "Hoe wordt de Wonderlic gescoord?", a: "Je score is het aantal goede antwoorden van de 50. Omdat de tijdslimiet krap is, beantwoordt bijna niemand alle vragen. Tempo en nauwkeurigheid samen bepalen je resultaat." },
        { q: "Hoe bereid ik me voor op de Wonderlic?", a: "Oefen numerieke, verbale en logische vragen op snelheid en leer lastige vragen over te slaan en later terug te keren. Ready to Ace biedt onbeperkt oefenen op tijd voor €4/maand." },
      ],
      relatedSlugs: ["numerical-reasoning", "verbal-reasoning", "logical-reasoning"],
    },
  },
  "predictive-index": {
    en: {
      name: "Predictive Index",
      title: "Predictive Index Practice Tests",
      headline: "Predictive Index (PI) Practice",
      description:
        "Prepare for Predictive Index assessments: the PI Cognitive Assessment (50 questions in 12 minutes across numerical, verbal and abstract reasoning) and the PI Behavioral Assessment used by U.S. employers.",
      metaDescription:
        "Free Predictive Index practice. PI Cognitive Assessment-style numerical, verbal and abstract reasoning plus behavioral assessment prep. Start practicing free.",
      keywords: ["Predictive Index practice", "PI Cognitive Assessment", "PI test prep", "Predictive Index Behavioral Assessment", "PI cognitive practice"],
      category: "Test Provider",
      bullets: [
        "Numerical reasoning word problems",
        "Verbal reasoning and analogies",
        "Abstract reasoning and patterns",
        "50 questions in 12 minutes, fast-paced",
        "Behavioral / work-style preparation",
      ],
      faqs: [
        { q: "What is the Predictive Index?", a: "Predictive Index (PI) offers two main assessments: the PI Cognitive Assessment, a 12-minute test of numerical, verbal and abstract reasoning, and the PI Behavioral Assessment, which maps your work style. Both are common in U.S. hiring." },
        { q: "How fast is the PI Cognitive Assessment?", a: "It's 50 questions in 12 minutes (about 14 seconds per question), so quick, accurate reasoning is essential. Practicing under time pressure is the best preparation." },
        { q: "Can you prepare for the PI Behavioral Assessment?", a: "There are no right or wrong answers, but reflecting on your work style and answering consistently helps. For the cognitive side, Ready to Ace offers unlimited timed practice for $4/month." },
      ],
      relatedSlugs: ["numerical-reasoning", "verbal-reasoning", "logical-reasoning", "work-style-assessment"],
    },
    nl: {
      name: "Predictive Index",
      title: "Predictive Index Oefenen",
      headline: "Predictive Index (PI) Oefenen",
      description:
        "Bereid je voor op Predictive Index-assessments: de PI Cognitive Assessment (50 vragen in 12 minuten over numeriek, verbaal en abstract redeneren) en de PI Behavioral Assessment die Amerikaanse werkgevers gebruiken.",
      metaDescription:
        "Gratis Predictive Index oefenen. Numeriek, verbaal en abstract redeneren in PI Cognitive Assessment-stijl plus voorbereiding op de gedragsassessment. Gratis starten.",
      keywords: ["Predictive Index oefenen", "PI Cognitive Assessment", "PI test voorbereiden", "Predictive Index Behavioral Assessment", "PI cognitief oefenen"],
      category: "Testaanbieder",
      bullets: [
        "Numerieke woordvraagstukken",
        "Verbaal redeneren en analogieën",
        "Abstract redeneren en patronen",
        "50 vragen in 12 minuten, hoog tempo",
        "Voorbereiding op gedrag / werkstijl",
      ],
      faqs: [
        { q: "Wat is de Predictive Index?", a: "Predictive Index (PI) biedt twee hoofdassessments: de PI Cognitive Assessment, een test van 12 minuten over numeriek, verbaal en abstract redeneren, en de PI Behavioral Assessment, die je werkstijl in kaart brengt. Beide zijn gangbaar bij Amerikaanse werving." },
        { q: "Hoe snel is de PI Cognitive Assessment?", a: "Het zijn 50 vragen in 12 minuten (zo'n 14 seconden per vraag), dus snel en nauwkeurig redeneren is essentieel. Oefenen onder tijdsdruk is de beste voorbereiding." },
        { q: "Kun je je voorbereiden op de PI Behavioral Assessment?", a: "Er zijn geen goede of foute antwoorden, maar nadenken over je werkstijl en consistent antwoorden helpt. Voor het cognitieve deel biedt Ready to Ace onbeperkt oefenen op tijd voor €4/maand." },
      ],
      relatedSlugs: ["numerical-reasoning", "verbal-reasoning", "logical-reasoning", "work-style-assessment"],
    },
  },
  hirevue: {
    en: {
      name: "HireVue",
      title: "HireVue Practice & Preparation",
      headline: "HireVue Assessment Practice",
      description:
        "Prepare for HireVue: on-demand video interviews, game-based assessments and situational questions used by large U.S. employers. Know the format and practice the reasoning and judgement skills behind it.",
      metaDescription:
        "Free HireVue preparation. Practice the situational judgement and reasoning behind HireVue video interviews and game-based assessments. Start practicing free.",
      keywords: ["HireVue practice", "HireVue interview prep", "HireVue assessment", "HireVue game based assessment", "HireVue questions"],
      category: "Test Provider",
      bullets: [
        "On-demand video interview format",
        "Game-based assessment basics",
        "Situational judgement scenarios",
        "Structured answer techniques (STAR)",
        "Reasoning practice behind the games",
      ],
      faqs: [
        { q: "What is a HireVue assessment?", a: "HireVue is a hiring platform combining on-demand (recorded) video interviews with game-based assessments. Candidates answer questions on camera and complete short games that measure cognitive and behavioral traits. It's widely used by large U.S. employers." },
        { q: "How do I prepare for a HireVue interview?", a: "Practice answering common questions out loud using the STAR method, test your camera and lighting, and rehearse staying concise. For the game-based portion, practicing reasoning and situational judgement helps you stay calm and quick." },
        { q: "Can you practice the HireVue games?", a: "The exact games vary by employer, but they measure the same reasoning and judgement skills you can train. Ready to Ace offers unlimited reasoning and situational judgement practice for $4/month." },
      ],
      relatedSlugs: ["situational-judgement", "work-style-assessment", "verbal-reasoning"],
    },
    nl: {
      name: "HireVue",
      title: "HireVue Oefenen & Voorbereiden",
      headline: "HireVue Assessment Oefenen",
      description:
        "Bereid je voor op HireVue: video-interviews op aanvraag, game-based assessments en situatievragen die grote Amerikaanse werkgevers gebruiken. Leer het format kennen en oefen de redeneer- en oordeelsvaardigheden erachter.",
      metaDescription:
        "Gratis HireVue voorbereiden. Oefen de situational judgement en het redeneren achter HireVue video-interviews en game-based assessments. Gratis starten.",
      keywords: ["HireVue oefenen", "HireVue interview voorbereiden", "HireVue assessment", "HireVue game based assessment", "HireVue vragen"],
      category: "Testaanbieder",
      bullets: [
        "Format van het video-interview op aanvraag",
        "Basis van game-based assessments",
        "Situational judgement-scenario's",
        "Gestructureerd antwoorden (STAR-methode)",
        "Redeneeroefening achter de games",
      ],
      faqs: [
        { q: "Wat is een HireVue-assessment?", a: "HireVue is een wervingsplatform dat opgenomen video-interviews combineert met game-based assessments. Kandidaten beantwoorden vragen voor de camera en doen korte games die cognitieve en gedragskenmerken meten. Het wordt veel gebruikt door grote Amerikaanse werkgevers." },
        { q: "Hoe bereid ik me voor op een HireVue-interview?", a: "Oefen veelgestelde vragen hardop met de STAR-methode, test je camera en belichting, en oefen bondig blijven. Voor het game-gedeelte helpt het oefenen van redeneren en situational judgement je rustig en snel te blijven." },
        { q: "Kun je de HireVue-games oefenen?", a: "De exacte games verschillen per werkgever, maar ze meten dezelfde redeneer- en oordeelsvaardigheden die je kunt trainen. Ready to Ace biedt onbeperkt oefenen in redeneren en situational judgement voor €4/maand." },
      ],
      relatedSlugs: ["situational-judgement", "work-style-assessment", "verbal-reasoning"],
    },
  },
  caliper: {
    en: {
      name: "Caliper",
      title: "Caliper Profile Practice",
      headline: "Caliper Assessment Practice",
      description:
        "Prepare for the Caliper Profile: a personality and cognitive assessment used by U.S. employers to predict job fit, especially in sales and leadership roles. It combines work-style questions with abstract reasoning.",
      metaDescription:
        "Free Caliper Profile preparation. Practice the abstract reasoning and work-style questions behind the Caliper assessment used in U.S. hiring. Start free.",
      keywords: ["Caliper Profile", "Caliper assessment practice", "Caliper test prep", "Caliper personality test", "Caliper questions"],
      category: "Test Provider",
      bullets: [
        "Work-style and personality questions",
        "Abstract and logical reasoning",
        "Job-fit and motivation profiling",
        "Consistent, honest answering strategy",
        "Reasoning practice behind the test",
      ],
      faqs: [
        { q: "What is the Caliper Profile?", a: "The Caliper Profile is a personality and cognitive assessment that predicts how well someone fits a role. It combines work-style and motivation questions with abstract reasoning, and is popular in U.S. sales and leadership hiring." },
        { q: "Can you prepare for the Caliper assessment?", a: "The personality section has no right answers, but understanding the format and answering consistently helps. The reasoning section can be practiced directly. Ready to Ace offers unlimited reasoning practice for $4/month." },
        { q: "How long is the Caliper Profile?", a: "It typically takes around 60–90 minutes and mixes multiple-choice personality items with reasoning questions. Going in familiar with the format keeps you calm and focused." },
      ],
      relatedSlugs: ["work-style-assessment", "leadership-assessment", "logical-reasoning"],
    },
    nl: {
      name: "Caliper",
      title: "Caliper Profile Oefenen",
      headline: "Caliper Assessment Oefenen",
      description:
        "Bereid je voor op het Caliper Profile: een persoonlijkheids- en capaciteitenassessment dat Amerikaanse werkgevers gebruiken om job-fit te voorspellen, vooral in sales- en leiderschapsrollen. Het combineert werkstijlvragen met abstract redeneren.",
      metaDescription:
        "Gratis Caliper Profile voorbereiden. Oefen het abstracte redeneren en de werkstijlvragen achter het Caliper-assessment uit de Amerikaanse werving. Gratis starten.",
      keywords: ["Caliper Profile", "Caliper assessment oefenen", "Caliper test voorbereiden", "Caliper persoonlijkheidstest", "Caliper vragen"],
      category: "Testaanbieder",
      bullets: [
        "Werkstijl- en persoonlijkheidsvragen",
        "Abstract en logisch redeneren",
        "Job-fit en motivatie in kaart",
        "Consistent en eerlijk antwoorden",
        "Redeneeroefening achter de test",
      ],
      faqs: [
        { q: "Wat is het Caliper Profile?", a: "Het Caliper Profile is een persoonlijkheids- en capaciteitenassessment dat voorspelt hoe goed iemand bij een rol past. Het combineert werkstijl- en motivatievragen met abstract redeneren en is populair bij Amerikaanse sales- en leiderschapswerving." },
        { q: "Kun je je voorbereiden op het Caliper-assessment?", a: "Het persoonlijkheidsdeel heeft geen goede antwoorden, maar het format kennen en consistent antwoorden helpt. Het redeneerdeel kun je direct oefenen. Ready to Ace biedt onbeperkt oefenen voor €4/maand." },
        { q: "Hoe lang duurt het Caliper Profile?", a: "Het duurt meestal zo'n 60–90 minuten en mengt meerkeuze-persoonlijkheidsvragen met redeneervragen. Bekend zijn met het format houdt je rustig en gefocust." },
      ],
      relatedSlugs: ["work-style-assessment", "leadership-assessment", "logical-reasoning"],
    },
  },
  pymetrics: {
    en: {
      name: "Pymetrics",
      title: "Pymetrics Games Practice",
      headline: "Pymetrics (Harver) Practice",
      description:
        "Prepare for Pymetrics: a set of neuroscience-based games that measure cognitive and emotional traits rather than right-or-wrong answers. Used by major U.S. employers for fair, early-stage screening.",
      metaDescription:
        "Free Pymetrics preparation. Understand the games, what each measures, and practice the reasoning and judgement skills behind them. Start practicing free.",
      keywords: ["Pymetrics games", "Pymetrics practice", "Pymetrics test prep", "Pymetrics assessment", "Harver Pymetrics"],
      category: "Test Provider",
      bullets: [
        "How the 12 core games work",
        "What each game actually measures",
        "Risk, memory and attention tasks",
        "Reasoning and judgement practice",
        "Staying calm and consistent",
      ],
      faqs: [
        { q: "What is Pymetrics?", a: "Pymetrics (now part of Harver) uses around a dozen short, neuroscience-based games to measure cognitive and emotional traits such as attention, risk tolerance and memory. There are no right or wrong answers. It builds a profile of how you think." },
        { q: "Can you prepare for Pymetrics games?", a: "You can't 'pass' them, but knowing the format removes surprise and nerves. Understanding what each game measures and practicing focus and quick decision-making helps you perform naturally." },
        { q: "Which employers use Pymetrics?", a: "Large U.S. employers in consulting, finance and technology use Pymetrics for fair early-stage screening. Practicing reasoning and situational judgement keeps your thinking sharp. Ready to Ace offers unlimited practice for $4/month." },
      ],
      relatedSlugs: ["situational-judgement", "logical-reasoning", "work-style-assessment"],
    },
    nl: {
      name: "Pymetrics",
      title: "Pymetrics Games Oefenen",
      headline: "Pymetrics (Harver) Oefenen",
      description:
        "Bereid je voor op Pymetrics: een reeks op neurowetenschap gebaseerde games die cognitieve en emotionele kenmerken meten in plaats van goede of foute antwoorden. Grote Amerikaanse werkgevers gebruiken het voor eerlijke screening vooraf.",
      metaDescription:
        "Gratis Pymetrics voorbereiden. Begrijp de games, wat elke game meet, en oefen de redeneer- en oordeelsvaardigheden erachter. Gratis starten.",
      keywords: ["Pymetrics games", "Pymetrics oefenen", "Pymetrics test voorbereiden", "Pymetrics assessment", "Harver Pymetrics"],
      category: "Testaanbieder",
      bullets: [
        "Hoe de 12 kern-games werken",
        "Wat elke game eigenlijk meet",
        "Taken rond risico, geheugen en aandacht",
        "Oefenen van redeneren en oordeel",
        "Rustig en consistent blijven",
      ],
      faqs: [
        { q: "Wat is Pymetrics?", a: "Pymetrics (nu onderdeel van Harver) gebruikt zo'n twaalf korte, op neurowetenschap gebaseerde games om cognitieve en emotionele kenmerken te meten, zoals aandacht, risicobereidheid en geheugen. Er zijn geen goede of foute antwoorden. Het bouwt een profiel van hoe jij denkt." },
        { q: "Kun je je voorbereiden op de Pymetrics-games?", a: "Je kunt ze niet 'halen', maar het format kennen haalt de verrassing en zenuwen weg. Begrijpen wat elke game meet en focus en snelle besluitvorming oefenen helpt je natuurlijk te presteren." },
        { q: "Welke werkgevers gebruiken Pymetrics?", a: "Grote Amerikaanse werkgevers in consultancy, finance en tech gebruiken Pymetrics voor eerlijke screening vooraf. Redeneren en situational judgement oefenen houdt je denken scherp. Ready to Ace biedt onbeperkt oefenen voor €4/maand." },
      ],
      relatedSlugs: ["situational-judgement", "logical-reasoning", "work-style-assessment"],
    },
  },
  saville: {
    en: {
      name: "Saville",
      title: "Saville Assessment Practice",
      headline: "Saville Assessment Practice",
      description:
        "Prepare for Saville Assessment aptitude tests, including Swift Analysis Aptitude and the Wave personality questionnaire: numerical, verbal and diagrammatic reasoning used by employers worldwide.",
      metaDescription:
        "Free Saville Assessment practice. Numerical, verbal and diagrammatic reasoning in the Saville Swift style, plus Wave personality prep. Start practicing free.",
      keywords: ["Saville assessment practice", "Saville Swift aptitude", "Saville Wave", "Saville numerical test", "Saville test prep"],
      category: "Test Provider",
      bullets: [
        "Numerical (comprehension & analysis)",
        "Verbal (comprehension & analysis)",
        "Diagrammatic / abstract reasoning",
        "Swift combined aptitude format",
        "Wave personality questionnaire prep",
      ],
      faqs: [
        { q: "What is a Saville Assessment?", a: "Saville Assessment (part of Willis Towers Watson) provides aptitude and personality tests. Its Swift range combines numerical, verbal and diagrammatic reasoning in one timed sitting, while the Wave questionnaire maps work style and motivation." },
        { q: "What is Saville Swift?", a: "Swift tests bundle several reasoning types into a single short, timed assessment, so quick switching between question types matters. Practicing each type under time pressure is the best preparation." },
        { q: "How do I prepare for Saville tests?", a: "Practice numerical, verbal and diagrammatic reasoning at speed and review the Wave personality format. Ready to Ace offers unlimited reasoning practice for $4/month." },
      ],
      relatedSlugs: ["numerical-reasoning", "verbal-reasoning", "logical-reasoning", "work-style-assessment"],
    },
    nl: {
      name: "Saville",
      title: "Saville Assessment Oefenen",
      headline: "Saville Assessment Oefenen",
      description:
        "Bereid je voor op de capaciteitentests van Saville Assessment, waaronder Swift Analysis Aptitude en de Wave-persoonlijkheidsvragenlijst: numeriek, verbaal en diagrammatisch redeneren, gebruikt door werkgevers wereldwijd.",
      metaDescription:
        "Gratis Saville Assessment oefenen. Numeriek, verbaal en diagrammatisch redeneren in Saville Swift-stijl, plus voorbereiding op Wave-persoonlijkheid. Gratis starten.",
      keywords: ["Saville assessment oefenen", "Saville Swift aptitude", "Saville Wave", "Saville numerieke test", "Saville test voorbereiden"],
      category: "Testaanbieder",
      bullets: [
        "Numeriek (begrip & analyse)",
        "Verbaal (begrip & analyse)",
        "Diagrammatisch / abstract redeneren",
        "Swift gecombineerd aptitude-format",
        "Voorbereiding Wave-persoonlijkheidsvragenlijst",
      ],
      faqs: [
        { q: "Wat is een Saville Assessment?", a: "Saville Assessment (onderdeel van Willis Towers Watson) biedt capaciteiten- en persoonlijkheidstests. De Swift-reeks combineert numeriek, verbaal en diagrammatisch redeneren in één test op tijd, terwijl de Wave-vragenlijst werkstijl en motivatie in kaart brengt." },
        { q: "Wat is Saville Swift?", a: "Swift-tests bundelen meerdere redeneertypes in één korte test op tijd, dus snel schakelen tussen vraagtypes telt mee. Elk type oefenen onder tijdsdruk is de beste voorbereiding." },
        { q: "Hoe bereid ik me voor op Saville-tests?", a: "Oefen numeriek, verbaal en diagrammatisch redeneren op snelheid en bekijk het Wave-persoonlijkheidsformat. Ready to Ace biedt onbeperkt oefenen voor €4/maand." },
      ],
      relatedSlugs: ["numerical-reasoning", "verbal-reasoning", "logical-reasoning", "work-style-assessment"],
    },
  },
  kenexa: {
    en: {
      name: "IBM Kenexa",
      title: "IBM Kenexa Practice Tests",
      headline: "IBM Kenexa Assessment Practice",
      description:
        "Prepare for IBM Kenexa assessments: numerical, verbal and logical reasoning tests (including the Kenexa Prove It! range) used by large employers for graduate and professional hiring.",
      metaDescription:
        "Free IBM Kenexa practice tests. Numerical, verbal and logical reasoning in the Kenexa style used by large employers worldwide. Start practicing free.",
      keywords: ["IBM Kenexa test", "Kenexa practice test", "Kenexa Prove It", "Kenexa numerical test", "Kenexa assessment prep"],
      category: "Test Provider",
      bullets: [
        "Numerical reasoning from data",
        "Verbal reasoning from passages",
        "Logical / inductive reasoning",
        "Prove It! skills-style questions",
        "Timed practice matching real conditions",
      ],
      faqs: [
        { q: "What is an IBM Kenexa test?", a: "IBM Kenexa provides aptitude assessments measuring numerical, verbal and logical reasoning, along with the Prove It! range of skills tests. They are used by large employers in graduate and professional selection." },
        { q: "Which employers use Kenexa?", a: "Large corporates across finance, retail and technology use IBM Kenexa assessments as part of structured hiring, often as an early online screening step." },
        { q: "How do I prepare for a Kenexa test?", a: "Practice numerical, verbal and logical reasoning under timed conditions to build speed and accuracy. Ready to Ace offers unlimited practice for $4/month." },
      ],
      relatedSlugs: ["numerical-reasoning", "verbal-reasoning", "logical-reasoning"],
    },
    nl: {
      name: "IBM Kenexa",
      title: "IBM Kenexa Test Oefenen",
      headline: "IBM Kenexa Assessment Oefenen",
      description:
        "Bereid je voor op IBM Kenexa-assessments: numerieke, verbale en logische redeneertests (waaronder de Kenexa Prove It!-reeks) die grote werkgevers gebruiken bij traineeship- en professionele werving.",
      metaDescription:
        "Gratis IBM Kenexa-test oefenen. Numeriek, verbaal en logisch redeneren in Kenexa-stijl, gebruikt door grote werkgevers wereldwijd. Gratis starten.",
      keywords: ["IBM Kenexa test", "Kenexa test oefenen", "Kenexa Prove It", "Kenexa numerieke test", "Kenexa assessment voorbereiden"],
      category: "Testaanbieder",
      bullets: [
        "Numeriek redeneren met gegevens",
        "Verbaal redeneren met teksten",
        "Logisch / inductief redeneren",
        "Prove It!-vaardigheidsvragen",
        "Oefenen op tijd, net als de echte test",
      ],
      faqs: [
        { q: "Wat is een IBM Kenexa-test?", a: "IBM Kenexa biedt capaciteitentests die numeriek, verbaal en logisch redeneren meten, samen met de Prove It!-reeks vaardigheidstests. Ze worden gebruikt door grote werkgevers bij traineeship- en professionele selectie." },
        { q: "Welke werkgevers gebruiken Kenexa?", a: "Grote bedrijven in finance, retail en tech gebruiken IBM Kenexa-assessments als onderdeel van gestructureerde werving, vaak als vroege online screeningstap." },
        { q: "Hoe bereid ik me voor op een Kenexa-test?", a: "Oefen numeriek, verbaal en logisch redeneren onder tijdsdruk om snelheid en nauwkeurigheid op te bouwen. Ready to Ace biedt onbeperkt oefenen voor €4/maand." },
      ],
      relatedSlugs: ["numerical-reasoning", "verbal-reasoning", "logical-reasoning"],
    },
  },
};
