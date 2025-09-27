package com.doubleplay.backend.dto;

import java.time.LocalDateTime;

public record GameSummary(Long gameId, LocalDateTime date, Long homeTeam, Long awayTeam, Long venueId) {}
