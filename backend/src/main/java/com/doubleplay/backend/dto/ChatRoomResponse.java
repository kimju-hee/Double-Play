package com.doubleplay.backend.dto;

import java.time.LocalDateTime;

public record ChatRoomResponse(
        Long roomId,
        String title,
        Long creatorUserId,
        String creatorNickname,
        LocalDateTime createdAt
) {}
