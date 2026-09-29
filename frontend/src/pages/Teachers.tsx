import { useEffect, useState, type FormEvent } from "react";
import api from "../api/api";

type SchoolClass = {
  id: number;
  name: string;
  grade: string;
};

type Teacher = {
  id: number;
  firstName: string;
  lastName: string;
  employeeNumber: string;
  email: string;
  schoolClass?: SchoolClass | null;
};

export default function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [email, setEmail] = useState("");
  const [classId, setClassId] = useState("");

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

  const loadClasses = async () => {
    try {
      const response = await api.get("/classes");
      setClasses(response.data);
    } catch (error) {
      console.error("Failed to load classes:", error);
    }
  };

  useEffect(() => {
    loadTeachers();
    loadClasses();
  }, []);

  const addTeacher = async (e: FormEvent) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const teacherData: any = {
        firstName,
        lastName,
        employeeNumber,
        email,
      };

      if (classId) {
        teacherData.schoolClass = {
          id: Number(classId),
        };
      } else {
        teacherData.schoolClass = null;
      }

      await api.post("/teachers", teacherData);

      setMessage("Teacher added successfully.");

      setFirstName("");
      setLastName("");
      setEmployeeNumber("");
      setEmail("");
      setClassId("");

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

        <div>
          <label>Class</label>
          <br />

          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
          >
            <option value="">No class assigned</option>

            {classes.map((schoolClass) => (
              <option key={schoolClass.id} value={schoolClass.id}>
                {schoolClass.name} - {schoolClass.grade}
              </option>
            ))}
          </select>
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
              <th>Class</th>
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

                <td>
                  {teacher.schoolClass
                    ? `${teacher.schoolClass.name} - ${teacher.schoolClass.grade}`
                    : "Not assigned"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}