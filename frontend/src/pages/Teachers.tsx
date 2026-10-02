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
    <div>
      <h1>Teachers</h1>

      <button onClick={() => (window.location.href = "/dashboard")}>
        Back to Dashboard
      </button>

      <hr />

      <h2>Add Teacher</h2>

      <form onSubmit={addTeacher}>
        <div>
          <label>First Name</label>
          <br />

          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label>Last Name</label>
          <br />

          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label>Employee Number</label>
          <br />

          <input
            value={employeeNumber}
            onChange={(e) => setEmployeeNumber(e.target.value)}
            placeholder="e.g. EMP001"
            required
          />
        </div>

        <br />

        <div>
          <label>Email</label>
          <br />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Teacher"}
        </button>
      </form>

      {message && <p>{message}</p>}

      <hr />

      <h2>Teacher List</h2>

      {teachers.length === 0 ? (
        <p>No teachers found.</p>
      ) : (
        <table>
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
                  {teacher.firstName} {teacher.lastName}
                </td>

                <td>{teacher.employeeNumber}</td>

                <td>{teacher.email || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}