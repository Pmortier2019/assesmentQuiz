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
import org.springframework.security.core.Authentication;
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
     * Access control (Pro / free-limit) is resolved against the authenticated
     * user from the JWT — never a client-supplied id.
     */
    @GetMapping("/{id}")
    public ResponseEntity<TestDetailResponse> getTest(
            @PathVariable Long id,
            Authentication auth
    ) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(testService.getTestDetail(id, userId));
    }

    /**
     * POST /api/tests/{id}/submit
     * The result is always recorded for the authenticated user.
     */
    @PostMapping("/{id}/submit")
    public ResponseEntity<SubmitTestResponse> submitTest(
            @PathVariable Long id,
            @Valid @RequestBody SubmitTestRequest request,
            Authentication auth
    ) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(testService.submitTest(id, userId, request));
    }

    /**
     * GET /api/tests/recommended/me
     * Returns tests scored by relevance to the authenticated user's career targets.
     */
    @GetMapping("/recommended/me")
    public ResponseEntity<List<TestResponse>> getRecommended(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(userService.getRecommendedTests(userId));
    }
}
