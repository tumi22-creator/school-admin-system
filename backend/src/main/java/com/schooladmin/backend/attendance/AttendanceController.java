package com.schooladmin.backend.attendance;

import com.schooladmin.backend.student.Student;
import com.schooladmin.backend.student.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;

    public AttendanceController(
            AttendanceRepository attendanceRepository,
            StudentRepository studentRepository
    ) {
        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
    }

    @PostMapping
    public ResponseEntity<?> markAttendance(
            @RequestBody AttendanceRequest request
    ) {

        Student student = studentRepository
                .findById(request.studentId())
                .orElse(null);

        if (student == null) {
            return ResponseEntity.badRequest()
                    .body("Student not found");
        }

        if (request.date() == null) {
            return ResponseEntity.badRequest()
                    .body("Attendance date is required");
        }

        if (request.status() == null) {
            return ResponseEntity.badRequest()
                    .body("Attendance status is required");
        }

        Attendance attendance = new Attendance();

        attendance.setStudent(student);
        attendance.setDate(request.date());
        attendance.setStatus(request.status());

        return ResponseEntity.ok(
                attendanceRepository.save(attendance)
        );
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getStudentAttendance(
            @PathVariable Long studentId
    ) {

        if (!studentRepository.existsById(studentId)) {
            return ResponseEntity.badRequest()
                    .body("Student not found");
        }

        return ResponseEntity.ok(
                attendanceRepository
                        .findByStudentIdOrderByDateDesc(studentId)
        );
    }

    @GetMapping("/date/{date}")
    public List<Attendance> getAttendanceByDate(
            @PathVariable LocalDate date
    ) {
        return attendanceRepository.findByDate(date);
    }

@GetMapping("/student/{studentId}/summary")
public ResponseEntity<?> getStudentAttendanceSummary(
        @PathVariable Long studentId
) {

    if (!studentRepository.existsById(studentId)) {
        return ResponseEntity.badRequest()
                .body("Student not found");
    }

    List<Attendance> records =
            attendanceRepository.findByStudentIdOrderByDateDesc(studentId);

    long total = records.size();

    long present = records.stream()
            .filter(a -> a.getStatus() == AttendanceStatus.PRESENT)
            .count();

    long absent = records.stream()
            .filter(a -> a.getStatus() == AttendanceStatus.ABSENT)
            .count();

    long late = records.stream()
            .filter(a -> a.getStatus() == AttendanceStatus.LATE)
            .count();

    double percentage = total == 0
            ? 0.0
            : ((double) present / total) * 100;

    AttendanceSummary summary = new AttendanceSummary(
            total,
            present,
            absent,
            late,
            Math.round(percentage * 100.0) / 100.0
    );

    return ResponseEntity.ok(summary);
}

    public record AttendanceRequest(
            Long studentId,
            LocalDate date,
            AttendanceStatus status
    ) {
    }
}