package com.assesspro.backend.controller;

import com.assesspro.backend.dto.GenerateTestRequest;
import com.assesspro.backend.dto.TestResponse;
import com.assesspro.backend.entity.AssessmentTest;
import com.assesspro.backend.service.AiTestGenerationService;
import com.assesspro.backend.service.TestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AiTestGenerationService aiTestGenerationService;
    private final TestService testService;

    /**
     * POST /api/admin/tests/generate
     *
     * Triggers AI generation of a new test and saves it to the database.
     * The generated test will immediately appear in GET /api/tests.
     *
     * TODO: Protect this endpoint with an admin role once Spring Security is added.
     */
    @PostMapping("/tests/generate")
    public ResponseEntity<TestResponse> generateTest(@Valid @RequestBody GenerateTestRequest request) {
        AssessmentTest test = aiTestGenerationService.generateAndSave(
                request.getType(),
                request.getDifficulty(),
                request.getLanguage(),
                request.getNumberOfQuestions()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(testService.toTestResponse(test));
    }
}
