package com.doubleplay.backend.service;

import com.doubleplay.backend.dto.ListResponse;
import com.doubleplay.backend.dto.VenueDetail;
import com.doubleplay.backend.dto.VenueSummary;
import com.doubleplay.backend.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VenueService {
    private final VenueRepository venueRepository;

    public ListResponse<VenueSummary> list() {
        var items = venueRepository.findAll().stream()
                .map(v -> new VenueSummary(v.getVenueId(), v.getVenueName()))
                .toList();
        return new ListResponse<>(items);
    }

    public VenueDetail get(Long venueId) {
        var v = venueRepository.findById(venueId).orElseThrow();
        return new VenueDetail(v.getVenueId(), v.getVenueName());
    }
}