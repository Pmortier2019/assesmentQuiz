package com.assesspro.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AnswerOptionResponse {
    private Long id;
    private String answerText;
    private int orderIndex;
    // isCorrect is intentionally omitted from the default response.
    // It is only included in the result/submit response to prevent cheating.
}
