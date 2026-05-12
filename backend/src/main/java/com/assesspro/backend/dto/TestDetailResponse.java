package com.assesspro.backend.dto;

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
public class TestDetailResponse {
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
    private LocalDateTime createdAt;
    private List<QuestionResponse> questions;
}
