package com.assesspro.backend.dto;

import com.assesspro.backend.entity.enums.MediaType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QuestionMediaResponse {
    private Long id;
    private MediaType mediaType;
    private String url;
    private String altText;
    private String caption;
}
