package com.schooladmin.backend.teacher;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    private final TeacherRepository teacherRepository;

    public TeacherController(TeacherRepository teacherRepository) {
        this.teacherRepository = teacherRepository;
    }

    @GetMapping
    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Teacher> createTeacher(
            @RequestBody Teacher teacher
    ) {
        return ResponseEntity.ok(
                teacherRepository.save(teacher)
        );
    }
}