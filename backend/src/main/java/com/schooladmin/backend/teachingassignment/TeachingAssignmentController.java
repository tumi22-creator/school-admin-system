package com.schooladmin.backend.teachingassignment;

import com.schooladmin.backend.schoolclass.SchoolClass;
import com.schooladmin.backend.schoolclass.SchoolClassRepository;
import com.schooladmin.backend.subject.Subject;
import com.schooladmin.backend.subject.SubjectRepository;
import com.schooladmin.backend.teacher.Teacher;
import com.schooladmin.backend.teacher.TeacherRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teaching-assignments")
public class TeachingAssignmentController {

    private final TeachingAssignmentRepository assignmentRepository;
    private final TeacherRepository teacherRepository;
    private final SubjectRepository subjectRepository;
    private final SchoolClassRepository schoolClassRepository;

    public TeachingAssignmentController(
            TeachingAssignmentRepository assignmentRepository,
            TeacherRepository teacherRepository,
            SubjectRepository subjectRepository,
            SchoolClassRepository schoolClassRepository
    ) {
        this.assignmentRepository = assignmentRepository;
        this.teacherRepository = teacherRepository;
        this.subjectRepository = subjectRepository;
        this.schoolClassRepository = schoolClassRepository;
    }

    @GetMapping
    public List<TeachingAssignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TeachingAssignment createAssignment(
            @RequestBody CreateAssignmentRequest request
    ) {

        Teacher teacher = teacherRepository.findById(request.teacherId())
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        Subject subject = subjectRepository.findById(request.subjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        SchoolClass schoolClass = schoolClassRepository.findById(request.classId())
                .orElseThrow(() -> new RuntimeException("Class not found"));

        TeachingAssignment assignment = new TeachingAssignment(
                teacher,
                subject,
                schoolClass
        );

        return assignmentRepository.save(assignment);
    }

    public record CreateAssignmentRequest(
            Long teacherId,
            Long subjectId,
            Long classId
    ) {
    }
}