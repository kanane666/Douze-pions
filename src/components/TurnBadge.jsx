export default function TurnBadge({ turn, thinking, winner }) {
  if (winner) {
    const msg = winner === 'draw' ? 'Match nul !' : winner === 'j1' ? 'Vous gagnez !' : "L'IA gagne !";
    const color = winner === 'j1' ? '#e040a0' : winner === 'j2' ? '#00d4ff' : '#aaa';
    return (
      <div style={{ display:'flex', justifyContent:'center', padding:'12px 20px' }}>
        <div style={{
          padding: '10px 28px', borderRadius: 50,
          background: `${color}22`, border: `1px solid ${color}55`,
          color, fontSize: 15, fontWeight: 700, letterSpacing: 0.3,
        }}>{msg}</div>
      </div>
    );
  }

  if (thinking) {
    return (
      <div style={{ display:'flex', justifyContent:'center', padding:'12px 20px' }}>
        <div style={{
          display:'flex', alignItems:'center', gap:10,
          padding:'10px 22px', borderRadius:50,
          background:'rgba(0,212,255,0.1)', border:'1px solid rgba(0,212,255,0.25)',
        }}>
          <ThinkingDots />
          <span style={{ color:'#00d4ff', fontSize:14, fontWeight:600 }}>IA en train de réfléchir</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display:'flex', justifyContent:'center', padding:'12px 20px' }}>
      <div style={{
        display:'flex', alignItems:'center', gap:8,
        padding:'10px 22px', borderRadius:50,
        background: turn==='j1' ? 'rgba(224,64,160,0.12)' : 'rgba(0,212,255,0.1)',
        border: `1px solid ${turn==='j1' ? 'rgba(224,64,160,0.3)' : 'rgba(0,212,255,0.25)'}`,
      }}>
        <div style={{
          width:8, height:8, borderRadius:'50%',
          background: turn==='j1' ? '#e040a0' : '#00d4ff',
          boxShadow: `0 0 8px ${turn==='j1' ? '#e040a0' : '#00d4ff'}`,
          animation: 'pulse 1.5s infinite',
        }} />
        <span style={{
          color: turn==='j1' ? '#e040a0' : '#00d4ff',
          fontSize: 14, fontWeight: 600,
        }}>
          {turn==='j1' ? 'Votre tour' : 'Tour de l\'IA'}
        </span>
      </div>
    </div>
  );
}

function ThinkingDots() {
  return (
    <div style={{ display:'flex', gap:4 }}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          width:6, height:6, borderRadius:'50%', background:'#00d4ff',
          animation: `bounce 1s ${i*0.15}s infinite`,
        }}/>
      ))}
      <style>{`
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </div>
  );
}