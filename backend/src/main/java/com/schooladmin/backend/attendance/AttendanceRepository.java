package com.schooladmin.backend.attendance;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByStudentIdOrderByDateDesc(Long studentId);

    List<Attendance> findByDate(LocalDate date);
}