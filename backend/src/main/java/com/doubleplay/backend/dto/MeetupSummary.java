package com.doubleplay.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record MeetupSummary(Long meetupId, Long hostUserId, Long gameId,
                            Integer capacity, Integer participantsCount,
                            LocalDateTime createdAt, LocalDate meetupDate) {}
