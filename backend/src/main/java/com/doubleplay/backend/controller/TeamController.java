package com.doubleplay.backend.controller;

import com.doubleplay.backend.dto.ListResponse;
import com.doubleplay.backend.dto.TeamDetail;
import com.doubleplay.backend.dto.TeamSummary;
import com.doubleplay.backend.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {
    private final TeamService teamService;

    @GetMapping
    public ResponseEntity<ListResponse<TeamSummary>> list() {
        return ResponseEntity.ok(teamService.list());
    }

    @GetMapping("/{teamId}")
    public ResponseEntity<TeamDetail> get(@PathVariable Long teamId) {
        return ResponseEntity.ok(teamService.get(teamId));
    }
}
