import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import api from "../api/api";

type Grade = {
  id: number;
  name: string;
};

type SchoolClass = {
  id: number;
  name: string;
  grade: Grade;
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

  const [assigningStudentId, setAssigningStudentId] =
    useState<number | null>(null);
  const [assignClassId, setAssignClassId] = useState("");

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

  const assignStudentToClass = async (studentId: number) => {
    if (!assignClassId) {
      setMessage("Select a class first.");
      return;
    }

    try {
      await api.put(
        `/students/${studentId}/class/${assignClassId}`
      );

      setMessage("Student class updated successfully.");

      setAssigningStudentId(null);
      setAssignClassId("");

      await loadStudents();
    } catch (error: any) {
      console.error(
        "Failed to assign student to class:",
        error
      );

      setMessage(
        error.response?.data ||
          "Failed to update student class."
      );
    }
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>School Administration System</h1>
          <p>Student management</p>
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
          <h2>Students</h2>
          <p>
            Register students and manage their class assignments.
          </p>
        </section>

        <section className="module-card student-form-card">
          <div>
            <h2>Add Student</h2>
            <p className="form-description">
              Enter the student's details and assign them to a class.
            </p>
          </div>

          <form onSubmit={addStudent} className="student-form">
            <div className="form-grid">
              <div className="form-field">
                <label>First Name</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. John"
                  required
                />
              </div>

              <div className="form-field">
                <label>Last Name</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Doe"
                  required
                />
              </div>

              <div className="form-field">
                <label>Student Number</label>
                <input
                  value={studentNumber}
                  onChange={(e) =>
                    setStudentNumber(e.target.value)
                  }
                  placeholder="e.g. STU006"
                  required
                />
              </div>

              <div className="form-field">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                />
              </div>

              <div className="form-field">
                <label>Class</label>

                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                >
                  <option value="">Select a class</option>

                  {classes.map((schoolClass) => (
                    <option
                      key={schoolClass.id}
                      value={schoolClass.id}
                    >
                      {schoolClass.name} -{" "}
                      {schoolClass.grade.name}
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
              {loading ? "Adding Student..." : "Add Student"}
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
            <h2>Student List</h2>
            <p>
              {students.length} student
              {students.length === 1 ? "" : "s"} registered.
            </p>
          </div>

          {students.length === 0 ? (
            <p>No students found.</p>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student Number</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Class</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.studentNumber}</td>

                      <td>
                        <strong>
                          {student.firstName}{" "}
                          {student.lastName}
                        </strong>
                      </td>

                      <td>{student.email || "-"}</td>

                      <td>
                        {student.schoolClass
                          ? `${student.schoolClass.name} - ${student.schoolClass.grade.name}`
                          : "Not assigned"}
                      </td>

                      <td>
                        {assigningStudentId === student.id ? (
                          <div className="assignment-controls">
                            <select
                              value={assignClassId}
                              onChange={(e) =>
                                setAssignClassId(e.target.value)
                              }
                            >
                              <option value="">
                                Select class
                              </option>

                              {classes.map((schoolClass) => (
                                <option
                                  key={schoolClass.id}
                                  value={schoolClass.id}
                                >
                                  {schoolClass.name} -{" "}
                                  {schoolClass.grade.name}
                                </option>
                              ))}
                            </select>

                            <button
                              className="table-button primary"
                              onClick={() =>
                                assignStudentToClass(student.id)
                              }
                            >
                              Save
                            </button>

                            <button
                              className="table-button secondary"
                              onClick={() => {
                                setAssigningStudentId(null);
                                setAssignClassId("");
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            className="table-button primary"
                            onClick={() => {
                              setAssigningStudentId(student.id);
                              setAssignClassId(
                                student.schoolClass
                                  ? String(
                                      student.schoolClass.id
                                    )
                                  : ""
                              );
                            }}
                          >
                            {student.schoolClass
                              ? "Change Class"
                              : "Assign Class"}
                          </button>
                        )}
                      </td>
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