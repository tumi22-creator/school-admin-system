import { useEffect, useState } from "react";
import api from "../api/api";

type Student = {
  id: number;
  firstName: string;
  lastName: string;
  studentNumber: string;
};

type Fee = {
  id: number;
  feeType: string;
  amount: number;
  description: string;
  year: number;
};

type Payment = {
  id: number;
  amount: number;
  paymentDate: string;
  reference: string;
  description: string;
};

type FeeSummary = {
  fees: Fee[];
  payments: Payment[];
  totalFees: number;
  totalPaid: number;
  outstandingBalance: number;
};

function Fees() {
  const [students, setStudents] = useState<Student[]>([]);
  const [studentId, setStudentId] = useState("");

  const [feeType, setFeeType] = useState("TUITION");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));

  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentDescription, setPaymentDescription] = useState("");

  const [summary, setSummary] = useState<FeeSummary | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const response = await api.get("/students");
      setStudents(response.data);
    } catch (error) {
      setMessage("Failed to load students");
    }
  };

  const loadFees = async () => {
    if (!studentId) {
      setMessage("Select a student first");
      return;
    }

    try {
      const response = await api.get(`/fees/student/${studentId}`);
      setSummary(response.data);
      setMessage("");
    } catch (error: any) {
      setMessage(
        error.response?.data || "Failed to load fee information"
      );
    }
  };

  const addFee = async () => {
    if (!studentId || !amount) {
      setMessage("Student and amount are required");
      return;
    }

    try {
      await api.post("/fees", {
        studentId: Number(studentId),
        feeType,
        amount: Number(amount),
        description,
        year: Number(year),
      });

      setAmount("");
      setDescription("");

      setMessage("Fee added successfully");

      await loadFees();
    } catch (error: any) {
      setMessage(
        error.response?.data || "Failed to add fee"
      );
    }
  };

  const recordPayment = async () => {
    if (!studentId || !paymentAmount) {
      setMessage("Student and payment amount are required");
      return;
    }

    try {
      await api.post("/fees/payments", {
        studentId: Number(studentId),
        amount: Number(paymentAmount),
        paymentDate: new Date().toISOString().split("T")[0],
        reference: paymentReference,
        description: paymentDescription,
      });

      setPaymentAmount("");
      setPaymentReference("");
      setPaymentDescription("");

      setMessage("Payment recorded successfully");

      await loadFees();
    } catch (error: any) {
      setMessage(
        error.response?.data || "Failed to record payment"
      );
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Fees Management</h1>

      {message && <p>{message}</p>}

      <label>Student</label>

      <br />

      <select
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
      >
        <option value="">Select student</option>

        {students.map((student) => (
          <option key={student.id} value={student.id}>
            {student.firstName} {student.lastName} (
            {student.studentNumber})
          </option>
        ))}
      </select>

      <button
        onClick={loadFees}
        style={{ marginLeft: "10px" }}
      >
        Load Fees
      </button>

      <hr />

      <h2>Add Fee</h2>

      <select
        value={feeType}
        onChange={(e) => setFeeType(e.target.value)}
      >
        <option value="TUITION">Tuition</option>
        <option value="REGISTRATION">Registration</option>
        <option value="TRANSPORT">Transport</option>
        <option value="UNIFORM">Uniform</option>
        <option value="EXAM">Exam</option>
        <option value="OTHER">Other</option>
      </select>

      <br />
      <br />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br />
      <br />

      <input
        type="number"
        placeholder="Year"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      />

      <br />
      <br />

      <button onClick={addFee}>
        Add Fee
      </button>

      <hr />

      <h2>Record Payment</h2>

      <input
        type="number"
        placeholder="Payment amount"
        value={paymentAmount}
        onChange={(e) => setPaymentAmount(e.target.value)}
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Payment reference"
        value={paymentReference}
        onChange={(e) => setPaymentReference(e.target.value)}
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Description"
        value={paymentDescription}
        onChange={(e) => setPaymentDescription(e.target.value)}
      />

      <br />
      <br />

      <button onClick={recordPayment}>
        Record Payment
      </button>

      {summary && (
        <>
          <hr />

          <h2>Fee Summary</h2>

          <p>
            Total Fees: R{summary.totalFees}
          </p>

          <p>
            Total Paid: R{summary.totalPaid}
          </p>

          <p>
            Outstanding: R{summary.outstandingBalance}
          </p>

          <h3>Fees</h3>

          {summary.fees.map((fee) => (
            <div key={fee.id}>
              {fee.feeType} — R{fee.amount} — {fee.description}
            </div>
          ))}

          <h3>Payments</h3>

          {summary.payments.map((payment) => (
            <div key={payment.id}>
              R{payment.amount} — {payment.reference} —{" "}
              {payment.paymentDate}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default Fees;