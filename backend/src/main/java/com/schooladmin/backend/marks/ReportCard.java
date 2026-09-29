package com.schooladmin.backend.marks;

import java.util.List;

public record ReportCard(
        Long studentId,
        String studentName,
        List<StudentMarkSummary> marks,
        double averagePercentage
) {
}