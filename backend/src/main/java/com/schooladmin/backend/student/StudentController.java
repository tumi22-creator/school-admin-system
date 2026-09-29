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
        @RequestBody Student student,
        Authentication authentication
) {
    if (student.getSchoolClass() != null
            && student.getSchoolClass().getId() != null) {

        SchoolClass schoolClass =
                schoolClassRepository.findById(
                        student.getSchoolClass().getId()
                ).orElse(null);

        if (schoolClass == null) {
            return ResponseEntity.badRequest()
                    .body("Class not found");
        }

        student.setSchoolClass(schoolClass);
    }

    Student savedStudent = studentRepository.save(student);

    auditLogService.log(
            "CREATE_STUDENT",
            authentication.getName(),
            "Created student "
                    + savedStudent.getFirstName()
                    + " "
                    + savedStudent.getLastName()
                    + " (" + savedStudent.getStudentNumber() + ")"
    );

    return ResponseEntity.ok(savedStudent);
}
}