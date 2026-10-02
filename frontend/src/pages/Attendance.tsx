
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import api from "../api/api";

type Student = {
  id: number;
  firstName: string;
  lastName: string;
  studentNumber: string;
};

type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";

export default function Attendance() {
  const [students, setStudents] = useState<Student[]>([]);
  const [studentId, setStudentId] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [status, setStatus] =
    useState<AttendanceStatus>("PRESENT");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadStudents = async () => {
    try {
      const response = await api.get("/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Failed to load students:", error);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const markAttendance = async (e: FormEvent) => {
    e.preventDefault();

    if (!studentId) {
      setMessage("Please select a student.");
      return;
    }

    setMessage("");
    setLoading(true);

    try {
      await api.post("/attendance", {
        studentId: Number(studentId),
        date,
        status,
      });

      setMessage("Attendance recorded successfully.");

      setStudentId("");
      setStatus("PRESENT");
    } catch (error: any) {
      setMessage(
        error.response?.data ||
          "Failed to record attendance."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>School Administration System</h1>
          <p>Attendance management</p>
        </div>

        <button
          className="logout-button"
          onClick={() => {
            window.location.href = "/dashboard";
          }}
        >
          Back to Dashboard
        </button>
      </header>

      <main className="dashboard-main">
        <section className="welcome-section">
          <h2>Attendance</h2>
          <p>
            Record daily attendance for registered students.
          </p>
        </section>

        <section className="module-card student-form-card">
          <div>
            <h2>Mark Attendance</h2>
            <p className="form-description">
              Select a student, attendance date and attendance status.
            </p>
          </div>

          <form onSubmit={markAttendance} className="student-form">
            <div className="form-grid">
              <div className="form-field">
                <label>Student</label>

                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                >
                  <option value="">Select a student</option>

                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.studentNumber} -{" "}
                      {student.firstName} {student.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label>Date</label>

                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label>Status</label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value as AttendanceStatus
                    )
                  }
                >
                  <option value="PRESENT">Present</option>
                  <option value="ABSENT">Absent</option>
                  <option value="LATE">Late</option>
                </select>
              </div>
            </div>

            <button
              className="module-button form-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Saving..." : "Mark Attendance"}
            </button>
          </form>

          {message && (
            <div className="status-message">
              {message}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
