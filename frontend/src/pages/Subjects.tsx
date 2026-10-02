
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
    <div>
      <h1>Subjects</h1>

      <button onClick={() => (window.location.href = "/dashboard")}>
        Back to Dashboard
      </button>

      <hr />

      <h2>Add Subject</h2>

      <form onSubmit={addSubject}>
        <div>
          <label>Subject Name</label>
          <br />

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Mathematics"
            required
          />
        </div>

        <br />

        <div>
          <label>Subject Code</label>
          <br />

          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="MATH"
            required
          />
        </div>

        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Subject"}
        </button>
      </form>

      {message && <p>{message}</p>}

      <hr />

      <h2>Subject List</h2>

      {subjects.length === 0 ? (
        <p>No subjects found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Subject Name</th>
              <th>Code</th>
            </tr>
          </thead>

          <tbody>
            {subjects.map((subject) => (
              <tr key={subject.id}>
                <td>{subject.name}</td>
                <td>{subject.code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

