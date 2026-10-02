package com.schooladmin.backend.parentstudent;

import com.schooladmin.backend.student.Student;
import com.schooladmin.backend.user.User;
import jakarta.persistence.*;

@Entity
@Table(
        name = "parent_students",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"parent_id", "student_id"}
                )
        }
)
public class ParentStudent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "parent_id", nullable = false)
    private User parent;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    public ParentStudent() {
    }

    public ParentStudent(User parent, Student student) {
        this.parent = parent;
        this.student = student;
    }

    public Long getId() {
        return id;
    }

    public User getParent() {
        return parent;
    }

    public void setParent(User parent) {
        this.parent = parent;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }
}