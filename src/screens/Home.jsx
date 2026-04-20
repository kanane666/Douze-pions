export default function Home({ onSelect }) {
  const games = [
    {
      id: 'douze',
      title: 'Douze Pions',
      desc: 'Jeu stratégique de déplacement et capture sur plateau 5×5. Devenez Dame pour dominer.',
      color: '#e040a0',
      dim: 'rgba(224,64,160,0.12)',
      border: 'rgba(224,64,160,0.25)',
      board: <MiniDouze />,
    },
    {
      id: 'trois',
      title: 'Trois Pions',
      desc: 'Alignement tactique 3 en ligne. Lignes, colonnes et diagonales en jeu.',
      color: '#00d4ff',
      dim: 'rgba(0,212,255,0.10)',
      border: 'rgba(0,212,255,0.22)',
      board: <MiniTrois />,
    },
  ];

  return (
    <div style={{ maxWidth:480, margin:'0 auto', padding:'0 0 40px' }}>
      <div style={{ padding:'36px 24px 28px' }}>
        <div style={{ fontSize:11, letterSpacing:3, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', marginBottom:10 }}>
          Game Hub
        </div>
        <div style={{ fontSize:36, fontWeight:700, color:'#fff', letterSpacing:-1, lineHeight:1.1 }}>
          Douze &amp; Trois
        </div>
        <div style={{ fontSize:14, color:'rgba(255,255,255,0.4)', marginTop:8 }}>
          Jouez contre l'IA · Deux jeux stratégiques
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:16, padding:'0 20px' }}>
        {games.map(g => (
          <div key={g.id}
            onClick={() => onSelect(g.id)}
            style={{
              background:'#16161f',
              border:`1px solid ${g.border}`,
              borderRadius:24,
              overflow:'hidden',
              cursor:'pointer',
              transition:'transform 0.18s, box-shadow 0.18s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow=`0 16px 48px ${g.dim}`; }}
            onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
          >
            <div style={{
              background: g.dim,
              padding:'28px 28px 20px',
              display:'flex', justifyContent:'center',
              borderBottom:`1px solid ${g.border}`,
            }}>
              {g.board}
            </div>
            <div style={{ padding:'22px 28px 24px' }}>
              <div style={{ fontSize:22, fontWeight:700, color:'#fff', marginBottom:8 }}>{g.title}</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.45)', lineHeight:1.6, marginBottom:20 }}>{g.desc}</div>
              <button style={{
                width:'100%', padding:'14px',
                borderRadius:14, fontSize:15, fontWeight:600,
                background: g.dim,
                border:`1px solid ${g.border}`,
                color: g.color,
                transition:'background 0.2s',
                letterSpacing:0.3,
              }}
              onMouseEnter={e => e.currentTarget.style.background=g.border}
              onMouseLeave={e => e.currentTarget.style.background=g.dim}
              >
                Jouer vs IA →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniDouze() {
  const cells = Array(25).fill(null);
  for(let i=0;i<12;i++) cells[i]='j1';
  for(let i=13;i<25;i++) cells[i]='j2';
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:5, width:160 }}>
      {cells.map((c,i) => (
        <div key={i} style={{
          width:28, height:28, borderRadius:7,
          background: c ? 'transparent' : 'rgba(255,255,255,0.04)',
          border:'1px solid rgba(255,255,255,0.07)',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          {c && <div style={{
            width:20, height:20, borderRadius:'50%',
            background: c==='j1' ? 'radial-gradient(circle at 35% 35%, #f472b6, #e040a0)' : 'radial-gradient(circle at 35% 35%, #67e8f9, #00d4ff)',
            boxShadow: c==='j1' ? '0 0 8px rgba(224,64,160,0.5)' : '0 0 8px rgba(0,212,255,0.5)',
          }}/>}
        </div>
      ))}
    </div>
  );
}

function MiniTrois() {
  return (
    <svg viewBox="0 0 160 160" width={140} height={140}>
      {[[0,80,160,80],[80,0,80,160],[0,0,160,160],[160,0,0,160]].map(([x1,y1,x2,y2],i)=>
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(0,212,255,0.25)" strokeWidth={1.5}/>
      )}
      {[{x:16,y:16,c:'j1'},{x:80,y:80,c:'j2'},{x:144,y:144,c:'j1'},{x:144,y:16,c:'j2'},{x:16,y:144,c:null}].map((p,i)=>
        p.c ? <circle key={i} cx={p.x} cy={p.y} r={12}
          fill={p.c==='j1'?'#e040a0':'#00d4ff'}
          opacity={0.85}/> : null
      )}
    </svg>
  );
}