package com.doubleplay.backend.dto;

import java.time.LocalDateTime;

public record ChatRoomResponse(Long roomId, Long meetupId, LocalDateTime createdAt) {}
