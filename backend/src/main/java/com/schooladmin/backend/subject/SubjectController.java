package com.schooladmin.backend.subject;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    private final SubjectRepository subjectRepository;

    public SubjectController(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
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
}