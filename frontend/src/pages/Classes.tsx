
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

export default function Classes() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);

  const [name, setName] = useState("");
  const [gradeId, setGradeId] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadClasses = async () => {
    try {
      const response = await api.get("/classes");
      setClasses(response.data);
    } catch (error) {
      console.error("Failed to load classes:", error);
    }
  };

  const loadGrades = async () => {
    try {
      const response = await api.get("/grades");
      setGrades(response.data);
    } catch (error) {
      console.error("Failed to load grades:", error);
    }
  };

  useEffect(() => {
    loadClasses();
    loadGrades();
  }, []);

  const addClass = async (e: FormEvent) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      await api.post("/classes", {
        name,
        gradeId: Number(gradeId),
      });

      setMessage("Class added successfully.");

      setName("");
      setGradeId("");

      await loadClasses();
    } catch (error: any) {
      setMessage(
        error.response?.data || "Failed to add class."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Classes</h1>

      <button onClick={() => (window.location.href = "/dashboard")}>
        Back to Dashboard
      </button>

      <hr />

      <h2>Add Class</h2>

      <form onSubmit={addClass}>
        <div>
          <label>Class Name</label>
          <br />

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Grade 10A"
            required
          />
        </div>

        <br />

        <div>
          <label>Grade</label>
          <br />

          <select
            value={gradeId}
            onChange={(e) => setGradeId(e.target.value)}
            required
          >
            <option value="">Select a grade</option>

            {grades.map((grade) => (
              <option key={grade.id} value={grade.id}>
                {grade.name}
              </option>
            ))}
          </select>
        </div>

        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Class"}
        </button>
      </form>

      {message && <p>{message}</p>}

      <hr />

      <h2>Class List</h2>

      {classes.length === 0 ? (
        <p>No classes found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Class Name</th>
              <th>Grade</th>
            </tr>
          </thead>

          <tbody>
            {classes.map((schoolClass) => (
              <tr key={schoolClass.id}>
                <td>{schoolClass.name}</td>

                <td>{schoolClass.grade.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

