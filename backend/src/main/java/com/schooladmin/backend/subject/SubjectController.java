package com.schooladmin.backend.subject;

import com.schooladmin.backend.schoolclass.SchoolClass;
import com.schooladmin.backend.schoolclass.SchoolClassRepository;
import com.schooladmin.backend.teacher.Teacher;
import com.schooladmin.backend.teacher.TeacherRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    private final SubjectRepository subjectRepository;
    private final TeacherRepository teacherRepository;
    private final SchoolClassRepository schoolClassRepository;

    public SubjectController(
            SubjectRepository subjectRepository,
            TeacherRepository teacherRepository,
            SchoolClassRepository schoolClassRepository
    ) {
        this.subjectRepository = subjectRepository;
        this.teacherRepository = teacherRepository;
        this.schoolClassRepository = schoolClassRepository;
    }

    @GetMapping
    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createSubject(@RequestBody Subject subject) {

        if (subject.getName() == null || subject.getName().isBlank()) {
            return ResponseEntity.badRequest()
                    .body("Subject name is required");
        }

        if (subject.getCode() == null || subject.getCode().isBlank()) {
            return ResponseEntity.badRequest()
                    .body("Subject code is required");
        }

        return ResponseEntity.ok(subjectRepository.save(subject));
    }

    @PutMapping("/{subjectId}/teacher/{teacherId}")
    public ResponseEntity<?> assignTeacher(
            @PathVariable Long subjectId,
            @PathVariable Long teacherId
    ) {

        Subject subject = subjectRepository.findById(subjectId)
                .orElse(null);

        Teacher teacher = teacherRepository.findById(teacherId)
                .orElse(null);

        if (subject == null) {
            return ResponseEntity.notFound().build();
        }

        if (teacher == null) {
            return ResponseEntity.badRequest()
                    .body("Teacher not found");
        }

        subject.getTeachers().add(teacher);

        return ResponseEntity.ok(subjectRepository.save(subject));
    }

    @PutMapping("/{subjectId}/class/{classId}")
    public ResponseEntity<?> assignClass(
            @PathVariable Long subjectId,
            @PathVariable Long classId
    ) {

        Subject subject = subjectRepository.findById(subjectId)
                .orElse(null);

        SchoolClass schoolClass = schoolClassRepository.findById(classId)
                .orElse(null);

        if (subject == null) {
            return ResponseEntity.notFound().build();
        }

        if (schoolClass == null) {
            return ResponseEntity.badRequest()
                    .body("Class not found");
        }

        subject.getClasses().add(schoolClass);

        return ResponseEntity.ok(subjectRepository.save(subject));
    }
}