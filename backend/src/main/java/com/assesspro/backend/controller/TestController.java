package com.assesspro.backend.controller;

import com.assesspro.backend.dto.SubmitTestRequest;
import com.assesspro.backend.dto.SubmitTestResponse;
import com.assesspro.backend.dto.TestDetailResponse;
import com.assesspro.backend.dto.TestResponse;
import com.assesspro.backend.service.TestService;
import com.assesspro.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tests")
@RequiredArgsConstructor
public class TestController {

    private final TestService testService;
    private final UserService userService;

    /**
     * GET /api/tests
     * GET /api/tests?type=NUMERICAL_REASONING&difficulty=MEDIUM&access=free
     */
    @GetMapping
    public ResponseEntity<List<TestResponse>> getTests(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String access
    ) {
        return ResponseEntity.ok(testService.getTests(type, difficulty, access));
    }

    /**
     * GET /api/tests/{id}
     * Pass userId as query param for access control until auth is implemented.
     */
    @GetMapping("/{id}")
    public ResponseEntity<TestDetailResponse> getTest(
            @PathVariable Long id,
            @RequestParam(required = false) Long userId
    ) {
        return ResponseEntity.ok(testService.getTestDetail(id, userId));
    }

    /**
     * POST /api/tests/{id}/submit
     */
    @PostMapping("/{id}/submit")
    public ResponseEntity<SubmitTestResponse> submitTest(
            @PathVariable Long id,
            @Valid @RequestBody SubmitTestRequest request
    ) {
        return ResponseEntity.ok(testService.submitTest(id, request));
    }

    /**
     * GET /api/tests/recommended/{userId}
     * Returns tests scored by relevance to the user's career targets.
     */
    @GetMapping("/recommended/{userId}")
    public ResponseEntity<List<TestResponse>> getRecommended(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getRecommendedTests(userId));
    }
}
