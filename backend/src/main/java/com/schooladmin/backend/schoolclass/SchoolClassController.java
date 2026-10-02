package com.schooladmin.backend.schoolclass;

import com.schooladmin.backend.grade.Grade;
import com.schooladmin.backend.grade.GradeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
public class SchoolClassController {

    private final SchoolClassRepository schoolClassRepository;
    private final GradeRepository gradeRepository;
    
    public SchoolClassController(
            SchoolClassRepository schoolClassRepository,
            GradeRepository gradeRepository
    ) {
        this.schoolClassRepository = schoolClassRepository;
        this.gradeRepository = gradeRepository;
    }

    @GetMapping
    public List<SchoolClass> getAllClasses() {
        return schoolClassRepository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SchoolClass createClass(@RequestBody CreateClassRequest request) {

        Grade grade = gradeRepository.findById(request.gradeId())
                .orElseThrow(() -> new RuntimeException("Grade not found"));

        SchoolClass schoolClass = new SchoolClass(
                request.name(),
                grade
        );

        return schoolClassRepository.save(schoolClass);
    }

    public record CreateClassRequest(
            String name,
            Long gradeId
    ) {
    }
}