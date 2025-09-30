package com.doubleplay.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Long transactionId;

    @Column(name = "meetup_id", nullable = false)
    private Long meetupId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "venue_id", nullable = false)
    private Long venueId;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "price", nullable = false)
    private Integer price;

    @Column(name = "traded_at", nullable = false)
    private LocalDateTime tradedAt;

    @PrePersist
    void onCreate() {
        if (tradedAt == null) tradedAt = LocalDateTime.now();
    }
}
