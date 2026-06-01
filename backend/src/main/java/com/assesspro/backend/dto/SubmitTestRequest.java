package com.assesspro.backend.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class SubmitTestRequest {

    // NOTE: the user is always derived from the authenticated JWT, never from
    // the request body, so there is intentionally no userId field here.

    @NotEmpty
    private List<AnswerSubmission> answers;

    private Integer timeTakenSeconds;

    @Data
    public static class AnswerSubmission {
        @NotNull
        private Long questionId;
        @NotNull
        private Long selectedAnswerOptionId;
    }
}
