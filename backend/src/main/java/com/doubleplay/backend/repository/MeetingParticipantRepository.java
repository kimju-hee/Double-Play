package com.doubleplay.backend.repository;

import com.doubleplay.backend.entity.MeetingParticipant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MeetingParticipantRepository extends JpaRepository<MeetingParticipant, Long> {
    List<MeetingParticipant> findByMeetup_MeetupId(Long meetupId);
}