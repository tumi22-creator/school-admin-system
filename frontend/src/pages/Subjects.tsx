
import { useEffect, useState, type FormEvent } from "react";
import api from "../api/api";

type Subject = {
  id: number;
  name: string;
  code: string;
};

export default function Subjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadSubjects = async () => {
    try {
      const response = await api.get("/subjects");
      setSubjects(response.data);
    } catch (error) {
      console.error("Failed to load subjects:", error);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const addSubject = async (e: FormEvent) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      await api.post("/subjects", {
        name,
        code,
      });

      setMessage("Subject added successfully.");

      setName("");
      setCode("");

      await loadSubjects();
    } catch (error: any) {
      console.error("Failed to add subject:", error);

      setMessage(
        error.response?.data || "Failed to add subject."
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
          <p>Subject management</p>
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
          <h2>Subjects</h2>
          <p>
            Manage the subjects offered by your school.
          </p>
        </section>

        <section className="module-card student-form-card">
          <div>
            <h2>Add Subject</h2>
            <p className="form-description">
              Add a subject name and its unique subject code.
            </p>
          </div>

          <form onSubmit={addSubject} className="student-form">
            <div className="form-grid">
              <div className="form-field">
                <label>Subject Name</label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mathematics"
                  required
                />
              </div>

              <div className="form-field">
                <label>Subject Code</label>

                <input
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.toUpperCase())
                  }
                  placeholder="e.g. MATH"
                  required
                />
              </div>
            </div>

            <button
              className="module-button form-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Adding Subject..." : "Add Subject"}
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
            <h2>Subject List</h2>
            <p>
              {subjects.length} subject
              {subjects.length === 1 ? "" : "s"} registered.
            </p>
          </div>

          {subjects.length === 0 ? (
            <p>No subjects found.</p>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Subject Name</th>
                    <th>Code</th>
                  </tr>
                </thead>

                <tbody>
                  {subjects.map((subject) => (
                    <tr key={subject.id}>
                      <td>
                        <strong>{subject.name}</strong>
                      </td>

                      <td>{subject.code}</td>
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


