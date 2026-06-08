package com.assesspro.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Full machine-readable copy of a user's personal data (GDPR art. 15 — right of
 * access). Returned by {@code GET /api/users/{userId}/export}.
 */
@Data
@Builder
public class UserDataExportResponse {
    private LocalDateTime exportedAt;
    private UserResponse profile;
    private String subscriptionStatus;
    private List<UserResultResponse> testResults;
}
