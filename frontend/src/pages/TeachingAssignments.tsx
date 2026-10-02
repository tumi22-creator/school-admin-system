
import { useEffect, useState, type FormEvent } from "react";
import api from "../api/api";

type Teacher = {
  id: number;
  firstName: string;
  lastName: string;
  employeeNumber: string;
};

type Subject = {
  id: number;
  name: string;
  code: string;
};

type Grade = {
  id: number;
  name: string;
};

type SchoolClass = {
  id: number;
  name: string;
  grade: Grade;
};

type TeachingAssignment = {
  id: number;
  teacher: Teacher;
  subject: Subject;
  schoolClass: SchoolClass;
};

export default function TeachingAssignments() {
  const [assignments, setAssignments] = useState<TeachingAssignment[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);

  const [teacherId, setTeacherId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [classId, setClassId] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadAssignments = async () => {
    try {
      const response = await api.get("/teaching-assignments");
      setAssignments(response.data);
    } catch (error) {
      console.error("Failed to load teaching assignments:", error);
    }
  };

  const loadTeachers = async () => {
    try {
      const response = await api.get("/teachers");
      setTeachers(response.data);
    } catch (error) {
      console.error("Failed to load teachers:", error);
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

  const loadClasses = async () => {
    try {
      const response = await api.get("/classes");
      setClasses(response.data);
    } catch (error) {
      console.error("Failed to load classes:", error);
    }
  };

  useEffect(() => {
    loadAssignments();
    loadTeachers();
    loadSubjects();
    loadClasses();
  }, []);

  const addAssignment = async (e: FormEvent) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      await api.post("/teaching-assignments", {
        teacherId: Number(teacherId),
        subjectId: Number(subjectId),
        classId: Number(classId),
      });

      setMessage("Teaching assignment added successfully.");

      setTeacherId("");
      setSubjectId("");
      setClassId("");

      await loadAssignments();
    } catch (error: any) {
      console.error("Failed to add teaching assignment:", error);

      setMessage(
        error.response?.data ||
          "Failed to add teaching assignment."
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
          <p>Teaching assignment management</p>
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
          <h2>Teaching Assignments</h2>
          <p>
            Assign teachers to subjects and school classes.
          </p>
        </section>

        <section className="module-card student-form-card">
          <div>
            <h2>Assign Teacher</h2>
            <p className="form-description">
              Select a teacher, subject and class to create a
              teaching assignment.
            </p>
          </div>

          <form onSubmit={addAssignment} className="student-form">
            <div className="form-grid">
              <div className="form-field">
                <label>Teacher</label>

                <select
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  required
                >
                  <option value="">Select a teacher</option>

                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.firstName} {teacher.lastName} (
                      {teacher.employeeNumber})
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

              <div className="form-field">
                <label>Class</label>

                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  required
                >
                  <option value="">Select a class</option>

                  {classes.map((schoolClass) => (
                    <option
                      key={schoolClass.id}
                      value={schoolClass.id}
                    >
                      {schoolClass.name} - {schoolClass.grade.name}
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
              {loading ? "Assigning..." : "Assign Teacher"}
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
            <h2>Current Teaching Assignments</h2>
            <p>
              {assignments.length} assignment
              {assignments.length === 1 ? "" : "s"} registered.
            </p>
          </div>

          {assignments.length === 0 ? (
            <p>No teaching assignments found.</p>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Teacher</th>
                    <th>Subject</th>
                    <th>Class</th>
                  </tr>
                </thead>

                <tbody>
                  {assignments.map((assignment) => (
                    <tr key={assignment.id}>
                      <td>
                        <strong>
                          {assignment.teacher.firstName}{" "}
                          {assignment.teacher.lastName}
                        </strong>
                      </td>

                      <td>
                        {assignment.subject.name} (
                        {assignment.subject.code})
                      </td>

                      <td>
                        {assignment.schoolClass.name} -{" "}
                        {assignment.schoolClass.grade.name}
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
