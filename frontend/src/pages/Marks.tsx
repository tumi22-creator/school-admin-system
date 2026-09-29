
import { FormEvent, useEffect, useState } from "react";
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
};

type SchoolClass = {
  id: number;
  name: string;
  grade: string;
};

type Assessment = {
  id: number;
  name: string;
  type: string;
  maxMark: number;
  date: string;
};

export default function Marks() {
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  const [assessmentName, setAssessmentName] = useState("");
  const [assessmentType, setAssessmentType] = useState("TEST");
  const [maxMark, setMaxMark] = useState("100");
  const [assessmentDate, setAssessmentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [subjectId, setSubjectId] = useState("");
  const [classId, setClassId] = useState("");

  const [studentId, setStudentId] = useState("");
  const [assessmentId, setAssessmentId] = useState("");
  const [mark, setMark] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStudents();
    loadSubjects();
    loadClasses();
    loadAssessments();
  }, []);

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

  const loadClasses = async () => {
    try {
      const response = await api.get("/classes");
      setClasses(response.data);
    } catch (error) {
      console.error("Failed to load classes:", error);
    }
  };

  const loadAssessments = async () => {
    try {
      const response = await api.get("/marks/assessments");
      setAssessments(response.data);
    } catch (error) {
      console.error("Failed to load assessments:", error);
    }
  };

  const createAssessment = async (e: FormEvent) => {
    e.preventDefault();

    if (!subjectId || !classId) {
      setMessage("Please select a subject and class.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await api.post("/marks/assessments", {
        name: assessmentName,
        type: assessmentType,
        maxMark: Number(maxMark),
        date: assessmentDate,
        subjectId: Number(subjectId),
        classId: Number(classId),
      });

      setMessage("Assessment created successfully.");

      setAssessmentName("");
      setAssessmentType("TEST");
      setMaxMark("100");
      setAssessmentDate(
        new Date().toISOString().split("T")[0]
      );
      setSubjectId("");
      setClassId("");

      await loadAssessments();
    } catch (error: any) {
      setMessage(
        error.response?.data ||
          "Failed to create assessment."
      );
    } finally {
      setLoading(false);
    }
  };

  const saveMark = async (e: FormEvent) => {
    e.preventDefault();

    if (!studentId || !assessmentId) {
      setMessage("Please select a student and assessment.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await api.post("/marks", {
        studentId: Number(studentId),
        assessmentId: Number(assessmentId),
        mark: Number(mark),
      });

      setMessage("Mark saved successfully.");

      setStudentId("");
      setAssessmentId("");
      setMark("");
    } catch (error: any) {
      setMessage(
        error.response?.data ||
          "Failed to save mark."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Marks & Assessments</h1>

      <button onClick={() => (window.location.href = "/dashboard")}>
        Back to Dashboard
      </button>

      <hr />

      <h2>Create Assessment</h2>

      <form onSubmit={createAssessment}>
        <div>
          <label>Assessment Name</label>

          <input
            value={assessmentName}
            onChange={(e) => setAssessmentName(e.target.value)}
            placeholder="Mathematics Test 1"
            required
          />
        </div>

        <div>
          <label>Subject</label>

          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            required
          >
            <option value="">Select subject</option>

            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Class</label>

          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            required
          >
            <option value="">Select class</option>

            {classes.map((schoolClass) => (
              <option key={schoolClass.id} value={schoolClass.id}>
                {schoolClass.name} - {schoolClass.grade}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Assessment Type</label>

          <select
            value={assessmentType}
            onChange={(e) => setAssessmentType(e.target.value)}
          >
            <option value="TEST">Test</option>
            <option value="ASSIGNMENT">Assignment</option>
            <option value="EXAM">Exam</option>
            <option value="PROJECT">Project</option>
          </select>
        </div>

        <div>
          <label>Maximum Mark</label>

          <input
            type="number"
            value={maxMark}
            onChange={(e) => setMaxMark(e.target.value)}
            min="1"
            required
          />
        </div>

        <div>
          <label>Date</label>

          <input
            type="date"
            value={assessmentDate}
            onChange={(e) => setAssessmentDate(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Assessment"}
        </button>
      </form>

      <hr />

      <h2>Enter Student Mark</h2>

      <form onSubmit={saveMark}>
        <div>
          <label>Student</label>

          <select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          >
            <option value="">Select student</option>

            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.studentNumber} - {student.firstName}{" "}
                {student.lastName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Assessment</label>

          <select
            value={assessmentId}
            onChange={(e) => setAssessmentId(e.target.value)}
            required
          >
            <option value="">Select assessment</option>

            {assessments.map((assessment) => (
              <option key={assessment.id} value={assessment.id}>
                {assessment.name} ({assessment.maxMark})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Mark</label>

          <input
            type="number"
            value={mark}
            onChange={(e) => setMark(e.target.value)}
            min="0"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Mark"}
        </button>
      </form>

      {message && <p>{message}</p>}

      <hr />

      <h2>Assessments</h2>

      {assessments.length === 0 ? (
        <p>No assessments found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Maximum Mark</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {assessments.map((assessment) => (
              <tr key={assessment.id}>
                <td>{assessment.name}</td>
                <td>{assessment.type}</td>
                <td>{assessment.maxMark}</td>
                <td>{assessment.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

