package com.assesspro.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.util.List;

/**
 * Lightweight pagination envelope returned by the test library endpoint.
 * Mirrors the frontend's PaginatedResponse<T> shape so the client can read
 * data/page/pageSize/total/hasMore directly without translating Spring's Page.
 */
@Data
@Builder
@AllArgsConstructor
public class PagedResponse<T> {
    private List<T> data;
    private int page;
    private int pageSize;
    private long total;
    private boolean hasMore;
}
