package com.schooladmin.backend.schoolclass;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
public class SchoolClassController {

    private final SchoolClassRepository schoolClassRepository;

    public SchoolClassController(SchoolClassRepository schoolClassRepository) {
        this.schoolClassRepository = schoolClassRepository;
    }

    @GetMapping
    public List<SchoolClass> getAllClasses() {
        return schoolClassRepository.findAll();
    }

    @PostMapping
    public SchoolClass createClass(@RequestBody SchoolClass schoolClass) {
        return schoolClassRepository.save(schoolClass);
    }
}