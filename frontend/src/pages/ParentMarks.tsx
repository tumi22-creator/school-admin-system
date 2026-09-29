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
  const studentId = new URLSearchParams(window.location.search).get(
    "studentId"
  );

  useEffect(() => {
    if (!studentId) {
      setError("No student selected");
      return;
    }

    loadMarks();
  }, []);

  const loadMarks = async () => {
    try {
      const response = await api.get(
        `/parents/${parentId}/student/${studentId}/dashboard`
      );

      setReportCard(response.data);
    } catch (err: any) {
      setError(
        err.response?.data || "Failed to load student marks"
      );
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Student Marks</h1>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {reportCard && (
        <>
          <h2>{reportCard.studentName}</h2>

          <h3>
            Average: {reportCard.averagePercentage ?? 0}%
          </h3>

          {reportCard.marks?.length === 0 ? (
            <p>No marks available.</p>
          ) : (
            <table
              style={{
                borderCollapse: "collapse",
                marginTop: "20px",
              }}
            >
              <thead>
                <tr>
                  <th style={{ padding: "10px" }}>Subject</th>
                  <th style={{ padding: "10px" }}>Assessment</th>
                  <th style={{ padding: "10px" }}>Mark</th>
                  <th style={{ padding: "10px" }}>Percentage</th>
                </tr>
              </thead>

              <tbody>
                {reportCard.marks?.map((mark) => (
                  <tr key={mark.assessmentId}>
                    <td style={{ padding: "10px" }}>
                      {mark.subject}
                    </td>

                    <td style={{ padding: "10px" }}>
                      {mark.assessmentName}
                    </td>

                    <td style={{ padding: "10px" }}>
                      {mark.mark} / {mark.maxMark}
                    </td>

                    <td style={{ padding: "10px" }}>
                      {mark.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

export default ParentMarks;