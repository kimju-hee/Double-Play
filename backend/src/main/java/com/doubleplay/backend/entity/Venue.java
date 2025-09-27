package com.doubleplay.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Venue")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Venue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long venueId;

    @Column(length = 100)
    private String venueName;
}