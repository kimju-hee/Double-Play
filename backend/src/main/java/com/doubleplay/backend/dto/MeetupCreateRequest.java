package com.doubleplay.backend.dto;

import java.time.LocalDate;

public record MeetupCreateRequest(Long hostUserId, Long gameId, LocalDate meetupDate,
                                  Integer capacity, String description) {}
