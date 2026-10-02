import { useEffect, useState, type FormEvent } from "react";
import api from "../api/api";

type Teacher = {
  id: number;
  firstName: string;
  lastName: string;
  employeeNumber: string;
  email: string;
};

export default function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadTeachers = async () => {
    try {
      const response = await api.get("/teachers");
      setTeachers(response.data);
    } catch (error) {
      console.error("Failed to load teachers:", error);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const addTeacher = async (e: FormEvent) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      await api.post("/teachers", {
        firstName,
        lastName,
        employeeNumber,
        email,
      });

      setMessage("Teacher added successfully.");

      setFirstName("");
      setLastName("");
      setEmployeeNumber("");
      setEmail("");

      await loadTeachers();
    } catch (error: any) {
      console.error("Failed to add teacher:", error);

      setMessage(
        error.response?.data || "Failed to add teacher."
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
          <p>Teacher management</p>
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
          <h2>Teachers</h2>
          <p>
            Manage teacher records and staff information.
          </p>
        </section>

        <section className="module-card student-form-card">
          <div>
            <h2>Add Teacher</h2>
            <p className="form-description">
              Enter the teacher's employment and contact details.
            </p>
          </div>

          <form onSubmit={addTeacher} className="student-form">
            <div className="form-grid">
              <div className="form-field">
                <label>First Name</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Sarah"
                  required
                />
              </div>

              <div className="form-field">
                <label>Last Name</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Smith"
                  required
                />
              </div>

              <div className="form-field">
                <label>Employee Number</label>
                <input
                  value={employeeNumber}
                  onChange={(e) =>
                    setEmployeeNumber(e.target.value)
                  }
                  placeholder="e.g. EMP001"
                  required
                />
              </div>

              <div className="form-field">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teacher@school.com"
                />
              </div>
            </div>

            <button
              className="module-button form-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Adding Teacher..." : "Add Teacher"}
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
            <h2>Teacher List</h2>
            <p>
              {teachers.length} teacher
              {teachers.length === 1 ? "" : "s"} registered.
            </p>
          </div>

          {teachers.length === 0 ? (
            <p>No teachers found.</p>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Employee Number</th>
                    <th>Email</th>
                  </tr>
                </thead>

                <tbody>
                  {teachers.map((teacher) => (
                    <tr key={teacher.id}>
                      <td>
                        <strong>
                          {teacher.firstName}{" "}
                          {teacher.lastName}
                        </strong>
                      </td>

                      <td>{teacher.employeeNumber}</td>

                      <td>{teacher.email || "-"}</td>
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