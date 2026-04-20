export default function TopBar({ title, onBack, onReset }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 20px',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <button onClick={onBack} style={{
        width: 40, height: 40, borderRadius: 12,
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: '#fff', fontSize: 18, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.2s',
      }}>←</button>

      <span style={{ fontSize: 16, fontWeight: 600, color: '#fff', letterSpacing: 0.3 }}>
        {title}
      </span>

      <button onClick={onReset} style={{
        width: 40, height: 40, borderRadius: 12,
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: '#fff', fontSize: 18, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.2s',
      }}>↺</button>
    </div>
  );
}