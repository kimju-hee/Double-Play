package com.doubleplay.backend.dto;

import java.time.LocalDateTime;

public record TransactionSummary(
        Long transactionId,
        String title,
        Integer price,
        Long venueId,
        String tradedAt
) {}
