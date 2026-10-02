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
    <div>
      <h1>Student Enrollments</h1>

      <button onClick={() => (window.location.href = "/dashboard")}>
        Back to Dashboard
      </button>

      <hr />

      <h2>Enroll Student in Subject</h2>

      <form onSubmit={addEnrollment}>
        <div>
          <label>Student</label>
          <br />

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

        <br />

        <div>
          <label>Subject</label>
          <br />

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

        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Enrolling..." : "Enroll Student"}
        </button>
      </form>

      {message && <p>{message}</p>}

      <hr />

      <h2>Current Enrollments</h2>

      {enrollments.length === 0 ? (
        <p>No enrollments found.</p>
      ) : (
        <table>
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
                  {enrollment.student.firstName}{" "}
                  {enrollment.student.lastName}
                </td>

                <td>{enrollment.student.studentNumber}</td>

                <td>{enrollment.subject.name}</td>

                <td>{enrollment.subject.code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}