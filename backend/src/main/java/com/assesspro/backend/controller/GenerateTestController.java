package com.assesspro.backend.controller;

import com.assesspro.backend.service.AiTestGenerationService;
import com.assesspro.backend.service.TestService;
import com.assesspro.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/generate")
@RequiredArgsConstructor
public class GenerateTestController {

    private final UserService userService;
    private final AiTestGenerationService aiTestGenerationService;
    private final TestService testService;

    /** POST /api/generate/test/{userId} */
    @PostMapping("/test/{userId}")
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
