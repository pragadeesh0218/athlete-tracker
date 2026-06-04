import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import API from '../api/axios';
import Sidebar from '../components/Layout/Sidebar';
import StatsCard from '../components/Dashboard/StatsCard';
import AthleteTable from '../components/Athletes/AthleteTable';
import AthleteModal from '../components/Athletes/AthleteModal';
import PerformanceChart from '../components/Dashboard/PerformanceChart';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sportFilter, setSportFilter] = useState('');
  const [modal, setModal] = useState({ open: false, data: null });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAthletes = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 8 };
      if (search) params.search = search;
      if (sportFilter) params.sport = sportFilter;
      const { data } = await API.get('/athletes', { params });
      setAthletes(data.athletes);
      setTotalPages(data.totalPages);
    } catch {
      toast.error('Failed to load athletes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAthletes(); }, [search, sportFilter, page]);

  const stats = {
    total: athletes.length,
    active: athletes.filter(a => a.status === 'Active').length,
    completed: athletes.reduce((s, a) => s + a.completedWorkouts, 0),
    avgScore: athletes.length
      ? Math.round(athletes.reduce((s, a) => s + a.performanceScore, 0) / athletes.length)
      : 0
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this athlete?')) return;
    await API.delete(`/athletes/${id}`);
    toast.success('Athlete removed');
    fetchAthletes();
  };

  const handleSave = async (formData, id) => {
    if (id) await API.put(`/athletes/${id}`, formData);
    else await API.post('/athletes', formData);
    toast.success(id ? 'Athlete updated' : 'Athlete added');
    setModal({ open: false, data: null });
    fetchAthletes();
  };

  const exportCSV = () => {
    const headers = ['Name', 'Sport', 'Age', 'Status', 'Score', 'Workouts'];
    const rows = athletes.map(a =>
      [a.name, a.sport, a.age, a.status, a.performanceScore, a.completedWorkouts].join(',')
    );
    const blob = new Blob([headers.join(',') + '\n' + rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'athletes.csv'; a.click();
  };

  return (
    <div className={`app-layout ${dark ? 'dark' : ''}`}>
      <Sidebar />
      <main className="main-content">
        <div className="topbar">
          <div>
            <h1>Welcome back, {user?.name} 👋</h1>
            <p>Here's your performance overview for today</p>
          </div>
          <div className="topbar-actions">
            <button onClick={toggleTheme} className="btn-icon">{dark ? '☀️' : '🌙'}</button>
            <button className="btn-primary" onClick={() => setModal({ open: true, data: null })}>
              + Add Athlete
            </button>
          </div>
        </div>

        <div className="stats-grid">
          <StatsCard label="Total Athletes" value={stats.total} icon="🏃" color="blue" />
          <StatsCard label="Active Sessions" value={stats.active} icon="⚡" color="green" />
          <StatsCard label="Completed Workouts" value={stats.completed} icon="✅" color="purple" />
          <StatsCard label="Avg Performance" value={`${stats.avgScore}%`} icon="🏆" color="orange" />
        </div>

        <PerformanceChart athletes={athletes} />

        <AthleteTable
          athletes={athletes}
          loading={loading}
          search={search} setSearch={setSearch}
          sportFilter={sportFilter} setSportFilter={setSportFilter}
          onEdit={(a) => setModal({ open: true, data: a })}
          onDelete={handleDelete}
          onExport={exportCSV}
          page={page} setPage={setPage} totalPages={totalPages}
        />
      </main>

      {modal.open && (
        <AthleteModal
          data={modal.data}
          onSave={handleSave}
          onClose={() => setModal({ open: false, data: null })}
        />
      )}
    </div>
  );
}