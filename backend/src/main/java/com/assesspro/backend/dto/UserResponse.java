package com.assesspro.backend.dto;

import com.assesspro.backend.entity.enums.Language;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String email;
    private String name;
    private Language preferredLanguage;
    private int freeTestsUsed;
    private int streak;
    @JsonProperty("isPro")
    private boolean isPro;
    @JsonProperty("isAdmin")
    private boolean isAdmin;
    private LocalDateTime createdAt;
    private String targetRole;
    private String targetIndustry;
    private String targetCompany;
}
