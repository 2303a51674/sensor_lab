import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await register(form.name, form.email, form.password);
      } else {
        await login(form.email, form.password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.brand}>
          <span style={s.brandIcon}>⬡</span>
          <div>
            <div style={s.brandName}>SensorLab</div>
            <div style={s.brandSub}>IR Sensor Platform</div>
          </div>
        </div>

        <h2 style={s.title}>{isRegister ? 'Create Account' : 'Sign In'}</h2>
        <p style={s.sub}>As₂S₃ Infrared Evanescent Wave Detection System</p>

        {error && <div style={s.error}>{error}</div>}

        <form onSubmit={handle} style={s.form}>
          {isRegister && (
            <div style={s.field}>
              <label style={s.label}>Name</label>
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                style={s.input}
                required
              />
            </div>
          )}
          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              style={s.input}
              required
            />
          </div>
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              style={s.input}
              required
            />
          </div>
          <button type="submit" style={s.btn} disabled={loading}>
            {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p style={s.toggle}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span style={s.toggleLink} onClick={() => { setIsRegister(!isRegister); setError(''); }}>
            {isRegister ? 'Sign In' : 'Register'}
          </span>
        </p>
      </div>
    </div>
  );
}

const s = {
  page: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)' },
  card: { background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: '18px', padding: '2.5rem 2rem', width: '100%', maxWidth: '400px' },
  brand: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' },
  brandIcon: { fontSize: '28px', color: 'var(--accent)' },
  brandName: { fontSize: '18px', fontWeight: '700', color: 'var(--text)' },
  brandSub: { fontSize: '10px', color: 'var(--text3)', fontFamily: 'var(--mono)', letterSpacing: '0.04em' },
  title: { fontSize: '22px', fontWeight: '700', color: 'var(--text)', marginBottom: '4px' },
  sub: { fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: '1.5rem' },
  error: { background: 'rgba(239,68,68,0.1)', border: '0.5px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#f87171', marginBottom: '1rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  field: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em' },
  input: { background: 'var(--bg2)', border: '0.5px solid var(--border2)', color: 'var(--text)', borderRadius: '8px', padding: '11px 13px', fontSize: '14px', outline: 'none', fontFamily: 'var(--sans)' },
  btn: { background: 'var(--accent)', color: '#000', padding: '13px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', border: 'none', cursor: 'pointer', marginTop: '6px' },
  toggle: { textAlign: 'center', marginTop: '1.25rem', fontSize: '13px', color: 'var(--text3)' },
  toggleLink: { color: 'var(--accent)', cursor: 'pointer', fontWeight: '600' },
};