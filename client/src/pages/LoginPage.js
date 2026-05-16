import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (mode === 'login') await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.page}>
      {/* Animated grid background */}
      <div style={styles.grid} />
      <div style={styles.glow1} />
      <div style={styles.glow2} />

      {/* Left panel */}
      <div style={styles.left}>
        <div style={styles.leftInner}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>⬡</span>
            <span style={styles.logoText}>SensorLab</span>
          </div>
          <h1 style={styles.hero}>Infrared<br /><span style={styles.heroAccent}>Evanescent<br />Wave</span><br />Sensor</h1>
          <p style={styles.heroSub}>As₂S₃ fiber-based detection system for ascorbic acid quantification in food and pharmaceutical products.</p>
          <div style={styles.specs}>
            {[
              ['Sensitivity', '0.1257 a.u./(mg·ml⁻¹)'],
              ['LoD', '0.917 mg/ml'],
              ['Fiber', 'As₂S₃ Chalcogenide'],
              ['Range', '5000–1500 cm⁻¹'],
            ].map(([k, v]) => (
              <div key={k} style={styles.spec}>
                <span style={styles.specKey}>{k}</span>
                <span style={styles.specVal}>{v}</span>
              </div>
            ))}
          </div>
          <p style={styles.citation}>Journal of Lightwave Technology · Vol. 42, No. 9 · May 2024</p>
        </div>
      </div>

      {/* Right panel - form */}
      <div style={styles.right}>
        <div style={styles.card}>
          <div style={styles.tabs}>
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); }}
                style={{ ...styles.tab, ...(mode === m ? styles.tabActive : {}) }}>
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <h2 style={styles.formTitle}>
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p style={styles.formSub}>
            {mode === 'login' ? 'Access your research dashboard' : 'Join the sensor research platform'}
          </p>

          <form onSubmit={handleSubmit} style={styles.form}>
            {mode === 'register' && (
              <div style={styles.field}>
                <label style={styles.label}>Full Name</label>
                <input
                  type="text" placeholder="Dr. Jane Smith" required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  style={styles.input}
                />
              </div>
            )}
            <div style={styles.field}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email" placeholder="researcher@lab.edu" required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                type="password" placeholder="••••••••" required
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                style={styles.input}
              />
            </div>

            {error && <div style={styles.error}>{error}</div>}

            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? 'Authenticating...' : mode === 'login' ? 'Sign In →' : 'Create Account →'}
            </button>
          </form>

          {mode === 'login' && (
            <div style={styles.demo}>
              <span style={styles.demoLabel}>Demo credentials:</span>
              <button style={styles.demoBtn} onClick={() => setForm({ ...form, email: 'demo@lab.edu', password: 'demo123' })}>
                Use demo account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', minHeight: '100vh', position: 'relative', overflow: 'hidden', background: 'var(--bg)' },
  grid: {
    position: 'absolute', inset: 0, zIndex: 0,
    backgroundImage: 'linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)',
    backgroundSize: '40px 40px',
  },
  glow1: { position: 'absolute', top: '-20%', left: '20%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)', zIndex: 0 },
  glow2: { position: 'absolute', bottom: '-10%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)', zIndex: 0 },
  left: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', position: 'relative', zIndex: 1 },
  leftInner: { maxWidth: '480px' },
  logo: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '3rem' },
  logoIcon: { fontSize: '24px', color: 'var(--accent)' },
  logoText: { fontFamily: 'var(--mono)', fontSize: '16px', color: 'var(--accent)', letterSpacing: '0.1em' },
  hero: { fontSize: 'clamp(40px,5vw,64px)', fontWeight: '800', lineHeight: 1.05, color: 'var(--text)', marginBottom: '1.5rem' },
  heroAccent: { color: 'var(--accent)' },
  heroSub: { fontSize: '15px', color: 'var(--text2)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '380px' },
  specs: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '2.5rem' },
  spec: { background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: '10px', padding: '12px 14px' },
  specKey: { display: 'block', fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: '0.08em', marginBottom: '4px', textTransform: 'uppercase' },
  specVal: { display: 'block', fontSize: '13px', fontFamily: 'var(--mono)', color: 'var(--accent)', fontWeight: '700' },
  citation: { fontSize: '11px', fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: '0.04em' },
  right: { width: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', zIndex: 1 },
  card: { width: '100%', background: 'var(--surface)', border: '0.5px solid var(--border2)', borderRadius: '20px', padding: '2rem' },
  tabs: { display: 'flex', background: 'var(--bg2)', borderRadius: '10px', padding: '4px', marginBottom: '1.75rem', gap: '4px' },
  tab: { flex: 1, padding: '9px', borderRadius: '8px', background: 'transparent', color: 'var(--text3)', fontSize: '13px', fontWeight: '600', letterSpacing: '0.03em' },
  tabActive: { background: 'var(--surface2)', color: 'var(--accent)', boxShadow: '0 0 0 0.5px var(--border2)' },
  formTitle: { fontSize: '24px', fontWeight: '700', color: 'var(--text)', marginBottom: '6px' },
  formSub: { fontSize: '13px', color: 'var(--text3)', marginBottom: '1.75rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '11px', fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: '0.06em', textTransform: 'uppercase' },
  input: { background: 'var(--bg2)', border: '0.5px solid var(--border2)', color: 'var(--text)', borderRadius: '8px', padding: '11px 14px', fontSize: '14px', outline: 'none', width: '100%', fontFamily: 'var(--sans)' },
  error: { background: 'rgba(239,68,68,0.1)', border: '0.5px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#f87171' },
  submitBtn: { background: 'var(--accent)', color: '#000', padding: '13px', borderRadius: '10px', fontWeight: '700', fontSize: '15px', letterSpacing: '0.02em', marginTop: '6px', border: 'none', cursor: 'pointer', transition: 'all 0.2s' },
  demo: { marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--bg2)', borderRadius: '10px', border: '0.5px solid var(--border)' },
  demoLabel: { fontSize: '12px', color: 'var(--text3)', fontFamily: 'var(--mono)' },
  demoBtn: { fontSize: '12px', color: 'var(--accent)', background: 'transparent', border: '0.5px solid var(--border2)', borderRadius: '6px', padding: '5px 12px', fontWeight: '600', cursor: 'pointer' },
};
