package com.schooladmin.backend.teachingassignment;

import com.schooladmin.backend.schoolclass.SchoolClass;
import com.schooladmin.backend.subject.Subject;
import com.schooladmin.backend.teacher.Teacher;
import jakarta.persistence.*;

@Entity
@Table(
        name = "teaching_assignments",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"teacher_id", "subject_id", "class_id"}
                )
        }
)
public class TeachingAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;

    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @ManyToOne
    @JoinColumn(name = "class_id", nullable = false)
    private SchoolClass schoolClass;

    public TeachingAssignment() {
    }

    public TeachingAssignment(
            Teacher teacher,
            Subject subject,
            SchoolClass schoolClass
    ) {
        this.teacher = teacher;
        this.subject = subject;
        this.schoolClass = schoolClass;
    }

    public Long getId() {
        return id;
    }

    public Teacher getTeacher() {
        return teacher;
    }

    public void setTeacher(Teacher teacher) {
        this.teacher = teacher;
    }

    public Subject getSubject() {
        return subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
    }

    public SchoolClass getSchoolClass() {
        return schoolClass;
    }

    public void setSchoolClass(SchoolClass schoolClass) {
        this.schoolClass = schoolClass;
    }
}