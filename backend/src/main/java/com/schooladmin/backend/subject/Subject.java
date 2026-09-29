package com.schooladmin.backend.subject;

import jakarta.persistence.*;
import com.schooladmin.backend.schoolclass.SchoolClass;
import com.schooladmin.backend.teacher.Teacher;
import java.util.HashSet;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonIgnore;


@Entity
@Table(name = "subjects")
public class Subject {


@JsonIgnore
    @ManyToMany
@JoinTable(
        name = "teacher_subjects",
        joinColumns = @JoinColumn(name = "subject_id"),
        inverseJoinColumns = @JoinColumn(name = "teacher_id")
)
private Set<Teacher> teachers = new HashSet<>();
@JsonIgnore
@ManyToMany
@JoinTable(
        name = "class_subjects",
        joinColumns = @JoinColumn(name = "subject_id"),
        inverseJoinColumns = @JoinColumn(name = "class_id")
)
private Set<SchoolClass> classes = new HashSet<>();

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, unique = true)
    private String code;

    public Subject() {
    }

    public Subject(String name, String code) {
        this.name = name;
        this.code = code;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Set<Teacher> getTeachers() {
    return teachers;
}

public void setTeachers(Set<Teacher> teachers) {
    this.teachers = teachers;
}

public Set<SchoolClass> getClasses() {
    return classes;
}

public void setClasses(Set<SchoolClass> classes) {
    this.classes = classes;
}
}