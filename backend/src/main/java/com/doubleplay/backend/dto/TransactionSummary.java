package com.doubleplay.backend.dto;

import java.time.LocalDateTime;

public record TransactionSummary(Long transactionId, Long userId, int price, LocalDateTime tradedAt) {}