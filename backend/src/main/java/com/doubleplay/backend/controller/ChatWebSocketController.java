package com.doubleplay.backend.controller;

import com.doubleplay.backend.dto.ChatMessageCreateRequest;
import com.doubleplay.backend.dto.ChatMessageRequest;
import com.doubleplay.backend.dto.ChatMessageResponse;
import com.doubleplay.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final ChatService chatService;

    @MessageMapping("/chatrooms/{roomId}/messages")
    @SendTo("/topic/chatrooms/{roomId}")
    public ChatMessageResponse send(@DestinationVariable Long roomId, @Payload ChatMessageRequest payload) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long uid = resolveUserId(auth);
        return chatService.sendMessage(roomId, uid, new ChatMessageCreateRequest(payload.content()));
    }

    private Long resolveUserId(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) return null;
        Object p = auth.getPrincipal();
        if (p instanceof Long l) return l;
        if (p instanceof org.springframework.security.core.userdetails.UserDetails ud) {
            try { return Long.parseLong(ud.getUsername()); } catch (NumberFormatException ignored) {}
        }
        try {
            Class<?> jwtCls = Class.forName("org.springframework.security.oauth2.jwt.Jwt");
            if (jwtCls.isInstance(p)) {
                Object jwt = p;
                Object claim = jwtCls.getMethod("getClaim", String.class).invoke(jwt, "userId");
                if (claim instanceof Number n) return n.longValue();
                if (claim instanceof String s) { try { return Long.parseLong(s); } catch (NumberFormatException ignored) {} }
                String sub = (String) jwtCls.getMethod("getSubject").invoke(jwt);
                try { return Long.parseLong(sub); } catch (NumberFormatException ignored) {}
            }
        } catch (ClassNotFoundException e) {
        } catch (Exception ignored) {
        }
        if (p instanceof String s) {
            try { return Long.parseLong(s); } catch (NumberFormatException ignored) {}
        }
        try {
            Class<?> cls = Class.forName("com.doubleplay.backend.security.UserPrincipal");
            if (cls.isInstance(p)) {
                Object v = cls.getMethod("getId").invoke(p);
                if (v instanceof Number n) return n.longValue();
            }
        } catch (Exception ignored) {
        }
        return null;
    }
}
