package com.assesspro.backend.ai;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

/**
 * Internal POJOs used only for deserialising the raw AI JSON response.
 * They are intentionally kept separate from the JPA entities.
 */
public class AiTestJson {

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TestJson {
        private String title;
        private String description;
        private String type;
        private String difficulty;
        private String language;
        private int estimatedTimeMinutes;
        private int displayQuestionCount;
        private List<QuestionJson> questions;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class QuestionJson {
        private String questionText;
        private String explanation;
        private int orderIndex;
        private List<MediaItemJson> mediaItems;
        private List<AnswerOptionJson> answerOptions;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class MediaItemJson {
        private String mediaType;
        private String url;
        private String altText;
        private String caption;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AnswerOptionJson {
        private String answerText;
        // @JsonProperty needed: Lombok turns isCorrect() getter → Jackson property "correct", not "isCorrect"
        @JsonProperty("isCorrect")
        private boolean isCorrect;
        private int orderIndex;
    }
}
