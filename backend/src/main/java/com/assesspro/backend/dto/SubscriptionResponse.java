package com.assesspro.backend.dto;

import com.assesspro.backend.entity.enums.SubscriptionStatus;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class SubscriptionResponse {
    private Long id;
    private Long userId;
    private SubscriptionStatus status;
    private String plan;
    private LocalDateTime startedAt;
    private LocalDateTime expiresAt;
    @JsonProperty("isPro")
    private boolean isPro;
}
