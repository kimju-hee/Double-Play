package com.doubleplay.backend.dto;

import java.time.LocalDateTime;

public record GameDetail(Long gameId, LocalDateTime date, Long homeTeam, Long awayTeam,
                         VenueDetail venue) {}