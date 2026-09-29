package com.schooladmin.backend.user;

import com.schooladmin.backend.attendance.AttendanceSummary;
import com.schooladmin.backend.marks.ReportCard;

public record ParentDashboardResponse(
        Long studentId,
        String studentName,
        String studentNumber,
        String className,
        AttendanceSummary attendance,
        ReportCard reportCard
) {
}