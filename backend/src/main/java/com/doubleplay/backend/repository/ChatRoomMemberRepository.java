// src/main/java/com/doubleplay/backend/repository/ChatRoomMemberRepository.java
package com.doubleplay.backend.repository;

import com.doubleplay.backend.entity.ChatRoom;
import com.doubleplay.backend.entity.ChatRoomMember;
import com.doubleplay.backend.entity.ChatRoomMember.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatRoomMemberRepository extends JpaRepository<ChatRoomMember, Long> {
    Optional<ChatRoomMember> findByRoom_RoomIdAndUserId(Long roomId, Long userId);
    List<ChatRoomMember> findByRoom_RoomIdAndStatus(Long roomId, Status status);
    List<ChatRoomMember> findByRoom_RoomId(Long roomId);
}
