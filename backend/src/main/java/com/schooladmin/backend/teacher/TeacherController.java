package com.schooladmin.backend.teacher;

import com.schooladmin.backend.schoolclass.SchoolClass;
import com.schooladmin.backend.schoolclass.SchoolClassRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    private final TeacherRepository teacherRepository;
    private final SchoolClassRepository schoolClassRepository;

    public TeacherController(
            TeacherRepository teacherRepository,
            SchoolClassRepository schoolClassRepository
    ) {
        this.teacherRepository = teacherRepository;
        this.schoolClassRepository = schoolClassRepository;
    }

    @GetMapping
    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createTeacher(@RequestBody Teacher teacher) {

        if (teacher.getSchoolClass() != null &&
                teacher.getSchoolClass().getId() != null) {

            SchoolClass schoolClass = schoolClassRepository
                    .findById(teacher.getSchoolClass().getId())
                    .orElse(null);

            if (schoolClass == null) {
                return ResponseEntity.badRequest()
                        .body("Class not found");
            }

            teacher.setSchoolClass(schoolClass);
        }

        return ResponseEntity.ok(teacherRepository.save(teacher));
    }
}