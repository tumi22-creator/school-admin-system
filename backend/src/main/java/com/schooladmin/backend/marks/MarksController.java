package com.schooladmin.backend.marks;

import com.schooladmin.backend.schoolclass.SchoolClass;
import com.schooladmin.backend.schoolclass.SchoolClassRepository;
import com.schooladmin.backend.student.Student;
import com.schooladmin.backend.student.StudentRepository;
import com.schooladmin.backend.subject.Subject;
import com.schooladmin.backend.subject.SubjectRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/marks")
public class MarksController {

    private final AssessmentRepository assessmentRepository;
    private final StudentMarkRepository studentMarkRepository;
    private final SubjectRepository subjectRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final StudentRepository studentRepository;

    public MarksController(
            AssessmentRepository assessmentRepository,
            StudentMarkRepository studentMarkRepository,
            SubjectRepository subjectRepository,
            SchoolClassRepository schoolClassRepository,
            StudentRepository studentRepository
    ) {
        this.assessmentRepository = assessmentRepository;
        this.studentMarkRepository = studentMarkRepository;
        this.subjectRepository = subjectRepository;
        this.schoolClassRepository = schoolClassRepository;
        this.studentRepository = studentRepository;
    }

    
@GetMapping("/assessments")
public ResponseEntity<?> getAssessments() {
    return ResponseEntity.ok(
            assessmentRepository.findAll()
    );
}


    @PostMapping("/assessments")
    public ResponseEntity<?> createAssessment(
            @RequestBody AssessmentRequest request
    ) {

        Subject subject = subjectRepository
                .findById(request.subjectId())
                .orElse(null);

        SchoolClass schoolClass = schoolClassRepository
                .findById(request.classId())
                .orElse(null);

        if (subject == null) {
            return ResponseEntity.badRequest()
                    .body("Subject not found");
        }

        if (schoolClass == null) {
            return ResponseEntity.badRequest()
                    .body("Class not found");
        }

        if (request.maxMark() <= 0) {
            return ResponseEntity.badRequest()
                    .body("Maximum mark must be greater than 0");
        }

        Assessment assessment = new Assessment();

        assessment.setName(request.name());
        assessment.setType(request.type());
        assessment.setMaxMark(request.maxMark());
        assessment.setDate(request.date());
        assessment.setSubject(subject);
        assessment.setSchoolClass(schoolClass);

        return ResponseEntity.ok(
                assessmentRepository.save(assessment)
        );
    }

    @PostMapping
    public ResponseEntity<?> recordMark(
            @RequestBody MarkRequest request
    ) {

        Student student = studentRepository
                .findById(request.studentId())
                .orElse(null);

        Assessment assessment = assessmentRepository
                .findById(request.assessmentId())
                .orElse(null);

        if (student == null) {
            return ResponseEntity.badRequest()
                    .body("Student not found");
        }

        if (assessment == null) {
            return ResponseEntity.badRequest()
                    .body("Assessment not found");
        }

        if (request.mark() < 0 ||
                request.mark() > assessment.getMaxMark()) {

            return ResponseEntity.badRequest()
                    .body("Mark must be between 0 and "
                            + assessment.getMaxMark());
        }

        StudentMark studentMark = new StudentMark();

        studentMark.setStudent(student);
        studentMark.setAssessment(assessment);
        studentMark.setMark(request.mark());

        return ResponseEntity.ok(
                studentMarkRepository.save(studentMark)
        );
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getStudentMarks(
            @PathVariable Long studentId
    ) {

        if (!studentRepository.existsById(studentId)) {
            return ResponseEntity.badRequest()
                    .body("Student not found");
        }

        return ResponseEntity.ok(
                studentMarkRepository.findByStudentId(studentId)
        );
    }

    public record AssessmentRequest(
            String name,
            AssessmentType type,
            double maxMark,
            LocalDate date,
            Long subjectId,
            Long classId
    ) {
    }

@GetMapping("/student/{studentId}/report-card")
public ResponseEntity<?> getStudentReportCard(
        @PathVariable Long studentId
) {

    Student student = studentRepository.findById(studentId)
            .orElse(null);

    if (student == null) {
        return ResponseEntity.badRequest()
                .body("Student not found");
    }

    List<StudentMark> studentMarks =
            studentMarkRepository.findByStudentId(studentId);

    List<StudentMarkSummary> summaries = studentMarks.stream()
            .map(mark -> {

                Assessment assessment = mark.getAssessment();

                double percentage =
                        (mark.getMark() / assessment.getMaxMark()) * 100;

                return new StudentMarkSummary(
                        assessment.getId(),
                        assessment.getName(),
                        assessment.getSubject().getName(),
                        mark.getMark(),
                        assessment.getMaxMark(),
                        Math.round(percentage * 100.0) / 100.0
                );
            })
            .toList();

    double average = summaries.isEmpty()
            ? 0.0
            : summaries.stream()
                .mapToDouble(StudentMarkSummary::percentage)
                .average()
                .orElse(0.0);

    average = Math.round(average * 100.0) / 100.0;

    ReportCard reportCard = new ReportCard(
            student.getId(),
            student.getFirstName() + " " + student.getLastName(),
            summaries,
            average
    );

    return ResponseEntity.ok(reportCard);
}

    public record MarkRequest(
            Long studentId,
            Long assessmentId,
            double mark
    ) {
    }
}