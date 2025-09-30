package com.doubleplay.backend.controller;

import com.doubleplay.backend.dto.ChatMessageCreateRequest;
import com.doubleplay.backend.dto.ChatMessageResponse;
import com.doubleplay.backend.dto.ChatRoomCreateRequest;
import com.doubleplay.backend.dto.ChatRoomResponse;
import com.doubleplay.backend.dto.MemberInfo;
import com.doubleplay.backend.dto.ParticipantStatusResponse;
import com.doubleplay.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;

    private Long currentUserId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
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

    @GetMapping("/chatrooms")
    public Map<String, List<ChatRoomResponse>> listAll() {
        Long uid = currentUserId();
        if (uid == null) throw new org.springframework.security.access.AccessDeniedException("UNAUTHORIZED");
        return Map.of("items", chatService.listAllRooms(uid));
    }

    @GetMapping("/chatrooms/{roomId}")
    public ChatRoomResponse get(@PathVariable Long roomId) {
        Long uid = currentUserId();
        if (uid == null) throw new org.springframework.security.access.AccessDeniedException("UNAUTHORIZED");
        return chatService.getRoom(roomId, uid);
    }

    @PostMapping("/chatrooms")
    public ChatRoomResponse createRoom(@RequestBody ChatRoomCreateRequest req) {
        Long uid = currentUserId();
        if (uid == null) throw new IllegalArgumentException("인증 필요");
        return chatService.createRoom(req, uid);
    }


    @PostMapping("/chatrooms/{roomId}/join")
    public ParticipantStatusResponse requestJoin(@PathVariable Long roomId){
        Long uid = currentUserId();
        if (uid == null) throw new org.springframework.security.access.AccessDeniedException("UNAUTHORIZED");
        return chatService.requestJoin(roomId, uid);
    }

    @PutMapping("/chatrooms/{roomId}/members/{userId}/approve")
    public ParticipantStatusResponse approve(@PathVariable Long roomId, @PathVariable Long userId){
        Long uid = currentUserId();
        if (uid == null) throw new org.springframework.security.access.AccessDeniedException("UNAUTHORIZED");
        return chatService.approve(roomId, userId, uid, true);
    }

    @DeleteMapping("/chatrooms/{roomId}/members/{userId}")
    public Map<String,Boolean> kick(@PathVariable Long roomId, @PathVariable Long userId){
        Long uid = currentUserId();
        if (uid == null) throw new org.springframework.security.access.AccessDeniedException("UNAUTHORIZED");
        chatService.kick(roomId, userId, uid);
        return Map.of("success", true);
    }

    @PutMapping("/chatrooms/{roomId}/members/{userId}/ban")
    public Map<String,Boolean> ban(@PathVariable Long roomId, @PathVariable Long userId){
        Long uid = currentUserId();
        if (uid == null) throw new org.springframework.security.access.AccessDeniedException("UNAUTHORIZED");
        chatService.ban(roomId, userId, uid);
        return Map.of("success", true);
    }

    @GetMapping("/chatrooms/{roomId}/pending")
    public Map<String,List<MemberInfo>> pending(@PathVariable Long roomId){
        return Map.of("items", chatService.listPending(roomId));
    }

    @GetMapping("/chatrooms/{roomId}/members")
    public Map<String,List<MemberInfo>> members(@PathVariable Long roomId){
        return Map.of("items", chatService.listMembers(roomId));
    }

    @PostMapping("/chatrooms/{roomId}/messages")
    public ChatMessageResponse send(@PathVariable Long roomId, @RequestBody ChatMessageCreateRequest req){
        Long uid = currentUserId();
        if (uid == null) throw new org.springframework.security.access.AccessDeniedException("UNAUTHORIZED");
        return chatService.sendMessage(roomId, uid, req);
    }

    @GetMapping("/chatrooms/{roomId}/messages")
    public Map<String,List<ChatMessageResponse>> messages(@PathVariable Long roomId,
                                                          @RequestParam(required=false) Long before,
                                                          @RequestParam(defaultValue="20") int limit){
        return Map.of("items", chatService.listMessages(roomId, before, limit));
    }
}
