
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
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>Fees Management</h1>
          <p>Manage student fees, payments and outstanding balances.</p>
        </div>

        <button
          className="logout-button"
          onClick={() => (window.location.href = "/dashboard")}
        >
          Back to Dashboard
        </button>
      </header>

      <main className="dashboard-main">
        {message && (
          <div className="status-message">
            {message}
          </div>
        )}

        <section className="student-form-card stat-card">
          <div className="section-heading">
            <h2>Select Student</h2>
            <p>
              Choose a student before managing their fees or payments.
            </p>
          </div>

          <div className="assignment-controls">
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
              className="table-button primary"
              onClick={loadFees}
            >
              Load Fees
            </button>
          </div>
        </section>

        <section className="student-form-card stat-card">
          <div className="section-heading">
            <h2>Add Fee</h2>
            <p>Assign a new fee to the selected student.</p>
          </div>

          <div className="student-form">
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="fee-type">Fee Type</label>

                <select
                  id="fee-type"
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
              </div>

              <div className="form-field">
                <label htmlFor="fee-amount">Amount</label>

                <input
                  id="fee-amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="fee-description">
                  Description
                </label>

                <input
                  id="fee-description"
                  type="text"
                  placeholder="Fee description"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                />
              </div>

              <div className="form-field">
                <label htmlFor="fee-year">Year</label>

                <input
                  id="fee-year"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>
            </div>

            <button
              className="module-button form-submit"
              onClick={addFee}
            >
              Add Fee
            </button>
          </div>
        </section>

        <section className="student-form-card stat-card">
          <div className="section-heading">
            <h2>Record Payment</h2>
            <p>Record a payment made by the selected student.</p>
          </div>

          <div className="student-form">
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="payment-amount">
                  Payment Amount
                </label>

                <input
                  id="payment-amount"
                  type="number"
                  placeholder="0.00"
                  value={paymentAmount}
                  onChange={(e) =>
                    setPaymentAmount(e.target.value)
                  }
                />
              </div>

              <div className="form-field">
                <label htmlFor="payment-reference">
                  Payment Reference
                </label>

                <input
                  id="payment-reference"
                  type="text"
                  placeholder="e.g. PAY-001"
                  value={paymentReference}
                  onChange={(e) =>
                    setPaymentReference(e.target.value)
                  }
                />
              </div>

              <div className="form-field">
                <label htmlFor="payment-description">
                  Description
                </label>

                <input
                  id="payment-description"
                  type="text"
                  placeholder="Payment description"
                  value={paymentDescription}
                  onChange={(e) =>
                    setPaymentDescription(e.target.value)
                  }
                />
              </div>
            </div>

            <button
              className="module-button form-submit"
              onClick={recordPayment}
            >
              Record Payment
            </button>
          </div>
        </section>

        {summary && (
          <section>
            <div className="section-heading">
              <h2>Fee Summary</h2>
              <p>
                Financial overview for the selected student.
              </p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Total Fees</span>
                <strong className="stat-value">
                  R{summary.totalFees.toFixed(2)}
                </strong>
                <span className="stat-description">
                  Total fees charged
                </span>
              </div>

              <div className="stat-card">
                <span className="stat-label">Total Paid</span>
                <strong className="stat-value">
                  R{summary.totalPaid.toFixed(2)}
                </strong>
                <span className="stat-description">
                  Total payments received
                </span>
              </div>

              <div className="stat-card">
                <span className="stat-label">
                  Outstanding Balance
                </span>
                <strong className="stat-value">
                  R{summary.outstandingBalance.toFixed(2)}
                </strong>
                <span className="stat-description">
                  Amount still outstanding
                </span>
              </div>
            </div>

            <div className="stat-card">
              <div className="section-heading">
                <h2>Fees</h2>
                <p>Fees assigned to this student.</p>
              </div>

              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Description</th>
                      <th>Year</th>
                    </tr>
                  </thead>

                  <tbody>
                    {summary.fees.length === 0 ? (
                      <tr>
                        <td colSpan={4}>
                          No fees found.
                        </td>
                      </tr>
                    ) : (
                      summary.fees.map((fee) => (
                        <tr key={fee.id}>
                          <td>{fee.feeType}</td>
                          <td>R{fee.amount.toFixed(2)}</td>
                          <td>{fee.description || "-"}</td>
                          <td>{fee.year}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="stat-card" style={{ marginTop: "20px" }}>
              <div className="section-heading">
                <h2>Payments</h2>
                <p>Payments recorded for this student.</p>
              </div>

              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Reference</th>
                      <th>Description</th>
                    </tr>
                  </thead>

                  <tbody>
                    {summary.payments.length === 0 ? (
                      <tr>
                        <td colSpan={4}>
                          No payments found.
                        </td>
                      </tr>
                    ) : (
                      summary.payments.map((payment) => (
                        <tr key={payment.id}>
                          <td>{payment.paymentDate}</td>
                          <td>R{payment.amount.toFixed(2)}</td>
                          <td>{payment.reference || "-"}</td>
                          <td>{payment.description || "-"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default Fees;

