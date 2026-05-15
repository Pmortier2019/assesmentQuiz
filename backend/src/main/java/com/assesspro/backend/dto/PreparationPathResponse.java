package com.assesspro.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class PreparationPathResponse {
    private List<String> recommendedOrder;
    private List<String> focusAreas;
    private int estimatedPreparationDays;
    private String targetRole;
    private String targetIndustry;
    private String targetCompany;
}
