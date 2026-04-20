export default function StatsBar({ stats }) {
  const total = stats.wins + stats.losses + stats.draws;
  return (
    <div style={{
      display:'flex', gap:8, padding:'0 20px 16px',
    }}>
      {[
        { label:'Victoires', val:stats.wins, color:'#e040a0' },
        { label:'Défaites', val:stats.losses, color:'#00d4ff' },
        { label:'Nuls', val:stats.draws, color:'rgba(255,255,255,0.3)' },
      ].map(({ label, val, color }) => (
        <div key={label} style={{
          flex:1, padding:'12px 10px',
          background:'rgba(255,255,255,0.04)',
          border:'1px solid rgba(255,255,255,0.07)',
          borderRadius:14, textAlign:'center',
        }}>
          <div style={{ fontSize:22, fontWeight:700, color }}>{val}</div>
          <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', marginTop:2, letterSpacing:0.5 }}>{label.toUpperCase()}</div>
        </div>
      ))}
    </div>
  );
}