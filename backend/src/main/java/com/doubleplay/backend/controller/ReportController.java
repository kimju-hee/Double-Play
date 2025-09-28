package com.doubleplay.backend.controller;

import com.doubleplay.backend.dto.ReportCreateRequest;
import com.doubleplay.backend.dto.ReportResponse;
import com.doubleplay.backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody ReportCreateRequest req) {
        var res = reportService.create(req);
        return ResponseEntity.ok(Map.of(
                "reportId", res.reportId(),
                "reportedAt", res.reportedAt()
        ));
    }

    @GetMapping
    public ResponseEntity<Map<String, List<ReportResponse>>> list(
            @RequestParam(required = false) String targetType,
            @RequestParam(required = false) Long reporterId,
            @RequestParam(defaultValue = "false") boolean isAdmin  // 간단 권한 체크
    ) {
        var items = reportService.list(targetType, reporterId, isAdmin);
        return ResponseEntity.ok(Map.of("items", items));
    }
}