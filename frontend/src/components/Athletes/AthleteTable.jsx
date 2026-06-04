const SPORTS = ['Football', 'Basketball', 'Swimming', 'Athletics', 'Tennis', 'Cricket', 'Other'];

const statusBadge = (status) => {
  const map = { Active: 'badge-green', Injured: 'badge-red', Resting: 'badge-orange' };
  return <span className={`badge ${map[status] || 'badge-gray'}`}>{status}</span>;
};

export default function AthleteTable({
  athletes, loading, search, setSearch,
  sportFilter, setSportFilter,
  onEdit, onDelete, onExport,
  page, setPage, totalPages
}) {
  return (
    <div className="table-card">
      <div className="table-header">
        <h3>Athletes</h3>
        <div className="table-controls">
          <input
            className="search-input"
            type="text"
            placeholder="🔍  Search athletes..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          <select
            className="filter-select"
            value={sportFilter}
            onChange={e => { setSportFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Sports</option>
            {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="btn-outline" onClick={onExport}>⬇ Export CSV</button>
        </div>
      </div>

      <div className="table-wrap">
        <table className="athlete-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Athlete</th>
              <th>Sport</th>
              <th>Age</th>
              <th>Score</th>
              <th>Workouts</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="table-empty">
                <div className="skeleton-rows">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="skeleton-row">
                      <div className="skeleton" style={{width: '40px'}} />
                      <div className="skeleton" style={{width: '140px'}} />
                      <div className="skeleton" style={{width: '90px'}} />
                      <div className="skeleton" style={{width: '40px'}} />
                      <div className="skeleton" style={{width: '60px'}} />
                      <div className="skeleton" style={{width: '60px'}} />
                      <div className="skeleton" style={{width: '70px'}} />
                      <div className="skeleton" style={{width: '80px'}} />
                    </div>
                  ))}
                </div>
              </td></tr>
            ) : athletes.length === 0 ? (
              <tr><td colSpan={8} className="table-empty">
                <div className="empty-state">
                  <div className="empty-icon">🏃</div>
                  <p>No athletes found</p>
                  <span>Try adjusting search or add a new athlete</span>
                </div>
              </td></tr>
            ) : athletes.map((a, i) => (
              <tr key={a._id} className="table-row">
                <td className="td-num">{(page - 1) * 8 + i + 1}</td>
                <td>
                  <div className="athlete-name-cell">
                    <div className="athlete-avatar">{a.name[0].toUpperCase()}</div>
                    <span>{a.name}</span>
                  </div>
                </td>
                <td><span className="sport-tag">{a.sport}</span></td>
                <td>{a.age}</td>
                <td>
                  <div className="score-cell">
                    <div className="score-bar">
                      <div className="score-fill" style={{ width: `${a.performanceScore}%` }} />
                    </div>
                    <span>{a.performanceScore}%</span>
                  </div>
                </td>
                <td>{a.completedWorkouts}</td>
                <td>{statusBadge(a.status)}</td>
                <td>
                  <div className="action-btns">
                    <button className="btn-edit" onClick={() => onEdit(a)} title="Edit">✏️</button>
                    <button className="btn-delete" onClick={() => onDelete(a._id)} title="Delete">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >← Prev</button>
          <span className="page-info">Page {page} of {totalPages}</span>
          <button
            className="page-btn"
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >Next →</button>
        </div>
      )}
    </div>
  );
}
