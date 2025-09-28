package com.doubleplay.backend.dto;

public record TransactionCreateRequest(Long meetupId, Long userId, int price) {}
