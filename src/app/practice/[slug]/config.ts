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

export const PRACTICE_PAGES: Record<string, PracticePageConfig> = {
  "numerical-reasoning": {
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
      { q: "How can I improve my numerical reasoning score?", a: "Regular practice is the most effective method. Focus on reading data quickly, practising mental arithmetic and working under timed conditions. Ready to Ace provides unlimited practice tests for €4/month." },
    ],
  },
  "logical-reasoning": {
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
  "verbal-reasoning": {
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
  "situational-judgement": {
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
  "critical-reasoning": {
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
  "data-interpretation": {
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
  "work-style-assessment": {
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
  "leadership-assessment": {
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
  "professional-ethics": {
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
};
