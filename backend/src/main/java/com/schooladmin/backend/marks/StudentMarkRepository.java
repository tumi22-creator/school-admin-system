package com.schooladmin.backend.marks;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentMarkRepository
        extends JpaRepository<StudentMark, Long> {

    List<StudentMark> findByStudentId(Long studentId);
}