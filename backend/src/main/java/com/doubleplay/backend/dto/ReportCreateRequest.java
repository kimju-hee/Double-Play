package com.doubleplay.backend.dto;

public record ReportCreateRequest(String targetType, Long targetId, String reason, Long reporterId) {}
