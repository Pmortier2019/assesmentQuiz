package com.assesspro.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
public class ImportTestRequest {

    private String title;
    private String description;
    private String type;
    private String difficulty;
    private String category;
    private String subcategory;
    private List<String> targetRoles;
    private List<String> targetIndustries;
    private List<String> recommendedForCompanies;
    private List<String> skillsMeasured;

    @JsonProperty("isFree")
    private boolean isFree = true;

    private int estimatedTimeMinutes;

    /** How many questions to show per attempt (0 = show all). */
    private int displayQuestionCount;
    private List<ImportQuestionDto> questions;

    @Data
    public static class ImportQuestionDto {
        private int orderIndex;
        private String questionText;
        private String explanation;
        private List<ImportAnswerDto> answers;
    }

    @Data
    public static class ImportAnswerDto {
        private String answerText;

        @JsonProperty("isCorrect")
        private boolean isCorrect;

        private int orderIndex;
    }
}
