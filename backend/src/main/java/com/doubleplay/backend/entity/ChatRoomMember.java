// src/main/java/com/doubleplay/backend/entity/ChatRoomMember.java
package com.doubleplay.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Table(name = "chat_room_member",
        uniqueConstraints = @UniqueConstraint(columnNames = {"room_id","user_id"}))
public class ChatRoomMember {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name="room_id", nullable=false)
    private ChatRoom room;

    @Column(name="user_id", nullable=false)
    private Long userId;

    @Enumerated(EnumType.STRING) @Column(nullable=false, length=16)
    private Role role;      // OWNER, MODERATOR, MEMBER

    @Enumerated(EnumType.STRING) @Column(nullable=false, length=16)
    private Status status;  // APPROVED, PENDING, BANNED

    @Column(nullable=false) private LocalDateTime joinedAt;

    @PrePersist void onCreate(){ if (joinedAt==null) joinedAt = LocalDateTime.now(); }

    public enum Role { OWNER, MODERATOR, MEMBER }
    public enum Status { APPROVED, PENDING, BANNED }
}
