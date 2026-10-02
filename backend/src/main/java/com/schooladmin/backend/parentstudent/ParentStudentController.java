package com.schooladmin.backend.parentstudent;

import com.schooladmin.backend.student.Student;
import com.schooladmin.backend.student.StudentRepository;
import com.schooladmin.backend.user.User;
import com.schooladmin.backend.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parent-students")
public class ParentStudentController {

    private final ParentStudentRepository parentStudentRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;

    public ParentStudentController(
            ParentStudentRepository parentStudentRepository,
            UserRepository userRepository,
            StudentRepository studentRepository
    ) {
        this.parentStudentRepository = parentStudentRepository;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
    }

    @GetMapping
    public List<ParentStudent> getAllLinks() {
        return parentStudentRepository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ParentStudent linkParentToStudent(
            @RequestBody CreateParentStudentRequest request
    ) {
        User parent = userRepository.findById(request.parentId())
                .orElseThrow(() -> new RuntimeException("Parent not found"));

        Student student = studentRepository.findById(request.studentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        ParentStudent link = new ParentStudent(parent, student);

        return parentStudentRepository.save(link);
    }

    public record CreateParentStudentRequest(
            Long parentId,
            Long studentId
    ) {
    }
}