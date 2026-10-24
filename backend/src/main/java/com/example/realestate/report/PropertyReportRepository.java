package com.example.realestate.report;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PropertyReportRepository extends JpaRepository<PropertyReport, UUID> {
    Page<PropertyReport> findByOrderByCreatedAtDesc(Pageable pageable);
    Page<PropertyReport> findByStatusOrderByCreatedAtDesc(ReportStatus status, Pageable pageable);
    long countByStatus(ReportStatus status);
}
