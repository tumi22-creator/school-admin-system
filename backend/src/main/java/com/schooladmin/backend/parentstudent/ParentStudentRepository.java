package com.schooladmin.backend.parentstudent;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParentStudentRepository
        extends JpaRepository<ParentStudent, Long> {

    List<ParentStudent> findByParentId(Long parentId);

    boolean existsByParentIdAndStudentId(Long parentId, Long studentId);

    java.util.Optional<ParentStudent> findByParentIdAndStudentId(
            Long parentId,
            Long studentId
    );
}