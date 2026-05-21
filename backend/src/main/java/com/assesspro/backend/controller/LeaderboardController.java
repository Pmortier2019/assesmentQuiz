package com.assesspro.backend.controller;

import com.assesspro.backend.dto.LeaderboardEntry;
import com.assesspro.backend.entity.TestResult;
import com.assesspro.backend.entity.enums.TestType;
import com.assesspro.backend.repository.TestResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

    private final TestResultRepository resultRepository;

    /**
     * GET /api/leaderboard?type=NUMERICAL_REASONING
     * Returns top 10 results this week, anonymised.
     */
    @GetMapping
    public ResponseEntity<List<LeaderboardEntry>> getLeaderboard(
            @RequestParam(required = false) String type
    ) {
        LocalDateTime since = LocalDateTime.now().minusDays(7);
        TestType testType = type != null ? TestType.valueOf(type.toUpperCase()) : null;

        List<TestResult> results;
        if (testType != null) {
            results = resultRepository.findTopByTypeAndDateRange(testType, since, PageRequest.of(0, 10));
        } else {
            // All types: sort by score desc, take top 10
            results = resultRepository.findAll().stream()
                    .filter(r -> r.getCreatedAt().isAfter(since))
                    .sorted((a, b) -> {
                        int scoreCmp = Integer.compare(b.getScore(), a.getScore());
                        return scoreCmp != 0 ? scoreCmp : Integer.compare(a.getTimeTakenSeconds(), b.getTimeTakenSeconds());
                    })
                    .limit(10)
                    .toList();
        }

        List<LeaderboardEntry> entries = new ArrayList<>();
        for (int i = 0; i < results.size(); i++) {
            TestResult r = results.get(i);
            entries.add(LeaderboardEntry.builder()
                    .rank(i + 1)
                    .displayName(anonymise(r.getUser().getName()))
                    .score(r.getScore())
                    .testTitle(r.getAssessmentTest().getTitle())
                    .timeTakenSeconds(r.getTimeTakenSeconds())
                    .build());
        }
        return ResponseEntity.ok(entries);
    }

    private static String anonymise(String name) {
        if (name == null || name.isBlank()) return "Anonymous";
        String[] parts = name.trim().split("\\s+");
        if (parts.length == 1) {
            String n = parts[0];
            return n.substring(0, 1).toUpperCase() + "*".repeat(Math.max(0, n.length() - 1));
        }
        return parts[0] + " " + parts[parts.length - 1].charAt(0) + ".";
    }
}
