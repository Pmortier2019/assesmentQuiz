package com.assesspro.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AnswerOptionResultResponse {
    private Long id;
    private String answerText;
    @JsonProperty("isCorrect")
    private boolean isCorrect;
    private int orderIndex;
}
