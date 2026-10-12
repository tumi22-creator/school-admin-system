
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
      const response = await api.get(
        `/parents/${parentId}/students`
      );

      setStudents(response.data);

      if (response.data.length > 0) {
        setSelectedStudent(String(response.data[0].id));
      }
    } catch (err: any) {
      setError(
        err.response?.data || "Failed to load students"
      );
    }
  };

  useEffect(() => {
    if (selectedStudent) {
      loadDashboard();
    }
  }, [selectedStudent]);

  const loadDashboard = async () => {
    try {
      setError("");

      const response = await api.get(
        `/parents/${parentId}/student/${selectedStudent}/dashboard`
      );

      setDashboard(response.data);
    } catch (err: any) {
      setError(
        err.response?.data || "Failed to load dashboard"
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");

    window.location.href = "/";
  };

  const navigate = (path: string) => {
    window.location.href = path;
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>Parent Dashboard</h1>
          <p>Monitor your child's academic and school information.</p>
        </div>

        <div className="user-section">
          <div>
            <strong>{localStorage.getItem("email")}</strong>
            <span>Parent</span>
          </div>

          <button
            className="logout-button"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {error && (
          <div className="status-message">
            {error}
          </div>
        )}

        <section className="student-form-card stat-card">
          <div className="section-heading">
            <h2>Select Student</h2>
            <p>
              Choose which student you want to view.
            </p>
          </div>

          <div className="form-field">
            <label htmlFor="student">
              Student
            </label>

            <select
              id="student"
              value={selectedStudent}
              onChange={(e) =>
                setSelectedStudent(e.target.value)
              }
            >
              <option value="">
                Select student
              </option>

              {students.map((student) => (
                <option
                  key={student.id}
                  value={student.id}
                >
                  {student.firstName} {student.lastName} (
                  {student.studentNumber})
                </option>
              ))}
            </select>
          </div>
        </section>

        {dashboard && (
          <>
            <section className="welcome-section">
              <h2>
                {dashboard.student.firstName}{" "}
                {dashboard.student.lastName}
              </h2>

              <p>
                Student Number:{" "}
                {dashboard.student.studentNumber}
              </p>
            </section>

            <section>
              <div className="section-heading">
                <h2>Attendance</h2>
                <p>
                  Attendance overview for the selected student.
                </p>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-label">
                    Attendance Rate
                  </span>

                  <strong className="stat-value">
                    {(
                      dashboard.attendance
                        ?.attendancePercentage ?? 0
                    ).toFixed(2)}
                    %
                  </strong>

                  <span className="stat-description">
                    Overall attendance
                  </span>
                </div>

                <div className="stat-card">
                  <span className="stat-label">
                    Present
                  </span>

                  <strong className="stat-value">
                    {dashboard.attendance?.present ?? 0}
                  </strong>

                  <span className="stat-description">
                    Days present
                  </span>
                </div>

                <div className="stat-card">
                  <span className="stat-label">
                    Absent
                  </span>

                  <strong className="stat-value">
                    {dashboard.attendance?.absent ?? 0}
                  </strong>

                  <span className="stat-description">
                    Days absent
                  </span>
                </div>

                <div className="stat-card">
                  <span className="stat-label">
                    Late
                  </span>

                  <strong className="stat-value">
                    {dashboard.attendance?.late ?? 0}
                  </strong>

                  <span className="stat-description">
                    Late arrivals
                  </span>
                </div>
              </div>
            </section>

            <section>
              <div className="section-heading">
                <h2>Academic & Financial Overview</h2>
                <p>
                  Quick overview of marks and outstanding fees.
                </p>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-label">
                    Average Mark
                  </span>

                  <strong className="stat-value">
                    {dashboard.averageMark ?? 0}%
                  </strong>

                  <span className="stat-description">
                    Current academic average
                  </span>
                </div>

                <div className="stat-card">
                  <span className="stat-label">
                    Outstanding Balance
                  </span>

                  <strong className="stat-value">
                    R
                    {(dashboard.outstandingBalance ?? 0).toFixed(
                      2
                    )}
                  </strong>

                  <span className="stat-description">
                    Fees still outstanding
                  </span>
                </div>
              </div>
            </section>

            <section>
              <div className="section-heading">
                <h2>Student Information</h2>
                <p>
                  Access detailed academic and financial records.
                </p>
              </div>

              <div className="module-grid">
                <div className="module-card">
                  <div>
                    <h3>Marks</h3>
                    <p>
                      View the student's assessments and academic
                      performance.
                    </p>
                  </div>

                  <button
                    className="module-button"
                    onClick={() =>
                      navigate(
                        `/parent-marks?studentId=${selectedStudent}`
                      )
                    }
                  >
                    View Marks
                  </button>
                </div>

                <div className="module-card">
                  <div>
                    <h3>Fees</h3>
                    <p>
                      View fees, payments and outstanding balances.
                    </p>
                  </div>

                  <button
                    className="module-button"
                    onClick={() =>
                      navigate(
                        `/parent-fees?studentId=${selectedStudent}`
                      )
                    }
                  >
                    View Fees
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default ParentDashboard;

