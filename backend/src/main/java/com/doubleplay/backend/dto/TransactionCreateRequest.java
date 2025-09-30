package com.doubleplay.backend.dto;

public record TransactionCreateRequest(
        Long meetupId,
        Long userId,
        Long venueId,
        String title,
        Integer price
) {}
