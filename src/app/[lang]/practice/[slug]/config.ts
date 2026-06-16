import type { Locale } from "@/lib/locales";

export interface PracticePageConfig {
  title: string;
  headline: string;
  description: string;
  metaDescription: string;
  keywords: string[];
  category: string;
  faqs: { q: string; a: string }[];
  bullets: string[];
}

/** Each practice page carries its content per locale. Slugs stay locale-stable. */
export type LocalizedPracticePage = Record<Locale, PracticePageConfig>;

export const PRACTICE_PAGES: Record<string, LocalizedPracticePage> = {
  "numerical-reasoning": {
    en: {
      title: "Numerical Reasoning Test Practice",
      headline: "Numerical Reasoning Test Practice",
      description:
        "Master the numerical reasoning tests used by top employers. Practice with real-style questions covering data interpretation, percentages, ratios and financial calculations.",
      metaDescription:
        "Free numerical reasoning test practice. Real-style questions used by SHL, Korn Ferry, cut-e and top employers in finance, consulting and technology. Start free.",
      keywords: ["numerical reasoning test", "numerical reasoning practice", "SHL numerical test", "numerical aptitude test", "numerical reasoning free"],
      category: "Cognitive",
      bullets: [
        "Data tables, graphs and charts",
        "Percentages, ratios and fractions",
        "Financial and business calculations",
        "Timed practice to match real conditions",
      ],
      faqs: [
        { q: "What is a numerical reasoning test?", a: "A numerical reasoning test measures your ability to interpret and work with numerical data such as tables, graphs and statistics. They are widely used by employers in finance, consulting and technology during graduate and professional hiring." },
        { q: "Who uses numerical reasoning tests?", a: "Most large employers use numerical reasoning tests, including banks, consulting firms, tech companies and graduate employers. Common providers include SHL, Korn Ferry, cut-e and Talent Q." },
        { q: "How can I improve my numerical reasoning score?", a: "Regular practice is the most effective method. Focus on reading data quickly, practising mental arithmetic and working under timed conditions. Ready to Ace provides unlimited practice tests for $4/month." },
      ],
    },
    nl: {
      title: "Numerieke Redeneertest Oefenen",
      headline: "Numerieke Redeneertest Oefenen",
      description:
        "Beheers de numerieke redeneertests die topwerkgevers gebruiken. Oefen met realistische vragen over data-interpretatie, percentages, verhoudingen en financiële berekeningen.",
      metaDescription:
        "Gratis numerieke redeneertest oefenen. Realistische vragen zoals gebruikt door SHL, Korn Ferry, cut-e en topwerkgevers in finance, consultancy en tech. Gratis starten.",
      keywords: ["numerieke redeneertest", "numeriek redeneren oefenen", "rekentest sollicitatie", "capaciteitentest cijfers", "SHL numerieke test"],
      category: "Cognitief",
      bullets: [
        "Datatabellen, grafieken en diagrammen",
        "Percentages, verhoudingen en breuken",
        "Financiële en zakelijke berekeningen",
        "Oefenen op tijd, net als de echte test",
      ],
      faqs: [
        { q: "Wat is een numerieke redeneertest?", a: "Een numerieke redeneertest meet je vermogen om numerieke gegevens zoals tabellen, grafieken en statistieken te interpreteren en ermee te werken. Werkgevers in finance, consultancy en tech gebruiken ze veel bij sollicitaties en traineeships." },
        { q: "Wie gebruikt numerieke redeneertests?", a: "De meeste grote werkgevers gebruiken numerieke redeneertests, waaronder banken, consultancybureaus, techbedrijven en traineeship-werkgevers. Bekende aanbieders zijn SHL, Korn Ferry, cut-e en Talent Q." },
        { q: "Hoe verbeter ik mijn score op de numerieke test?", a: "Regelmatig oefenen werkt het beste. Focus op snel gegevens aflezen, hoofdrekenen en werken onder tijdsdruk. Ready to Ace biedt onbeperkt oefentests voor €4/maand." },
      ],
    },
  },
  "logical-reasoning": {
    en: {
      title: "Logical Reasoning Test Practice",
      headline: "Logical Reasoning Test Practice",
      description:
        "Sharpen your logical reasoning with practice tests that mirror the abstract and inductive reasoning assessments used by top employers.",
      metaDescription:
        "Free logical reasoning test practice. Abstract and inductive reasoning questions used by top employers in consulting, tech and finance. Start free.",
      keywords: ["logical reasoning test", "abstract reasoning test", "inductive reasoning test", "logical reasoning practice", "SHL logical test"],
      category: "Cognitive",
      bullets: [
        "Pattern recognition and sequences",
        "Abstract shape and figure series",
        "Inductive and deductive reasoning",
        "Timed conditions matching real tests",
      ],
      faqs: [
        { q: "What is a logical reasoning test?", a: "A logical reasoning test assesses your ability to identify patterns, sequences and rules in abstract information. They are used to evaluate problem-solving and analytical thinking." },
        { q: "What is the difference between logical and abstract reasoning?", a: "The terms are often used interchangeably. Both involve identifying patterns in shapes or sequences without relying on prior knowledge." },
        { q: "Which employers use logical reasoning tests?", a: "Consulting firms, technology companies, banks and graduate employers commonly use logical reasoning tests as part of their hiring process." },
      ],
    },
    nl: {
      title: "Logische Redeneertest Oefenen",
      headline: "Logische Redeneertest Oefenen",
      description:
        "Scherp je logisch redeneervermogen aan met oefentests die de abstracte en inductieve redeneertoetsen van topwerkgevers nabootsen.",
      metaDescription:
        "Gratis logische redeneertest oefenen. Abstracte en inductieve redeneervragen zoals gebruikt door topwerkgevers in consultancy, tech en finance. Gratis starten.",
      keywords: ["logische redeneertest", "abstract redeneren test", "inductief redeneren oefenen", "logisch redeneren sollicitatie", "SHL logische test"],
      category: "Cognitief",
      bullets: [
        "Patroonherkenning en reeksen",
        "Abstracte figuren- en vormreeksen",
        "Inductief en deductief redeneren",
        "Op tijd oefenen, net als de echte test",
      ],
      faqs: [
        { q: "Wat is een logische redeneertest?", a: "Een logische redeneertest meet je vermogen om patronen, reeksen en regels in abstracte informatie te herkennen. Werkgevers gebruiken ze om probleemoplossend en analytisch denkvermogen te beoordelen." },
        { q: "Wat is het verschil tussen logisch en abstract redeneren?", a: "De termen worden vaak door elkaar gebruikt. Beide draaien om het herkennen van patronen in vormen of reeksen zonder voorkennis nodig te hebben." },
        { q: "Welke werkgevers gebruiken logische redeneertests?", a: "Consultancybureaus, techbedrijven, banken en traineeship-werkgevers gebruiken logische redeneertests vaak als onderdeel van hun selectieproces." },
      ],
    },
  },
  "verbal-reasoning": {
    en: {
      title: "Verbal Reasoning Test Practice",
      headline: "Verbal Reasoning Test Practice",
      description:
        "Practice the verbal reasoning tests used in graduate and professional hiring. Improve your ability to evaluate written arguments and draw accurate conclusions.",
      metaDescription:
        "Free verbal reasoning test practice. True/false/cannot say questions used by SHL, Korn Ferry and top employers. Start free today.",
      keywords: ["verbal reasoning test", "verbal reasoning practice", "SHL verbal test", "verbal aptitude test", "true false cannot say test"],
      category: "Communication",
      bullets: [
        "True / False / Cannot Say format",
        "Business and professional passages",
        "Argument evaluation and inference",
        "Speed and accuracy under time pressure",
      ],
      faqs: [
        { q: "What is a verbal reasoning test?", a: "A verbal reasoning test measures your ability to understand and critically evaluate written information. You are typically asked whether statements are True, False or Cannot Say based on a passage of text." },
        { q: "How do I pass a verbal reasoning test?", a: "Read each passage carefully without bringing in outside knowledge. Base your answer only on what the text states. Practice regularly to improve reading speed and accuracy." },
        { q: "Who uses verbal reasoning tests?", a: "Law firms, consulting firms, banks, government bodies and many graduate employers use verbal reasoning tests as part of online screening." },
      ],
    },
    nl: {
      title: "Verbale Redeneertest Oefenen",
      headline: "Verbale Redeneertest Oefenen",
      description:
        "Oefen de verbale redeneertests die bij sollicitaties en traineeships worden gebruikt. Verbeter je vermogen om geschreven argumenten te beoordelen en juiste conclusies te trekken.",
      metaDescription:
        "Gratis verbale redeneertest oefenen. Waar/onwaar/niet te zeggen-vragen zoals gebruikt door SHL, Korn Ferry en topwerkgevers. Vandaag gratis starten.",
      keywords: ["verbale redeneertest", "verbaal redeneren oefenen", "taaltest sollicitatie", "SHL verbale test", "waar onwaar niet te zeggen test"],
      category: "Communicatie",
      bullets: [
        "Formaat Waar / Onwaar / Niet te zeggen",
        "Zakelijke en professionele teksten",
        "Argumenten beoordelen en gevolgtrekkingen maken",
        "Snelheid en nauwkeurigheid onder tijdsdruk",
      ],
      faqs: [
        { q: "Wat is een verbale redeneertest?", a: "Een verbale redeneertest meet je vermogen om geschreven informatie te begrijpen en kritisch te beoordelen. Meestal moet je aangeven of beweringen Waar, Onwaar of Niet te zeggen zijn op basis van een tekst." },
        { q: "Hoe slaag ik voor een verbale redeneertest?", a: "Lees elke tekst zorgvuldig zonder eigen kennis mee te nemen. Baseer je antwoord alleen op wat er in de tekst staat. Oefen regelmatig om je leessnelheid en nauwkeurigheid te verbeteren." },
        { q: "Wie gebruikt verbale redeneertests?", a: "Advocatenkantoren, consultancybureaus, banken, overheidsinstanties en veel traineeship-werkgevers gebruiken verbale redeneertests bij online screening." },
      ],
    },
  },
  "situational-judgement": {
    en: {
      title: "Situational Judgement Test (SJT) Practice",
      headline: "Situational Judgement Test Practice",
      description:
        "Practice situational judgement tests (SJTs) used by employers to assess workplace behaviour and decision-making. Prepare for HR, management and graduate roles.",
      metaDescription:
        "Free situational judgement test (SJT) practice. Workplace scenarios used by top employers in HR, consulting, healthcare and finance. Start free.",
      keywords: ["situational judgement test", "SJT practice", "situational judgement test practice", "SJT free", "workplace scenarios test"],
      category: "HR & Leadership",
      bullets: [
        "Realistic workplace scenarios",
        "Most and least effective response format",
        "Competency-based question styles",
        "Used by HR, management and graduate roles",
      ],
      faqs: [
        { q: "What is a situational judgement test?", a: "A situational judgement test (SJT) presents you with realistic work scenarios and asks you to choose the most and least effective responses. They assess judgement, professionalism and core competencies." },
        { q: "Can you prepare for a situational judgement test?", a: "Yes. While SJTs assess natural judgement, understanding the competencies being assessed and practising regularly improves your score significantly." },
        { q: "Who uses SJTs?", a: "SJTs are used across many sectors including healthcare, government, consulting, finance and graduate programmes. They are common in NHS, civil service and large corporate recruitment." },
      ],
    },
    nl: {
      title: "Situational Judgement Test (SJT) Oefenen",
      headline: "Situational Judgement Test Oefenen",
      description:
        "Oefen situational judgement tests (SJT's) die werkgevers gebruiken om werkgedrag en besluitvorming te beoordelen. Bereid je voor op HR-, management- en traineeshipfuncties.",
      metaDescription:
        "Gratis situational judgement test (SJT) oefenen. Werkscenario's zoals gebruikt door topwerkgevers in HR, consultancy, zorg en finance. Gratis starten.",
      keywords: ["situational judgement test", "SJT oefenen", "situationele beoordelingstest", "werkscenario test", "SJT sollicitatie"],
      category: "HR & Leiderschap",
      bullets: [
        "Realistische werkscenario's",
        "Formaat: meest en minst effectieve reactie",
        "Competentiegerichte vraagstijlen",
        "Gebruikt voor HR-, management- en traineeshipfuncties",
      ],
      faqs: [
        { q: "Wat is een situational judgement test?", a: "Een situational judgement test (SJT) legt je realistische werksituaties voor en vraagt je de meest en minst effectieve reactie te kiezen. Ze beoordelen je oordeelsvermogen, professionaliteit en kerncompetenties." },
        { q: "Kun je je voorbereiden op een situational judgement test?", a: "Ja. Hoewel SJT's je natuurlijke oordeelsvermogen toetsen, verbetert het begrijpen van de beoordeelde competenties en regelmatig oefenen je score aanzienlijk." },
        { q: "Wie gebruikt SJT's?", a: "SJT's worden in veel sectoren gebruikt, waaronder de zorg, overheid, consultancy, finance en traineeships. Ze zijn gangbaar bij grote werkgevers en overheidswerving." },
      ],
    },
  },
  "critical-reasoning": {
    en: {
      title: "Critical Reasoning Test Practice",
      headline: "Critical Reasoning Test Practice",
      description:
        "Develop critical thinking and argument analysis skills with practice tests used in law, consulting and management hiring.",
      metaDescription:
        "Free critical reasoning test practice. Argument analysis and logical inference questions used in law, consulting and management hiring. Start free.",
      keywords: ["critical reasoning test", "critical thinking test", "Watson Glaser test", "argument analysis test", "critical reasoning practice"],
      category: "Cognitive",
      bullets: [
        "Argument strength and validity",
        "Inference and assumption questions",
        "Watson Glaser style format",
        "Used in law, consulting and management",
      ],
      faqs: [
        { q: "What is a critical reasoning test?", a: "A critical reasoning test measures your ability to analyse arguments, identify assumptions and draw logical conclusions. The Watson Glaser is a well-known example used extensively in law and consulting." },
        { q: "What is the Watson Glaser test?", a: "The Watson Glaser Critical Thinking Appraisal is a popular critical reasoning test used by law firms, consulting firms and professional services companies." },
        { q: "How do I improve my critical reasoning score?", a: "Practice identifying assumptions and distinguishing between strong and weak arguments. Avoid letting personal opinions influence your answers." },
      ],
    },
    nl: {
      title: "Kritische Redeneertest Oefenen",
      headline: "Kritische Redeneertest Oefenen",
      description:
        "Ontwikkel je kritisch denkvermogen en argumentanalyse met oefentests die worden gebruikt bij selectie in de advocatuur, consultancy en management.",
      metaDescription:
        "Gratis kritische redeneertest oefenen. Argumentanalyse en logische gevolgtrekkingen zoals gebruikt in de advocatuur, consultancy en management. Gratis starten.",
      keywords: ["kritische redeneertest", "kritisch denken test", "Watson Glaser test", "argumentanalyse test", "kritisch redeneren oefenen"],
      category: "Cognitief",
      bullets: [
        "Sterkte en geldigheid van argumenten",
        "Vragen over gevolgtrekkingen en aannames",
        "Watson Glaser-stijl formaat",
        "Gebruikt in de advocatuur, consultancy en management",
      ],
      faqs: [
        { q: "Wat is een kritische redeneertest?", a: "Een kritische redeneertest meet je vermogen om argumenten te analyseren, aannames te herkennen en logische conclusies te trekken. De Watson Glaser is een bekend voorbeeld dat veel in de advocatuur en consultancy wordt gebruikt." },
        { q: "Wat is de Watson Glaser test?", a: "De Watson Glaser Critical Thinking Appraisal is een populaire kritische redeneertest die door advocatenkantoren, consultancybureaus en zakelijke dienstverleners wordt gebruikt." },
        { q: "Hoe verbeter ik mijn score op de kritische redeneertest?", a: "Oefen met het herkennen van aannames en het onderscheid tussen sterke en zwakke argumenten. Laat je persoonlijke mening je antwoorden niet beïnvloeden." },
      ],
    },
  },
  "data-interpretation": {
    en: {
      title: "Data Interpretation Test Practice",
      headline: "Data Interpretation Test Practice",
      description:
        "Practice interpreting complex data sets, charts and graphs. Essential preparation for roles in finance, data analytics, consulting and operations.",
      metaDescription:
        "Free data interpretation test practice. Charts, graphs and data tables used by employers in finance, consulting and analytics. Start free.",
      keywords: ["data interpretation test", "data analysis test", "data reasoning test", "chart interpretation test", "data interpretation practice"],
      category: "Finance & Consulting",
      bullets: [
        "Bar charts, line graphs and pie charts",
        "Multi-table data analysis",
        "Business and financial datasets",
        "Time-pressured conditions",
      ],
      faqs: [
        { q: "What is a data interpretation test?", a: "A data interpretation test requires you to analyse data presented in charts, graphs or tables and answer questions based on your findings. They are common in finance, consulting and data-heavy roles." },
        { q: "How is data interpretation different from numerical reasoning?", a: "Data interpretation focuses more on reading and analysing visual data (charts, graphs), while numerical reasoning may also include calculations and arithmetic problems." },
        { q: "What roles require data interpretation tests?", a: "Finance analysts, data analysts, consultants, operations managers and many other analytical roles commonly include data interpretation assessments." },
      ],
    },
    nl: {
      title: "Data-interpretatietest Oefenen",
      headline: "Data-interpretatietest Oefenen",
      description:
        "Oefen met het interpreteren van complexe datasets, grafieken en diagrammen. Essentiële voorbereiding voor functies in finance, data-analyse, consultancy en operations.",
      metaDescription:
        "Gratis data-interpretatietest oefenen. Grafieken, diagrammen en datatabellen zoals gebruikt door werkgevers in finance, consultancy en analytics. Gratis starten.",
      keywords: ["data-interpretatietest", "data-analyse test", "datatest sollicitatie", "grafieken interpreteren test", "data-interpretatie oefenen"],
      category: "Financieel & Consultancy",
      bullets: [
        "Staaf-, lijn- en cirkeldiagrammen",
        "Data-analyse over meerdere tabellen",
        "Zakelijke en financiële datasets",
        "Onder tijdsdruk",
      ],
      faqs: [
        { q: "Wat is een data-interpretatietest?", a: "Bij een data-interpretatietest analyseer je gegevens uit grafieken, diagrammen of tabellen en beantwoord je vragen op basis van je bevindingen. Ze zijn gangbaar in finance, consultancy en datagedreven functies." },
        { q: "Wat is het verschil met een numerieke redeneertest?", a: "Data-interpretatie richt zich meer op het aflezen en analyseren van visuele gegevens (grafieken, diagrammen), terwijl numeriek redeneren ook berekeningen en rekenkundige opgaven kan bevatten." },
        { q: "Voor welke functies zijn data-interpretatietests nodig?", a: "Financieel analisten, data-analisten, consultants, operations managers en veel andere analytische functies bevatten vaak een data-interpretatietest." },
      ],
    },
  },
  "work-style-assessment": {
    en: {
      title: "Work Style Assessment Practice",
      headline: "Work Style Assessment Practice",
      description:
        "Understand the personality and work style assessments used in hiring. Learn how to present your working preferences effectively and authentically.",
      metaDescription:
        "Free work style assessment practice. Personality and behavioural assessments used in hiring for sales, HR, customer service and management. Start free.",
      keywords: ["work style assessment", "personality test practice", "behavioural assessment", "work style questionnaire", "personality questionnaire practice"],
      category: "Personality",
      bullets: [
        "Personality and behavioural preferences",
        "Occupational personality questionnaire style",
        "Used in sales, HR and customer service hiring",
        "Understand what employers are looking for",
      ],
      faqs: [
        { q: "What is a work style assessment?", a: "A work style assessment measures your behavioural tendencies and personality preferences in a workplace context. Employers use them to understand how you work, communicate and fit within a team." },
        { q: "Can you fail a personality test?", a: "There are no right or wrong answers in a personality test. However, employers compare your profile to the ideal profile for the role, so consistency and self-awareness matter." },
        { q: "Who uses work style assessments?", a: "Work style assessments are widely used in sales, customer service, HR, management and retail hiring across all industries." },
      ],
    },
    nl: {
      title: "Werkstijl-assessment Oefenen",
      headline: "Werkstijl-assessment Oefenen",
      description:
        "Begrijp de persoonlijkheids- en werkstijl-assessments die bij selectie worden gebruikt. Leer je werkvoorkeuren effectief en authentiek te presenteren.",
      metaDescription:
        "Gratis werkstijl-assessment oefenen. Persoonlijkheids- en gedragsassessments zoals gebruikt bij selectie voor sales, HR, klantenservice en management. Gratis starten.",
      keywords: ["werkstijl assessment", "persoonlijkheidstest oefenen", "gedragsassessment", "persoonlijkheidsvragenlijst", "OPQ oefenen"],
      category: "Persoonlijkheid",
      bullets: [
        "Persoonlijkheids- en gedragsvoorkeuren",
        "Stijl van de beroepspersoonlijkheidsvragenlijst (OPQ)",
        "Gebruikt bij selectie in sales, HR en klantenservice",
        "Begrijp waar werkgevers naar op zoek zijn",
      ],
      faqs: [
        { q: "Wat is een werkstijl-assessment?", a: "Een werkstijl-assessment meet je gedragsneigingen en persoonlijkheidsvoorkeuren in een werkcontext. Werkgevers gebruiken ze om te begrijpen hoe je werkt, communiceert en in een team past." },
        { q: "Kun je zakken voor een persoonlijkheidstest?", a: "Er zijn geen goede of foute antwoorden bij een persoonlijkheidstest. Werkgevers vergelijken je profiel wel met het ideale profiel voor de functie, dus consistentie en zelfkennis zijn belangrijk." },
        { q: "Wie gebruikt werkstijl-assessments?", a: "Werkstijl-assessments worden in alle sectoren veel gebruikt bij selectie voor sales, klantenservice, HR, management en retail." },
      ],
    },
  },
  "leadership-assessment": {
    en: {
      title: "Leadership Assessment Test Practice",
      headline: "Leadership Assessment Practice",
      description:
        "Prepare for leadership and management assessments used in senior hiring and development programmes. Covers leadership style, decision-making and ethics.",
      metaDescription:
        "Free leadership assessment practice. Leadership style, decision-making and management scenarios used in senior and graduate hiring. Start free.",
      keywords: ["leadership assessment", "leadership test practice", "management assessment", "leadership style test", "leadership skills test"],
      category: "HR & Leadership",
      bullets: [
        "Leadership style and preference",
        "Decision-making under pressure",
        "Professional ethics scenarios",
        "Used in management and graduate programmes",
      ],
      faqs: [
        { q: "What is a leadership assessment?", a: "A leadership assessment measures qualities such as decision-making, strategic thinking, people management and ethical judgement. They are used in senior hiring, graduate leadership programmes and development centres." },
        { q: "How do I prepare for a leadership assessment?", a: "Reflect on your leadership experiences and understand common leadership models. Practice scenario-based questions and be consistent in your responses." },
        { q: "What types of organisations use leadership assessments?", a: "Consulting firms, banks, FMCG companies, government bodies and large corporates use leadership assessments for graduate schemes and management roles." },
      ],
    },
    nl: {
      title: "Leiderschapsassessment Oefenen",
      headline: "Leiderschapsassessment Oefenen",
      description:
        "Bereid je voor op leiderschaps- en managementassessments die worden gebruikt bij selectie voor senior functies en ontwikkelprogramma's. Behandelt leiderschapsstijl, besluitvorming en ethiek.",
      metaDescription:
        "Gratis leiderschapsassessment oefenen. Leiderschapsstijl, besluitvorming en managementscenario's zoals gebruikt bij selectie voor senior- en traineeshipfuncties. Gratis starten.",
      keywords: ["leiderschapsassessment", "leiderschapstest oefenen", "managementassessment", "leiderschapsstijl test", "leidinggevende vaardigheden test"],
      category: "HR & Leiderschap",
      bullets: [
        "Leiderschapsstijl en -voorkeur",
        "Besluitvorming onder druk",
        "Scenario's rond professionele ethiek",
        "Gebruikt in management- en traineeshipprogramma's",
      ],
      faqs: [
        { q: "Wat is een leiderschapsassessment?", a: "Een leiderschapsassessment meet eigenschappen zoals besluitvorming, strategisch denken, people management en ethisch oordeelsvermogen. Ze worden gebruikt bij senior selectie, leiderschapstraineeships en development centers." },
        { q: "Hoe bereid ik me voor op een leiderschapsassessment?", a: "Reflecteer op je leiderschapservaringen en verdiep je in gangbare leiderschapsmodellen. Oefen met scenariovragen en wees consistent in je antwoorden." },
        { q: "Welke organisaties gebruiken leiderschapsassessments?", a: "Consultancybureaus, banken, FMCG-bedrijven, overheidsinstanties en grote corporates gebruiken leiderschapsassessments voor traineeships en managementfuncties." },
      ],
    },
  },
  "professional-ethics": {
    en: {
      title: "Professional Ethics Assessment Practice",
      headline: "Professional Ethics Assessment Practice",
      description:
        "Practice ethics and integrity assessments used in consulting, finance, healthcare and government hiring. Learn how to navigate workplace ethical dilemmas.",
      metaDescription:
        "Free professional ethics assessment practice. Integrity and ethics scenarios used in consulting, finance, healthcare and government hiring. Start free.",
      keywords: ["professional ethics test", "integrity assessment", "ethics test practice", "workplace ethics assessment", "ethics and compliance test"],
      category: "HR & Leadership",
      bullets: [
        "Workplace ethical dilemmas",
        "Integrity and compliance scenarios",
        "Used in finance, consulting and healthcare",
        "Understand professional conduct standards",
      ],
      faqs: [
        { q: "What is a professional ethics assessment?", a: "A professional ethics assessment presents workplace dilemmas that test your integrity, judgement and adherence to professional conduct standards. They are common in regulated industries." },
        { q: "Who uses ethics assessments?", a: "Finance, consulting, healthcare, law and government organisations use ethics assessments, particularly for roles involving client contact, sensitive data or regulatory compliance." },
        { q: "Can you prepare for an ethics test?", a: "Yes. Familiarise yourself with the organisation's values and professional codes of conduct. Practice identifying the most ethical course of action in workplace scenarios." },
      ],
    },
    nl: {
      title: "Beroepsethiek-assessment Oefenen",
      headline: "Beroepsethiek-assessment Oefenen",
      description:
        "Oefen ethiek- en integriteitsassessments die worden gebruikt bij selectie in consultancy, finance, zorg en overheid. Leer omgaan met ethische dilemma's op de werkvloer.",
      metaDescription:
        "Gratis beroepsethiek-assessment oefenen. Integriteits- en ethiekscenario's zoals gebruikt bij selectie in consultancy, finance, zorg en overheid. Gratis starten.",
      keywords: ["beroepsethiek test", "integriteitsassessment", "ethiektest oefenen", "ethiek op de werkvloer test", "ethiek en compliance test"],
      category: "HR & Leiderschap",
      bullets: [
        "Ethische dilemma's op de werkvloer",
        "Integriteits- en compliancescenario's",
        "Gebruikt in finance, consultancy en zorg",
        "Begrijp de normen voor professioneel gedrag",
      ],
      faqs: [
        { q: "Wat is een beroepsethiek-assessment?", a: "Een beroepsethiek-assessment legt je werkdilemma's voor die je integriteit, oordeelsvermogen en naleving van professionele gedragsnormen toetsen. Ze zijn gangbaar in gereguleerde sectoren." },
        { q: "Wie gebruikt ethiekassessments?", a: "Organisaties in finance, consultancy, zorg, de advocatuur en overheid gebruiken ethiekassessments, vooral voor functies met klantcontact, gevoelige data of toezichtverplichtingen." },
        { q: "Kun je je voorbereiden op een ethiektest?", a: "Ja. Verdiep je in de waarden en gedragscodes van de organisatie. Oefen met het bepalen van de meest ethische handelwijze in werksituaties." },
      ],
    },
  },
};
