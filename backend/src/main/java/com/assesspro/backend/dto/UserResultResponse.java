package com.assesspro.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class UserResultResponse {
    private Long resultId;
    private Long testId;
    private String testTitle;
    private int score;
    private int totalQuestions;
    private int correctAnswers;
    private int timeTakenSeconds;
    private String feedback;
    private LocalDateTime completedAt;
}
