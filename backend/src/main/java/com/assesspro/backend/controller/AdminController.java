package com.assesspro.backend.controller;

import com.assesspro.backend.dto.GenerateTestRequest;
import com.assesspro.backend.dto.ImportTestRequest;
import com.assesspro.backend.dto.TestResponse;
import com.assesspro.backend.entity.AssessmentTest;
import com.assesspro.backend.entity.TestResult;
import com.assesspro.backend.entity.User;
import com.assesspro.backend.entity.enums.Difficulty;
import com.assesspro.backend.entity.enums.TestType;
import com.assesspro.backend.repository.AssessmentTestRepository;
import com.assesspro.backend.repository.TestResultRepository;
import com.assesspro.backend.repository.UserRepository;
import com.assesspro.backend.service.AiTestGenerationService;
import com.assesspro.backend.service.ImportTestService;
import com.assesspro.backend.service.TestService;
import com.assesspro.backend.service.UserService;

import java.util.*;
import java.util.stream.Collectors;
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
    private final ImportTestService importTestService;
    private final UserService userService;
    private final AssessmentTestRepository testRepository;
    private final TestResultRepository resultRepository;
    private final UserRepository userRepository;

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

    /**
     * POST /api/admin/tests/import
     *
     * Accepts the JSON structure produced by the AI assessment generation prompt
     * and saves it directly to the database — no DataInitializer changes required.
     */
    @PostMapping("/tests/import")
    public ResponseEntity<?> importTest(@RequestBody ImportTestRequest request) {
        try {
            AssessmentTest test = importTestService.importTest(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(testService.toTestResponse(test));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * POST /api/admin/generate-for-user/{userId}
     *
     * Generates a personalised AI test based on the user's career profile
     * and saves it. Called by the "Generate a test for me" button.
     */
    @PostMapping("/generate-for-user/{userId}")
    public ResponseEntity<?> generateForUser(@PathVariable Long userId) {
        try {
            var user = userService.getUserEntity(userId);
            var test = aiTestGenerationService.generateForUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(testService.toTestResponse(test));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("Test generation failed: " + e.getMessage());
        }
    }

    /**
     * POST /api/admin/generate-type/{userId}/{type}?difficulty=EASY|MEDIUM|HARD
     *
     * Generates one AI test of the given TestType + difficulty for the user's career context.
     * Called once per combination by the frontend bulk-generation flow.
     */
    @PostMapping("/generate-type/{userId}/{type}")
    public ResponseEntity<?> generateType(
            @PathVariable Long userId,
            @PathVariable String type,
            @RequestParam(defaultValue = "MEDIUM") String difficulty) {
        try {
            TestType testType = TestType.valueOf(type.toUpperCase());
            Difficulty diff = Difficulty.valueOf(difficulty.toUpperCase());
            var user = userService.getUserEntity(userId);
            var test = aiTestGenerationService.generateForUserOfType(user, testType, diff);
            return ResponseEntity.status(HttpStatus.CREATED).body(testService.toTestResponse(test));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid type or difficulty: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("Test generation failed: " + e.getMessage());
        }
    }

    /**
     * GET /api/admin/generation-status
     *
     * Returns which type+difficulty combinations already exist in the database.
     * Used by the frontend to skip already-generated combinations.
     */
    @GetMapping("/generation-status")
    public ResponseEntity<Map<String, List<String>>> generationStatus() {
        Map<String, List<String>> existing = new HashMap<>();
        for (TestType type : TestType.values()) {
            List<String> difficulties = testRepository.findByType(type).stream()
                    .map(t -> t.getDifficulty().name())
                    .distinct()
                    .toList();
            if (!difficulties.isEmpty()) {
                existing.put(type.name(), difficulties);
            }
        }
        return ResponseEntity.ok(existing);
    }

    /**
     * GET /api/admin/stats
     * Platform-wide counts for the admin dashboard.
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> stats() {
        long totalTests   = testRepository.count();
        long totalUsers   = userRepository.count();
        long totalResults = resultRepository.count();
        long aiTests      = testRepository.findAll().stream().filter(AssessmentTest::isGeneratedByAI).count();
        long freeTests    = testRepository.findByIsFreeTrue().size();

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalTests",   totalTests);
        stats.put("totalUsers",   totalUsers);
        stats.put("totalResults", totalResults);
        stats.put("aiTests",      aiTests);
        stats.put("freeTests",    freeTests);
        return ResponseEntity.ok(stats);
    }

    /**
     * GET /api/admin/users
     * All users with result count and average score.
     */
    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> adminUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> result = users.stream().map(u -> {
            List<TestResult> results = resultRepository.findByUserIdOrderByCreatedAtDesc(u.getId());
            double avgScore = results.stream().mapToInt(TestResult::getScore).average().orElse(0);
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("id",          u.getId());
            row.put("name",        u.getName());
            row.put("email",       u.getEmail());
            row.put("targetRole",  u.getTargetRole());
            row.put("resultCount", results.size());
            row.put("avgScore",    (int) Math.round(avgScore));
            row.put("createdAt",   u.getCreatedAt());
            return row;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    /**
     * GET /api/admin/tests
     * All tests with question count for the admin test library table.
     */
    @GetMapping("/tests")
    public ResponseEntity<List<TestResponse>> adminTests() {
        return ResponseEntity.ok(
            testRepository.findAll().stream()
                .sorted(Comparator.comparing(AssessmentTest::getCreatedAt).reversed())
                .map(testService::toTestResponse)
                .collect(Collectors.toList())
        );
    }

    /**
     * DELETE /api/admin/tests/{id}
     */
    @DeleteMapping("/tests/{id}")
    public ResponseEntity<Void> deleteTest(@PathVariable Long id) {
        if (!testRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        testRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * PATCH /api/admin/tests/{id}/free?isFree=true|false
     */
    @PatchMapping("/tests/{id}/free")
    public ResponseEntity<TestResponse> setTestFree(
            @PathVariable Long id,
            @RequestParam boolean isFree) {
        return testRepository.findById(id).map(test -> {
            test.setFree(isFree);
            testRepository.save(test);
            return ResponseEntity.ok(testService.toTestResponse(test));
        }).orElse(ResponseEntity.notFound().build());
    }
}
