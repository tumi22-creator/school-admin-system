package com.schooladmin.backend.fees;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeeRepository extends JpaRepository<Fee, Long> {

    List<Fee> findByStudentId(Long studentId);

    List<Fee> findByStudentIdAndYear(Long studentId, Integer year);
}