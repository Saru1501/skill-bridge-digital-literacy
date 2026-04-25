import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMySavedResources, toggleSaveResource, downloadResource } from "../../services/api";

export default function SavedLessonResources() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMySavedResources().then(r => setSaved(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleUnsave = async (savedId, lessonId, resourceId) => {
    try {
      await toggleSaveResource(lessonId, resourceId);
      setSaved((current) => current.filter((item) => item._id !== savedId));
    } catch {}
  };

  const handleDownload = async (lessonId, resourceId, name) => {
    try {
      const res = await downloadResource(lessonId, resourceId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', name || 'resource');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {}
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div style={{ background: '#fff', minHeight: '100vh', padding: 32 }}>
      <div style={{ background: '#1E293B', borderRadius: 18, padding: 24, marginBottom: 32 }}>
        <h1 style={{ color: '#fff', fontWeight: 700, fontSize: 28 }}>Saved Lesson Resources</h1>
      </div>
      {saved.length === 0 ? (
        <div className="card"><div className="empty-state">
          <h3>No saved resources</h3><p>Save lesson resources to access them quickly.</p>
        </div></div>
      ) : (
        <div className="resources-grid">
          {saved.map(item => (
            <div className="resource-card" key={item._id}>
              <div className="resource-card-body">
                <div className="resource-card-label">{item.resourceType || "resource"}</div>
                <h4>{item.resourceName || item.lesson?.title}</h4>
                <p>{item.lesson?.title}</p>
                {item.lesson?.course?.title && (
                  <div className="resource-card-meta">
                    <span className="badge badge-gray">{item.lesson.course.title}</span>
                  </div>
                )}
                <Link to={`/lesson/${item.lesson?._id}`} className="btn btn-secondary btn-sm" style={{ marginTop: 16 }}>
                  Open Lesson
                </Link>
              </div>
              <div className="resource-card-footer">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() =>
                    handleDownload(
                      item.lesson?._id,
                      item.resourceId,
                      item.resourceName || item.resourceUrl?.split("/").pop()
                    )
                  }
                  disabled={!item.lesson?._id || !item.resourceId}
                >
                  Download
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleUnsave(item._id, item.lesson?._id, item.resourceId)}
                  disabled={!item.lesson?._id || !item.resourceId}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
