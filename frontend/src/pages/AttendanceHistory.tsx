
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

  return (
    <div>
      <h1>Attendance History</h1>

      <button onClick={() => (window.location.href = "/dashboard")}>
        Back to Dashboard
      </button>

      <hr />

      <h2>Select Student</h2>

      <select
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

      {message && <p>{message}</p>}

      {summary && (
        <>
          <hr />

          <h2>Attendance Summary</h2>

          <p>Total: {summary.total}</p>
          <p>Present: {summary.present}</p>
          <p>Absent: {summary.absent}</p>
          <p>Late: {summary.late}</p>

          <h3>
            Attendance Rate:{" "}
            {summary.attendancePercentage.toFixed(2)}%
          </h3>
        </>
      )}

      <hr />

      <h2>Attendance History</h2>

      {attendance.length === 0 ? (
        <p>No attendance records found.</p>
      ) : (
        <table>
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
                <td>{record.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

