
import { useEffect, useState } from "react";
import api from "../api/api";

type Student = {
  id: number;
  firstName: string;
  lastName: string;
  studentNumber: string;
};

type Parent = {
  id: number;
  email: string;
  role: string;
};

function Parents() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [selectedParent, setSelectedParent] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");

  const [message, setMessage] = useState("");

  useEffect(() => {
    loadParents();
    loadStudents();
  }, []);

  const loadParents = async () => {
    try {
      const response = await api.get("/parents");
      setParents(response.data);
    } catch (error) {
      setMessage("Failed to load parents");
    }
  };

  const loadStudents = async () => {
    try {
      const response = await api.get("/students");
      setStudents(response.data);
    } catch (error) {
      setMessage("Failed to load students");
    }
  };

  const createParent = async () => {
    if (!email || !password) {
      setMessage("Enter the parent email and password.");
      return;
    }

    try {
      const response = await api.post("/parents", {
        email,
        password,
      });

      setParents((current) => [...current, response.data]);

      setEmail("");
      setPassword("");

      setMessage("Parent created successfully.");
    } catch (error: any) {
      setMessage(
        error.response?.data || "Failed to create parent"
      );
    }
  };

  const linkStudent = async () => {
    if (!selectedParent || !selectedStudent) {
      setMessage("Select both a parent and a student.");
      return;
    }

    try {
      await api.post("/parent-students", {
        parentId: Number(selectedParent),
        studentId: Number(selectedStudent),
      });

      setMessage("Student linked successfully.");

      setSelectedParent("");
      setSelectedStudent("");
    } catch (error: any) {
      setMessage(
        error.response?.data || "Failed to link student"
      );
    }
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>Parent Management</h1>
          <p>Create parent accounts and link students to them.</p>
        </div>

        <button
          className="logout-button"
          onClick={() => (window.location.href = "/dashboard")}
        >
          Back to Dashboard
        </button>
      </header>

      <main className="dashboard-main">
        {message && (
          <div className="status-message">
            {message}
          </div>
        )}

        <section className="student-form-card stat-card">
          <div className="section-heading">
            <h2>Create Parent</h2>
            <p>
              Create a parent account that can access the parent portal.
            </p>
          </div>

          <div className="student-form">
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="parent-email">
                  Parent Email
                </label>

                <input
                  id="parent-email"
                  type="email"
                  placeholder="parent@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="parent-password">
                  Password
                </label>

                <input
                  id="parent-password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              className="module-button form-submit"
              onClick={createParent}
            >
              Create Parent
            </button>
          </div>
        </section>

        <section className="student-form-card stat-card">
          <div className="section-heading">
            <h2>Link Parent to Student</h2>
            <p>
              Connect a parent account to a student's school record.
            </p>
          </div>

          <div className="student-form">
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="parent-select">
                  Parent
                </label>

                <select
                  id="parent-select"
                  value={selectedParent}
                  onChange={(e) =>
                    setSelectedParent(e.target.value)
                  }
                >
                  <option value="">Select parent</option>

                  {parents.map((parent) => (
                    <option key={parent.id} value={parent.id}>
                      {parent.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="student-select">
                  Student
                </label>

                <select
                  id="student-select"
                  value={selectedStudent}
                  onChange={(e) =>
                    setSelectedStudent(e.target.value)
                  }
                >
                  <option value="">Select student</option>

                  {students.map((student) => (
                    <option
                      key={student.id}
                      value={student.id}
                    >
                      {student.firstName} {student.lastName} (
                      {student.studentNumber})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              className="module-button form-submit"
              onClick={linkStudent}
            >
              Link Student
            </button>
          </div>
        </section>

        <section>
          <div className="section-heading">
            <h2>Parent Accounts</h2>
            <p>Parent accounts currently registered in the system.</p>
          </div>

          <div className="stat-card">
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>

                <tbody>
                  {parents.length === 0 ? (
                    <tr>
                      <td colSpan={3}>
                        No parent accounts found.
                      </td>
                    </tr>
                  ) : (
                    parents.map((parent) => (
                      <tr key={parent.id}>
                        <td>{parent.id}</td>
                        <td>{parent.email}</td>
                        <td>{parent.role}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Parents;

