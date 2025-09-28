package com.doubleplay.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record MeetupDetail(Long meetupId, Long hostUserId, Long gameId,
                           Integer capacity, String description,
                           LocalDateTime createdAt, LocalDate meetupDate,
                           List<ParticipantDto> participants) {}
