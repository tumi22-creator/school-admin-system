import { useEffect, useState, type FormEvent } from "react";
import api from "../api/api";

type Grade = {
  id: number;
  name: string;
};

export default function Grades() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadGrades = async () => {
    try {
      const response = await api.get("/grades");
      setGrades(response.data);
    } catch (error) {
      console.error("Failed to load grades:", error);
      setMessage("Failed to load grades.");
    }
  };

  useEffect(() => {
    loadGrades();
  }, []);

  const addGrade = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setMessage("Grade name is required.");
      return;
    }

    setMessage("");
    setLoading(true);

    try {
      await api.post("/grades", {
        name: name.trim(),
      });

      setMessage("Grade added successfully.");
      setName("");

      await loadGrades();
    } catch (error: any) {
      console.error("Failed to add grade:", error);

      setMessage(
        error.response?.data || "Failed to add grade."
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
          <p>Grade management</p>
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
          <h2>Grades</h2>
          <p>
            Manage the grades used by your school.
          </p>
        </section>

        <section className="module-card student-form-card">
          <div>
            <h2>Add Grade</h2>
            <p className="form-description">
              Add a school grade such as Grade 8, Grade 9 or Grade 12.
            </p>
          </div>

          <form onSubmit={addGrade} className="student-form">
            <div className="form-grid">
              <div className="form-field">
                <label>Grade Name</label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Grade 12"
                  required
                />
              </div>
            </div>

            <button
              className="module-button form-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Adding Grade..." : "Add Grade"}
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
            <h2>Grade List</h2>
            <p>
              {grades.length} grade
              {grades.length === 1 ? "" : "s"} registered.
            </p>
          </div>

          {grades.length === 0 ? (
            <p>No grades found.</p>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Grade</th>
                  </tr>
                </thead>

                <tbody>
                  {grades.map((grade) => (
                    <tr key={grade.id}>
                      <td>{grade.id}</td>
                      <td>
                        <strong>{grade.name}</strong>
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