package com.doubleplay.backend.controller;

import com.doubleplay.backend.dto.GameDetail;
import com.doubleplay.backend.dto.GameSummary;
import com.doubleplay.backend.dto.ListResponse;
import com.doubleplay.backend.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/games")
@RequiredArgsConstructor
public class GameController {
    private final GameService gameService;

    @GetMapping
    public ResponseEntity<ListResponse<GameSummary>> list(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date,
            @RequestParam(required = false) Long teamId
    ) {
        return ResponseEntity.ok(gameService.list(date, teamId));
    }

    @GetMapping("/{gameId}")
    public ResponseEntity<GameDetail> get(@PathVariable Long gameId) {
        return ResponseEntity.ok(gameService.get(gameId));
    }
}