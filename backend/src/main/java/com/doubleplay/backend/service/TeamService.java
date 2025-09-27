package com.doubleplay.backend.service;

import com.doubleplay.backend.dto.ListResponse;
import com.doubleplay.backend.dto.TeamDetail;
import com.doubleplay.backend.dto.TeamSummary;
import com.doubleplay.backend.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TeamService {
    private final TeamRepository teamRepository;

    public ListResponse<TeamSummary> list() {
        var items = teamRepository.findAll().stream()
                .map(t -> new TeamSummary(t.getTeamId(), t.getTeamName(), t.getCity()))
                .toList();
        return new ListResponse<>(items);
    }

    public TeamDetail get(Long teamId) {
        var t = teamRepository.findById(teamId).orElseThrow();
        return new TeamDetail(t.getTeamId(), t.getTeamName(), t.getCity());
    }
}