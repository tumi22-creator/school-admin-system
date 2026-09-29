import { useEffect, useState } from "react";
import api from "../api/api";

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

function ParentFees() {
  const [summary, setSummary] = useState<FeeSummary | null>(null);
  const [error, setError] = useState("");

  const parentId = localStorage.getItem("userId");

  const studentId = new URLSearchParams(
    window.location.search
  ).get("studentId");

  useEffect(() => {
    if (!studentId) {
      setError("No student selected");
      return;
    }

    loadFees();
  }, []);

  const loadFees = async () => {
    try {
      const response = await api.get(
        `/parents/${parentId}/student/${studentId}/fees`
      );

      setSummary(response.data);
    } catch (err: any) {
      setError(
        err.response?.data || "Failed to load fee information"
      );
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Student Fees</h1>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {summary && (
        <>
          <h2>Fee Summary</h2>

          <p>
            Total Fees: R{summary.totalFees}
          </p>

          <p>
            Total Paid: R{summary.totalPaid}
          </p>

          <p>
            Outstanding Balance: R{summary.outstandingBalance}
          </p>

          <hr />

          <h2>Fees</h2>

          {summary.fees.length === 0 ? (
            <p>No fees recorded.</p>
          ) : (
            summary.fees.map((fee) => (
              <div key={fee.id}>
                <strong>{fee.feeType}</strong>
                {" — "}
                R{fee.amount}
                {" — "}
                {fee.description}
                {" — "}
                {fee.year}
              </div>
            ))
          )}

          <hr />

          <h2>Payments</h2>

          {summary.payments.length === 0 ? (
            <p>No payments recorded.</p>
          ) : (
            summary.payments.map((payment) => (
              <div key={payment.id}>
                R{payment.amount}
                {" — "}
                {payment.reference}
                {" — "}
                {payment.paymentDate}
              </div>
            ))
          )}

          <br />

          <button
            onClick={() =>
              (window.location.href = "/dashboard")
            }
          >
            Back to Dashboard
          </button>
        </>
      )}
    </div>
  );
}

export default ParentFees;