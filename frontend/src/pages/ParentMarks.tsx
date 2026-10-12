
import { useEffect, useState } from "react";
import api from "../api/api";

type Mark = {
  assessmentId: number;
  assessmentName: string;
  subject: string;
  mark: number;
  maxMark: number;
  percentage: number;
};

type ReportCard = {
  studentId: number;
  studentName: string;
  marks: Mark[];
  averagePercentage: number;
};

function ParentMarks() {
  const [reportCard, setReportCard] = useState<ReportCard | null>(null);
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

    loadMarks();
  }, []);

  const loadMarks = async () => {
    try {
      setError("");

      const response = await api.get(
        `/parents/${parentId}/student/${studentId}/dashboard`
      );

      setReportCard(response.data);
    } catch (err: any) {
      setError(
        err.response?.data ||
          "Failed to load student marks"
      );
    }
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>Student Marks</h1>
          <p>View academic performance and assessment results.</p>
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

        {reportCard && (
          <>
            <section className="welcome-section">
              <h2>{reportCard.studentName}</h2>
              <p>
                Academic performance and assessment results.
              </p>
            </section>

            <section className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">
                  Average Mark
                </span>

                <strong className="stat-value">
                  {reportCard.averagePercentage ?? 0}%
                </strong>

                <span className="stat-description">
                  Overall academic average
                </span>
              </div>

              <div className="stat-card">
                <span className="stat-label">
                  Assessments
                </span>

                <strong className="stat-value">
                  {reportCard.marks?.length ?? 0}
                </strong>

                <span className="stat-description">
                  Recorded assessments
                </span>
              </div>
            </section>

            <section>
              <div className="section-heading">
                <h2>Assessment Results</h2>
                <p>
                  Detailed marks for each recorded assessment.
                </p>
              </div>

              {reportCard.marks?.length === 0 ? (
                <div className="stat-card">
                  <p className="form-description">
                    No marks available.
                  </p>
                </div>
              ) : (
                <div className="stat-card">
                  <div className="table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Subject</th>
                          <th>Assessment</th>
                          <th>Mark</th>
                          <th>Percentage</th>
                        </tr>
                      </thead>

                      <tbody>
                        {reportCard.marks?.map((mark) => (
                          <tr key={mark.assessmentId}>
                            <td>{mark.subject}</td>

                            <td>{mark.assessmentName}</td>

                            <td>
                              {mark.mark} / {mark.maxMark}
                            </td>

                            <td>{mark.percentage}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default ParentMarks;

