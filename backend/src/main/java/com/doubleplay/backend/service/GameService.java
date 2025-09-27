package com.doubleplay.backend.service;

import com.doubleplay.backend.dto.GameDetail;
import com.doubleplay.backend.dto.GameSummary;
import com.doubleplay.backend.dto.ListResponse;
import com.doubleplay.backend.dto.VenueDetail;
import com.doubleplay.backend.repository.GameRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class GameService {
    private final GameRepository gameRepository;

    public ListResponse<GameSummary> list(LocalDate date, Long teamId) {
        LocalDateTime start = (date == null) ? null : date.atStartOfDay();
        LocalDateTime end = (date == null) ? null : date.plusDays(1).atStartOfDay();
        var items = gameRepository.search(start, end, teamId).stream()
                .map(g -> new GameSummary(
                        g.getGameId(),
                        g.getDate(),
                        g.getHomeTeam().getTeamId(),
                        g.getAwayTeam().getTeamId(),
                        g.getVenue().getVenueId()
                ))
                .toList();
        return new ListResponse<>(items);
    }

    public GameDetail get(Long gameId) {
        var g = gameRepository.findById(gameId).orElseThrow();
        var vd = new VenueDetail(g.getVenue().getVenueId(), g.getVenue().getVenueName());
        return new GameDetail(
                g.getGameId(),
                g.getDate(),
                g.getHomeTeam().getTeamId(),
                g.getAwayTeam().getTeamId(),
                vd
        );
    }
}