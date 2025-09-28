package com.doubleplay.backend.repository;

import com.doubleplay.backend.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    List<ChatRoom> findByMeetup_MeetupId(Long meetupId);
}