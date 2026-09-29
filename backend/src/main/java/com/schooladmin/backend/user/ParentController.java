package com.schooladmin.backend.user;

import com.schooladmin.backend.student.Student;
import com.schooladmin.backend.student.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.Authentication;
import com.schooladmin.backend.attendance.Attendance;
import com.schooladmin.backend.attendance.AttendanceRepository;
import com.schooladmin.backend.marks.StudentMark;
import com.schooladmin.backend.marks.StudentMarkRepository;
import java.util.List;
import com.schooladmin.backend.attendance.AttendanceStatus;
import com.schooladmin.backend.marks.StudentMarkSummary;
import com.schooladmin.backend.marks.ReportCard;
import com.schooladmin.backend.student.Student;
import com.schooladmin.backend.fees.Fee;
import com.schooladmin.backend.fees.FeeRepository;
import com.schooladmin.backend.fees.Payment;
import com.schooladmin.backend.fees.PaymentRepository;

import java.math.BigDecimal;
import com.schooladmin.backend.attendance.AttendanceSummary;




@RestController
@RequestMapping("/api/parents")
public class ParentController {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final AttendanceRepository attendanceRepository;
private final StudentMarkRepository studentMarkRepository;
private final FeeRepository feeRepository;
private final PaymentRepository paymentRepository;


public ParentController(
        UserRepository userRepository,
        StudentRepository studentRepository,
        PasswordEncoder passwordEncoder,
        AttendanceRepository attendanceRepository,
        StudentMarkRepository studentMarkRepository,
        FeeRepository feeRepository,
        PaymentRepository paymentRepository
) {
    this.userRepository = userRepository;
    this.studentRepository = studentRepository;
    this.passwordEncoder = passwordEncoder;
    this.attendanceRepository = attendanceRepository;
    this.studentMarkRepository = studentMarkRepository;
    this.feeRepository = feeRepository;
    this.paymentRepository = paymentRepository;
}


@PostMapping
public ResponseEntity<?> createParent(
        @RequestBody CreateParentRequest request
) {

    if (request.email() == null || request.email().isBlank()) {
        return ResponseEntity.badRequest()
                .body("Email is required");
    }

    if (request.password() == null || request.password().isBlank()) {
        return ResponseEntity.badRequest()
                .body("Password is required");
    }

    if (userRepository.existsByEmail(request.email())) {
        return ResponseEntity.status(409)
                .body("Email already registered");
    }

    User parent = new User();

    parent.setEmail(request.email());
    parent.setPassword(passwordEncoder.encode(request.password()));
    parent.setRole(Role.PARENT);

    User savedParent = userRepository.save(parent);

    return ResponseEntity.status(201).body(
            new ParentResponse(
                    savedParent.getId(),
                    savedParent.getEmail(),
                    savedParent.getRole()
            )
    );
}

public record CreateParentRequest(
        String email,
        String password
) {
}

public record ParentResponse(
        Long id,
        String email,
        Role role
) {
}

    @PutMapping("/{parentId}/student/{studentId}")
    public ResponseEntity<?> linkStudent(
            @PathVariable Long parentId,
            @PathVariable Long studentId
    ) {

        User parent = userRepository.findById(parentId)
                .orElse(null);

        Student student = studentRepository.findById(studentId)
                .orElse(null);

        if (parent == null) {
            return ResponseEntity.badRequest()
                    .body("Parent not found");
        }

        if (parent.getRole() != Role.PARENT) {
            return ResponseEntity.badRequest()
                    .body("User is not a parent");
        }

        if (student == null) {
            return ResponseEntity.badRequest()
                    .body("Student not found");
        }

        parent.getStudents().add(student);

        userRepository.save(parent);

        return ResponseEntity.ok("Student linked to parent");
    }

    @GetMapping("/{parentId}/students")
public ResponseEntity<?> getParentStudents(
        @PathVariable Long parentId,
        Authentication authentication
) {

    User parent = userRepository.findById(parentId)
            .orElse(null);

    if (parent == null) {
        return ResponseEntity.notFound().build();
    }

    if (parent.getRole() != Role.PARENT) {
        return ResponseEntity.badRequest()
                .body("User is not a parent");
    }

    // A parent can only access their own account.
    if (!parent.getEmail().equals(authentication.getName())) {
        return ResponseEntity.status(403)
                .body("Access denied");
    }

    return ResponseEntity.ok(parent.getStudents());
}

@GetMapping("/{parentId}/student/{studentId}/overview")
public ResponseEntity<?> getStudentOverview(
        @PathVariable Long parentId,
        @PathVariable Long studentId,
        Authentication authentication
) {

    User parent = userRepository.findById(parentId)
            .orElse(null);

    if (parent == null || parent.getRole() != Role.PARENT) {
        return ResponseEntity.notFound().build();
    }

    if (!parent.getEmail().equals(authentication.getName())) {
        return ResponseEntity.status(403)
                .body("Access denied");
    }

    boolean linked = parent.getStudents()
            .stream()
            .anyMatch(student -> student.getId().equals(studentId));

    if (!linked) {
        return ResponseEntity.status(403)
                .body("Student is not linked to this parent");
    }

    List<Attendance> attendance =
            attendanceRepository
                    .findByStudentIdOrderByDateDesc(studentId);

    List<StudentMark> marks =
            studentMarkRepository
                    .findByStudentId(studentId);

    return ResponseEntity.ok(
            new StudentOverviewResponse(
                    attendance,
                    marks
            )
    );
}

public record StudentOverviewResponse(
        List<Attendance> attendance,
        List<StudentMark> marks
) {
}
@GetMapping("/{parentId}/student/{studentId}/dashboard")
public ResponseEntity<?> getStudentDashboard(
        @PathVariable Long parentId,
        @PathVariable Long studentId,
        Authentication authentication
) {
    User parent = userRepository.findById(parentId).orElse(null);

    if (parent == null || parent.getRole() != Role.PARENT) {
        return ResponseEntity.notFound().build();
    }

    // Parent can only access their own account
    if (!parent.getEmail().equals(authentication.getName())) {
        return ResponseEntity.status(403).body("Access denied");
    }

    // Student must be linked to this parent
    Student student = parent.getStudents().stream()
            .filter(s -> s.getId().equals(studentId))
            .findFirst()
            .orElse(null);

    if (student == null) {
        return ResponseEntity.status(403)
                .body("Student is not linked to this parent");
    }

    // Attendance
    List<Attendance> attendanceRecords =
            attendanceRepository.findByStudentIdOrderByDateDesc(studentId);

    long total = attendanceRecords.size();
    long present = attendanceRecords.stream()
            .filter(a -> a.getStatus() == AttendanceStatus.PRESENT)
            .count();
    long absent = attendanceRecords.stream()
            .filter(a -> a.getStatus() == AttendanceStatus.ABSENT)
            .count();
    long late = attendanceRecords.stream()
            .filter(a -> a.getStatus() == AttendanceStatus.LATE)
            .count();

    double attendancePercentage =
            total == 0 ? 0 : (present * 100.0) / total;

    AttendanceSummary attendanceSummary =
            new AttendanceSummary(
                    total,
                    present,
                    absent,
                    late,
                    attendancePercentage
            );

    // Marks
    List<StudentMark> marks =
            studentMarkRepository.findByStudentId(studentId);

    List<StudentMarkSummary> markSummaries = marks.stream()
            .map(mark -> {
                double percentage =
                        mark.getAssessment().getMaxMark() == 0
                                ? 0
                                : (mark.getMark()
                                / mark.getAssessment().getMaxMark()) * 100;

                return new StudentMarkSummary(
                        mark.getAssessment().getId(),
                        mark.getAssessment().getName(),
                        mark.getAssessment().getSubject().getName(),
                        mark.getMark(),
                        mark.getAssessment().getMaxMark(),
                        percentage
                );
            })
            .toList();

    double average = markSummaries.stream()
            .mapToDouble(StudentMarkSummary::percentage)
            .average()
            .orElse(0);

    ReportCard reportCard = new ReportCard(
            student.getId(),
            student.getFirstName() + " " + student.getLastName(),
            markSummaries,
            average
    );

    String className = student.getSchoolClass() != null
            ? student.getSchoolClass().getName()
            : null;

    ParentDashboardResponse dashboard =
            new ParentDashboardResponse(
                    student.getId(),
                    student.getFirstName() + " " + student.getLastName(),
                    student.getStudentNumber(),
                    className,
                    attendanceSummary,
                    reportCard
            );

    return ResponseEntity.ok(dashboard);
}

@GetMapping("/{parentId}/student/{studentId}/fees")
public ResponseEntity<?> getStudentFees(
        @PathVariable Long parentId,
        @PathVariable Long studentId,
        Authentication authentication
) {
    User parent = userRepository.findById(parentId).orElse(null);

    if (parent == null || parent.getRole() != Role.PARENT) {
        return ResponseEntity.notFound().build();
    }

    if (!parent.getEmail().equals(authentication.getName())) {
        return ResponseEntity.status(403).body("Access denied");
    }

    boolean linked = parent.getStudents().stream()
            .anyMatch(student -> student.getId().equals(studentId));

    if (!linked) {
        return ResponseEntity.status(403)
                .body("Student is not linked to this parent");
    }

    List<Fee> fees = feeRepository.findByStudentId(studentId);

    List<Payment> payments =
            paymentRepository.findByStudentIdOrderByPaymentDateDesc(studentId);

    BigDecimal totalFees = fees.stream()
            .map(Fee::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

    BigDecimal totalPaid = payments.stream()
            .map(Payment::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

    BigDecimal outstandingBalance = totalFees.subtract(totalPaid);

    return ResponseEntity.ok(
            new ParentFeeResponse(
                    fees,
                    payments,
                    totalFees,
                    totalPaid,
                    outstandingBalance
            )
    );
}

public record ParentFeeResponse(
        List<Fee> fees,
        List<Payment> payments,
        BigDecimal totalFees,
        BigDecimal totalPaid,
        BigDecimal outstandingBalance
) {}

@PutMapping("/{parentId}/password")
public ResponseEntity<?> resetParentPassword(
        @PathVariable Long parentId,
        @RequestBody PasswordResetRequest request
) {
    User parent = userRepository.findById(parentId).orElse(null);

    if (parent == null || parent.getRole() != Role.PARENT) {
        return ResponseEntity.notFound().build();
    }

    if (request.password() == null || request.password().length() < 8) {
        return ResponseEntity.badRequest()
                .body("Password must be at least 8 characters");
    }

    parent.setPassword(passwordEncoder.encode(request.password()));
    userRepository.save(parent);

    return ResponseEntity.ok("Parent password updated successfully");
}

public record PasswordResetRequest(
        String password
) {}

}