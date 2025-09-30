package com.doubleplay.backend.dto;

import java.time.LocalDateTime;

public record ChatMessageResponse(Long messageId, Long roomId, Long senderUserId, String senderNickname, String content,  LocalDateTime sendAt) {}
