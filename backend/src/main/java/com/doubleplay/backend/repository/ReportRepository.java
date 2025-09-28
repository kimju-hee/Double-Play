package com.doubleplay.backend.repository;

import com.doubleplay.backend.entity.Report;
import com.doubleplay.backend.entity.Report.TargetType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {

    @Query("""
        select r from Report r
        where (:targetType is null or r.targetType = :targetType)
          and (:reporterId is null or r.reporter.userId = :reporterId)
        order by r.reportedAt desc, r.reportId desc
    """)
    List<Report> search(TargetType targetType, Long reporterId);
}