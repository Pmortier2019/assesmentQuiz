package com.assesspro.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LeaderboardEntry {
    private int rank;
    private String displayName;
    private int score;
    private String testTitle;
    private int timeTakenSeconds;
}
