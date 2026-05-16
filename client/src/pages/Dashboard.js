import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, Title, Tooltip, Legend, ArcElement
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

const NAV = [
  { id: 'overview', icon: '◈', label: 'Overview' },
  { id: 'sensors', icon: '⬡', label: 'Sensor Data' },
  { id: 'products', icon: '⬢', label: 'Products' },
  { id: 'add', icon: '+', label: 'Add Reading' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState('overview');
  const [sensors, setSensors] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [addForm, setAddForm] = useState({ sensorType: 'Type IV', sensitivity: '', lod: '', concentration: '', notes: '' });
  const [addProductForm, setAddProductForm] = useState({ productName: '', productType: 'tablet', measuredConcentration: '', nominalConcentration: '' });
  const [msg, setMsg] = useState('');

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [s, p, st] = await Promise.all([
        api.get('/api/sensors'),
        api.get('/api/products'),
        api.get('/api/sensors/stats'),
      ]);
      setSensors(s.data); setProducts(p.data); setStats(st.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  const seedData = async () => {
    setSeeding(true);
    try {
      await api.post('/api/sensors/seed');
      await api.post('/api/products/seed');
      await fetchAll();
      setMsg('Research data seeded successfully!');
      setTimeout(() => setMsg(''), 3000);
    } catch (e) { setMsg('Seed failed: ' + (e.response?.data?.message || e.message)); }
    finally { setSeeding(false); }
  };

  const addSensor = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/sensors', addForm);
      setMsg('Sensor reading added!'); setTimeout(() => setMsg(''), 3000);
      setAddForm({ sensorType: 'Type IV', sensitivity: '', lod: '', concentration: '', notes: '' });
      fetchAll();
    } catch (err) { setMsg('Error: ' + (err.response?.data?.message || err.message)); }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/products', addProductForm);
      setMsg('Product test added!'); setTimeout(() => setMsg(''), 3000);
      setAddProductForm({ productName: '', productType: 'tablet', measuredConcentration: '', nominalConcentration: '' });
      fetchAll();
    } catch (err) { setMsg('Error: ' + (err.response?.data?.message || err.message)); }
  };

  const deleteSensor = async (id) => {
    await api.delete(`/api/sensors/${id}`);
    fetchAll();
  };

  const deleteProduct = async (id) => {
    await api.delete(`/api/products/${id}`);
    fetchAll();
  };

  const chartOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#141d2e', titleColor: '#e8f4f8', bodyColor: '#8baec4', borderColor: 'rgba(0,212,255,0.2)', borderWidth: 1 } },
    scales: {
      x: { ticks: { color: '#4d7a96', font: { size: 10 } }, grid: { color: 'rgba(100,180,255,0.05)' } },
      y: { ticks: { color: '#4d7a96', font: { size: 10 } }, grid: { color: 'rgba(100,180,255,0.05)' } }
    }
  };

  const sensBarData = {
    labels: ['Type I', 'Type II', 'Type III', 'Type IV'],
    datasets: [
      { label: 'Sensitivity', data: [0.0708, 0.0978, 0.1101, 0.1257], backgroundColor: ['#1a3a5c', '#1a4a6c', '#1a5a8c', '#00d4ff'], borderRadius: 6 }
    ]
  };

  const lodLineData = {
    labels: ['Type I', 'Type II', 'Type III', 'Type IV'],
    datasets: [
      { label: 'LoD (mg/ml)', data: [2.895, 1.783, 1.540, 0.917], borderColor: '#10d48e', backgroundColor: 'rgba(16,212,142,0.1)', tension: 0.4, fill: true, pointBackgroundColor: '#10d48e', pointRadius: 5 }
    ]
  };

  const productDoughData = {
    labels: products.map(p => p.productName?.split(' ').slice(0, 2).join(' ')),
    datasets: [{ data: products.map(p => p.measuredConcentration), backgroundColor: ['#00d4ff', '#7c3aed', '#10d48e', '#f59e0b', '#ef4444'], borderWidth: 0, hoverOffset: 6 }]
  };

  return (
    <div style={s.layout}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.sideTop}>
          <div style={s.brand}>
            <span style={s.brandIcon}>⬡</span>
            <div>
              <div style={s.brandName}>SensorLab</div>
              <div style={s.brandSub}>IR Sensor Platform</div>
            </div>
          </div>
          <nav style={s.nav}>
            {NAV.map(n => (
              <button key={n.id} onClick={() => setActive(n.id)}
                style={{ ...s.navItem, ...(active === n.id ? s.navActive : {}) }}>
                <span style={s.navIcon}>{n.icon}</span>
                <span>{n.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div style={s.sideBottom}>
          <div style={s.userCard}>
            <div style={s.avatar}>{user?.name?.[0]?.toUpperCase() || 'U'}</div>
            <div>
              <div style={s.userName}>{user?.name}</div>
              <div style={s.userRole}>{user?.role || 'researcher'}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={s.logoutBtn}>Sign Out</button>
        </div>
      </aside>

      {/* Main */}
      <main style={s.main}>
        {/* Top bar */}
        <div style={s.topbar}>
          <div>
            <h1 style={s.pageTitle}>{NAV.find(n => n.id === active)?.label}</h1>
            <p style={s.pageSub}>As₂S₃ Infrared Evanescent Wave Detection System</p>
          </div>
          <div style={s.topActions}>
            {msg && <div style={s.toast}>{msg}</div>}
            <button onClick={seedData} disabled={seeding} style={s.seedBtn}>
              {seeding ? 'Seeding...' : '⟳ Seed Research Data'}
            </button>
          </div>
        </div>

        <div style={s.content}>
          {loading ? (
            <div style={s.loadWrap}><div style={s.spinner} />Loading data...</div>
          ) : (
            <>
              {/* OVERVIEW */}
              {active === 'overview' && (
                <div>
                  <div style={s.metricsRow}>
                    {[
                      { label: 'Total Readings', val: stats.total || 0, unit: '', color: '#00d4ff' },
                      { label: 'Best Sensitivity', val: (stats.bestSensitivity || 0).toFixed(4), unit: 'a.u./(mg·ml⁻¹)', color: '#7c3aed' },
                      { label: 'Best LoD', val: (stats.bestLoD || 0).toFixed(3), unit: 'mg/ml', color: '#10d48e' },
                      { label: 'Products Tested', val: products.length, unit: 'samples', color: '#f59e0b' },
                    ].map(m => (
                      <div key={m.label} style={s.metricCard}>
                        <div style={s.metricLabel}>{m.label}</div>
                        <div style={{ ...s.metricVal, color: m.color }}>{m.val}</div>
                        <div style={s.metricUnit}>{m.unit}</div>
                      </div>
                    ))}
                  </div>

                  <div style={s.chartsRow}>
                    <div style={s.chartCard}>
                      <div style={s.chartTitle}>Sensor Sensitivity by Type</div>
                      <div style={{ height: '220px' }}><Bar data={sensBarData} options={chartOpts} /></div>
                    </div>
                    <div style={s.chartCard}>
                      <div style={s.chartTitle}>Limit of Detection Trend</div>
                      <div style={{ height: '220px' }}><Line data={lodLineData} options={chartOpts} /></div>
                    </div>
                    {products.length > 0 && (
                      <div style={s.chartCard}>
                        <div style={s.chartTitle}>Product Concentration Distribution</div>
                        <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ width: '200px', height: '200px' }}>
                            <Doughnut data={productDoughData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={s.peakCard}>
                    <div style={s.chartTitle}>Characteristic Absorption Peaks — Ascorbic Acid</div>
                    <div style={s.peakRow}>
                      {[
                        { wavenumber: '1760 cm⁻¹', bond: 'C=O Stretch', wavelength: '5.69 µm', desc: 'Carbonyl group vibration — primary identification peak' },
                        { wavenumber: '1690 cm⁻¹', bond: 'C=C Stretch', wavelength: '5.92 µm', desc: 'Alkene double bond vibration — secondary confirmation' },
                        { wavenumber: '2342 cm⁻¹', bond: 'CO₂ Release', wavelength: '4.27 µm', desc: 'Carbon dioxide — present in effervescent tablets only' },
                      ].map(p => (
                        <div key={p.wavenumber} style={s.peakItem}>
                          <div style={s.peakWave}>{p.wavenumber}</div>
                          <div style={s.peakBond}>{p.bond}</div>
                          <div style={s.peakWl}>{p.wavelength}</div>
                          <div style={s.peakDesc}>{p.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SENSORS TABLE */}
              {active === 'sensors' && (
                <div>
                  <div style={s.tableCard}>
                    <div style={s.tableHeader}>
                      <span style={s.chartTitle}>Sensor Readings ({sensors.length})</span>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={s.table}>
                        <thead>
                          <tr>
                            {['Type', 'dw (µm)', 'lw (mm)', 'Bent', 'Sensitivity', 'LoD', 'Conc. (mg/ml)', 'Recorded By', 'Actions'].map(h => (
                              <th key={h} style={s.th}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {sensors.map(r => (
                            <tr key={r._id} style={s.tr}>
                              <td style={{ ...s.td, ...s.typeCell }}>{r.sensorType}</td>
                              <td style={s.td}>{r.waistDiameter ?? '—'}</td>
                              <td style={s.td}>{r.waistLength ?? '—'}</td>
                              <td style={s.td}><span style={{ color: r.hasBend ? '#10d48e' : '#4d7a96' }}>{r.hasBend ? 'Yes' : 'No'}</span></td>
                              <td style={{ ...s.td, color: '#00d4ff', fontFamily: 'var(--mono)', fontSize: '13px' }}>{r.sensitivity?.toFixed(4)}</td>
                              <td style={{ ...s.td, color: '#10d48e', fontFamily: 'var(--mono)', fontSize: '13px' }}>{r.lod?.toFixed(3)}</td>
                              <td style={s.td}>{r.concentration ?? '—'}</td>
                              <td style={{ ...s.td, color: 'var(--text2)' }}>{r.recordedBy?.name || 'System'}</td>
                              <td style={s.td}>
                                <button onClick={() => deleteSensor(r._id)} style={s.delBtn}>✕</button>
                              </td>
                            </tr>
                          ))}
                          {sensors.length === 0 && (
                            <tr><td colSpan={9} style={{ ...s.td, textAlign: 'center', color: 'var(--text3)', padding: '2rem' }}>No data — click "Seed Research Data" to load</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* PRODUCTS TABLE */}
              {active === 'products' && (
                <div style={s.tableCard}>
                  <div style={s.tableHeader}><span style={s.chartTitle}>Product Tests ({products.length})</span></div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={s.table}>
                      <thead>
                        <tr>
                          {['Product', 'Type', 'Measured (mg/ml)', 'Nominal (mg/ml)', 'Δ Error', 'Sensor', 'Actions'].map(h => (
                            <th key={h} style={s.th}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(p => (
                          <tr key={p._id} style={s.tr}>
                            <td style={{ ...s.td, color: 'var(--text)', fontWeight: '500' }}>{p.productName}</td>
                            <td style={s.td}><span style={s.typeBadge}>{p.productType}</span></td>
                            <td style={{ ...s.td, fontFamily: 'var(--mono)', color: '#00d4ff' }}>{p.measuredConcentration?.toFixed(2)}</td>
                            <td style={{ ...s.td, fontFamily: 'var(--mono)', color: 'var(--text2)' }}>{p.nominalConcentration?.toFixed(2)}</td>
                            <td style={{ ...s.td, fontFamily: 'var(--mono)', color: p.delta <= 0.5 ? '#10d48e' : '#f59e0b' }}>±{p.delta?.toFixed(2)}</td>
                            <td style={{ ...s.td, color: 'var(--text3)' }}>{p.sensorUsed}</td>
                            <td style={s.td}><button onClick={() => deleteProduct(p._id)} style={s.delBtn}>✕</button></td>
                          </tr>
                        ))}
                        {products.length === 0 && (
                          <tr><td colSpan={7} style={{ ...s.td, textAlign: 'center', color: 'var(--text3)', padding: '2rem' }}>No products — click "Seed Research Data"</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ADD READING */}
              {active === 'add' && (
                <div style={s.addGrid}>
                  <div style={s.formCard}>
                    <div style={s.chartTitle}>Add Sensor Reading</div>
                    <form onSubmit={addSensor} style={s.addForm}>
                      {[
                        { label: 'Sensor Type', key: 'sensorType', type: 'select', opts: ['Type I', 'Type II', 'Type III', 'Type IV'] },
                        { label: 'Sensitivity (a.u./(mg·ml⁻¹))', key: 'sensitivity', type: 'number', step: '0.0001', placeholder: '0.1257' },
                        { label: 'LoD (mg/ml)', key: 'lod', type: 'number', step: '0.001', placeholder: '0.917' },
                        { label: 'Concentration tested (mg/ml)', key: 'concentration', type: 'number', step: '0.1', placeholder: '90' },
                        { label: 'Notes', key: 'notes', type: 'text', placeholder: 'Optional notes...' },
                      ].map(f => (
                        <div key={f.key} style={s.formField}>
                          <label style={s.formLabel}>{f.label}</label>
                          {f.type === 'select' ? (
                            <select value={addForm[f.key]} onChange={e => setAddForm({ ...addForm, [f.key]: e.target.value })} style={s.formInput}>
                              {f.opts.map(o => <option key={o}>{o}</option>)}
                            </select>
                          ) : (
                            <input type={f.type} step={f.step} placeholder={f.placeholder}
                              value={addForm[f.key]} onChange={e => setAddForm({ ...addForm, [f.key]: e.target.value })}
                              style={s.formInput} required={f.key !== 'notes'} />
                          )}
                        </div>
                      ))}
                      <button type="submit" style={s.submitBtn}>Add Sensor Reading</button>
                    </form>
                  </div>

                  <div style={s.formCard}>
                    <div style={s.chartTitle}>Add Product Test</div>
                    <form onSubmit={addProduct} style={s.addForm}>
                      {[
                        { label: 'Product Name', key: 'productName', type: 'text', placeholder: 'e.g. Vitamin C Tablets' },
                        { label: 'Product Type', key: 'productType', type: 'select', opts: ['tablet', 'juice', 'powder', 'other'] },
                        { label: 'Measured Concentration (mg/ml)', key: 'measuredConcentration', type: 'number', step: '0.01', placeholder: '20.37' },
                        { label: 'Nominal Concentration (mg/ml)', key: 'nominalConcentration', type: 'number', step: '0.01', placeholder: '21.3' },
                      ].map(f => (
                        <div key={f.key} style={s.formField}>
                          <label style={s.formLabel}>{f.label}</label>
                          {f.type === 'select' ? (
                            <select value={addProductForm[f.key]} onChange={e => setAddProductForm({ ...addProductForm, [f.key]: e.target.value })} style={s.formInput}>
                              {f.opts.map(o => <option key={o}>{o}</option>)}
                            </select>
                          ) : (
                            <input type={f.type} step={f.step} placeholder={f.placeholder}
                              value={addProductForm[f.key]} onChange={e => setAddProductForm({ ...addProductForm, [f.key]: e.target.value })}
                              style={s.formInput} required />
                          )}
                        </div>
                      ))}
                      <button type="submit" style={s.submitBtn}>Add Product Test</button>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

const s = {
  layout: { display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' },
  sidebar: { width: '220px', background: 'var(--surface)', borderRight: '0.5px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.5rem 1rem', flexShrink: 0 },
  sideTop: {},
  brand: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' },
  brandIcon: { fontSize: '22px', color: 'var(--accent)' },
  brandName: { fontSize: '15px', fontWeight: '700', color: 'var(--text)' },
  brandSub: { fontSize: '10px', color: 'var(--text3)', fontFamily: 'var(--mono)', letterSpacing: '0.04em' },
  nav: { display: 'flex', flexDirection: 'column', gap: '4px' },
  navItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', background: 'transparent', color: 'var(--text3)', fontSize: '13px', fontWeight: '500', textAlign: 'left', width: '100%', border: 'none', cursor: 'pointer', transition: 'all 0.15s' },
  navActive: { background: 'var(--surface2)', color: 'var(--accent)', border: '0.5px solid var(--border2)' },
  navIcon: { fontSize: '16px', width: '18px', textAlign: 'center' },
  sideBottom: { display: 'flex', flexDirection: 'column', gap: '10px' },
  userCard: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'var(--bg2)', borderRadius: '10px', border: '0.5px solid var(--border)' },
  avatar: { width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: '#000', flexShrink: 0 },
  userName: { fontSize: '13px', fontWeight: '600', color: 'var(--text)' },
  userRole: { fontSize: '10px', color: 'var(--text3)', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.06em' },
  logoutBtn: { width: '100%', padding: '9px', background: 'transparent', border: '0.5px solid var(--border2)', color: 'var(--text3)', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
  main: { flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  topbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.75rem', borderBottom: '0.5px solid var(--border)', flexShrink: 0, gap: '1rem', flexWrap: 'wrap' },
  pageTitle: { fontSize: '20px', fontWeight: '700', color: 'var(--text)' },
  pageSub: { fontSize: '12px', color: 'var(--text3)', fontFamily: 'var(--mono)', marginTop: '3px' },
  topActions: { display: 'flex', alignItems: 'center', gap: '12px' },
  toast: { background: 'rgba(16,212,142,0.15)', border: '0.5px solid rgba(16,212,142,0.3)', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', color: '#10d48e' },
  seedBtn: { background: 'var(--surface2)', border: '0.5px solid var(--border2)', color: 'var(--accent)', padding: '9px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--mono)' },
  content: { flex: 1, overflow: 'auto', padding: '1.75rem' },
  loadWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', gap: '12px', color: 'var(--text3)', fontFamily: 'var(--mono)', fontSize: '14px' },
  spinner: { width: '20px', height: '20px', border: '2px solid var(--border2)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  metricsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '1.5rem' },
  metricCard: { background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: '14px', padding: '16px 18px' },
  metricLabel: { fontSize: '11px', fontFamily: 'var(--mono)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' },
  metricVal: { fontSize: '26px', fontWeight: '700', lineHeight: 1, marginBottom: '4px' },
  metricUnit: { fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--mono)' },
  chartsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '1.5rem' },
  chartCard: { background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: '14px', padding: '16px 18px' },
  chartTitle: { fontSize: '12px', fontFamily: 'var(--mono)', color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' },
  peakCard: { background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: '14px', padding: '16px 18px' },
  peakRow: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' },
  peakItem: { background: 'var(--bg2)', borderRadius: '10px', padding: '14px', border: '0.5px solid var(--border)' },
  peakWave: { fontSize: '18px', fontFamily: 'var(--mono)', fontWeight: '700', color: 'var(--accent)', marginBottom: '4px' },
  peakBond: { fontSize: '13px', fontWeight: '600', color: 'var(--text)', marginBottom: '2px' },
  peakWl: { fontSize: '11px', fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: '8px' },
  peakDesc: { fontSize: '12px', color: 'var(--text2)', lineHeight: 1.5 },
  tableCard: { background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: '14px', overflow: 'hidden' },
  tableHeader: { padding: '16px 20px', borderBottom: '0.5px solid var(--border)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '10px 16px', textAlign: 'left', fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '0.5px solid var(--border)', background: 'var(--bg2)' },
  td: { padding: '11px 16px', fontSize: '13px', color: 'var(--text2)', borderBottom: '0.5px solid var(--border)' },
  tr: { transition: 'background 0.15s' },
  typeCell: { fontFamily: 'var(--mono)', color: 'var(--accent)', fontWeight: '700', fontSize: '12px' },
  typeBadge: { background: 'var(--surface2)', border: '0.5px solid var(--border2)', borderRadius: '5px', padding: '2px 8px', fontSize: '11px', color: 'var(--text2)', fontFamily: 'var(--mono)' },
  delBtn: { background: 'rgba(239,68,68,0.1)', border: '0.5px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer' },
  addGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  formCard: { background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: '14px', padding: '20px' },
  addForm: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' },
  formField: { display: 'flex', flexDirection: 'column', gap: '5px' },
  formLabel: { fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em' },
  formInput: { background: 'var(--bg2)', border: '0.5px solid var(--border2)', color: 'var(--text)', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', outline: 'none', fontFamily: 'var(--sans)' },
  submitBtn: { background: 'var(--accent)', color: '#000', padding: '12px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', border: 'none', cursor: 'pointer', marginTop: '4px' },
};
