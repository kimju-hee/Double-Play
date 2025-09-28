package com.doubleplay.backend.controller;

import com.doubleplay.backend.dto.ParticipantCreateRequest;
import com.doubleplay.backend.dto.ParticipantResponse;
import com.doubleplay.backend.dto.ParticipantStatusUpdateRequest;
import com.doubleplay.backend.service.MeetingParticipantService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MeetingParticipantController {
    private final MeetingParticipantService participantService;

    @PostMapping("/meetups/{meetupId}/participants")
    public ParticipantResponse create(@PathVariable Long meetupId, @RequestBody ParticipantCreateRequest req) {
        return participantService.create(meetupId, req);
    }

    @GetMapping("/meetups/{meetupId}/participants")
    public Map<String, List<ParticipantResponse>> list(@PathVariable Long meetupId) {
        return Map.of("items", participantService.list(meetupId));
    }

    @PutMapping("/participants/{participantId}")
    public ParticipantResponse update(
            @PathVariable Long participantId,
            @RequestParam Long requesterId,
            @RequestBody ParticipantStatusUpdateRequest req
    ) {
        return participantService.update(participantId, req, requesterId);
    }

        @DeleteMapping("/participants/{participantId}")
    public Map<String, Boolean> delete(@PathVariable Long participantId) {
        return Map.of("success", participantService.delete(participantId));
    }
}
