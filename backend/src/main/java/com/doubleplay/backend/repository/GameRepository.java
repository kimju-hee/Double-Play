package com.doubleplay.backend.repository;

import com.doubleplay.backend.entity.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface GameRepository extends JpaRepository<Game, Long> {
    @Query("""
        select g from Game g
        where (:start is null or g.date >= :start)
          and (:end   is null or g.date <  :end)
          and (:teamId is null or g.homeTeam.teamId = :teamId or g.awayTeam.teamId = :teamId)
        order by g.date asc
    """)
    List<Game> search(LocalDateTime start, LocalDateTime end, Long teamId);
}