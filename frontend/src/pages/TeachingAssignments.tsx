
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
        error.response?.data || "Failed to add teaching assignment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Teaching Assignments</h1>

      <button onClick={() => (window.location.href = "/dashboard")}>
        Back to Dashboard
      </button>

      <hr />

      <h2>Assign Teacher</h2>

      <form onSubmit={addAssignment}>
        <div>
          <label>Teacher</label>
          <br />

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

        <div>
          <label>Class</label>
          <br />

          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            required
          >
            <option value="">Select a class</option>

            {classes.map((schoolClass) => (
              <option key={schoolClass.id} value={schoolClass.id}>
                {schoolClass.name} - {schoolClass.grade.name}
              </option>
            ))}
          </select>
        </div>

        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Assigning..." : "Assign Teacher"}
        </button>
      </form>

      {message && <p>{message}</p>}

      <hr />

      <h2>Current Teaching Assignments</h2>

      {assignments.length === 0 ? (
        <p>No teaching assignments found.</p>
      ) : (
        <table>
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
                  {assignment.teacher.firstName}{" "}
                  {assignment.teacher.lastName}
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
      )}
    </div>
  );
}

