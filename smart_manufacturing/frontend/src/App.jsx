import React, { useState, useEffect } from 'react';
import { 
  Factory, LayoutDashboard, MonitorPlay, AlertTriangle, 
  Activity, Play, CheckCircle2, XCircle, Plus, RefreshCw, 
  Zap, Settings, Wrench
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'kiosk'
  const [plantId, setPlantId] = useState(1);
  const [kpis, setKpis] = useState({
    total_production: 0,
    active_machines: 0,
    total_machines: 0,
    efficiency: 0,
    active_alerts: 0,
    downtime_machines: 0,
  });
  const [activities, setActivities] = useState([]);
  const [machines, setMachines] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Modals
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [showCompleteJobModal, setShowCompleteJobModal] = useState(false);
  const [activeJobId, setActiveJobId] = useState(null);
  const [unitsProducedInput, setUnitsProducedInput] = useState(0);

  // New Job Form State
  const [newJob, setNewJob] = useState({
    title: '',
    part_name: '',
    target_qty: 100,
    priority: 'Normal',
    machine_id: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Dashboard KPIs
      const kpiRes = await fetch(`/api/dashboard/kpis?plant_id=${plantId}`);
      if (kpiRes.ok) {
        const kpiData = await kpiRes.json();
        setKpis(kpiData);
      }

      // Fetch Recent Activity
      const actRes = await fetch(`/api/dashboard/recent-activity?plant_id=${plantId}&limit=8`);
      if (actRes.ok) {
        const actData = await actRes.json();
        setActivities(Array.isArray(actData) ? actData : []);
      }

      // Fetch Kiosk Machines
      const macRes = await fetch(`/api/kiosk/machines?plant_id=${plantId}`);
      if (macRes.ok) {
        const macData = await macRes.json();
        setMachines(Array.isArray(macData) ? macData : []);
        if (macData.length > 0 && !selectedMachine) {
          setSelectedMachine(macData[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobsForMachine = async (machineId) => {
    try {
      const res = await fetch(`/api/kiosk/machines/${machineId}/jobs`);
      if (res.ok) {
        const data = await res.json();
        setJobs(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [plantId]);

  useEffect(() => {
    if (selectedMachine) {
      fetchJobsForMachine(selectedMachine.id);
    }
  }, [selectedMachine]);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newJob,
        plant_id: plantId,
        machine_id: parseInt(newJob.machine_id || selectedMachine?.id),
        target_qty: parseInt(newJob.target_qty),
      };

      const res = await fetch('/api/kiosk/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowCreateJobModal(false);
        setNewJob({ title: '', part_name: '', target_qty: 100, priority: 'Normal', machine_id: '' });
        fetchData();
        if (selectedMachine) fetchJobsForMachine(selectedMachine.id);
      }
    } catch (err) {
      console.error('Error creating job:', err);
    }
  };

  const handleRunJob = async (jobId) => {
    try {
      const res = await fetch(`/api/kiosk/jobs/${jobId}/run`, { method: 'POST' });
      if (res.ok) {
        fetchData();
        if (selectedMachine) fetchJobsForMachine(selectedMachine.id);
      }
    } catch (err) {
      console.error('Error running job:', err);
    }
  };

  const handleCompleteJobSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/kiosk/jobs/${activeJobId}/complete?units_produced=${unitsProducedInput}`, {
        method: 'POST',
      });
      if (res.ok) {
        setShowCompleteJobModal(false);
        fetchData();
        if (selectedMachine) fetchJobsForMachine(selectedMachine.id);
      }
    } catch (err) {
      console.error('Error completing job:', err);
    }
  };

  const handleSetMachineStatus = async (machineId, status) => {
    try {
      const res = await fetch(`/api/kiosk/machines/${machineId}/status?status=${status}`, { method: 'POST' });
      if (res.ok) {
        fetchData();
        if (selectedMachine) fetchJobsForMachine(selectedMachine.id);
      }
    } catch (err) {
      console.error('Error setting status:', err);
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="app-header">
        <div className="brand">
          <div className="brand-icon">
            <Factory size={22} />
          </div>
          <span>Smart Manufacturing OS</span>
        </div>

        <nav className="nav-tabs">
          <button 
            className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={16} /> Executive Dashboard
          </button>
          <button 
            className={`nav-tab ${activeTab === 'kiosk' ? 'active' : ''}`}
            onClick={() => setActiveTab('kiosk')}
          >
            <MonitorPlay size={16} /> Operator Kiosk
          </button>
        </nav>

        <div className="plant-selector">
          <Factory size={16} />
          <span>Plant:</span>
          <select 
            className="plant-select-dropdown"
            value={plantId} 
            onChange={(e) => setPlantId(Number(e.target.value))}
          >
            <option value={1}>Plant Alpha (Texas)</option>
            <option value={2}>Plant Beta (Frankfurt)</option>
            <option value={3}>Plant Gamma (Tokyo)</option>
          </select>
          <button className="btn btn-secondary" style={{ padding: '6px' }} onClick={fetchData} title="Refresh Data">
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* KPI Row */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-header">
              <span>Total Units Produced</span>
              <div className="kpi-icon" style={{ color: '#06b6d4' }}><Zap size={18} /></div>
            </div>
            <div className="kpi-value">{kpis.total_production?.toLocaleString() || 0}</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span>Active Machines</span>
              <div className="kpi-icon" style={{ color: '#10b981' }}><MonitorPlay size={18} /></div>
            </div>
            <div className="kpi-value">
              {kpis.active_machines} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ {kpis.total_machines}</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span>Plant Efficiency (OEE)</span>
              <div className="kpi-icon" style={{ color: '#6366f1' }}><Activity size={18} /></div>
            </div>
            <div className="kpi-value" style={{ color: kpis.efficiency >= 80 ? '#10b981' : '#f59e0b' }}>
              {kpis.efficiency}%
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <span>Active Alerts</span>
              <div className="kpi-icon" style={{ color: '#f43f5e' }}><AlertTriangle size={18} /></div>
            </div>
            <div className="kpi-value" style={{ color: kpis.active_alerts > 0 ? '#f43f5e' : 'var(--text-primary)' }}>
              {kpis.active_alerts}
            </div>
          </div>
        </div>

        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-grid">
            {/* Machine Status Overview */}
            <div className="card">
              <div className="card-title">
                <span>Machine Status Matrix</span>
                <button className="btn btn-primary" onClick={() => setShowCreateJobModal(true)}>
                  <Plus size={16} /> Schedule New Job
                </button>
              </div>

              <div className="machine-grid">
                {machines.map((machine) => (
                  <div key={machine.id} className="machine-card">
                    <div className="machine-header">
                      <div>
                        <div className="machine-name">{machine.name}</div>
                        <div className="machine-type">{machine.machine_type || 'CNC Milling'}</div>
                      </div>
                      <div className={`status-badge ${machine.status}`}>
                        <span className={`status-dot ${machine.status}`}></span>
                        {machine.status}
                      </div>
                    </div>

                    {machine.current_job_title ? (
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', fontSize: '0.85rem' }}>
                        <div style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>{machine.current_job_title}</div>
                        <div style={{ color: 'var(--text-muted)' }}>Part: {machine.current_job_part}</div>
                        <div style={{ marginTop: '4px', fontSize: '0.8rem' }}>
                          Progress: {machine.current_job_produced} / {machine.current_job_target} units
                        </div>
                      </div>
                    ) : (
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                        No active job running
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                      <button 
                        className="btn btn-secondary" 
                        style={{ flex: 1, fontSize: '0.8rem' }}
                        onClick={() => { setSelectedMachine(machine); setActiveTab('kiosk'); }}
                      >
                        Open Kiosk
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <div className="card-title">
                <span>Live Activity Stream</span>
              </div>
              <div className="activity-list">
                {activities.length > 0 ? (
                  activities.map((act, index) => (
                    <div key={act.id || index} className="activity-item">
                      <Activity size={16} style={{ color: 'var(--accent-primary)', marginTop: '2px' }} />
                      <div>
                        <div className="activity-text">{act.event}</div>
                        <div className="activity-time">{new Date(act.timestamp).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No recent activity logged</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Kiosk View */}
        {activeTab === 'kiosk' && selectedMachine && (
          <div className="dashboard-grid">
            <div className="card">
              <div className="card-title">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>Machine Operator Kiosk: <strong>{selectedMachine.name}</strong></span>
                  <div className={`status-badge ${selectedMachine.status}`}>
                    <span className={`status-dot ${selectedMachine.status}`}></span>
                    {selectedMachine.status}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-secondary" onClick={() => handleSetMachineStatus(selectedMachine.id, 'Idle')}>Set Idle</button>
                  <button className="btn btn-danger" onClick={() => handleSetMachineStatus(selectedMachine.id, 'Down')}>Set Down</button>
                </div>
              </div>

              <h4 style={{ margin: '1.5rem 0 1rem 0', fontSize: '1rem' }}>Job Queue for {selectedMachine.name}</h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {jobs.map((job) => (
                  <div key={job.id} style={{ 
                    background: 'rgba(255, 255, 255, 0.03)', 
                    border: '1px solid var(--border-color)', 
                    padding: '1.25rem', 
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>{job.title}</span>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          padding: '2px 8px', 
                          borderRadius: '10px', 
                          background: job.priority === 'Urgent' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                          color: job.priority === 'Urgent' ? '#f87171' : '#a5b4fc'
                        }}>
                          {job.priority} Priority
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status: {job.status}</span>
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
                        Part: {job.part_name} &bull; Target: {job.target_qty} units &bull; Produced: {job.units_produced} units
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {job.status === 'Pending' && (
                        <button className="btn btn-primary" onClick={() => handleRunJob(job.id)}>
                          <Play size={14} /> Start Job
                        </button>
                      )}
                      {job.status === 'Running' && (
                        <button className="btn btn-primary" style={{ background: '#10b981' }} onClick={() => {
                          setActiveJobId(job.id);
                          setUnitsProducedInput(job.target_qty);
                          setShowCompleteJobModal(true);
                        }}>
                          <CheckCircle2 size={14} /> Complete Job
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {jobs.length === 0 && (
                  <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                    No jobs currently queued for this machine.
                  </div>
                )}
              </div>
            </div>

            {/* Select Machine Sidebar */}
            <div className="card">
              <div className="card-title">Select Machine</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {machines.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMachine(m)}
                    className="btn btn-secondary"
                    style={{
                      justifyContent: 'space-between',
                      borderColor: selectedMachine.id === m.id ? 'var(--accent-primary)' : 'var(--border-color)',
                      background: selectedMachine.id === m.id ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    }}
                  >
                    <span>{m.name}</span>
                    <span className={`status-badge ${m.status}`}>{m.status}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal: Create Job */}
      {showCreateJobModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginBottom: '1.25rem' }}>Schedule New Production Job</h3>
            <form onSubmit={handleCreateJob}>
              <div className="form-group">
                <label className="form-label">Job Title</label>
                <input 
                  type="text" 
                  className="form-input"
                  required
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  placeholder="e.g. Batch #409 Turbines"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Part Name</label>
                <input 
                  type="text" 
                  className="form-input"
                  required
                  value={newJob.part_name}
                  onChange={(e) => setNewJob({ ...newJob, part_name: e.target.value })}
                  placeholder="e.g. Steel Gear X-1"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Machine</label>
                <select 
                  className="form-select"
                  value={newJob.machine_id || selectedMachine?.id || ''}
                  onChange={(e) => setNewJob({ ...newJob, machine_id: e.target.value })}
                >
                  {machines.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Target Quantity</label>
                <input 
                  type="number" 
                  className="form-input"
                  required
                  value={newJob.target_qty}
                  onChange={(e) => setNewJob({ ...newJob, target_qty: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowCreateJobModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create Job</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Complete Job */}
      {showCompleteJobModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginBottom: '1.25rem' }}>Complete Job & Record Production</h3>
            <form onSubmit={handleCompleteJobSubmit}>
              <div className="form-group">
                <label className="form-label">Actual Units Produced</label>
                <input 
                  type="number" 
                  className="form-input"
                  required
                  value={unitsProducedInput}
                  onChange={(e) => setUnitsProducedInput(Number(e.target.value))}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowCompleteJobModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, background: '#10b981' }}>Submit Completion</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
