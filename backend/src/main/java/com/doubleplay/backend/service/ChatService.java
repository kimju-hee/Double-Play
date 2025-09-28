package com.doubleplay.backend.service;

import com.doubleplay.backend.dto.ChatMessageResponse;
import com.doubleplay.backend.dto.ChatRoomCreateRequest;
import com.doubleplay.backend.dto.ChatRoomResponse;
import com.doubleplay.backend.entity.ChatMessage;
import com.doubleplay.backend.entity.ChatRoom;
import com.doubleplay.backend.repository.ChatMessageRepository;
import com.doubleplay.backend.repository.ChatRoomRepository;
import com.doubleplay.backend.repository.MeetUpRepository;
import com.doubleplay.backend.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.doubleplay.backend.dto.ChatMessageCreateRequest;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final MeetUpRepository meetUpRepository;
    private final UsersRepository usersRepository;

    public ChatRoomResponse createRoom(ChatRoomCreateRequest req) {
        var meetup = meetUpRepository.findById(req.meetupId()).orElseThrow();

        var existing = chatRoomRepository.findByMeetup_MeetupId(req.meetupId());
        if (!existing.isEmpty()) {
            var room = existing.get(0);
            return new ChatRoomResponse(room.getRoomId(), room.getMeetup().getMeetupId(), room.getCreatedAt());
        }

        var room = ChatRoom.builder()
                .meetup(meetup)
                .createdAt(LocalDateTime.now())
                .build();
        chatRoomRepository.save(room);
        return new ChatRoomResponse(room.getRoomId(), room.getMeetup().getMeetupId(), room.getCreatedAt());
    }

    public List<ChatRoomResponse> listRooms(Long meetupId) {
        return chatRoomRepository.findByMeetup_MeetupId(meetupId)
                .stream()
                .map(r -> new ChatRoomResponse(r.getRoomId(), r.getMeetup().getMeetupId(), r.getCreatedAt()))
                .toList();
    }

    public ChatRoomResponse getRoom(Long roomId) {
        var room = chatRoomRepository.findById(roomId).orElseThrow();
        return new ChatRoomResponse(room.getRoomId(), room.getMeetup().getMeetupId(), room.getCreatedAt());
    }

    public boolean deleteRoom(Long roomId, Long requesterId) {
        var room = chatRoomRepository.findById(roomId).orElseThrow();
        var hostId = room.getMeetup().getHostUser().getUserId();
        if (!hostId.equals(requesterId)) {
            return false;
        }
        chatRoomRepository.delete(room);
        return true;
    }

    public ChatMessageResponse sendMessage(Long roomId, ChatMessageCreateRequest req) {
        var room = chatRoomRepository.findById(roomId).orElseThrow();
        var sender = usersRepository.findById(req.senderUserId()).orElseThrow();
        var msg = ChatMessage.builder()
                .chatRoom(room)
                .user(sender)
                .content(req.content())
                .sendAt(LocalDateTime.now())
                .build();
        chatMessageRepository.save(msg);
        return new ChatMessageResponse(msg.getMessageId(), roomId, sender.getUserId(), msg.getContent(), msg.getSendAt());
    }

    public List<ChatMessageResponse> listMessages(Long roomId, Long before, int limit) {
        List<ChatMessage> msgs;
        if (before != null) {
            msgs = chatMessageRepository.findByChatRoom_RoomIdAndMessageIdLessThanOrderByMessageIdDesc(roomId, before);
        } else {
            msgs = chatMessageRepository.findTop20ByChatRoom_RoomIdOrderByMessageIdDesc(roomId);
        }
        return msgs.stream()
                .limit(limit)
                .map(m -> new ChatMessageResponse(m.getMessageId(), roomId, m.getUser().getUserId(), m.getContent(), m.getSendAt()))
                .toList();
    }
}
