package com.doubleplay.backend.controller;

import com.doubleplay.backend.entity.Venue;
import com.doubleplay.backend.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class VenueController {
    private final VenueRepository venueRepository;

    @GetMapping("/venues")
    public Map<String, Object> list() {
        List<Venue> items = venueRepository.findAll(Sort.by(Sort.Direction.ASC, "venueId"));
        return Map.of("items", items);
    }

    @GetMapping("/venues/{venueId}")
    public Venue get(@PathVariable Long venueId) {
        return venueRepository.findById(venueId).orElseThrow();
    }
}
