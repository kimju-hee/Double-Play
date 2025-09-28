package com.doubleplay.backend.controller;

import com.doubleplay.backend.dto.MeetupCreateRequest;
import com.doubleplay.backend.dto.MeetupCreateResponse;
import com.doubleplay.backend.dto.MeetupDetail;
import com.doubleplay.backend.service.MeetUpService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/meetups")
@RequiredArgsConstructor
public class MeetUpController {
    private final MeetUpService meetUpService;

    @PostMapping
    public ResponseEntity<MeetupCreateResponse> create(@RequestBody MeetupCreateRequest req) {
        return ResponseEntity.ok(meetUpService.create(req));
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> list(
            @RequestParam(required = false) Long gameId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        var items = meetUpService.list(gameId, date);
        return ResponseEntity.ok(Map.of("items", items));
    }

    @GetMapping("/{meetupId}")
    public ResponseEntity<MeetupDetail> get(@PathVariable Long meetupId) {
        return ResponseEntity.ok(meetUpService.get(meetupId));
    }

    @DeleteMapping("/{meetupId}")
    public ResponseEntity<Map<String, Boolean>> delete(
            @PathVariable Long meetupId,
            @RequestParam Long requesterId
    ) {
        boolean success = meetUpService.delete(meetupId, requesterId);
        return ResponseEntity.ok(Map.of("success", success));
    }
}