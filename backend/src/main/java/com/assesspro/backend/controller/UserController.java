package com.assesspro.backend.controller;

import com.assesspro.backend.dto.*;
import com.assesspro.backend.service.AiTestGenerationService;
import com.assesspro.backend.service.TestService;
import com.assesspro.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final AiTestGenerationService aiTestGenerationService;
    private final TestService testService;

    /** GET /api/users/{userId} */
    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUser(userId));
    }

    /** GET /api/users/{userId}/results */
    @GetMapping("/{userId}/results")
    public ResponseEntity<List<UserResultResponse>> getResults(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserResults(userId));
    }

    /** GET /api/users/{userId}/recommendations */
    @GetMapping("/{userId}/recommendations")
    public ResponseEntity<List<TestResponse>> getRecommendations(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getRecommendations(userId));
    }

    /** PATCH /api/users/{userId}/career-targets */
    @PatchMapping("/{userId}/career-targets")
    public ResponseEntity<UserResponse> updateCareerTargets(
            @PathVariable Long userId,
            @RequestBody CareerTargetsRequest request) {
        return ResponseEntity.ok(userService.updateCareerTargets(userId, request));
    }

    /** GET /api/users/{userId}/preparation-path */
    @GetMapping("/{userId}/preparation-path")
    public ResponseEntity<PreparationPathResponse> getPreparationPath(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getPreparationPath(userId));
    }

    /** POST /api/users/{userId}/generate-test — generates a fresh AI test based on the user's career profile */
    @PostMapping("/{userId}/generate-test")
    public ResponseEntity<?> generateTest(@PathVariable Long userId) {
        try {
            var user = userService.getUserEntity(userId);
            var test = aiTestGenerationService.generateForUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(testService.toTestResponse(test));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("Test generation failed: " + e.getMessage());
        }
    }
}
