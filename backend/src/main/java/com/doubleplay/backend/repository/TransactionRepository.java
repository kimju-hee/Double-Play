package com.doubleplay.backend.repository;

import com.doubleplay.backend.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByMeetupIdOrderByTransactionIdDesc(Long meetupId);
    List<Transaction> findAllByOrderByTransactionIdDesc();
}
