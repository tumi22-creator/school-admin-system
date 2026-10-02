
package com.schooladmin.backend.user;

import com.schooladmin.backend.attendance.Attendance;
import com.schooladmin.backend.attendance.AttendanceRepository;
import com.schooladmin.backend.attendance.AttendanceStatus;
import com.schooladmin.backend.attendance.AttendanceSummary;
import com.schooladmin.backend.fees.Fee;
import com.schooladmin.backend.fees.FeeRepository;
import com.schooladmin.backend.fees.Payment;
import com.schooladmin.backend.fees.PaymentRepository;
import com.schooladmin.backend.marks.ReportCard;
import com.schooladmin.backend.marks.StudentMark;
import com.schooladmin.backend.marks.StudentMarkRepository;
import com.schooladmin.backend.marks.StudentMarkSummary;
import com.schooladmin.backend.parentstudent.ParentStudent;
import com.schooladmin.backend.parentstudent.ParentStudentRepository;
import com.schooladmin.backend.student.Student;
import com.schooladmin.backend.student.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/parents")
public class ParentController {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final ParentStudentRepository parentStudentRepository;
    private final PasswordEncoder passwordEncoder;
    private final AttendanceRepository attendanceRepository;
    private final StudentMarkRepository studentMarkRepository;
    private final FeeRepository feeRepository;
    private final PaymentRepository paymentRepository;

    public ParentController(
            UserRepository userRepository,
            StudentRepository studentRepository,
            ParentStudentRepository parentStudentRepository,
            PasswordEncoder passwordEncoder,
            AttendanceRepository attendanceRepository,
            StudentMarkRepository studentMarkRepository,
            FeeRepository feeRepository,
            PaymentRepository paymentRepository
    ) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.parentStudentRepository = parentStudentRepository;
        this.passwordEncoder = passwordEncoder;
        this.attendanceRepository = attendanceRepository;
        this.studentMarkRepository = studentMarkRepository;
        this.feeRepository = feeRepository;
        this.paymentRepository = paymentRepository;
    }



// ============================================================
// GET ALL PARENTS
// ADMIN ONLY
// ============================================================

@GetMapping
public ResponseEntity<?> getAllParents() {

    List<User> parents = userRepository.findAll()
            .stream()
            .filter(user -> user.getRole() == Role.PARENT)
            .toList();

    List<ParentResponse> response = parents.stream()
            .map(parent -> new ParentResponse(
                    parent.getId(),
                    parent.getEmail(),
                    parent.getRole()
            ))
            .toList();

    return ResponseEntity.ok(response);
}
    // ============================================================
    // CREATE PARENT
    // ADMIN ONLY
    // ============================================================

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

    // ============================================================
    // LINK STUDENT TO PARENT
    // ADMIN ONLY
    // ============================================================

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

        if (parentStudentRepository.existsByParentIdAndStudentId(
                parentId,
                studentId
        )) {
            return ResponseEntity.status(409)
                    .body("Student is already linked to this parent");
        }

        ParentStudent link = new ParentStudent(parent, student);

        parentStudentRepository.save(link);

        return ResponseEntity.ok("Student linked to parent");
    }

    // ============================================================
    // GET PARENT'S STUDENTS
    // PARENT CAN ONLY SEE THEIR OWN STUDENTS
    // ============================================================

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

        if (!isAuthenticatedParent(parentId, authentication)) {
            return ResponseEntity.status(403)
                    .body("Access denied");
        }

        List<ParentStudent> links =
                parentStudentRepository.findByParentId(parentId);

        List<Student> students = links.stream()
                .map(ParentStudent::getStudent)
                .toList();

        return ResponseEntity.ok(students);
    }

    // ============================================================
    // STUDENT OVERVIEW
    // PARENT CAN ONLY SEE LINKED STUDENTS
    // ============================================================

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

        if (!isAuthenticatedParent(parentId, authentication)) {
            return ResponseEntity.status(403)
                    .body("Access denied");
        }

        boolean linked =
                parentStudentRepository.existsByParentIdAndStudentId(
                        parentId,
                        studentId
                );

        if (!linked) {
            return ResponseEntity.status(403)
                    .body("Student is not linked to this parent");
        }

        List<Attendance> attendance =
                attendanceRepository
                        .findByStudentIdOrderByDateDesc(studentId);

        List<StudentMark> marks =
                studentMarkRepository.findByStudentId(studentId);

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

    // ============================================================
    // STUDENT DASHBOARD
    // PARENT CAN ONLY SEE LINKED STUDENTS
    // ============================================================

    @GetMapping("/{parentId}/student/{studentId}/dashboard")
    public ResponseEntity<?> getStudentDashboard(
            @PathVariable Long parentId,
            @PathVariable Long studentId,
            Authentication authentication
    ) {

        User parent = userRepository.findById(parentId)
                .orElse(null);

        if (parent == null || parent.getRole() != Role.PARENT) {
            return ResponseEntity.notFound().build();
        }

        if (!isAuthenticatedParent(parentId, authentication)) {
            return ResponseEntity.status(403)
                    .body("Access denied");
        }

        Student student = parentStudentRepository
                .findByParentIdAndStudentId(parentId, studentId)
                .map(ParentStudent::getStudent)
                .orElse(null);

        if (student == null) {
            return ResponseEntity.status(403)
                    .body("Student is not linked to this parent");
        }

        // --------------------------------------------------------
        // ATTENDANCE
        // --------------------------------------------------------

        List<Attendance> attendanceRecords =
                attendanceRepository
                        .findByStudentIdOrderByDateDesc(studentId);

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
                total == 0
                        ? 0
                        : (present * 100.0) / total;

        AttendanceSummary attendanceSummary =
                new AttendanceSummary(
                        total,
                        present,
                        absent,
                        late,
                        attendancePercentage
                );

        // --------------------------------------------------------
        // MARKS
        // --------------------------------------------------------

        List<StudentMark> marks =
                studentMarkRepository.findByStudentId(studentId);

        List<StudentMarkSummary> markSummaries =
                marks.stream()
                        .map(mark -> {

                            double percentage =
                                    mark.getAssessment().getMaxMark() == 0
                                            ? 0
                                            : (mark.getMark()
                                            / mark.getAssessment().getMaxMark())
                                            * 100;

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

        double average =
                markSummaries.stream()
                        .mapToDouble(StudentMarkSummary::percentage)
                        .average()
                        .orElse(0);

        ReportCard reportCard =
                new ReportCard(
                        student.getId(),
                        student.getFirstName()
                                + " "
                                + student.getLastName(),
                        markSummaries,
                        average
                );

        String className =
                student.getSchoolClass() != null
                        ? student.getSchoolClass().getName()
                        : null;

        ParentDashboardResponse dashboard =
                new ParentDashboardResponse(
                        student.getId(),
                        student.getFirstName()
                                + " "
                                + student.getLastName(),
                        student.getStudentNumber(),
                        className,
                        attendanceSummary,
                        reportCard
                );

        return ResponseEntity.ok(dashboard);
    }

    // ============================================================
    // STUDENT FEES
    // PARENT CAN ONLY SEE LINKED STUDENTS
    // ============================================================

    @GetMapping("/{parentId}/student/{studentId}/fees")
    public ResponseEntity<?> getStudentFees(
            @PathVariable Long parentId,
            @PathVariable Long studentId,
            Authentication authentication
    ) {

        User parent = userRepository.findById(parentId)
                .orElse(null);

        if (parent == null || parent.getRole() != Role.PARENT) {
            return ResponseEntity.notFound().build();
        }

        if (!isAuthenticatedParent(parentId, authentication)) {
            return ResponseEntity.status(403)
                    .body("Access denied");
        }

        boolean linked =
                parentStudentRepository.existsByParentIdAndStudentId(
                        parentId,
                        studentId
                );

        if (!linked) {
            return ResponseEntity.status(403)
                    .body("Student is not linked to this parent");
        }

        List<Fee> fees =
                feeRepository.findByStudentId(studentId);

        List<Payment> payments =
                paymentRepository
                        .findByStudentIdOrderByPaymentDateDesc(studentId);

        BigDecimal totalFees =
                fees.stream()
                        .map(Fee::getAmount)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalPaid =
                payments.stream()
                        .map(Payment::getAmount)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal outstandingBalance =
                totalFees.subtract(totalPaid);

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
    ) {
    }

    // ============================================================
    // RESET PARENT PASSWORD
    // ADMIN ONLY
    // ============================================================

    @PutMapping("/{parentId}/password")
    public ResponseEntity<?> resetParentPassword(
            @PathVariable Long parentId,
            @RequestBody PasswordResetRequest request
    ) {

        User parent = userRepository.findById(parentId)
                .orElse(null);

        if (parent == null || parent.getRole() != Role.PARENT) {
            return ResponseEntity.notFound().build();
        }

        if (request.password() == null
                || request.password().length() < 8) {

            return ResponseEntity.badRequest()
                    .body("Password must be at least 8 characters");
        }

        parent.setPassword(
                passwordEncoder.encode(request.password())
        );

        userRepository.save(parent);

        return ResponseEntity.ok(
                "Parent password updated successfully"
        );
    }

    public record PasswordResetRequest(
            String password
    ) {
    }

    // ============================================================
    // AUTHENTICATION / OWNERSHIP CHECK
    // ============================================================

    private boolean isAuthenticatedParent(
            Long parentId,
            Authentication authentication
    ) {

        if (authentication == null
                || authentication.getName() == null) {
            return false;
        }

        User authenticatedUser =
                userRepository.findByEmail(authentication.getName())
                        .orElse(null);

        if (authenticatedUser == null) {
            return false;
        }

        if (authenticatedUser.getRole() != Role.PARENT) {
            return false;
        }

        return authenticatedUser.getId().equals(parentId);
    }


    @PutMapping("/{parentId}/email")
public ResponseEntity<?> updateParentEmail(
        @PathVariable Long parentId,
        @RequestBody UpdateEmailRequest request
) {
    User parent = userRepository.findById(parentId)
            .orElseThrow(() -> new RuntimeException("Parent not found"));

    if (parent.getRole() != Role.PARENT) {
        return ResponseEntity.badRequest()
                .body("User is not a parent");
    }

    if (userRepository.existsByEmail(request.email())
            && !parent.getEmail().equals(request.email())) {
        return ResponseEntity.badRequest()
                .body("Email already exists");
    }

    parent.setEmail(request.email());

    return ResponseEntity.ok(userRepository.save(parent));
}

public record UpdateEmailRequest(String email) {}
}
