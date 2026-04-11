import { useState, useEffect } from "react";
import { getMyEnrollments, getCourseProgress, getLessons } from "../../services/api";

export default function Downloads() {
  const [downloads, setDownloads] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const enrRes = await getMyEnrollments();
        const enrollments = enrRes.data.data || [];
        const all = [];
        await Promise.all(enrollments.map(async e => {
          try {
            const [pRes, lRes] = await Promise.all([getCourseProgress(e.course._id), getLessons(e.course._id)]);
            const prog = pRes.data.data; const lessons = lRes.data.data || [];
            (prog?.downloadedResources || []).forEach(url => {
              lessons.forEach(l => {
                const res = l.resources?.find(r => r.url === url);
                if (res) all.push({ ...res, courseName: e.course.title, lessonName: l.title, courseId: e.course._id });
              });
            });
          } catch {}
        }));
        setDownloads(all);
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  const typeIcon = (type) => {
    if (type==="pdf") return <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>;
    if (type==="video") return <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>;
    return <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>;
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="section-title">Downloads</h1>
          <p className="section-sub">Resources saved for offline access</p>
        </div>
      </div>

      {downloads.length === 0 ? (
        <div className="card"><div className="empty-state">
          <div className="empty-state-icon"><svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg></div>
          <h3>No downloads yet</h3><p>Download lesson resources to access them offline.</p>
        </div></div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>File</th><th>Type</th><th>Course</th><th>Lesson</th><th>Action</th></tr></thead>
            <tbody>
              {downloads.map((d, i) => (
                <tr key={i}>
                  <td>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div className={"resource-type-icon "+(d.type||"other")}>{typeIcon(d.type)}</div>
                      <span style={{fontWeight:600}}>{d.name}</span>
                    </div>
                  </td>
                  <td><span className="badge badge-blue">{d.type || "file"}</span></td>
                  <td style={{color:"#475569"}}>{d.courseName}</td>
                  <td style={{color:"#475569"}}>{d.lessonName}</td>
                  <td><a href={d.url} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">Open</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
