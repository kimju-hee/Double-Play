package com.doubleplay.backend.controller;

import com.doubleplay.backend.dto.*;
import com.doubleplay.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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

    @MessageMapping("/chatroom/{roomId}/send")
    @SendTo("/topic/chatroom/{roomId}")
    public ChatMessageResponse send(@DestinationVariable Long roomId, ChatMessageRequest req) {
        return new ChatMessageResponse(
                null,
                roomId,
                req.senderUserId(),
                req.content(),
                LocalDateTime.now()
        );
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