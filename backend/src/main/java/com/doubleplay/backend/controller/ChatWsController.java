package com.doubleplay.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.Map;

@Controller
@RequiredArgsConstructor
public class ChatWsController {
    private final SimpMessagingTemplate template;

    public static record ChatSendPayload(Long roomId, String content, Long senderId, String senderName) {}

    @MessageMapping("/chat.sendMessage")
    public void send(ChatSendPayload p, Principal principal) {
        var now = java.time.LocalDateTime.now().toString();
        var out = Map.of("roomId", p.roomId(), "content", p.content(), "sender", p.senderName()!=null?p.senderName():"user", "at", now);
        template.convertAndSend("/topic/chatroom." + p.roomId(), out);
    }
}