package com.assesspro.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class SkillsSummaryResponse {
    private int totalTests;
    private int avgScore;
    private List<SkillEntry> skills;

    @Data
    @Builder
    public static class SkillEntry {
        private String type;
        private int avgScore;
        private int count;
        private int lastScore;
        private String trend; // "up", "down", "stable"
    }
}
