package com.doubleplay.backend.service;

import com.doubleplay.backend.dto.*;
import com.doubleplay.backend.entity.ChatMessage;
import com.doubleplay.backend.entity.ChatRoom;
import com.doubleplay.backend.entity.ChatRoomMember;
import com.doubleplay.backend.entity.ChatRoomMember.Role;
import com.doubleplay.backend.entity.ChatRoomMember.Status;
import com.doubleplay.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomMemberRepository memberRepository;
    private final UsersRepository usersRepository;

    private String nicknameOf(Long userId) {
        return usersRepository.findById(userId).map(u -> u.getNickname()).orElse("User#" + userId);
    }

    public ChatRoomResponse createRoom(ChatRoomCreateRequest req, Long uid) {
        var room = ChatRoom.builder()
                .title(req.title())
                .transactionId(req.transactionId())
                .createdByUserId(uid)
                .createdAt(LocalDateTime.now())
                .build();
        chatRoomRepository.save(room);

        var owner = ChatRoomMember.builder()
                .room(room).userId(uid)
                .role(Role.OWNER).status(Status.APPROVED)
                .build();
        memberRepository.save(owner);

        return new ChatRoomResponse(
                room.getRoomId(),
                room.getTitle(),
                room.getCreatedByUserId(),
                nicknameOf(room.getCreatedByUserId()),
                room.getCreatedAt()
        );
    }

    public List<ChatRoomResponse> listAllRooms() {
        return chatRoomRepository.findAll().stream()
                .map(r -> new ChatRoomResponse(r.getRoomId(), r.getTitle(),
                        r.getCreatedByUserId(), nicknameOf(r.getCreatedByUserId()), r.getCreatedAt()))
                .toList();
    }

    public ChatRoomResponse getRoom(Long roomId) {
        var r = chatRoomRepository.findById(roomId).orElseThrow();
        return new ChatRoomResponse(r.getRoomId(), r.getTitle(),
                r.getCreatedByUserId(), nicknameOf(r.getCreatedByUserId()), r.getCreatedAt());
    }

    public ParticipantStatusResponse requestJoin(Long roomId, Long userId) {
        var room = chatRoomRepository.findById(roomId).orElseThrow();
        var existing = memberRepository.findByRoom_RoomIdAndUserId(roomId, userId).orElse(null);
        if (existing != null) {
            if (existing.getStatus() == Status.BANNED) throw new IllegalStateException("BANNED");
            if (existing.getStatus() == Status.APPROVED) return new ParticipantStatusResponse("APPROVED");
            return new ParticipantStatusResponse("PENDING");
        }
        var m = ChatRoomMember.builder()
                .room(room).userId(userId)
                .role(Role.MEMBER).status(Status.PENDING).build();
        memberRepository.save(m);
        return new ParticipantStatusResponse("PENDING");
    }

    public ParticipantStatusResponse approve(Long roomId, Long targetUserId, Long approverId, boolean approve) {
        mustBeModerator(roomId, approverId);
        var m = memberRepository.findByRoom_RoomIdAndUserId(roomId, targetUserId).orElseThrow();
        if (approve) m.setStatus(Status.APPROVED);
        else m.setStatus(Status.PENDING);
        memberRepository.save(m);
        return new ParticipantStatusResponse(m.getStatus().name());
    }

    public void kick(Long roomId, Long targetUserId, Long byUserId) {
        mustBeModerator(roomId, byUserId);
        memberRepository.findByRoom_RoomIdAndUserId(roomId, targetUserId).ifPresent(memberRepository::delete);
    }

    public void ban(Long roomId, Long targetUserId, Long byUserId) {
        mustBeModerator(roomId, byUserId);
        var m = memberRepository.findByRoom_RoomIdAndUserId(roomId, targetUserId)
                .orElseGet(() -> ChatRoomMember.builder()
                        .room(chatRoomRepository.findById(roomId).orElseThrow())
                        .userId(targetUserId).role(Role.MEMBER).build());
        m.setStatus(Status.BANNED);
        memberRepository.save(m);
    }

    public ChatMessageResponse sendMessage(Long roomId, Long senderUserId, ChatMessageCreateRequest req) {
        ensureApproved(roomId, senderUserId);
        var room = chatRoomRepository.findById(roomId).orElseThrow();
        var msg = ChatMessage.builder()
                .chatRoom(room)
                .senderUserId(senderUserId)
                .content(req.content())
                .sendAt(LocalDateTime.now())
                .build();
        chatMessageRepository.save(msg);
        return new ChatMessageResponse(
                msg.getMessageId(), roomId, msg.getSenderUserId(),
                nicknameOf(msg.getSenderUserId()), msg.getContent(), msg.getSendAt()
        );
    }

    public List<ChatMessageResponse> listMessages(Long roomId, Long before, int limit) {
        var msgs = (before != null)
                ? chatMessageRepository.findByChatRoom_RoomIdAndMessageIdLessThanOrderByMessageIdDesc(roomId, before)
                : chatMessageRepository.findTop20ByChatRoom_RoomIdOrderByMessageIdDesc(roomId);
        return msgs.stream().limit(limit)
                .map(m -> new ChatMessageResponse(m.getMessageId(), roomId,
                        m.getSenderUserId(), nicknameOf(m.getSenderUserId()),
                        m.getContent(), m.getSendAt()))
                .toList();
    }

    private void mustBeModerator(Long roomId, Long userId) {
        var m = memberRepository.findByRoom_RoomIdAndUserId(roomId, userId).orElseThrow(() -> new IllegalStateException("NOT_MEMBER"));
        if (!(m.getRole() == Role.OWNER || m.getRole() == Role.MODERATOR)) throw new IllegalStateException("FORBIDDEN");
    }

    private void ensureApproved(Long roomId, Long userId) {
        var m = memberRepository.findByRoom_RoomIdAndUserId(roomId, userId).orElseThrow(() -> new IllegalStateException("NOT_MEMBER"));
        if (m.getStatus() != Status.APPROVED) throw new IllegalStateException("PENDING_OR_BANNED");
    }

    public List<MemberInfo> listPending(Long roomId) {
        return memberRepository.findByRoom_RoomIdAndStatus(roomId, ChatRoomMember.Status.PENDING)
                .stream()
                .map(m -> new MemberInfo(
                        m.getUserId(),
                        nicknameOf(m.getUserId()),
                        m.getRole().name(),
                        m.getStatus().name()))
                .toList();
    }

    public List<MemberInfo> listMembers(Long roomId) {
        return memberRepository.findByRoom_RoomId(roomId)
                .stream()
                .map(m -> new MemberInfo(
                        m.getUserId(),
                        nicknameOf(m.getUserId()),
                        m.getRole().name(),
                        m.getStatus().name()))
                .toList();
    }

}
