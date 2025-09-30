package com.doubleplay.backend.controller;

import com.doubleplay.backend.dto.TransactionResponse;
import com.doubleplay.backend.dto.TransactionSummary;
import com.doubleplay.backend.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.doubleplay.backend.dto.TransactionCreateRequest;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService transactionService;

    @PostMapping("/transactions")
    public TransactionResponse create(@RequestBody TransactionCreateRequest req) {
        return transactionService.create(req);
    }

    @GetMapping("/meetups/{meetupId}/transactions")
    public List<TransactionSummary> list(@PathVariable Long meetupId) {
        return transactionService.list(meetupId);
    }

    @GetMapping("/transactions/{transactionId}")
    public TransactionResponse get(@PathVariable Long transactionId) {
        return transactionService.get(transactionId);
    }

    @DeleteMapping("/transactions/{transactionId}")
    public boolean delete(@PathVariable Long transactionId,
                          @RequestParam Long requesterId,
                          @RequestParam(defaultValue = "false") boolean isAdmin) {
        return transactionService.delete(transactionId, requesterId, isAdmin);
    }

    @GetMapping("/transactions")
    public List<TransactionSummary> listAll(@RequestParam(required = false) Long meetupId) {
        return transactionService.list(meetupId);
    }
}