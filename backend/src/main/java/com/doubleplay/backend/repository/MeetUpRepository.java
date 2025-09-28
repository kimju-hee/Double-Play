package com.doubleplay.backend.repository;

import com.doubleplay.backend.entity.MeetUp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface MeetUpRepository extends JpaRepository<MeetUp, Long> {
    List<MeetUp> findByGame_GameId(Long gameId);
    List<MeetUp> findByMeetupDate(LocalDate date);
    List<MeetUp> findByGame_GameIdAndMeetupDate(Long gameId, LocalDate date);
}