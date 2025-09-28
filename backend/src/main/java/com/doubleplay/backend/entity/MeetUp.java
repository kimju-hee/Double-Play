package com.doubleplay.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "MeetUp")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MeetUp {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long meetupId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_user_id", nullable = false)
    private Users hostUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    private LocalDateTime createdAt;
    private LocalDate meetupDate;
    private Integer capacity;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private Status status;

    private LocalDateTime closedAt;

    @OneToMany(mappedBy = "meetup", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MeetingParticipant> participants;

    public enum Status {
        RECRUITING, CLOSED, ENDED
    }
}