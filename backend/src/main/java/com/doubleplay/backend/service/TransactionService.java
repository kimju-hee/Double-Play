package com.doubleplay.backend.service;

import com.doubleplay.backend.dto.TransactionCreateRequest;
import com.doubleplay.backend.dto.TransactionResponse;
import com.doubleplay.backend.dto.TransactionSummary;
import com.doubleplay.backend.entity.Transaction;
import com.doubleplay.backend.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;

    @Transactional
    public TransactionResponse create(TransactionCreateRequest req) {
        Transaction tx = Transaction.builder()
                .meetupId(req.meetupId())
                .userId(req.userId())
                .venueId(req.venueId())
                .title(req.title())
                .price(req.price())
                .build();

        tx = transactionRepository.save(tx);
        return toResponse(tx);
    }

    @Transactional(readOnly = true)
    public TransactionResponse get(Long transactionId) {
        Transaction tx = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new IllegalArgumentException("거래를 찾을 수 없습니다: " + transactionId));
        return toResponse(tx);
    }

    private static TransactionResponse toResponse(Transaction tx) {
        return new TransactionResponse(
                tx.getTransactionId(),
                tx.getMeetupId(),
                tx.getUserId(),
                tx.getTitle(),
                tx.getPrice(),
                tx.getVenueId(),
                tx.getTradedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
        );
    }

    @Transactional(readOnly = true)
    public List<TransactionSummary> list(Long meetupId) {
        List<Transaction> rows = (meetupId != null)
                ? transactionRepository.findByMeetupIdOrderByTransactionIdDesc(meetupId)
                : transactionRepository.findAllByOrderByTransactionIdDesc();

        return rows.stream()
                .map(tx -> new TransactionSummary(
                        tx.getTransactionId(),
                        tx.getTitle(),
                        tx.getPrice(),
                        tx.getVenueId(),
                        tx.getTradedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                ))
                .toList();
    }

    @Transactional
    public boolean delete(Long transactionId, Long requesterId, boolean isAdmin) {
        Transaction tx = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new IllegalArgumentException("거래를 찾을 수 없습니다: " + transactionId));

        if (!isAdmin && (requesterId == null || !requesterId.equals(tx.getUserId()))) {
            throw new IllegalStateException("삭제 권한이 없습니다.");
        }

        transactionRepository.deleteById(transactionId);
        return true;
    }
}
