package com.doubleplay.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Venue")
public class Venue {
    @Id
    @Column(name = "venue_id")
    private Long venueId;

    @Column(name = "venue_name", nullable = false, length = 200)
    private String venueName;
}
