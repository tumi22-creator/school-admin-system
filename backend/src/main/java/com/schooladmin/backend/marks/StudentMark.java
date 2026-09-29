package com.schooladmin.backend.marks;

import com.schooladmin.backend.student.Student;
import jakarta.persistence.*;

@Entity
@Table(
        name = "student_marks",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"student_id", "assessment_id"}
                )
        }
)
public class StudentMark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne(optional = false)
    @JoinColumn(name = "assessment_id")
    private Assessment assessment;

    @Column(nullable = false)
    private double mark;

    public StudentMark() {
    }

    public Long getId() {
        return id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Assessment getAssessment() {
        return assessment;
    }

    public void setAssessment(Assessment assessment) {
        this.assessment = assessment;
    }

    public double getMark() {
        return mark;
    }

    public void setMark(double mark) {
        this.mark = mark;
    }
}