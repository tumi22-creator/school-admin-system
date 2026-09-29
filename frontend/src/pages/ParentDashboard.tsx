import { useEffect, useState } from "react";
import api from "../api/api";

type Student = {
  id: number;
  firstName: string;
  lastName: string;
  studentNumber: string;
};

type DashboardData = {
  student: Student;
  attendance?: {
    total: number;
    present: number;
    absent: number;
    late: number;
    attendancePercentage: number;
  };
  averageMark?: number;
  outstandingBalance?: number;
};

function ParentDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  const parentId = localStorage.getItem("userId");

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const response = await api.get(`/parents/${parentId}/students`);
      setStudents(response.data);

      if (response.data.length > 0) {
        setSelectedStudent(String(response.data[0].id));
      }
    } catch (err: any) {
      setError(err.response?.data || "Failed to load students");
    }
  };

  useEffect(() => {
    if (selectedStudent) {
      loadDashboard();
    }
  }, [selectedStudent]);

  const loadDashboard = async () => {
  try {
    const response = await api.get(
      `/parents/${parentId}/student/${selectedStudent}/dashboard`
    );

    console.log("PARENT DASHBOARD DATA:", response.data);

    setDashboard(response.data);
  } catch (err: any) {
    setError(err.response?.data || "Failed to load dashboard");
  }
};

  const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");

  window.location.href = "/";
};

  return (
    <div style={{ padding: "30px" }}>
      <h1>Parent Dashboard</h1>

      <button onClick={logout}>
        Logout
      </button>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      <label>Select Student</label>

      <br />

      <select
        value={selectedStudent}
        onChange={(e) => setSelectedStudent(e.target.value)}
      >
        <option value="">Select student</option>

        {students.map((student) => (
          <option key={student.id} value={student.id}>
            {student.firstName} {student.lastName} (
            {student.studentNumber})
          </option>
        ))}
      </select>

      {dashboard && (
        <div style={{ marginTop: "30px" }}>
          <h2>
            {dashboard.student.firstName}{" "}
            {dashboard.student.lastName}
          </h2>

          <p>
            Student Number: {dashboard.student.studentNumber}
          </p>

          <hr />

          <h3>Attendance</h3>

          <p>
            Attendance:{" "}
            {dashboard.attendance?.attendancePercentage ?? 0}%
          </p>

          <p>
            Present: {dashboard.attendance?.present ?? 0}
          </p>

          <p>
            Absent: {dashboard.attendance?.absent ?? 0}
          </p>

          <p>
            Late: {dashboard.attendance?.late ?? 0}
          </p>

          <hr />

          <h3>Academic Performance</h3>

          <p>
            Average Mark: {dashboard.averageMark ?? 0}%
          </p>

          <hr />

          <h3>Fees</h3>

          <hr />

<h3>Student Information</h3>

<button
  onClick={() =>
    window.location.href = `/marks?studentId=${selectedStudent}`
  }
>
  View Marks
</button>

<button
  onClick={() =>
    window.location.href = `/fees?studentId=${selectedStudent}`
  }
  style={{ marginLeft: "10px" }}
>
  View Fees
</button>

<button
  onClick={() =>
    (window.location.href = `/parent-marks?studentId=${selectedStudent}`)
  }
>
  View Marks
</button>

<button
  onClick={() =>
    (window.location.href = `/parent-fees?studentId=${selectedStudent}`)
  }
>
  View Fees
</button>


          <p>
            Outstanding Balance: R
            {dashboard.outstandingBalance ?? 0}
          </p>

          
        </div>
      )}
    </div>
  );
}

export default ParentDashboard;