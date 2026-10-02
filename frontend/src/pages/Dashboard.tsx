import { useEffect, useState } from "react";
import api from "../api/api";

export default function Dashboard() {
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/";
      return;
    }

    api.get("/students")
      .then((response) => {
        setStudentCount(response.data.length);
      })
      .catch((error) => {
        console.error("Failed to load students:", error);
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    window.location.href = "/";
  };

  const navigate = (path: string) => {
    window.location.href = path;
  };

  const modules = [
    {
      title: "Students",
      description: "Manage student records, classes and assignments.",
      path: "/students",
      action: "Manage Students",
    },
    {
      title: "Teachers",
      description: "Manage teachers and staff information.",
      path: "/teachers",
      action: "Manage Teachers",
    },
    {
      title: "Grades",
      description: "Manage Grade 8 through Grade 12.",
      path: "/grades",
      action: "Manage Grades",
    },
    {
      title: "Classes",
      description: "Manage classes and their assigned grades.",
      path: "/classes",
      action: "Manage Classes",
    },
    {
      title: "Subjects",
      description: "Manage school subjects and subject codes.",
      path: "/subjects",
      action: "Manage Subjects",
    },
    {
      title: "Enrollments",
      description: "Enroll students in school subjects.",
      path: "/enrollments",
      action: "Manage Enrollments",
    },
    {
      title: "Teaching Assignments",
      description: "Assign teachers to subjects and classes.",
      path: "/teaching-assignments",
      action: "Manage Assignments",
    },
    {
      title: "Marks",
      description: "Manage assessments and student marks.",
      path: "/marks",
      action: "Manage Marks",
    },
    {
      title: "Attendance",
      description: "Record and monitor student attendance.",
      path: "/attendance",
      action: "Manage Attendance",
    },
    {
      title: "Parents",
      description: "Manage parent accounts and student relationships.",
      path: "/parents",
      action: "Manage Parents",
    },
    {
      title: "Fees",
      description: "Manage school fees and payments.",
      path: "/fees",
      action: "Manage Fees",
    },
  ];

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>School Administration System</h1>
          <p>School management dashboard</p>
        </div>

        <div className="user-section">
          <div>
            <strong>{email}</strong>
            <span>{role}</span>
          </div>

          <button className="logout-button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="welcome-section">
          <div>
            <h2>Dashboard</h2>
            <p>Manage your school's students, staff and academic records.</p>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Students</span>
            <strong className="stat-value">{studentCount}</strong>
            <span className="stat-description">Registered students</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Role</span>
            <strong className="stat-value">{role}</strong>
            <span className="stat-description">Current account</span>
          </div>
        </section>

        <section>
          <div className="section-heading">
            <h2>School Management</h2>
            <p>Access the main areas of the administration system.</p>
          </div>

          <div className="module-grid">
            {modules.map((module) => (
              <div className="module-card" key={module.path}>
                <div>
                  <h3>{module.title}</h3>
                  <p>{module.description}</p>
                </div>

                <button
                  className="module-button"
                  onClick={() => navigate(module.path)}
                >
                  {module.action}
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}