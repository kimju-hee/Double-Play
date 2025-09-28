package com.doubleplay.backend.service;

import com.doubleplay.backend.dto.*;
import com.doubleplay.backend.entity.MeetUp;
import com.doubleplay.backend.repository.GameRepository;
import com.doubleplay.backend.repository.MeetUpRepository;
import com.doubleplay.backend.repository.MeetingParticipantRepository;
import com.doubleplay.backend.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MeetUpService {
    private final MeetUpRepository meetUpRepository;
    private final MeetingParticipantRepository participantRepository;
    private final UsersRepository userRepository;
    private final GameRepository gameRepository;

    public MeetupCreateResponse create(MeetupCreateRequest req) {
        var user = userRepository.findById(req.hostUserId()).orElseThrow();
        var game = gameRepository.findById(req.gameId()).orElseThrow();

        var meetup = MeetUp.builder()
                .hostUser(user)
                .game(game)
                .meetupDate(req.meetupDate())
                .capacity(req.capacity())
                .description(req.description())
                .status(MeetUp.Status.RECRUITING)
                .createdAt(LocalDateTime.now())
                .build();

        meetUpRepository.save(meetup);
        return new MeetupCreateResponse(meetup.getMeetupId());
    }

    public List<MeetupSummary> list(Long gameId, LocalDate date) {
        List<MeetUp> meetups;
        if (gameId != null && date != null) {
            meetups = meetUpRepository.findByGame_GameIdAndMeetupDate(gameId, date);
        } else if (gameId != null) {
            meetups = meetUpRepository.findByGame_GameId(gameId);
        } else if (date != null) {
            meetups = meetUpRepository.findByMeetupDate(date);
        } else {
            meetups = meetUpRepository.findAll();
        }

        return meetups.stream().map(m ->
                new MeetupSummary(
                        m.getMeetupId(),
                        m.getHostUser().getUserId(),
                        m.getGame().getGameId(),
                        m.getCapacity(),
                        m.getParticipants() == null ? 0 : m.getParticipants().size(),
                        m.getCreatedAt(),
                        m.getMeetupDate()
                )
        ).toList();
    }

    public MeetupDetail get(Long meetupId) {
        var m = meetUpRepository.findById(meetupId).orElseThrow();
        var participants = participantRepository.findByMeetup_MeetupId(meetupId)
                .stream()
                .map(p -> new ParticipantDto(p.getParticipantId(),
                        p.getUser().getUserId(),
                        p.getStatus().name()))
                .toList();

        return new MeetupDetail(
                m.getMeetupId(),
                m.getHostUser().getUserId(),
                m.getGame().getGameId(),
                m.getCapacity(),
                m.getDescription(),
                m.getCreatedAt(),
                m.getMeetupDate(),
                participants
        );
    }

    public boolean delete(Long meetupId, Long requesterId) {
        var m = meetUpRepository.findById(meetupId).orElseThrow();
        if (!m.getHostUser().getUserId().equals(requesterId)) {
            return false;
        }
        meetUpRepository.delete(m);
        return true;
    }
}