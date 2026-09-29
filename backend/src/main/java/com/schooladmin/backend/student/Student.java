package com.schooladmin.backend.student;


import jakarta.persistence.*;
import com.schooladmin.backend.schoolclass.SchoolClass;

@Entity
@Table(name = "students")
public class Student {

    @ManyToOne
    @JoinColumn(name = "class_id")
    private SchoolClass schoolClass;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String studentNumber;

    private String email;

    public Student() {
    }

    public Student(String firstName, String lastName, String studentNumber, String email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.studentNumber = studentNumber;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getStudentNumber() {
        return studentNumber;
    }

    public void setStudentNumber(String studentNumber) {
        this.studentNumber = studentNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public SchoolClass getSchoolClass() {
    return schoolClass;
}

public void setSchoolClass(SchoolClass schoolClass) {
    this.schoolClass = schoolClass;
}
}