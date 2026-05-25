-- V1: Initial schema baseline
-- This migration documents the schema as created by Hibernate ddl-auto=update.
-- On existing databases this file is skipped via flyway.baseline-on-migrate=true.

CREATE TABLE IF NOT EXISTS users (
    id                  BIGSERIAL PRIMARY KEY,
    email               VARCHAR(255) NOT NULL UNIQUE,
    name                VARCHAR(255) NOT NULL,
    password_hash       VARCHAR(255),
    role                VARCHAR(255) NOT NULL DEFAULT 'USER',
    preferred_language  VARCHAR(255) NOT NULL DEFAULT 'EN',
    free_tests_used     INT          NOT NULL DEFAULT 0,
    xp                  INT          NOT NULL DEFAULT 0,
    target_role         VARCHAR(255),
    target_industry     VARCHAR(255),
    target_company      VARCHAR(255),
    level               VARCHAR(255),
    created_at          TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id                   BIGSERIAL PRIMARY KEY,
    user_id              BIGINT       NOT NULL UNIQUE REFERENCES users(id),
    status               VARCHAR(255) NOT NULL DEFAULT 'FREE',
    plan                 VARCHAR(255) NOT NULL DEFAULT 'FREE',
    started_at           TIMESTAMP,
    expires_at           TIMESTAMP,
    ls_subscription_id   VARCHAR(255),
    ls_customer_id       VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS assessment_tests (
    id                      BIGSERIAL PRIMARY KEY,
    title                   VARCHAR(255) NOT NULL,
    description             TEXT,
    type                    VARCHAR(255) NOT NULL,
    difficulty              VARCHAR(255) NOT NULL,
    language                VARCHAR(255) NOT NULL DEFAULT 'EN',
    is_free                 BOOLEAN      NOT NULL DEFAULT FALSE,
    is_generated_by_a_i     BOOLEAN      NOT NULL DEFAULT FALSE,
    estimated_time_minutes  INT,
    display_question_count  INT                   DEFAULT 0,
    category                VARCHAR(255),
    subcategory             VARCHAR(255),
    created_at              TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS test_target_roles (
    test_id BIGINT NOT NULL REFERENCES assessment_tests(id),
    role    VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS test_target_industries (
    test_id  BIGINT NOT NULL REFERENCES assessment_tests(id),
    industry VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS test_recommended_companies (
    test_id BIGINT NOT NULL REFERENCES assessment_tests(id),
    company VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS test_skills_measured (
    test_id BIGINT NOT NULL REFERENCES assessment_tests(id),
    skill   VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS questions (
    assessment_test_id  BIGINT NOT NULL REFERENCES assessment_tests(id),
    id                  BIGSERIAL PRIMARY KEY,
    question_text       TEXT         NOT NULL,
    explanation         TEXT,
    order_index         INT          NOT NULL
);

CREATE TABLE IF NOT EXISTS question_media (
    id          BIGSERIAL PRIMARY KEY,
    question_id BIGINT       NOT NULL REFERENCES questions(id),
    media_type  VARCHAR(255) NOT NULL,
    url         VARCHAR(255) NOT NULL,
    alt_text    VARCHAR(255),
    caption     VARCHAR(255),
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS answer_options (
    id          BIGSERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL REFERENCES questions(id),
    answer_text TEXT   NOT NULL,
    is_correct  BOOLEAN NOT NULL DEFAULT FALSE,
    order_index INT     NOT NULL
);

CREATE TABLE IF NOT EXISTS test_results (
    id                 BIGSERIAL PRIMARY KEY,
    user_id            BIGINT NOT NULL REFERENCES users(id),
    assessment_test_id BIGINT NOT NULL REFERENCES assessment_tests(id),
    score              INT    NOT NULL,
    total_questions    INT    NOT NULL,
    correct_answers    INT    NOT NULL,
    time_taken_seconds INT,
    feedback           TEXT,
    created_at         TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_answers (
    id                       BIGSERIAL PRIMARY KEY,
    test_result_id           BIGINT  NOT NULL REFERENCES test_results(id),
    question_id              BIGINT  NOT NULL REFERENCES questions(id),
    selected_answer_option_id BIGINT REFERENCES answer_options(id),
    is_correct               BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT       NOT NULL REFERENCES users(id),
    token      VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP    NOT NULL,
    used       BOOLEAN      NOT NULL DEFAULT FALSE
);
