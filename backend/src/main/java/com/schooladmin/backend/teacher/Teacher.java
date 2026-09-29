package com.schooladmin.backend.teacher;

import jakarta.persistence.*;
import com.schooladmin.backend.schoolclass.SchoolClass;

@Entity
@Table(name = "teachers")
public class Teacher {

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
    private String employeeNumber;

    @Column(unique = true)
    private String email;

    public Teacher() {
    }

    public Teacher(String firstName, String lastName, String employeeNumber, String email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.employeeNumber = employeeNumber;
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

    public String getEmployeeNumber() {
        return employeeNumber;
    }

    public void setEmployeeNumber(String employeeNumber) {
        this.employeeNumber = employeeNumber;
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