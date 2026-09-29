package com.schooladmin.backend.user;

import jakarta.persistence.*;
import com.schooladmin.backend.student.Student;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {

    @ManyToMany
    @JoinTable(
        name = "parent_students",
        joinColumns = @JoinColumn(name = "parent_id"),
        inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    private Set<Student> students = new HashSet<>();

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    public User() {
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

public Set<Student> getStudents() {
    return students;
}

public void setStudents(Set<Student> students) {
    this.students = students;
}

}