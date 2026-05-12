package com.assesspro.backend.controller;

import com.assesspro.backend.dto.TestResponse;
import com.assesspro.backend.dto.UserResponse;
import com.assesspro.backend.dto.UserResultResponse;
import com.assesspro.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

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
}
