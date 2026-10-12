
import { useEffect, useState } from "react";
import api from "../api/api";

type Student = {
  id: number;
  firstName: string;
  lastName: string;
  studentNumber: string;
};

type Attendance = {
  id: number;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE";
};

type Summary = {
  total: number;
  present: number;
  absent: number;
  late: number;
  attendancePercentage: number;
};

export default function AttendanceHistory() {
  const [students, setStudents] = useState<Student[]>([]);
  const [studentId, setStudentId] = useState("");
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/students")
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error("Failed to load students:", error);
      });
  }, []);

  const loadAttendance = async (id: string) => {
    if (!id) {
      setAttendance([]);
      setSummary(null);
      setMessage("");
      return;
    }

    setMessage("");

    try {
      const historyResponse = await api.get(
        `/attendance/student/${id}`
      );

      setAttendance(historyResponse.data);

      const summaryResponse = await api.get(
        `/attendance/student/${id}/summary`
      );

      setSummary(summaryResponse.data);
    } catch (error: any) {
      console.error(error);

      setMessage(
        error.response?.data ||
          "Failed to load attendance."
      );

      setAttendance([]);
      setSummary(null);
    }
  };

  const handleStudentChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const id = e.target.value;

    setStudentId(id);
    loadAttendance(id);
  };

  const getStatusLabel = (status: Attendance["status"]) => {
    if (status === "PRESENT") return "Present";
    if (status === "ABSENT") return "Absent";
    return "Late";
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>Attendance History</h1>
          <p>View attendance records and attendance summaries.</p>
        </div>

        <button
          className="logout-button"
          onClick={() => (window.location.href = "/dashboard")}
        >
          Back to Dashboard
        </button>
      </header>

      <main className="dashboard-main">
        <section className="student-form-card stat-card">
          <div className="section-heading">
            <h2>Select Student</h2>
            <p>
              Choose a student to view their attendance history.
            </p>
          </div>

          <div className="form-field">
            <label htmlFor="student">Student</label>

            <select
              id="student"
              value={studentId}
              onChange={handleStudentChange}
            >
              <option value="">Select a student</option>

              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.studentNumber} - {student.firstName}{" "}
                  {student.lastName}
                </option>
              ))}
            </select>
          </div>

          {message && (
            <div className="status-message">
              {message}
            </div>
          )}
        </section>

        {summary && (
          <section>
            <div className="section-heading">
              <h2>Attendance Summary</h2>
              <p>Overview of the selected student's attendance.</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Total Records</span>
                <strong className="stat-value">
                  {summary.total}
                </strong>
                <span className="stat-description">
                  Attendance records
                </span>
              </div>

              <div className="stat-card">
                <span className="stat-label">Present</span>
                <strong className="stat-value">
                  {summary.present}
                </strong>
                <span className="stat-description">
                  Days present
                </span>
              </div>

              <div className="stat-card">
                <span className="stat-label">Absent</span>
                <strong className="stat-value">
                  {summary.absent}
                </strong>
                <span className="stat-description">
                  Days absent
                </span>
              </div>

              <div className="stat-card">
                <span className="stat-label">Late</span>
                <strong className="stat-value">
                  {summary.late}
                </strong>
                <span className="stat-description">
                  Late arrivals
                </span>
              </div>
            </div>

            <div className="stat-card">
              <span className="stat-label">
                Attendance Rate
              </span>

              <strong className="stat-value">
                {summary.attendancePercentage.toFixed(2)}%
              </strong>

              <span className="stat-description">
                Overall attendance percentage
              </span>
            </div>
          </section>
        )}

        <section>
          <div className="section-heading">
            <h2>Attendance History</h2>
            <p>
              Detailed attendance records for the selected student.
            </p>
          </div>

          {attendance.length === 0 ? (
            <div className="stat-card">
              <p className="form-description">
                {studentId
                  ? "No attendance records found."
                  : "Select a student to view attendance records."}
              </p>
            </div>
          ) : (
            <div className="stat-card">
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {attendance.map((record) => (
                      <tr key={record.id}>
                        <td>{record.date}</td>
                        <td>{getStatusLabel(record.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

