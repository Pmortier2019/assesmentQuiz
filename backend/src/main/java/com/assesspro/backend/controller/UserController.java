package com.assesspro.backend.controller;

import com.assesspro.backend.dto.*;
import com.assesspro.backend.exception.AccessDeniedException;
import com.assesspro.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /** GET /api/users/{userId} */
    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long userId, Authentication auth) {
        requireOwner(auth, userId);
        return ResponseEntity.ok(userService.getUser(userId));
    }

    /** GET /api/users/{userId}/results */
    @GetMapping("/{userId}/results")
    public ResponseEntity<List<UserResultResponse>> getResults(@PathVariable Long userId, Authentication auth) {
        requireOwner(auth, userId);
        return ResponseEntity.ok(userService.getUserResults(userId));
    }

    /** GET /api/users/{userId}/recommendations */
    @GetMapping("/{userId}/recommendations")
    public ResponseEntity<List<TestResponse>> getRecommendations(@PathVariable Long userId, Authentication auth) {
        requireOwner(auth, userId);
        return ResponseEntity.ok(userService.getRecommendations(userId));
    }

    /** PATCH /api/users/{userId}/career-targets */
    @PatchMapping("/{userId}/career-targets")
    public ResponseEntity<UserResponse> updateCareerTargets(
            @PathVariable Long userId,
            @RequestBody CareerTargetsRequest request,
            Authentication auth) {
        requireOwner(auth, userId);
        return ResponseEntity.ok(userService.updateCareerTargets(userId, request));
    }

    /** GET /api/users/{userId}/preparation-path */
    @GetMapping("/{userId}/preparation-path")
    public ResponseEntity<PreparationPathResponse> getPreparationPath(@PathVariable Long userId, Authentication auth) {
        requireOwner(auth, userId);
        return ResponseEntity.ok(userService.getPreparationPath(userId));
    }

    /** GET /api/users/{userId}/recommended-tests */
    @GetMapping("/{userId}/recommended-tests")
    public ResponseEntity<List<TestResponse>> getRecommendedTests(@PathVariable Long userId, Authentication auth) {
        requireOwner(auth, userId);
        return ResponseEntity.ok(userService.getRecommendedTests(userId));
    }

    /** GET /api/users/{userId}/skills-summary */
    @GetMapping("/{userId}/skills-summary")
    public ResponseEntity<SkillsSummaryResponse> getSkillsSummary(@PathVariable Long userId, Authentication auth) {
        requireOwner(auth, userId);
        return ResponseEntity.ok(userService.getSkillsSummary(userId));
    }

    /**
     * Ensures the caller may only act on their own user record.
     * Admins may access any user; everyone else is restricted to their own id.
     */
    private void requireOwner(Authentication auth, Long userId) {
        Long authenticatedId = (Long) auth.getPrincipal();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin && !authenticatedId.equals(userId)) {
            throw new AccessDeniedException("You are not allowed to access this resource.");
        }
    }
}
