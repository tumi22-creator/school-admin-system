package com.schooladmin.backend.student;

import com.schooladmin.backend.schoolclass.SchoolClass;
import com.schooladmin.backend.schoolclass.SchoolClassRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.schooladmin.backend.audit.AuditLogService;
import org.springframework.security.core.Authentication;


import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentRepository studentRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final AuditLogService auditLogService;




   public StudentController(
        StudentRepository studentRepository,
        SchoolClassRepository schoolClassRepository,
        AuditLogService auditLogService
) {
        this.studentRepository = studentRepository;
        this.schoolClassRepository = schoolClassRepository;
        this.auditLogService = auditLogService;
    }

    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

  @PostMapping
public ResponseEntity<?> createStudent(
        @RequestBody CreateStudentRequest request,
        Authentication authentication
) {

    SchoolClass schoolClass =
            schoolClassRepository.findById(request.classId())
                    .orElse(null);

    if (schoolClass == null) {
        return ResponseEntity.badRequest()
                .body("Class not found");
    }

    Student student = new Student();

    student.setFirstName(request.firstName());
    student.setLastName(request.lastName());
    student.setStudentNumber(request.studentNumber());
    student.setEmail(request.email());
    student.setSchoolClass(schoolClass);

    Student savedStudent = studentRepository.save(student);

    auditLogService.log(
            "CREATE_STUDENT",
            authentication.getName(),
            "Created student "
                    + savedStudent.getFirstName()
                    + " "
                    + savedStudent.getLastName()
                    + " (" + savedStudent.getStudentNumber() + ")"
                    + " in class "
                    + schoolClass.getName()
    );

    return ResponseEntity.ok(savedStudent);
}

    public record CreateStudentRequest(
            String firstName,
            String lastName,
            String studentNumber,
            String email,
            Long classId
    ) {
    }

@PutMapping("/{studentId}/class/{classId}")
public ResponseEntity<?> assignStudentToClass(
        @PathVariable Long studentId,
        @PathVariable Long classId,
        Authentication authentication
) {

    Student student = studentRepository.findById(studentId)
            .orElse(null);

    if (student == null) {
        return ResponseEntity.notFound().build();
    }

    SchoolClass schoolClass =
            schoolClassRepository.findById(classId)
                    .orElse(null);

    if (schoolClass == null) {
        return ResponseEntity.badRequest()
                .body("Class not found");
    }

    student.setSchoolClass(schoolClass);

    Student savedStudent = studentRepository.save(student);

    auditLogService.log(
            "ASSIGN_STUDENT_CLASS",
            authentication.getName(),
            "Assigned student "
                    + savedStudent.getFirstName()
                    + " "
                    + savedStudent.getLastName()
                    + " to class "
                    + schoolClass.getName()
    );

    return ResponseEntity.ok(savedStudent);
}
}