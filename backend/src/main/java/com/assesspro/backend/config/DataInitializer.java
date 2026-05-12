package com.assesspro.backend.config;

import com.assesspro.backend.entity.*;
import com.assesspro.backend.entity.enums.*;
import com.assesspro.backend.repository.*;
import com.assesspro.backend.service.AiTestGenerationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AssessmentTestRepository testRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final AiTestGenerationService aiTestGenerationService;

    @Override
    public void run(String... args) {
        if (testRepository.count() > 0) {
            log.info("Seed data already present, skipping initialisation.");
            return;
        }
        log.info("Seeding database...");
        seedUsers();
        seedFreeTests();
        seedProTests();
        seedAiGeneratedTests();
        log.info("Database seeding complete.");
    }

    // ── Users ─────────────────────────────────────────────────────────────────

    private void seedUsers() {
        User demo = User.builder().email("demo@assesspro.io").name("Demo User")
                .preferredLanguage(Language.EN).freeTestsUsed(0).build();
        userRepository.save(demo);
        subscriptionRepository.save(Subscription.builder().user(demo)
                .status(SubscriptionStatus.FREE).plan("FREE").build());

        User pro = User.builder().email("pro@assesspro.io").name("Pro User")
                .preferredLanguage(Language.EN).freeTestsUsed(5).build();
        userRepository.save(pro);
        subscriptionRepository.save(Subscription.builder().user(pro)
                .status(SubscriptionStatus.ACTIVE).plan("PRO_MONTHLY").build());

        log.info("Seeded 2 users");
    }

    // ── Free tests (5 tests, one per type, EASY) ──────────────────────────────

    private void seedFreeTests() {
        seedNumericalEasy();
        seedLogicalEasy();
        seedVerbalEasy();
        seedSituationalEasy();
        seedPersonalityEasy();
        log.info("Seeded 5 free tests");
    }

    private void seedNumericalEasy() {
        AssessmentTest t = buildTest("Number Essentials",
                "Master the fundamentals: sequences, percentages, fractions and basic algebra.",
                TestType.NUMERICAL_REASONING, Difficulty.EASY, true, false, 10);

        addQ(t, "What comes next in the sequence: 2, 4, 8, 16, ?",
                "Each number doubles the previous one. 16 × 2 = 32.", 1,
                ao("24", false, 1), ao("30", false, 2), ao("32", true, 3), ao("36", false, 4));

        addQ(t, "What is 25% of 200?",
                "200 × 0.25 = 50.", 2,
                ao("25", false, 1), ao("40", false, 2), ao("50", true, 3), ao("75", false, 4));

        addQ(t, "A shop sells 120 items in 6 days. What is the daily average?",
                "120 ÷ 6 = 20 items per day.", 3,
                ao("15", false, 1), ao("18", false, 2), ao("20", true, 3), ao("24", false, 4));

        addQ(t, "If x + 7 = 15, what is x?",
                "x = 15 − 7 = 8.", 4,
                ao("6", false, 1), ao("7", false, 2), ao("8", true, 3), ao("9", false, 4));

        addQ(t, "What is 3/4 expressed as a percentage?",
                "3 ÷ 4 = 0.75 = 75%.", 5,
                ao("60%", false, 1), ao("70%", false, 2), ao("75%", true, 3), ao("80%", false, 4));

        addQ(t, "A train travels 150 km in 2 hours. What is its average speed?",
                "Speed = Distance ÷ Time = 150 ÷ 2 = 75 km/h.", 6,
                ao("60 km/h", false, 1), ao("70 km/h", false, 2), ao("75 km/h", true, 3), ao("80 km/h", false, 4));

        addQ(t, "45 is what percentage of 180?",
                "(45 ÷ 180) × 100 = 25%.", 7,
                ao("20%", false, 1), ao("22%", false, 2), ao("25%", true, 3), ao("30%", false, 4));

        addQ(t, "What is 5² + 3²?",
                "5² = 25, 3² = 9. 25 + 9 = 34.", 8,
                ao("28", false, 1), ao("30", false, 2), ao("34", true, 3), ao("36", false, 4));

        testRepository.save(t);
    }

    private void seedLogicalEasy() {
        AssessmentTest t = buildTest("Logic Foundations",
                "Sharpen your reasoning: sequences, analogies and simple deductions.",
                TestType.LOGICAL_REASONING, Difficulty.EASY, true, false, 10);

        addQ(t, "Which does NOT belong: Circle, Square, Triangle, Cube?",
                "Circle, Square and Triangle are 2D shapes. Cube is a 3D shape.", 1,
                ao("Circle", false, 1), ao("Square", false, 2), ao("Triangle", false, 3), ao("Cube", true, 4));

        addQ(t, "All Bloops are Razzles, and all Razzles are Lazzles. Are all Bloops definitely Lazzles?",
                "Yes — transitive property: Bloops → Razzles → Lazzles.", 2,
                ao("Yes", true, 1), ao("No", false, 2), ao("Cannot be determined", false, 3), ao("Only sometimes", false, 4));

        addQ(t, "Next in the sequence: 3, 6, 12, 24, ?",
                "Each number is doubled. 24 × 2 = 48.", 3,
                ao("36", false, 1), ao("42", false, 2), ao("46", false, 3), ao("48", true, 4));

        addQ(t, "It rains, so the ground gets wet. The ground is dry. Did it rain?",
                "If rain → wet ground (contrapositive: dry ground → no rain). So no, it did not rain.", 4,
                ao("Yes", false, 1), ao("No", true, 2), ao("Cannot be determined", false, 3), ao("Maybe", false, 4));

        addQ(t, "Book is to Library as Painting is to ___?",
                "A library stores books; a gallery (museum) stores paintings.", 5,
                ao("Artist", false, 1), ao("Gallery", true, 2), ao("Canvas", false, 3), ao("Studio", false, 4));

        addQ(t, "What comes next: A, C, E, G, ?",
                "The sequence skips one letter each time. After G comes I.", 6,
                ao("H", false, 1), ao("I", true, 2), ao("J", false, 3), ao("K", false, 4));

        testRepository.save(t);
    }

    private void seedVerbalEasy() {
        AssessmentTest t = buildTest("Reading & Vocabulary Starter",
                "Build your verbal skills: comprehension, synonyms and sentence logic.",
                TestType.VERBAL_REASONING, Difficulty.EASY, true, false, 10);

        addQ(t, "\"The sky appears blue because of the scattering of sunlight.\" Which statement is TRUE?",
                "Rayleigh scattering causes shorter (blue) wavelengths to scatter more, making the sky look blue.", 1,
                ao("The sky is blue because of water vapour", false, 1),
                ao("Sunlight scattering causes the blue colour", true, 2),
                ao("The sky would be red without an atmosphere", false, 3),
                ao("Blue is the natural colour of the sun", false, 4));

        addQ(t, "Which word is closest in meaning to 'Benevolent'?",
                "Benevolent means well-meaning and kindly disposed toward others.", 2,
                ao("Aggressive", false, 1), ao("Indifferent", false, 2), ao("Kind", true, 3), ao("Strict", false, 4));

        addQ(t, "Which word is the OPPOSITE of 'Diligent'?",
                "Diligent means hardworking and careful. The opposite is lazy or negligent.", 3,
                ao("Busy", false, 1), ao("Lazy", true, 2), ao("Smart", false, 3), ao("Quiet", false, 4));

        addQ(t, "Which word does NOT belong: Joyful, Elated, Gloomy, Content?",
                "Joyful, Elated and Content are positive emotions. Gloomy is negative.", 4,
                ao("Joyful", false, 1), ao("Elated", false, 2), ao("Gloomy", true, 3), ao("Content", false, 4));

        addQ(t, "Complete the sentence: \"He was so tired that he could barely keep his eyes ___\".",
                "The idiom 'keep one's eyes open' means to stay awake and alert.", 5,
                ao("shut", false, 1), ao("open", true, 2), ao("closed", false, 3), ao("wide", false, 4));

        addQ(t, "\"Recycling reduces waste sent to landfill.\" If this is true, what can you conclude?",
                "If recycling reduces landfill waste, then NOT recycling increases landfill waste.", 6,
                ao("Everyone recycles", false, 1),
                ao("Not recycling leads to more landfill waste", true, 2),
                ao("Recycling eliminates all pollution", false, 3),
                ao("Landfills are no longer needed", false, 4));

        testRepository.save(t);
    }

    private void seedSituationalEasy() {
        AssessmentTest t = buildTest("Workplace Scenarios: Foundations",
                "Practice responding effectively to everyday professional situations.",
                TestType.SITUATIONAL_JUDGEMENT, Difficulty.EASY, true, false, 10);

        addQ(t, "You notice a colleague made an error in a client report that has not yet been sent. What do you do?",
                "Informing the colleague privately lets them correct the error without embarrassment and maintains the relationship.", 1,
                ao("Send the report as-is", false, 1),
                ao("Tell your manager without informing your colleague first", false, 2),
                ao("Quietly inform your colleague so they can correct it", true, 3),
                ao("Ignore it — it's not your responsibility", false, 4));

        addQ(t, "You are overwhelmed with tasks and cannot meet a deadline. What is the best action?",
                "Communicating early allows the team to adjust plans. Saying nothing or submitting incomplete work damages trust.", 2,
                ao("Say nothing and hope to finish in time", false, 1),
                ao("Inform your manager early and propose a revised timeline", true, 2),
                ao("Submit incomplete work without warning", false, 3),
                ao("Ask a colleague to do the work for you", false, 4));

        addQ(t, "Two colleagues are in a heated argument in the open office. You are a bystander. What do you do?",
                "Calmly suggesting they discuss privately is professional and de-escalates tension without ignoring the issue.", 3,
                ao("Join the argument and take a side", false, 1),
                ao("Ignore it completely", false, 2),
                ao("Calmly suggest they take the discussion to a private room", true, 3),
                ao("Immediately escalate to HR", false, 4));

        addQ(t, "Your manager gives you feedback you disagree with. How do you respond?",
                "Listening first and then respectfully asking for clarification shows professionalism and openness.", 4,
                ao("Dismiss the feedback and do it your way", false, 1),
                ao("Accept everything without comment", false, 2),
                ao("Listen fully, then respectfully ask for clarification and share your perspective", true, 3),
                ao("Complain to other colleagues about the feedback", false, 4));

        addQ(t, "You finish your tasks early with time to spare. What do you do?",
                "Proactively helping the team or asking for more work shows initiative and team orientation.", 5,
                ao("Browse the internet until the next task arrives", false, 1),
                ao("Leave the office early without telling anyone", false, 2),
                ao("Offer to help colleagues or ask your manager for additional tasks", true, 3),
                ao("Start a personal project on your work computer", false, 4));

        testRepository.save(t);
    }

    private void seedPersonalityEasy() {
        AssessmentTest t = buildTest("Work Style Self-Assessment",
                "Gain insight into your professional preferences, strengths and working patterns.",
                TestType.PERSONALITY_WORK_STYLE, Difficulty.EASY, true, false, 10);

        addQ(t, "When starting a new project, you prefer to:",
                "Researching first and then building a flexible plan balances preparation with adaptability — a strong professional approach.", 1,
                ao("Plan every detail before taking any action", false, 1),
                ao("Dive straight in and figure things out along the way", false, 2),
                ao("Research first, then create a flexible plan", true, 3),
                ao("Wait for detailed instructions from your manager", false, 4));

        addQ(t, "In a team setting, you naturally gravitate toward the role of:",
                "Strong teams need all roles. Coordinators who keep people organised are consistently valued in professional settings.", 2,
                ao("Leader who sets direction and motivates others", false, 1),
                ao("Innovator who generates new ideas", false, 2),
                ao("Implementer who turns plans into results", false, 3),
                ao("Coordinator who ensures everyone stays aligned", true, 4));

        addQ(t, "When facing a difficult decision at work, you typically:",
                "Gathering relevant data before deciding leads to more consistent outcomes and shows analytical thinking.", 3,
                ao("Go with your gut instinct immediately", false, 1),
                ao("Ask everyone around you what they would do", false, 2),
                ao("Gather relevant information and weigh the options before deciding", true, 3),
                ao("Delay the decision as long as possible", false, 4));

        addQ(t, "How do you prefer to receive feedback from your manager?",
                "Regular structured feedback allows for continuous improvement and clear expectations — preferred by high performers.", 4,
                ao("Only when something goes seriously wrong", false, 1),
                ao("As part of a formal annual review only", false, 2),
                ao("Regularly, in a structured and constructive way", true, 3),
                ao("Informally and only when you ask for it", false, 4));

        addQ(t, "When working on a long-term project, you tend to:",
                "Breaking goals into milestones is a proven way to maintain momentum and track progress on complex work.", 5,
                ao("Focus only on the end goal", false, 1),
                ao("Work in intense bursts and then rest", false, 2),
                ao("Break it into milestones and review progress regularly", true, 3),
                ao("Rely on deadlines to motivate you at the last minute", false, 4));

        addQ(t, "When a colleague takes a different approach to yours on a shared task, you:",
                "Discussing both approaches openly leads to better outcomes and strengthens the working relationship.", 6,
                ao("Insist your approach is followed", false, 1),
                ao("Give in immediately to avoid conflict", false, 2),
                ao("Discuss both approaches openly and find the best solution together", true, 3),
                ao("Do your part your way and ignore theirs", false, 4));

        testRepository.save(t);
    }

    // ── Pro tests (9 tests across all types and levels) ───────────────────────

    private void seedProTests() {
        seedNumericalMedium();
        seedNumericalHard();
        seedLogicalMedium();
        seedLogicalHard();
        seedVerbalMedium();
        seedVerbalHard();
        seedSituationalMedium();
        seedSituationalHard();
        seedPersonalityMedium();
        log.info("Seeded 9 Pro tests");
    }

    private void seedNumericalMedium() {
        AssessmentTest t = buildTest("Applied Numerics",
                "Tackle percentage changes, ratios, averages and multi-step word problems.",
                TestType.NUMERICAL_REASONING, Difficulty.MEDIUM, false, false, 15);

        addQ(t, "A product's price rises from €80 to €100. What is the percentage increase?",
                "(100 − 80) / 80 × 100 = 25%.", 1,
                ao("15%", false, 1), ao("20%", false, 2), ao("25%", true, 3), ao("30%", false, 4));

        addQ(t, "40% of a company's 60 employees are women. How many employees are men?",
                "Women = 40% × 60 = 24. Men = 60 − 24 = 36.", 2,
                ao("24", false, 1), ao("30", false, 2), ao("36", true, 3), ao("40", false, 4));

        addQ(t, "A and B share €240 in the ratio 3:5. How much does B receive?",
                "Total parts = 8. B = (5/8) × 240 = 150.", 3,
                ao("€90", false, 1), ao("€120", false, 2), ao("€150", true, 3), ao("€160", false, 4));

        addQ(t, "A jacket costs €250. A 12% discount is applied. What is the final price?",
                "Discount = 12% × 250 = €30. Final = 250 − 30 = €220.", 4,
                ao("€210", false, 1), ao("€215", false, 2), ao("€220", true, 3), ao("€225", false, 4));

        addQ(t, "A town's population grows from 50,000 to 55,000. What is the percentage change?",
                "(55,000 − 50,000) / 50,000 × 100 = 10%.", 5,
                ao("5%", false, 1), ao("8%", false, 2), ao("10%", true, 3), ao("12%", false, 4));

        addQ(t, "A car travels 300 km at a constant speed of 60 km/h. How long does the journey take?",
                "Time = Distance ÷ Speed = 300 ÷ 60 = 5 hours.", 6,
                ao("4 hours", false, 1), ao("4.5 hours", false, 2), ao("5 hours", true, 3), ao("6 hours", false, 4));

        addQ(t, "€2,000 is invested at 5% simple interest per year for 3 years. How much interest is earned?",
                "Simple interest = Principal × Rate × Time = 2000 × 0.05 × 3 = €300.", 7,
                ao("€250", false, 1), ao("€275", false, 2), ao("€300", true, 3), ao("€315", false, 4));

        addQ(t, "What is the mean (average) of: 4, 8, 12, 16, 20?",
                "Sum = 60. Mean = 60 ÷ 5 = 12.", 8,
                ao("10", false, 1), ao("11", false, 2), ao("12", true, 3), ao("14", false, 4));

        testRepository.save(t);
    }

    private void seedNumericalHard() {
        AssessmentTest t = buildTest("Advanced Data Interpretation",
                "Interpret complex financial and statistical data under timed conditions.",
                TestType.NUMERICAL_REASONING, Difficulty.HARD, false, false, 18);

        addQ(t, "A company's revenue grew from €2.4M in Q1 to €3.0M in Q4. What is the percentage increase?",
                "(3.0 − 2.4) / 2.4 × 100 = 25%.", 1,
                ao("20%", false, 1), ao("25%", true, 2), ao("30%", false, 3), ao("33%", false, 4));

        addQ(t, "Investment A: €10,000 at 8% annual return. Investment B: €10,000 at 5%. What is the combined value after 1 year?",
                "A = 10,000 × 1.08 = 10,800. B = 10,000 × 1.05 = 10,500. Total = €21,300.", 2,
                ao("€20,800", false, 1), ao("€21,000", false, 2), ao("€21,300", true, 3), ao("€21,500", false, 4));

        addQ(t, "Revenue = €500,000. Costs = €350,000. What is the profit margin?",
                "Profit = 500k − 350k = 150k. Margin = 150k / 500k × 100 = 30%.", 3,
                ao("25%", false, 1), ao("28%", false, 2), ao("30%", true, 3), ao("35%", false, 4));

        addQ(t, "€5,000 invested at 4% compound interest for 2 years. What is the final amount?",
                "Year 1: 5000 × 1.04 = 5200. Year 2: 5200 × 1.04 = 5408.", 4,
                ao("€5,360", false, 1), ao("€5,400", false, 2), ao("€5,408", true, 3), ao("€5,416", false, 4));

        addQ(t, "3 workers complete a job in 12 days. How long would it take 4 workers at the same rate?",
                "Total work = 3 × 12 = 36 worker-days. 4 workers: 36 ÷ 4 = 9 days.", 5,
                ao("8 days", false, 1), ao("9 days", true, 2), ao("10 days", false, 3), ao("12 days", false, 4));

        addQ(t, "Sales grow 20% in Year 1, then fall 10% in Year 2. What is the net change from the start?",
                "After Y1: 1.20. After Y2: 1.20 × 0.90 = 1.08. Net = +8%.", 6,
                ao("+5%", false, 1), ao("+8%", true, 2), ao("+10%", false, 3), ao("+12%", false, 4));

        addQ(t, "A store marks up goods by 40%, then offers a 25% discount. What is the net effect on the original price?",
                "After markup: 1.40. After discount: 1.40 × 0.75 = 1.05. Net = +5%.", 7,
                ao("−5%", false, 1), ao("0%", false, 2), ao("+5%", true, 3), ao("+15%", false, 4));

        addQ(t, "Fixed costs = €60,000. Selling price per unit = €25. Variable cost per unit = €10. How many units to break even?",
                "Contribution per unit = 25 − 10 = €15. Break-even = 60,000 ÷ 15 = 4,000 units.", 8,
                ao("3,000", false, 1), ao("3,500", false, 2), ao("4,000", true, 3), ao("4,500", false, 4));

        testRepository.save(t);
    }

    private void seedLogicalMedium() {
        AssessmentTest t = buildTest("Intermediate Reasoning",
                "Tackle syllogisms, number series and multi-step logical deductions.",
                TestType.LOGICAL_REASONING, Difficulty.MEDIUM, false, false, 15);

        addQ(t, "All A are B. Some B are C. What can you conclude about A and C?",
                "We know some B are C, but we do not know which B are C. The A's might not be among those B's that are C.", 1,
                ao("All A are C", false, 1),
                ao("Some A are definitely C", false, 2),
                ao("Nothing certain can be concluded about A and C", true, 3),
                ao("No A are C", false, 4));

        addQ(t, "What comes next: 1, 4, 9, 16, 25, ?",
                "These are perfect squares: 1², 2², 3², 4², 5², 6² = 36.", 2,
                ao("30", false, 1), ao("34", false, 2), ao("36", true, 3), ao("49", false, 4));

        addQ(t, "Fibonacci sequence: 2, 3, 5, 8, 13, 21, ?",
                "Each number is the sum of the two before it. 13 + 21 = 34.", 3,
                ao("29", false, 1), ao("32", false, 2), ao("34", true, 3), ao("36", false, 4));

        addQ(t, "In a group of 30 students: 18 study French, 15 study German, 8 study both. How many study neither?",
                "French only: 10, German only: 7, Both: 8, Total studying: 25. Neither: 30 − 25 = 5.", 4,
                ao("3", false, 1), ao("5", true, 2), ao("7", false, 3), ao("8", false, 4));

        addQ(t, "Two interleaved sequences: 2, 7, 4, 9, 8, 11, 16, 13, ?",
                "Odd positions (1,3,5,7): 2, 4, 8, 16 — doubling. Next odd position (9) = 32.", 5,
                ao("15", false, 1), ao("17", false, 2), ao("32", true, 3), ao("26", false, 4));

        addQ(t, "Hot is to Cold as Mountain is to ___?",
                "Hot and Cold are antonyms. The antonym of Mountain (high point) is Valley (low point).", 6,
                ao("Hill", false, 1), ao("River", false, 2), ao("Valley", true, 3), ao("Plain", false, 4));

        testRepository.save(t);
    }

    private void seedLogicalHard() {
        AssessmentTest t = buildTest("Critical Logic & Deduction",
                "Identify assumptions, evaluate arguments and solve complex multi-step problems.",
                TestType.LOGICAL_REASONING, Difficulty.HARD, false, false, 18);

        addQ(t, "Some managers are engineers. All engineers passed the certification exam. What can you conclude?",
                "Since some managers are engineers, and all engineers passed the exam, those particular managers also passed the exam.", 1,
                ao("All managers passed the exam", false, 1),
                ao("Some managers passed the certification exam", true, 2),
                ao("No managers are non-engineers", false, 3),
                ao("Nothing can be concluded", false, 4));

        addQ(t, "\"CompanyX has good customer service. Every successful business has good customer service. Therefore CompanyX is successful.\" This argument is:",
                "This is the fallacy of affirming the consequent. Good service is a condition of success, not sufficient proof of it.", 2,
                ao("Valid — the conclusion follows logically", false, 1),
                ao("Invalid — good service alone does not prove success", true, 2),
                ao("Valid — the premises are true so the conclusion must be", false, 3),
                ao("Invalid — the first premise is unverifiable", false, 4));

        addQ(t, "\"Increased screen time → reduced attention spans. Therefore we must ban phones in schools.\" What assumption is required?",
                "The conclusion (ban phones) only makes sense if the consequence (reduced attention span) is harmful to education.", 3,
                ao("All students use phones irresponsibly", false, 1),
                ao("Reduced attention spans harm educational outcomes", true, 2),
                ao("Phones have no educational value", false, 3),
                ao("Teachers cannot manage phone use in class", false, 4));

        addQ(t, "A survey shows countries with more TVs per household have higher life expectancy. A politician concludes: 'TVs increase life expectancy.' This illustrates:",
                "A third variable (wealth) causes both more TVs and higher life expectancy. This is a confounding variable — correlation ≠ causation.", 4,
                ao("A valid causal claim backed by data", false, 1),
                ao("A false dilemma", false, 2),
                ao("A confounding variable and false causation", true, 3),
                ao("An appeal to authority", false, 4));

        addQ(t, "Exactly 5 people sit in a row: Alice, Bob, Carol, Dave, Eve. Dave is last. Bob sits directly before Carol. Alice is not first. Eve is not adjacent to Dave. Who is first?",
                "Dave is 5th. Bob-Carol is a pair. Alice is not 1st. Eve is not 4th. Only arrangement: Eve, Alice, Bob, Carol, Dave → Eve is 1st.", 5,
                ao("Alice", false, 1), ao("Bob", false, 2), ao("Carol", false, 3), ao("Eve", true, 4));

        addQ(t, "Which statement, if true, would most weaken: 'Our new training programme improved employee performance, as scores rose 20% after roll-out.'?",
                "If industry scores also rose 20% in the same period, the training programme cannot claim credit for the improvement.", 6,
                ao("The training took 3 weeks to complete", false, 1),
                ao("Industry-wide test scores rose 20% in the same period", true, 2),
                ao("Some employees missed sessions", false, 3),
                ao("The programme was costly to deliver", false, 4));

        testRepository.save(t);
    }

    private void seedVerbalMedium() {
        AssessmentTest t = buildTest("Text Analysis & Inference",
                "Read passages, evaluate statements and identify what can and cannot be concluded.",
                TestType.VERBAL_REASONING, Difficulty.MEDIUM, false, false, 15);

        addQ(t, "Passage: 'Remote working has increased productivity in many companies. However, some employees report feeling isolated.' Which statement is SUPPORTED?",
                "The passage states both productivity gains AND isolation concerns, supporting the balanced conclusion.", 1,
                ao("Remote working always increases productivity", false, 1),
                ao("Remote working has both benefits and drawbacks", true, 2),
                ao("All employees prefer working from the office", false, 3),
                ao("Isolation has eliminated all productivity gains", false, 4));

        addQ(t, "Diligent is to Careless as Generous is to ___?",
                "Diligent and Careless are antonyms. The antonym of Generous is Selfish.", 2,
                ao("Wealthy", false, 1), ao("Giving", false, 2), ao("Selfish", true, 3), ao("Humble", false, 4));

        addQ(t, "Passage: 'The report was delayed because the data was unavailable.' Which assumption underlies this statement?",
                "The statement assumes the report could not have been written without the data — i.e. the data was essential.", 3,
                ao("The report is unimportant", false, 1),
                ao("The data was essential to completing the report", true, 2),
                ao("The report will never be completed", false, 3),
                ao("Data is always unavailable", false, 4));

        addQ(t, "A passage ends: 'Despite criticism, the policy was implemented and outcomes improved.' What is the author's most likely tone?",
                "The author acknowledges opposition but highlights the positive result — this is a neutral, balanced, even slightly optimistic tone.", 4,
                ao("Strongly critical of the policy", false, 1),
                ao("Neutral and informative", true, 2),
                ao("Enthusiastically supportive", false, 3),
                ao("Dismissive of the criticism", false, 4));

        addQ(t, "'All team leaders completed the workshop. Some managers are team leaders.' What can be concluded?",
                "Since some managers are team leaders, and all team leaders completed the workshop, those managers completed the workshop.", 5,
                ao("All managers completed the workshop", false, 1),
                ao("Some managers completed the workshop", true, 2),
                ao("No managers completed the workshop", false, 3),
                ao("Nothing can be concluded", false, 4));

        addQ(t, "Which of the following is an example of a FACT rather than an OPINION?",
                "A fact is objectively verifiable. 'The company was founded in 1998' can be checked against records.", 6,
                ao("This is the best product on the market", false, 1),
                ao("The company was founded in 1998", true, 2),
                ao("Customers deserve better service", false, 3),
                ao("The new design looks modern", false, 4));

        testRepository.save(t);
    }

    private void seedVerbalHard() {
        AssessmentTest t = buildTest("Critical Thinking & Argument Analysis",
                "Evaluate complex arguments, identify fallacies and assess evidence quality.",
                TestType.VERBAL_REASONING, Difficulty.HARD, false, false, 20);

        addQ(t, "Passage: 'Sales rose 15% after the new campaign. Therefore the campaign caused the increase.' Which flaw is present?",
                "Post hoc ergo propter hoc: assuming that because B followed A, A caused B. Other factors could have driven sales.", 1,
                ao("False dilemma", false, 1), ao("Ad hominem", false, 2),
                ao("Post hoc fallacy", true, 3), ao("Straw man", false, 4));

        addQ(t, "'We should prioritise economic growth because without it we cannot fund healthcare.' What type of argument structure is this?",
                "This is an instrumental argument — it values X (growth) as a means to achieve Y (healthcare funding).", 2,
                ao("Circular reasoning", false, 1),
                ao("Instrumental argument (means to an end)", true, 2),
                ao("Ad hominem", false, 3),
                ao("False dichotomy", false, 4));

        addQ(t, "Passage: 'No evidence has been found that the drug causes harm. Therefore it is safe.' Which flaw is this?",
                "Absence of evidence is not evidence of absence. The drug's safety has not been proven, only its harm not yet demonstrated.", 3,
                ao("Hasty generalisation", false, 1),
                ao("Appeal to ignorance (absence of evidence ≠ evidence of absence)", true, 2),
                ao("Straw man argument", false, 3),
                ao("False analogy", false, 4));

        addQ(t, "'Either we cut costs drastically or the company will go bankrupt.' This is most likely an example of:",
                "A false dilemma presents only two options when more may exist (e.g. increasing revenue, restructuring).", 4,
                ao("A valid logical dilemma", false, 1),
                ao("A false dilemma (false dichotomy)", true, 2),
                ao("Circular reasoning", false, 3),
                ao("An appeal to authority", false, 4));

        addQ(t, "Which of the following, if true, would MOST strengthen: 'Teaching critical thinking improves student outcomes'?",
                "A controlled study directly measuring outcomes provides strong causal evidence — far better than anecdote or correlation.", 5,
                ao("Several teachers believe it makes students smarter", false, 1),
                ao("A randomised controlled study found higher grades in schools that taught critical thinking", true, 2),
                ao("Critical thinking is valued by employers", false, 3),
                ao("Some countries include it in their curriculum", false, 4));

        addQ(t, "A passage argues: 'Organic food is healthier because it is more expensive.' What logical error is present?",
                "Price does not determine health value. This is a false equivalence — conflating cost with nutritional quality.", 6,
                ao("Overgeneralisation", false, 1),
                ao("False equivalence between cost and quality", true, 2),
                ao("Ad hominem", false, 3),
                ao("Slippery slope", false, 4));

        testRepository.save(t);
    }

    private void seedSituationalMedium() {
        AssessmentTest t = buildTest("Professional Dilemmas",
                "Navigate more complex workplace situations involving ethics, leadership and stakeholders.",
                TestType.SITUATIONAL_JUDGEMENT, Difficulty.MEDIUM, false, false, 15);

        addQ(t, "You discover a process inefficiency that saves €50k/year, but fixing it would disrupt your colleague's workflow significantly. What do you do?",
                "Documenting the finding and discussing it collaboratively respects your colleague and allows the organisation to benefit from the insight.", 1,
                ao("Implement the change without consulting your colleague", false, 1),
                ao("Ignore it to avoid conflict", false, 2),
                ao("Document it and raise it with your manager, involving your colleague in the solution", true, 3),
                ao("Tell the colleague to fix it themselves", false, 4));

        addQ(t, "A client is unhappy with a deliverable that technically meets the agreed specification. How do you respond?",
                "Acknowledging the client's concern and looking for a solution beyond the letter of the contract builds long-term relationships.", 2,
                ao("Point out that the contract was fulfilled and do nothing further", false, 1),
                ao("Apologise and redo everything for free without escalating", false, 2),
                ao("Acknowledge their concern, clarify the misalignment and explore a mutually acceptable solution", true, 3),
                ao("Escalate immediately to legal", false, 4));

        addQ(t, "Your manager asks you to present a project as your own work, when it was primarily done by your team. You should:",
                "Attributing work accurately builds trust and team morale. You can present the project while crediting contributors.", 3,
                ao("Do as asked — your manager has authority over these decisions", false, 1),
                ao("Refuse outright and report your manager to HR", false, 2),
                ao("Present the project while clearly attributing contributions to the team", true, 3),
                ao("Ask a colleague to present instead", false, 4));

        addQ(t, "A high-performing team member is consistently late to morning meetings. This is starting to affect team morale. You are the team lead. What is your first step?",
                "A private, empathetic conversation is the professional first step. It uncovers the cause before escalating.", 4,
                ao("Issue a formal written warning immediately", false, 1),
                ao("Raise it publicly in the next team meeting", false, 2),
                ao("Have a private, empathetic conversation to understand if there is an underlying reason", true, 3),
                ao("Ignore it — their output is good", false, 4));

        addQ(t, "Two departments are competing for the same budget. You lead one of them. The other department's project has objectively greater business value. What do you do?",
                "Acknowledging the other project's merit demonstrates integrity. You can still advocate for your project while being transparent.", 5,
                ao("Advocate strongly for your own project regardless", false, 1),
                ao("Withdraw your bid without explanation", false, 2),
                ao("Present your project's strengths honestly and acknowledge where the other project has greater value", true, 3),
                ao("Form a coalition with other departments to oppose the rival project", false, 4));

        testRepository.save(t);
    }

    private void seedSituationalHard() {
        AssessmentTest t = buildTest("Leadership Under Pressure",
                "Handle complex ethical dilemmas, stakeholder conflicts and high-stakes decisions.",
                TestType.SITUATIONAL_JUDGEMENT, Difficulty.HARD, false, false, 18);

        addQ(t, "You discover a colleague has been falsifying expense reports for small amounts over several months. What is the most appropriate action?",
                "Reporting through proper channels is ethically required. Confronting alone risks escalation; ignoring it makes you complicit.", 1,
                ao("Confront the colleague directly and demand they repay the amounts", false, 1),
                ao("Ignore it — the amounts are small and not worth the drama", false, 2),
                ao("Report the issue through the appropriate compliance or HR channel", true, 3),
                ao("Mention it informally to your manager in passing", false, 4));

        addQ(t, "You are leading a project. A key stakeholder asks you to cut corners on safety testing to meet the launch deadline. You:",
                "Safety cannot be compromised. Escalating is correct — the stakeholder's pressure must be transparently communicated to leadership.", 2,
                ao("Agree — meeting the deadline is paramount", false, 1),
                ao("Silently reduce testing scope without informing anyone", false, 2),
                ao("Refuse to cut safety corners, document the request and escalate to senior leadership", true, 3),
                ao("Delay without informing the stakeholder", false, 4));

        addQ(t, "Your team is resistant to a major organisational change you are required to implement. The most effective first step is:",
                "Understanding concerns before pushing change leads to better buy-in. Resistance is usually information, not obstruction.", 3,
                ao("Mandate compliance and warn of consequences for resistance", false, 1),
                ao("Delay implementation until all concerns are resolved", false, 2),
                ao("Hold open sessions to understand concerns, then communicate the rationale clearly while moving forward", true, 3),
                ao("Escalate resistant team members to HR", false, 4));

        addQ(t, "You are aware that a decision by senior leadership is based on incorrect data. Pointing it out risks embarrassing a senior executive. You should:",
                "Accurate information is critical to good decisions. The professional and ethical action is to raise it tactfully and through the right channels.", 4,
                ao("Stay silent to protect the relationship", false, 1),
                ao("Raise it publicly in the next all-hands meeting", false, 2),
                ao("Privately and respectfully inform the relevant person with the correct data, through the appropriate channel", true, 3),
                ao("Leak the information to colleagues to build consensus against the decision", false, 4));

        addQ(t, "You have been asked to lay off three team members due to budget cuts, but you believe the decision is based on flawed financial projections. You:",
                "Acting on potentially flawed data is serious. Requesting a data review before proceeding is the responsible first step.", 5,
                ao("Carry out the layoffs immediately — it is a senior decision", false, 1),
                ao("Refuse to proceed under any circumstances", false, 2),
                ao("Request a meeting to review the projections before proceeding, with a clear note of your concerns", true, 3),
                ao("Warn the affected employees informally so they can prepare", false, 4));

        testRepository.save(t);
    }

    private void seedPersonalityMedium() {
        AssessmentTest t = buildTest("Advanced Work Style Profile",
                "Explore your approach to ambiguity, leadership, conflict and professional growth.",
                TestType.PERSONALITY_WORK_STYLE, Difficulty.MEDIUM, false, false, 12);

        addQ(t, "When given a task with unclear instructions, you typically:",
                "Asking targeted clarifying questions early prevents wasted effort and shows proactivity — a highly professional approach.", 1,
                ao("Start immediately and figure it out as you go", false, 1),
                ao("Wait until someone clarifies without asking", false, 2),
                ao("Ask targeted clarifying questions before starting", true, 3),
                ao("Decline the task until full instructions are provided", false, 4));

        addQ(t, "When you make a significant mistake at work, your first instinct is to:",
                "Owning mistakes, correcting them and learning from them is the mark of a high-performing professional.", 2,
                ao("Hope nobody noticed", false, 1),
                ao("Blame external factors", false, 2),
                ao("Acknowledge it, correct it where possible and identify what to do differently", true, 3),
                ao("Apologise repeatedly without taking action", false, 4));

        addQ(t, "You prefer to work on:",
                "Being effective across both contexts is most valued by employers — it shows adaptability and self-awareness.", 3,
                ao("Tasks you know well, where you can consistently deliver", false, 1),
                ao("Novel challenges where you must learn as you go", false, 2),
                ao("A mix of familiar tasks and new challenges", true, 3),
                ao("Whatever your manager assigns, without preference", false, 4));

        addQ(t, "When you disagree strongly with a team decision that has already been made, you:",
                "Raising concerns through proper channels while still committing to the decision shows professionalism and integrity.", 4,
                ao("Openly undermine the decision with colleagues", false, 1),
                ao("Say nothing and comply reluctantly", false, 2),
                ao("Raise your concern to the appropriate person, then fully commit once a decision is confirmed", true, 3),
                ao("Refuse to participate until the decision is reversed", false, 4));

        addQ(t, "How do you typically approach professional development?",
                "Proactively seeking growth opportunities — beyond what's required — correlates strongly with long-term career progression.", 5,
                ao("Only develop skills when required by a new role", false, 1),
                ao("Rely on your employer to provide all training", false, 2),
                ao("Proactively seek learning opportunities aligned with your goals", true, 3),
                ao("Avoid development activities that feel outside your comfort zone", false, 4));

        addQ(t, "Under significant pressure, you tend to:",
                "Prioritising, communicating transparently and maintaining quality are the hallmarks of resilient professionals.", 6,
                ao("Work longer hours without adjusting your approach", false, 1),
                ao("Become withdrawn and work entirely independently", false, 2),
                ao("Prioritise ruthlessly, communicate risks early and focus on quality over quantity", true, 3),
                ao("Push stress aside completely and maintain your normal pace", false, 4));

        testRepository.save(t);
    }

    // ── AI-generated test ─────────────────────────────────────────────────────

    private void seedAiGeneratedTests() {
        try {
            aiTestGenerationService.generateAndSave(
                    TestType.NUMERICAL_REASONING, Difficulty.MEDIUM, Language.EN, 5);
            log.info("Seeded 1 AI-generated test");
        } catch (Exception e) {
            log.warn("AI test seeding skipped (non-fatal): {}", e.getMessage());
        }
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private AssessmentTest buildTest(String title, String desc, TestType type,
                                     Difficulty diff, boolean free, boolean ai, int minutes) {
        return AssessmentTest.builder()
                .title(title).description(desc).type(type).difficulty(diff)
                .language(Language.EN).isFree(free).isGeneratedByAI(ai)
                .estimatedTimeMinutes(minutes).build();
    }

    private void addQ(AssessmentTest test, String text, String explanation, int order,
                      AnswerOption a1, AnswerOption a2, AnswerOption a3, AnswerOption a4) {
        Question q = Question.builder()
                .assessmentTest(test).questionText(text)
                .explanation(explanation).orderIndex(order).build();
        for (AnswerOption o : List.of(a1, a2, a3, a4)) {
            o.setQuestion(q);
            q.getAnswerOptions().add(o);
        }
        test.getQuestions().add(q);
    }

    private AnswerOption ao(String text, boolean correct, int order) {
        return AnswerOption.builder()
                .answerText(text).isCorrect(correct).orderIndex(order).build();
    }
}
