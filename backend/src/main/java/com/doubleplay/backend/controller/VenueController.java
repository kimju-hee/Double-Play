package com.doubleplay.backend.controller;

import com.doubleplay.backend.dto.ListResponse;
import com.doubleplay.backend.dto.VenueDetail;
import com.doubleplay.backend.dto.VenueSummary;
import com.doubleplay.backend.service.VenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/venues")
@RequiredArgsConstructor
public class VenueController {
    private final VenueService venueService;

    @GetMapping
    public ResponseEntity<ListResponse<VenueSummary>> list() {
        return ResponseEntity.ok(venueService.list());
    }

    @GetMapping("/{venueId}")
    public ResponseEntity<VenueDetail> get(@PathVariable Long venueId) {
        return ResponseEntity.ok(venueService.get(venueId));
    }
}