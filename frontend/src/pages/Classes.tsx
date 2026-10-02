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
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>School Administration System</h1>
          <p>Class management</p>
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
          <h2>Classes</h2>
          <p>
            Create school classes and assign each class to a grade.
          </p>
        </section>

        <section className="module-card student-form-card">
          <div>
            <h2>Add Class</h2>
            <p className="form-description">
              Create a class such as Grade 10A and associate it with
              its grade.
            </p>
          </div>

          <form onSubmit={addClass} className="student-form">
            <div className="form-grid">
              <div className="form-field">
                <label>Class Name</label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Grade 10A"
                  required
                />
              </div>

              <div className="form-field">
                <label>Grade</label>

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
            </div>

            <button
              className="module-button form-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Adding Class..." : "Add Class"}
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
            <h2>Class List</h2>
            <p>
              {classes.length} class
              {classes.length === 1 ? "" : "es"} registered.
            </p>
          </div>

          {classes.length === 0 ? (
            <p>No classes found.</p>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Class Name</th>
                    <th>Grade</th>
                  </tr>
                </thead>

                <tbody>
                  {classes.map((schoolClass) => (
                    <tr key={schoolClass.id}>
                      <td>
                        <strong>{schoolClass.name}</strong>
                      </td>

                      <td>{schoolClass.grade.name}</td>
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