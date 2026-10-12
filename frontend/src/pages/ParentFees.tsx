
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
      setError("");

      const response = await api.get(
        `/parents/${parentId}/student/${studentId}/fees`
      );

      setSummary(response.data);
    } catch (err: any) {
      setError(
        err.response?.data ||
          "Failed to load fee information"
      );
    }
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>Student Fees</h1>
          <p>View fees, payments and outstanding balances.</p>
        </div>

        <button
          className="logout-button"
          onClick={() => (window.location.href = "/dashboard")}
        >
          Back to Dashboard
        </button>
      </header>

      <main className="dashboard-main">
        {error && (
          <div className="status-message">
            {error}
          </div>
        )}

        {summary && (
          <>
            <section>
              <div className="section-heading">
                <h2>Fee Summary</h2>
                <p>
                  Financial overview for the selected student.
                </p>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-label">
                    Total Fees
                  </span>

                  <strong className="stat-value">
                    R{summary.totalFees.toFixed(2)}
                  </strong>

                  <span className="stat-description">
                    Total fees charged
                  </span>
                </div>

                <div className="stat-card">
                  <span className="stat-label">
                    Total Paid
                  </span>

                  <strong className="stat-value">
                    R{summary.totalPaid.toFixed(2)}
                  </strong>

                  <span className="stat-description">
                    Payments received
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
            </section>

            <section>
              <div className="section-heading">
                <h2>Fees</h2>
                <p>
                  Fees currently recorded for the student.
                </p>
              </div>

              <div className="stat-card">
                {summary.fees.length === 0 ? (
                  <p className="form-description">
                    No fees recorded.
                  </p>
                ) : (
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
                        {summary.fees.map((fee) => (
                          <tr key={fee.id}>
                            <td>{fee.feeType}</td>
                            <td>
                              R{fee.amount.toFixed(2)}
                            </td>
                            <td>
                              {fee.description || "-"}
                            </td>
                            <td>{fee.year}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>

            <section>
              <div className="section-heading">
                <h2>Payments</h2>
                <p>
                  Payments recorded for the student.
                </p>
              </div>

              <div className="stat-card">
                {summary.payments.length === 0 ? (
                  <p className="form-description">
                    No payments recorded.
                  </p>
                ) : (
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
                        {summary.payments.map((payment) => (
                          <tr key={payment.id}>
                            <td>{payment.paymentDate}</td>
                            <td>
                              R{payment.amount.toFixed(2)}
                            </td>
                            <td>
                              {payment.reference || "-"}
                            </td>
                            <td>
                              {payment.description || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default ParentFees;

