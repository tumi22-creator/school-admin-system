import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import api from "../api/api";

type SchoolClass = {
  id: number;
  name: string;
  grade: string;
};

export default function Classes() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
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

  useEffect(() => {
    loadClasses();
  }, []);

  const addClass = async (e: FormEvent) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      await api.post("/classes", {
        name,
        grade,
      });

      setMessage("Class added successfully.");
      setName("");
      setGrade("");

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
    <div>
      <h1>Classes</h1>

      <button onClick={() => (window.location.href = "/dashboard")}>
        Back to Dashboard
      </button>

      <hr />

      <h2>Add Class</h2>

      <form onSubmit={addClass}>
        <div>
          <label>Class Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Grade 10A"
            required
          />
        </div>

        <div>
          <label>Grade</label>
          <input
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="Grade 10"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Class"}
        </button>
      </form>

      {message && <p>{message}</p>}

      <hr />

      <h2>Class List</h2>

      {classes.length === 0 ? (
        <p>No classes found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Class Name</th>
              <th>Grade</th>
            </tr>
          </thead>

          <tbody>
            {classes.map((schoolClass) => (
              <tr key={schoolClass.id}>
                <td>{schoolClass.name}</td>
                <td>{schoolClass.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}