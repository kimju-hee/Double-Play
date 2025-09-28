package com.doubleplay.backend.controller;

import com.doubleplay.backend.dto.ChatMessageCreateRequest;
import com.doubleplay.backend.dto.ChatMessageResponse;
import com.doubleplay.backend.dto.ChatRoomCreateRequest;
import com.doubleplay.backend.dto.ChatRoomResponse;
import com.doubleplay.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;

    @PostMapping("/chatrooms")
    public ChatRoomResponse createRoom(@RequestBody ChatRoomCreateRequest req) {
        return chatService.createRoom(req);
    }

    @GetMapping("/meetups/{meetupId}/chatrooms")
    public Map<String, List<ChatRoomResponse>> listRooms(@PathVariable Long meetupId) {
        return Map.of("items", chatService.listRooms(meetupId));
    }

    @GetMapping("/chatrooms/{roomId}")
    public ChatRoomResponse getRoom(@PathVariable Long roomId) {
        return chatService.getRoom(roomId);
    }

    @DeleteMapping("/chatrooms/{roomId}")
    public Map<String, Boolean> deleteRoom(@PathVariable Long roomId, @RequestParam Long requesterId) {
        return Map.of("success", chatService.deleteRoom(roomId, requesterId));
    }

    @PostMapping("/chatrooms/{roomId}/messages")
    public ChatMessageResponse sendMessage(@PathVariable Long roomId, @RequestBody ChatMessageCreateRequest req) {
        return chatService.sendMessage(roomId, req);
    }

    @GetMapping("/chatrooms/{roomId}/messages")
    public Map<String, List<ChatMessageResponse>> listMessages(
            @PathVariable Long roomId,
            @RequestParam(required = false) Long before,
            @RequestParam(defaultValue = "20") int limit
    ) {
        return Map.of("items", chatService.listMessages(roomId, before, limit));
    }
}