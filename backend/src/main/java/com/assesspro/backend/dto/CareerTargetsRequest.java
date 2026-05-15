package com.assesspro.backend.dto;

import lombok.Data;

@Data
public class CareerTargetsRequest {
    private String targetRole;
    private String targetIndustry;
    private String targetCompany;
}
