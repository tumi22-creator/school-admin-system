
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import api from "../api/api";

type SchoolClass = {
  id: number;
  name: string;
  grade: string;
};

type Student = {
  id: number;
  firstName: string;
  lastName: string;
  studentNumber: string;
  email: string;
  schoolClass?: SchoolClass;
};

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [email, setEmail] = useState("");
  const [classId, setClassId] = useState("");

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

  const loadClasses = async () => {
    try {
      const response = await api.get("/classes");
      setClasses(response.data);
    } catch (error) {
      console.error("Failed to load classes:", error);
    }
  };

  useEffect(() => {
    loadStudents();
    loadClasses();
  }, []);

  const addStudent = async (e: FormEvent) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      await api.post("/students", {
        firstName,
        lastName,
        studentNumber,
        email,
        classId: classId ? Number(classId) : null,
      });

      setMessage("Student added successfully.");

      setFirstName("");
      setLastName("");
      setStudentNumber("");
      setEmail("");
      setClassId("");

      await loadStudents();
    } catch (error: any) {
      setMessage(
        error.response?.data || "Failed to add student."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Students</h1>

      <button onClick={() => (window.location.href = "/dashboard")}>
        Back to Dashboard
      </button>

      <hr />

      <h2>Add Student</h2>

      <form onSubmit={addStudent}>
        <div>
          <label>First Name</label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Last Name</label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Student Number</label>
          <input
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Class</label>

          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
          >
            <option value="">Select a class</option>

            {classes.map((schoolClass) => (
              <option key={schoolClass.id} value={schoolClass.id}>
                {schoolClass.name} - {schoolClass.grade}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Student"}
        </button>
      </form>

      {message && <p>{message}</p>}

      <hr />

      <h2>Student List</h2>

      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Student Number</th>
              <th>Name</th>
              <th>Email</th>
              <th>Class</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.studentNumber}</td>

                <td>
                  {student.firstName} {student.lastName}
                </td>

                <td>{student.email || "-"}</td>

                <td>
                  {student.schoolClass
                    ? `${student.schoolClass.name} - ${student.schoolClass.grade}`
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

