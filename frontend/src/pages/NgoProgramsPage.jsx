import { useEffect, useState } from "react";
import {
  createProgram,
  deleteProgram,
  getNgoPrograms,
  updateProgram,
} from "../services/sponsorshipService";
import useAuth from "../hooks/useAuth";

const EMPTY_FORM = {
  title: "",
  description: "",
  maxStudents: "",
  active: true,
};

export default function NgoProgramsPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [programs, setPrograms] = useState([]);
  const [editingProgramId, setEditingProgramId] = useState("");
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchPrograms = async () => {
    try {
      setLoadingPrograms(true);
      const data = await getNgoPrograms();
      setPrograms(data.programs || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load programs.");
    } finally {
      setLoadingPrograms(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchPrograms();
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.title.trim()) {
      setError("Program title is required.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: formData.title,
        description: formData.description,
        maxStudents: Number(formData.maxStudents) || 0,
        active: formData.active,
      };

      const data = editingProgramId
        ? await updateProgram(editingProgramId, payload)
        : await createProgram(payload);
      setSuccess(
        data.message || (editingProgramId ? "Program updated successfully." : "Program created successfully.")
      );
      setFormData(EMPTY_FORM);
      setEditingProgramId("");
      fetchPrograms();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save program.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (program) => {
    setError("");
    setSuccess("");
    setEditingProgramId(program._id);
    setFormData({
      title: program.title || "",
      description: program.description || "",
      maxStudents: program.maxStudents || "",
      active: Boolean(program.active),
    });
  };

  const handleCancelEdit = () => {
    setEditingProgramId("");
    setFormData(EMPTY_FORM);
  };

  const handleDelete = async (programId) => {
    if (!window.confirm("Are you sure you want to delete this program?")) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      const data = await deleteProgram(programId);
      setSuccess(data.message || "Program deleted successfully.");
      fetchPrograms();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete program.");
    }
  };

  return (
    <div className="workspace-stack">
      <section className="workspace-hero">
        <h2>Manage Sponsorship Programs</h2>
        <p>Create new initiatives, control capacity, and keep your active NGO programs organized in a cleaner management view.</p>
      </section>

      {(error || success) && (
        <div>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
        </div>
      )}

      <div className="workspace-grid">
        <section className="content-panel">
          <div className="content-panel__header">
            <div>
              <h3 className="content-panel__title">Create New Program</h3>
              <p className="content-panel__sub">Add a sponsorship initiative with a clear description and learner capacity.</p>
            </div>
          </div>

          <div className="content-panel__body">
            <form onSubmit={handleSubmit} className="field-stack">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Program Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Women in Tech Empowerment Grant 2026"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the support, target learners, and intended impact."
                  rows="6"
                  className="form-control"
                />
              </div>

              <div className="field-grid">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Maximum Students</label>
                  <input
                    type="number"
                    name="maxStudents"
                    value={formData.maxStudents}
                    onChange={handleChange}
                    placeholder="0 for unlimited"
                    className="form-control"
                    min="0"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Availability</label>
                  <div className="form-control" style={{ display: "flex", alignItems: "center" }}>
                    <label className="checkbox-inline">
                      <input
                        type="checkbox"
                        name="active"
                        checked={formData.active}
                        onChange={handleChange}
                      />
                      Program is active
                    </label>
                  </div>
                </div>
              </div>

              <div className="tile-actions">
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? "Saving..." : editingProgramId ? "Update Program" : "Create Program"}
                </button>
                {editingProgramId && (
                  <button type="button" onClick={handleCancelEdit} className="btn btn-secondary">
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>

        <section className="content-panel">
          <div className="content-panel__header">
            <div>
              <h3 className="content-panel__title">Workspace Notes</h3>
              <p className="content-panel__sub">Keep programs easy to review for applicants and admins.</p>
            </div>
          </div>
          <div className="content-panel__body">
            <div className="stack-list">
              <div className="tile-note">
                Use specific titles, clear eligibility notes, and realistic learner caps so applicants can choose the right initiative.
              </div>
              <div className="tile-note">
                Active programs are visible to students. Inactive programs stay hidden from the student catalog, but now still remain visible in your NGO management list for editing.
              </div>
              <div className="tile-note">
                Programs currently managed by this NGO account: <strong>{programs.length}</strong>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="content-panel">
        <div className="content-panel__header">
          <div>
            <h3 className="content-panel__title">My Programs</h3>
            <p className="content-panel__sub">A cleaner tile view for every initiative you have published.</p>
          </div>
        </div>

        <div className="content-panel__body">
          {loadingPrograms ? (
            <div className="empty-panel">Loading programs...</div>
          ) : programs.length === 0 ? (
            <div className="empty-panel">No sponsorship programs created yet.</div>
          ) : (
            <div className="tile-grid">
              {programs.map((program) => (
                <article key={program._id} className="tile-card">
                  <div className="tile-top">
                    <div>
                      <h4 className="tile-title">{program.title}</h4>
                      <p className="tile-subtitle">{program.ngoUser?.name || "NGO Initiative"}</p>
                    </div>
                    <span className={`status-pill ${program.active ? "status-pill--success" : "status-pill--warning"}`}>
                      {program.active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <p className="tile-copy">
                    {program.description || "No description provided for this sponsorship program yet."}
                  </p>

                  <div className="tile-meta">
                    <div className="tile-meta-row">
                      <span>Capacity</span>
                      <strong>{program.maxStudents || "Unlimited"} learners</strong>
                    </div>
                    <div className="tile-meta-row">
                      <span>Program ID</span>
                      <strong>{program._id?.slice(-8)}</strong>
                    </div>
                  </div>

                  <div className="tile-actions">
                    <button onClick={() => handleEdit(program)} className="btn btn-secondary btn-sm">
                      Edit Program
                    </button>
                    <button onClick={() => handleDelete(program._id)} className="btn btn-danger btn-sm">
                      Delete Program
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
