package com.doubleplay.backend.dto;

import java.time.LocalDateTime;

public record TransactionResponse(Long transactionId, Long meetupId, Long userId, int price, LocalDateTime tradedAt) {}