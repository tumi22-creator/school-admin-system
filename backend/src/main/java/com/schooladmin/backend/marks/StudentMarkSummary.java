package com.schooladmin.backend.marks;

public record StudentMarkSummary(
        Long assessmentId,
        String assessmentName,
        String subject,
        double mark,
        double maxMark,
        double percentage
) {
}