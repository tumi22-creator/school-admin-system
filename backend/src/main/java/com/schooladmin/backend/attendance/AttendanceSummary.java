package com.schooladmin.backend.attendance;

public record AttendanceSummary(
        long total,
        long present,
        long absent,
        long late,
        double attendancePercentage
) {
}