package com.assesspro.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class QuestionResponse {
    private Long id;
    private String questionText;
    private String explanation;
    private int orderIndex;
    private List<QuestionMediaResponse> mediaItems;
    private List<AnswerOptionResponse> answerOptions;
}
