
import { FormEvent, useEffect, useState } from "react";
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
    <div>
      <h1>Attendance</h1>

      <button onClick={() => (window.location.href = "/dashboard")}>
        Back to Dashboard
      </button>

      <hr />

      <h2>Mark Attendance</h2>

      <form onSubmit={markAttendance}>
        <div>
          <label>Student</label>

          <select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
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

        <div>
          <label>Date</label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Status</label>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as AttendanceStatus)
            }
          >
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
            <option value="LATE">Late</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Mark Attendance"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

