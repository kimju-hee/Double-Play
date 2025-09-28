package com.doubleplay.backend.service;

import com.doubleplay.backend.dto.ParticipantCreateRequest;
import com.doubleplay.backend.dto.ParticipantResponse;
import com.doubleplay.backend.dto.ParticipantStatusUpdateRequest;
import com.doubleplay.backend.entity.MeetingParticipant;
import com.doubleplay.backend.repository.MeetUpRepository;
import com.doubleplay.backend.repository.MeetingParticipantRepository;
import com.doubleplay.backend.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MeetingParticipantService {
    private final MeetingParticipantRepository participantRepository;
    private final MeetUpRepository meetUpRepository;
    private final UsersRepository userRepository;

    public ParticipantResponse create(Long meetupId, ParticipantCreateRequest req) {
        var meetup = meetUpRepository.findById(meetupId).orElseThrow();
        var user = userRepository.findById(req.userId()).orElseThrow();

        var participant = MeetingParticipant.builder()
                .meetup(meetup)
                .user(user)
                .status(MeetingParticipant.Status.PENDING)
                .requestedAt(LocalDateTime.now())
                .build();

        participantRepository.save(participant);
        return new ParticipantResponse(
                participant.getParticipantId(),
                participant.getUser().getUserId(),
                participant.getStatus().name(),
                participant.getRequestedAt()
        );
    }

    public List<ParticipantResponse> list(Long meetupId) {
        return participantRepository.findByMeetup_MeetupId(meetupId)
                .stream()
                .map(p -> new ParticipantResponse(
                        p.getParticipantId(),
                        p.getUser().getUserId(),
                        p.getStatus().name(),
                        p.getRequestedAt()
                ))
                .toList();
    }

    public ParticipantResponse update(Long participantId, ParticipantStatusUpdateRequest req, Long requesterId) {
        var participant = participantRepository.findById(participantId).orElseThrow();
        var meetup = participant.getMeetup();

        if (!meetup.getHostUser().getUserId().equals(requesterId)) {
            throw new IllegalStateException("Only the host can update participant status.");
        }

        participant.setStatus(MeetingParticipant.Status.valueOf(req.status()));
        participantRepository.save(participant);

        return new ParticipantResponse(
                participant.getParticipantId(),
                participant.getUser().getUserId(),
                participant.getStatus().name(),
                participant.getRequestedAt()
        );
    }

    public boolean delete(Long participantId) {
        var participant = participantRepository.findById(participantId).orElseThrow();
        participantRepository.delete(participant);
        return true;
    }
}