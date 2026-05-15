package com.assesspro.backend.dto;

import com.assesspro.backend.entity.enums.AssessmentCategory;
import com.assesspro.backend.entity.enums.Difficulty;
import com.assesspro.backend.entity.enums.Language;
import com.assesspro.backend.entity.enums.TestType;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class TestResponse {
    private Long id;
    private String title;
    private String description;
    private TestType type;
    private Difficulty difficulty;
    private Language language;
    @JsonProperty("isFree")
    private boolean isFree;
    @JsonProperty("isGeneratedByAI")
    private boolean isGeneratedByAI;
    private int estimatedTimeMinutes;
    private int questionCount;
    private int displayQuestionCount;
    private LocalDateTime createdAt;
    private AssessmentCategory category;
    private String subcategory;
    private List<String> targetRoles;
    private List<String> targetIndustries;
    private List<String> recommendedForCompanies;
    private List<String> skillsMeasured;
    @JsonProperty("isRecommended")
    private boolean isRecommended;
}
