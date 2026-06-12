package com.assesspro.backend.ai;

/**
 * Provider-agnostic hint for how much reasoning power a generation needs.
 *
 * <p>The concrete model behind each tier is the AI client's concern — this only
 * expresses intent. Reasoning-heavy tests (maths, logic, data) where a slip
 * produces a factually wrong "correct" answer warrant the stronger model;
 * behavioural tests with no single objective answer can use the cheaper one.
 */
public enum ModelTier {
    /** Cheaper/faster model — fine where there is no single objectively-correct answer. */
    STANDARD,
    /** Stronger model — for tests whose correctness depends on accurate reasoning. */
    REASONING
}
