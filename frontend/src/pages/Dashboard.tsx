
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

  return (
    <div>
      <header>
        <h1>School Administration System</h1>

        <div>
          <span>{email}</span>
          <span>{role}</span>

          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <main>
        <h2>Dashboard</h2>
        

        <div>
        <h3>Students</h3>
        <p>{studentCount} students registered</p>
        </div>
        <button onClick={() => (window.location.href = "/students")}>
        Manage Students
        </button>

        <div>
          <h3>Teachers</h3>
          <p>Manage teachers and classes.</p>
        </div>
        <button onClick={() => (window.location.href = "/teachers")}>
           Manage Teachers
        </button>

        <div>
  <h3>Grades</h3>
  <p>Manage Grade 8 to Grade 12.</p>
</div>

<button
  onClick={() => (window.location.href = "/grades")}
>
  Manage Grades
</button>

        
        <div>
        <h3>Classes</h3>
        <p>Manage school classes and grades.</p>
          </div>

          <button onClick={() => (window.location.href = "/classes")}>
            Manage Classes
          </button>

          <div>
  <h3>Subjects</h3>
  <p>Manage school subjects.</p>
</div>

<button onClick={() => (window.location.href = "/subjects")}>
  Manage Subjects
</button>

<div>
  <h3>Student Enrollments</h3>
  <p>Enroll students in school subjects.</p>
</div>

<button
  onClick={() => (window.location.href = "/enrollments")}
>
  Manage Enrollments
</button>

<div>
  <h3>Teaching Assignments</h3>
  <p>Assign teachers to subjects and classes.</p>
</div>

<button
  onClick={() => (window.location.href = "/teaching-assignments")}
>
  Manage Teaching Assignments
</button>

         <div>
          <h3>Marks</h3>
          <p>Manage student marks and assessments.</p>
        </div>
        <button onClick={() => (window.location.href = "/marks")}>
          Manage Marks
        </button> 



        <div>
          <h3>Attendance</h3>
          <p>Track student attendance.</p>
        </div>
        <button onClick={() => (window.location.href = "/attendance")}>
          Manage Attendance
        </button>

      

         <div>
          <h3>Parents</h3>
          <p>View and manage parent information.</p>
        </div>
        <button onClick={() => window.location.href = "/parents"}>
        Manage Parents
        </button>

        <div>
          <h3>Fees</h3>
          <p>Manage school fees and payments.</p>
        </div>
        <button onClick={() => window.location.href = "/fees"}>
        Manage Fees
        </button>
      </main>
    </div>
  );
} 

