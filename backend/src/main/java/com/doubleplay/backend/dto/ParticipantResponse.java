package com.doubleplay.backend.dto;

import java.time.LocalDateTime;

public record ParticipantResponse(Long participantId, Long userId, String status, LocalDateTime requestedAt) {}
