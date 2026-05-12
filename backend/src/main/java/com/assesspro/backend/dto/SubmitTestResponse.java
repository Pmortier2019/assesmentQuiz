package com.assesspro.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class SubmitTestResponse {
    private Long resultId;
    private Long testId;
    private Long userId;
    private int score;
    private int totalQuestions;
    private int correctAnswers;
    private int timeTakenSeconds;
    private String feedback;
    private LocalDateTime completedAt;
    private List<QuestionResultDetail> questionResults;

    @Data
    @Builder
    public static class QuestionResultDetail {
        private Long questionId;
        private String questionText;
        private String explanation;
        private Long selectedAnswerOptionId;
        @JsonProperty("isCorrect")
        private boolean isCorrect;
        private List<AnswerOptionResultResponse> answerOptions;
    }
}
