package com.doubleplay.backend.dto;

public record ChatMessageCreateRequest(Long senderUserId, String content) {}
