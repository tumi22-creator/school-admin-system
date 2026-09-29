package com.schooladmin.backend.audit;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String action;

    @Column(nullable = false)
    private String username;

    private String details;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column
private String ipAddress;

@Column(length = 1000)
private String userAgent;

    public AuditLog() {
    }

  public AuditLog(
        String action,
        String username,
        String details,
        String ipAddress,
        String userAgent
) {
    this.action = action;
    this.username = username;
    this.details = details;
    this.ipAddress = ipAddress;
    this.userAgent = userAgent;
    this.timestamp = LocalDateTime.now();
}

    public Long getId() {
        return id;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public String getIpAddress() {
    return ipAddress;
}

public void setIpAddress(String ipAddress) {
    this.ipAddress = ipAddress;
}

public String getUserAgent() {
    return userAgent;
}

public void setUserAgent(String userAgent) {
    this.userAgent = userAgent;
}
}