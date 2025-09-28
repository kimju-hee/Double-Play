package com.doubleplay.backend.service;

import com.doubleplay.backend.dto.ReportCreateRequest;
import com.doubleplay.backend.dto.ReportResponse;
import com.doubleplay.backend.entity.Report;
import com.doubleplay.backend.entity.Users;
import com.doubleplay.backend.repository.ReportRepository;
import com.doubleplay.backend.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final UsersRepository usersRepository;

    public ReportResponse create(ReportCreateRequest req) {
        var targetType = Report.TargetType.valueOf(req.targetType().toUpperCase());

        Users reporter = usersRepository.findById(req.reporterId())
                .orElseThrow(() -> new IllegalArgumentException("Reporter not found: " + req.reporterId()));

        var report = Report.builder()
                .targetType(targetType)
                .targetId(req.targetId())
                .reason(req.reason())
                .reporter(reporter)
                .reportedAt(LocalDateTime.now())
                .build();

        reportRepository.save(report);

        return toResponse(report);
    }

    public List<ReportResponse> list(String targetTypeStr, Long reporterId, boolean isAdmin) {
        if (!isAdmin) {
            throw new SecurityException("Admin only");
        }
        Report.TargetType targetType = null;
        if (targetTypeStr != null && !targetTypeStr.isBlank()) {
            targetType = Report.TargetType.valueOf(targetTypeStr.toUpperCase());
        }

        return reportRepository.search(targetType, reporterId)
                .stream().map(this::toResponse).toList();
    }

    private ReportResponse toResponse(Report r) {
        return new ReportResponse(
                r.getReportId(),
                r.getTargetType().name(),
                r.getTargetId(),
                r.getReason(),
                r.getReporter().getUserId(),
                r.getReportedAt()
        );
    }
}
