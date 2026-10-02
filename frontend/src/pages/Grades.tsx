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
    <div>
      <h1>Grades</h1>

      <button onClick={() => (window.location.href = "/dashboard")}>
        Back to Dashboard
      </button>

      <hr />

      <h2>Add Grade</h2>

      <form onSubmit={addGrade}>
        <div>
          <label>Grade Name</label>
          <br />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Grade 12"
            required
          />
        </div>

        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Grade"}
        </button>
      </form>

      {message && <p>{message}</p>}

      <hr />

      <h2>Grade List</h2>

      {grades.length === 0 ? (
        <p>No grades found.</p>
      ) : (
        <table>
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
                <td>{grade.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}