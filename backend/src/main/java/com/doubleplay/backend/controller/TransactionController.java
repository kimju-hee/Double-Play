package com.doubleplay.backend.controller;

import com.doubleplay.backend.dto.TransactionResponse;
import com.doubleplay.backend.dto.TransactionSummary;
import com.doubleplay.backend.dto.TransactionCreateRequest;
import com.doubleplay.backend.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService transactionService;

    private Long currentUserId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return null;
        Object p = auth.getPrincipal();

        if (p instanceof Long l) return l;

        if (p instanceof org.springframework.security.core.userdetails.UserDetails ud) {
            try { return Long.parseLong(ud.getUsername()); } catch (NumberFormatException ignored) {}
        }

        try {
            Class<?> jwtCls = Class.forName("org.springframework.security.oauth2.jwt.Jwt");
            if (jwtCls.isInstance(p)) {
                Object jwt = p;
                Object claim = jwtCls.getMethod("getClaim", String.class).invoke(jwt, "userId");
                if (claim instanceof Number n) return n.longValue();
                if (claim instanceof String s) { try { return Long.parseLong(s); } catch (NumberFormatException ignored) {} }
                String sub = (String) jwtCls.getMethod("getSubject").invoke(jwt);
                try { return Long.parseLong(sub); } catch (NumberFormatException ignored) {}
            }
        } catch (ClassNotFoundException e) {
        } catch (Exception ignored) {}

        if (p instanceof String s) {
            try { return Long.parseLong(s); } catch (NumberFormatException ignored) {}
        }

        try {
            Class<?> cls = Class.forName("com.doubleplay.backend.security.UserPrincipal");
            if (cls.isInstance(p)) {
                Object v = cls.getMethod("getId").invoke(p);
                if (v instanceof Number n) return n.longValue();
            }
        } catch (Exception ignored) {}
        return null;
    }

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

    @PutMapping("/transactions/{id}/complete")
    public Map<String, Object> complete(@PathVariable Long id) {
        Long uid = currentUserId();
        if (uid == null) throw new org.springframework.security.access.AccessDeniedException("UNAUTHORIZED");
        transactionService.complete(id, uid); // 내부에서 seller 권한 체크
        return Map.of("success", true, "status", "COMPLETED");
    }
}
