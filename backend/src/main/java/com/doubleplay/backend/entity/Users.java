package com.doubleplay.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Users {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false, length = 60)
    private String nickname;

    @Column(length = 1)
    private String gender;

    @Column(length = 20)
    private String oauthProvider;

    @Column(length = 20)
    private String role;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.role = this.role == null ? "USER" : this.role;
        this.createdAt = LocalDateTime.now();
    }
}