
import { useEffect, useState, type FormEvent } from "react";
import api from "../api/api";

type Student = {
  id: number;
  firstName: string;
  lastName: string;
  studentNumber: string;
};

type Subject = {
  id: number;
  name: string;
  code: string;
};

type Enrollment = {
  id: number;
  student: Student;
  subject: Subject;
};

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [studentId, setStudentId] = useState("");
  const [subjectId, setSubjectId] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadEnrollments = async () => {
    try {
      const response = await api.get("/enrollments");
      setEnrollments(response.data);
    } catch (error) {
      console.error("Failed to load enrollments:", error);
    }
  };

  const loadStudents = async () => {
    try {
      const response = await api.get("/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Failed to load students:", error);
    }
  };

  const loadSubjects = async () => {
    try {
      const response = await api.get("/subjects");
      setSubjects(response.data);
    } catch (error) {
      console.error("Failed to load subjects:", error);
    }
  };

  useEffect(() => {
    loadEnrollments();
    loadStudents();
    loadSubjects();
  }, []);

  const addEnrollment = async (e: FormEvent) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      await api.post("/enrollments", {
        studentId: Number(studentId),
        subjectId: Number(subjectId),
      });

      setMessage("Student enrolled in subject successfully.");

      setStudentId("");
      setSubjectId("");

      await loadEnrollments();
    } catch (error: any) {
      console.error("Failed to create enrollment:", error);

      setMessage(
        error.response?.data || "Failed to create enrollment."
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
          <p>Student enrollment management</p>
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
          <h2>Student Enrollments</h2>
          <p>
            Enroll students in the subjects they are taking.
          </p>
        </section>

        <section className="module-card student-form-card">
          <div>
            <h2>Enroll Student in Subject</h2>
            <p className="form-description">
              Select a student and subject to create an enrollment.
            </p>
          </div>

          <form onSubmit={addEnrollment} className="student-form">
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
                      {student.firstName} {student.lastName} (
                      {student.studentNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label>Subject</label>

                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  required
                >
                  <option value="">Select a subject</option>

                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name} ({subject.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              className="module-button form-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Enrolling..." : "Enroll Student"}
            </button>
          </form>

          {message && (
            <div className="status-message">
              {message}
            </div>
          )}
        </section>

        <section className="module-card">
          <div className="section-heading">
            <h2>Current Enrollments</h2>
            <p>
              {enrollments.length} enrollment
              {enrollments.length === 1 ? "" : "s"} registered.
            </p>
          </div>

          {enrollments.length === 0 ? (
            <p>No enrollments found.</p>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Student Number</th>
                    <th>Subject</th>
                    <th>Code</th>
                  </tr>
                </thead>

                <tbody>
                  {enrollments.map((enrollment) => (
                    <tr key={enrollment.id}>
                      <td>
                        <strong>
                          {enrollment.student.firstName}{" "}
                          {enrollment.student.lastName}
                        </strong>
                      </td>

                      <td>{enrollment.student.studentNumber}</td>

                      <td>{enrollment.subject.name}</td>

                      <td>{enrollment.subject.code}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
