package com.assesspro.backend.dto;

import com.assesspro.backend.entity.enums.Difficulty;
import com.assesspro.backend.entity.enums.Language;
import com.assesspro.backend.entity.enums.TestType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GenerateTestRequest {

    @NotNull
    private TestType type;

    @NotNull
    private Difficulty difficulty;

    @NotNull
    private Language language;

    @Min(1)
    @Max(20)
    private int numberOfQuestions = 5;
}
