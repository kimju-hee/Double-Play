package com.doubleplay.backend.dto;

import java.time.LocalDateTime;

public record ReportResponse(Long reportId, String targetType, Long targetId,                             String reason, Long reporterId, LocalDateTime reportedAt) {}
