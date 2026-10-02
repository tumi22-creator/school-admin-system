package com.schooladmin.backend.enrollment;

import com.schooladmin.backend.student.Student;
import com.schooladmin.backend.student.StudentRepository;
import com.schooladmin.backend.subject.Subject;
import com.schooladmin.backend.subject.SubjectRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;

    public EnrollmentController(
            EnrollmentRepository enrollmentRepository,
            StudentRepository studentRepository,
            SubjectRepository subjectRepository
    ) {
        this.enrollmentRepository = enrollmentRepository;
        this.studentRepository = studentRepository;
        this.subjectRepository = subjectRepository;
    }

    @GetMapping
    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Enrollment createEnrollment(
            @RequestBody CreateEnrollmentRequest request
    ) {

        Student student = studentRepository.findById(request.studentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Subject subject = subjectRepository.findById(request.subjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        Enrollment enrollment = new Enrollment(student, subject);

        return enrollmentRepository.save(enrollment);
    }

    public record CreateEnrollmentRequest(
            Long studentId,
            Long subjectId
    ) {
    }
}