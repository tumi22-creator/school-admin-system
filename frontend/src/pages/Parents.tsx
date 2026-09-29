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
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const response = await api.get("/students");
      setStudents(response.data);
    } catch (error) {
      setMessage("Failed to load students");
    }
  };

  const createParent = async () => {
    try {
      const response = await api.post("/parents", {
        email,
        password,
      });

      setParents((current) => [...current, response.data]);

      setEmail("");
      setPassword("");

      setMessage("Parent created successfully");
    } catch (error: any) {
      setMessage(
        error.response?.data || "Failed to create parent"
      );
    }
  };

  const linkStudent = async () => {
    if (!selectedParent || !selectedStudent) {
      setMessage("Select both a parent and a student");
      return;
    }

    try {
      await api.put(
        `/parents/${selectedParent}/student/${selectedStudent}`
      );

      setMessage("Student linked successfully");
    } catch (error: any) {
      setMessage(
        error.response?.data || "Failed to link student"
      );
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Parent Management</h1>

      {message && (
        <p style={{ color: "green" }}>
          {message}
        </p>
      )}

      <hr />

      <h2>Create Parent</h2>

      <input
        type="email"
        placeholder="Parent email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Parent password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />
      <br />

      <button onClick={createParent}>
        Create Parent
      </button>

      <hr />

      <h2>Link Parent to Student</h2>

      <label>Parent</label>

      <br />

      <select
        value={selectedParent}
        onChange={(e) => setSelectedParent(e.target.value)}
      >
        <option value="">Select parent</option>

        {parents.map((parent) => (
          <option key={parent.id} value={parent.id}>
            {parent.email}
          </option>
        ))}
      </select>

      <br />
      <br />

      <label>Student</label>

      <br />

      <select
        value={selectedStudent}
        onChange={(e) => setSelectedStudent(e.target.value)}
      >
        <option value="">Select student</option>

        {students.map((student) => (
          <option key={student.id} value={student.id}>
            {student.firstName} {student.lastName} (
            {student.studentNumber})
          </option>
        ))}
      </select>

      <br />
      <br />

      <button onClick={linkStudent}>
        Link Student
      </button>
    </div>
  );
}

export default Parents;