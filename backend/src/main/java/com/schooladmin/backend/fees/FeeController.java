package com.schooladmin.backend.fees;

import com.schooladmin.backend.student.Student;
import com.schooladmin.backend.student.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fees")
public class FeeController {

    private final FeeRepository feeRepository;
    private final PaymentRepository paymentRepository;
    private final StudentRepository studentRepository;

    public FeeController(
            FeeRepository feeRepository,
            PaymentRepository paymentRepository,
            StudentRepository studentRepository
    ) {
        this.feeRepository = feeRepository;
        this.paymentRepository = paymentRepository;
        this.studentRepository = studentRepository;
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getStudentFees(@PathVariable Long studentId) {

        if (!studentRepository.existsById(studentId)) {
            return ResponseEntity.notFound().build();
        }

        List<Fee> fees = feeRepository.findByStudentId(studentId);

        List<Payment> payments =
        paymentRepository.findByStudentIdOrderByPaymentDateDesc(studentId);

java.math.BigDecimal totalFees = fees.stream()
        .map(Fee::getAmount)
        .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);

java.math.BigDecimal totalPaid = payments.stream()
        .map(Payment::getAmount)
        .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);

java.math.BigDecimal outstandingBalance =
        totalFees.subtract(totalPaid);

return ResponseEntity.ok(
        new FeeOverviewResponse(
                fees,
                payments,
                totalFees,
                totalPaid,
                outstandingBalance
        )
);
    }

    @PostMapping
    public ResponseEntity<?> createFee(@RequestBody FeeRequest request) {

        Student student = studentRepository
                .findById(request.studentId())
                .orElse(null);

        if (student == null) {
            return ResponseEntity.badRequest().body("Student not found");
        }

        Fee fee = new Fee();
        fee.setStudent(student);
        fee.setType(request.type());
        fee.setAmount(request.amount());
        fee.setDescription(request.description());
        fee.setYear(request.year());

        return ResponseEntity.ok(feeRepository.save(fee));
    }

    @PostMapping("/payments")
    public ResponseEntity<?> recordPayment(
            @RequestBody PaymentRequest request
    ) {

        Student student = studentRepository
                .findById(request.studentId())
                .orElse(null);

        if (student == null) {
            return ResponseEntity.badRequest().body("Student not found");
        }

        Payment payment = new Payment();
        payment.setStudent(student);
        payment.setAmount(request.amount());
        payment.setPaymentDate(request.paymentDate());
        payment.setReference(request.reference());
        payment.setDescription(request.description());

        return ResponseEntity.ok(paymentRepository.save(payment));
    }

    public record FeeRequest(
            Long studentId,
            FeeType type,
            java.math.BigDecimal amount,
            String description,
            Integer year
    ) {
    }

    public record PaymentRequest(
            Long studentId,
            java.math.BigDecimal amount,
            java.time.LocalDate paymentDate,
            String reference,
            String description
    ) {
    }

   public record FeeOverviewResponse(
        List<Fee> fees,
        List<Payment> payments,
        java.math.BigDecimal totalFees,
        java.math.BigDecimal totalPaid,
        java.math.BigDecimal outstandingBalance
) {
}
}