package com.schooladmin.backend.auth;

import com.schooladmin.backend.user.Role;
import com.schooladmin.backend.user.User;
import com.schooladmin.backend.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.schooladmin.backend.audit.AuditLogService;
import org.springframework.security.crypto.password.PasswordEncoder;
import jakarta.servlet.http.HttpServletRequest;
import com.schooladmin.backend.security.LoginRateLimiter;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuditLogService auditLogService;
    private final LoginRateLimiter loginRateLimiter;

    public AuthController(
        UserRepository userRepository,
        JwtService jwtService,
        AuditLogService auditLogService,
        LoginRateLimiter loginRateLimiter
) {
    this.userRepository = userRepository;
    this.jwtService = jwtService;
    this.auditLogService = auditLogService;
    this.loginRateLimiter = loginRateLimiter;
    this.passwordEncoder = new BCryptPasswordEncoder();
}

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        if (request.email() == null || request.email().isBlank()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        if (request.password() == null || request.password().isBlank()) {
            return ResponseEntity.badRequest().body("Password is required");
        }

        if (userRepository.existsByEmail(request.email())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Email already registered");
        }

        User user = new User();

        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));

        // Registration creates a normal student account.
        user.setRole(Role.STUDENT);

        User savedUser = userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                new RegisterResponse(
                        savedUser.getId(),
                        savedUser.getEmail(),
                        savedUser.getRole()
                )
        );
    }

    public record RegisterRequest(
            String email,
            String password
    ) {
    }

    public record RegisterResponse(
            Long id,
            String email,
            Role role
    ) {
    }

@PostMapping("/login")
public ResponseEntity<?> login(
        @RequestBody LoginRequest request,
        HttpServletRequest httpRequest
) {

     String ipAddress = httpRequest.getRemoteAddr();
String userAgent = httpRequest.getHeader("User-Agent");

if (!loginRateLimiter.isAllowed(ipAddress)) {
    auditLogService.log(
            "LOGIN_RATE_LIMITED",
            request.email(),
            "Login rate limit exceeded",
            ipAddress,
            userAgent
    );

    return ResponseEntity.status(429)
            .body("Too many login attempts. Please try again later.");
}   

   

    User user = userRepository.findByEmail(request.email()).orElse(null);

    if (user == null || !passwordEncoder.matches(
            request.password(),
            user.getPassword()
    )) {

        auditLogService.log(
                "LOGIN_FAILED",
                request.email(),
                "Failed login attempt",
                ipAddress,
                userAgent
        );

        return ResponseEntity.status(401)
                .body("Invalid email or password");
    }

    String token = jwtService.generateToken(
            user.getEmail(),
            user.getRole().name()
    );

    auditLogService.log(
            "LOGIN_SUCCESS",
            user.getEmail(),
            "Successful login",
            ipAddress,
            userAgent
    );

    return ResponseEntity.ok(
            new LoginResponse(
                    token,
                      user.getId(),
                user.getEmail(),
                user.getRole()
            )
    );
}
public record LoginRequest(
        String email,
        String password
) {
}

public record LoginResponse(
        String token,
        Long userId,
        String email,
        Role role
) {
}


}