package com.doubleplay.backend.repository;

import com.doubleplay.backend.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByChatRoom_RoomIdAndMessageIdLessThanOrderByMessageIdDesc(Long roomId, Long beforeId);
    List<ChatMessage> findTop20ByChatRoom_RoomIdOrderByMessageIdDesc(Long roomId); // limit fallback
}