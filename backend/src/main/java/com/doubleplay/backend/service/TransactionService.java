package com.doubleplay.backend.service;

import com.doubleplay.backend.dto.TransactionCreateRequest;
import com.doubleplay.backend.dto.TransactionResponse;
import com.doubleplay.backend.dto.TransactionSummary;
import com.doubleplay.backend.entity.Transaction;
import com.doubleplay.backend.repository.MeetUpRepository;
import com.doubleplay.backend.repository.TransactionRepository;
import com.doubleplay.backend.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final MeetUpRepository meetUpRepository;
    private final UsersRepository usersRepository;

    public TransactionResponse create(TransactionCreateRequest req) {
        var meetup = meetUpRepository.findById(req.meetupId()).orElseThrow();
        var user = usersRepository.findById(req.userId()).orElseThrow();

        var tx = Transaction.builder()
                .meetup(meetup)
                .user(user)
                .price(req.price())
                .tradedAt(LocalDateTime.now())
                .build();
        transactionRepository.save(tx);

        return new TransactionResponse(tx.getTransactionId(), meetup.getMeetupId(), user.getUserId(), tx.getPrice(), tx.getTradedAt());
    }

    public List<TransactionSummary> list(Long meetupId) {
        return transactionRepository.findByMeetup_MeetupId(meetupId).stream()
                .map(tx -> new TransactionSummary(tx.getTransactionId(), tx.getUser().getUserId(), tx.getPrice(), tx.getTradedAt()))
                .toList();
    }

    public TransactionResponse get(Long transactionId) {
        var tx = transactionRepository.findById(transactionId).orElseThrow();
        return new TransactionResponse(tx.getTransactionId(), tx.getMeetup().getMeetupId(), tx.getUser().getUserId(), tx.getPrice(), tx.getTradedAt());
    }

    public boolean delete(Long transactionId, Long requesterId, boolean isAdmin) {
        var tx = transactionRepository.findById(transactionId).orElseThrow();
        if (!isAdmin && !tx.getUser().getUserId().equals(requesterId)) {
            return false;
        }
        transactionRepository.delete(tx);
        return true;
    }
}