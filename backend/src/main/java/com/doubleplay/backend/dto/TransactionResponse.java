package com.doubleplay.backend.dto;

public record TransactionResponse(
        Long transactionId,
        Long meetupId,
        Long userId,
        String title,
        Integer price,
        Long venueId,
        String tradedAt
) {}
