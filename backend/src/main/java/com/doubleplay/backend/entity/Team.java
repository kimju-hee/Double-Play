package com.doubleplay.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Teams")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long teamId;

    @Column(length = 50)
    private String teamName;

    @Column(length = 100)
    private String city;
}