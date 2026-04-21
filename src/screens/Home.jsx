import { useState } from 'react';

export default function Home({ onSelect, stats, onResetStats }) {
  const [difficulty, setDifficulty] = useState('normal');
  const [showConfirm, setShowConfirm] = useState(false);

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

  const levels = [
    { id: 'easy',   label: 'Facile' },
    { id: 'normal', label: 'Normal' },
    { id: 'hard',   label: 'Difficile' },
  ];

  // Calcule les stats globales toutes parties confondues
  function globalStats() {
    let wins = 0, losses = 0, draws = 0;
    for (const game of ['douze', 'trois']) {
      for (const m of ['ai', '2p']) {
        wins   += stats[game][m].wins;
        losses += stats[game][m].losses;
        draws  += stats[game][m].draws;
      }
    }
    const total = wins + losses + draws;
    const rate  = total > 0 ? Math.round((wins / total) * 100) : 0;
    return { wins, losses, draws, total, rate };
  }

  function gameStats(id) {
    const ai  = stats[id].ai;
    const p2  = stats[id]['2p'];
    const wins   = ai.wins   + p2.wins;
    const losses = ai.losses + p2.losses;
    const draws  = ai.draws  + p2.draws;
    const total  = wins + losses + draws;
    const rate   = total > 0 ? Math.round((wins / total) * 100) : 0;
    return { wins, losses, draws, total, rate };
  }

  const g = globalStats();

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 0 40px' }}>

      {/* Header */}
      <div style={{ padding: '36px 24px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 3, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 10 }}>
            Game Hub
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#fff', letterSpacing: -1, lineHeight: 1.1 }}>
            Douze &amp; Trois
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
            Deux jeux stratégiques · vs IA ou un ami
          </div>
        </div>

        {/* Bouton reset */}
        {g.total > 0 && (
          <button
            onClick={() => setShowConfirm(true)}
            style={{
              marginTop: 8, padding: '8px 14px', borderRadius: 10,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.35)', fontSize: 12,
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            Reset stats
          </button>
        )}
      </div>

      {/* Confirmation reset */}
      {showConfirm && (
        <div style={{
          margin: '0 20px 20px',
          padding: '16px 20px',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
            Effacer toutes les stats ?
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setShowConfirm(false)} style={{
              padding: '7px 14px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.1)',
              background: 'transparent', color: 'rgba(255,255,255,0.4)', fontSize: 12, cursor: 'pointer',
            }}>
              Annuler
            </button>
            <button onClick={() => { onResetStats(); setShowConfirm(false); }} style={{
              padding: '7px 14px', borderRadius: 9, border: '1px solid rgba(224,64,160,0.4)',
              background: 'rgba(224,64,160,0.15)', color: '#e040a0', fontSize: 12,
              fontWeight: 600, cursor: 'pointer',
            }}>
              Confirmer
            </button>
          </div>
        </div>
      )}

      {/* Stats globales */}
      {g.total > 0 && (
        <div style={{ margin: '0 20px 24px' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
            Stats globales
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 18, padding: '16px 20px',
          }}>
            {/* Chiffres */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              {[
                { label: 'Victoires', val: g.wins,   color: '#e040a0' },
                { label: 'Défaites',  val: g.losses, color: '#00d4ff' },
                { label: 'Nuls',      val: g.draws,  color: 'rgba(255,255,255,0.35)' },
                { label: 'Parties',   val: g.total,  color: 'rgba(255,255,255,0.6)' },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color }}>{val}</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 2, letterSpacing: 0.5 }}>
                    {label.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>

            {/* Barre taux victoire */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: 1 }}>
                TAUX DE VICTOIRE
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, color: g.rate >= 50 ? '#e040a0' : '#00d4ff' }}>
                {g.rate}%
              </span>
            </div>
            <div style={{ height: 5, borderRadius: 5, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${g.rate}%`, borderRadius: 5,
                background: g.rate >= 50
                  ? 'linear-gradient(90deg, #e040a0, #f472b6)'
                  : 'linear-gradient(90deg, #185FA5, #00d4ff)',
                transition: 'width 0.5s ease',
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Sélecteur difficulté */}
      <div style={{ padding: '0 20px 24px' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
          Niveau IA
        </div>
        <div style={{
          display: 'flex', gap: 8,
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 14, padding: 4,
        }}>
          {levels.map(l => (
            <button key={l.id} onClick={() => setDifficulty(l.id)} style={{
              flex: 1, padding: '10px 8px',
              borderRadius: 11, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600,
              background: difficulty === l.id ? 'rgba(255,255,255,0.12)' : 'transparent',
              color: difficulty === l.id ? '#fff' : 'rgba(255,255,255,0.35)',
              boxShadow: difficulty === l.id ? '0 0 0 1px rgba(255,255,255,0.15)' : 'none',
              transition: 'all 0.15s',
            }}>
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cartes jeux */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '0 20px' }}>
        {games.map(g => {
          const gs = gameStats(g.id);
          return (
            <div key={g.id} style={{
              background: '#16161f',
              border: `1px solid ${g.border}`,
              borderRadius: 24, overflow: 'hidden',
            }}>
              <div style={{
                background: g.dim, padding: '28px 28px 20px',
                display: 'flex', justifyContent: 'center',
                borderBottom: `1px solid ${g.border}`,
              }}>
                {g.board}
              </div>

              <div style={{ padding: '20px 24px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>{g.title}</div>
                  {/* Mini stats par jeu */}
                  {gs.total > 0 && (
                    <div style={{
                      display: 'flex', gap: 8, alignItems: 'center',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: 10, padding: '5px 10px',
                    }}>
                      <span style={{ fontSize: 12, color: '#e040a0', fontWeight: 700 }}>{gs.wins}V</span>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>·</span>
                      <span style={{ fontSize: 12, color: '#00d4ff', fontWeight: 700 }}>{gs.losses}D</span>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>·</span>
                      <span style={{ fontSize: 12, color: g.color, fontWeight: 700 }}>{gs.rate}%</span>
                    </div>
                  )}
                </div>

                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: 18 }}>
                  {g.desc}
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => onSelect(g.id, 'ai', difficulty)}
                    style={{
                      flex: 1, padding: '13px 8px', borderRadius: 14,
                      fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      background: g.dim, border: `1px solid ${g.border}`,
                      color: g.color, transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = g.border}
                    onMouseLeave={e => e.currentTarget.style.background = g.dim}
                  >
                    vs IA
                  </button>
                  <button
                    onClick={() => onSelect(g.id, '2p', difficulty)}
                    style={{
                      flex: 1, padding: '13px 8px', borderRadius: 14,
                      fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: 'rgba(255,255,255,0.7)',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  >
                    2 Joueurs
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MiniDouze() {
  const cells = Array(25).fill(null);
  for (let i = 0; i < 12; i++) cells[i] = 'j1';
  for (let i = 13; i < 25; i++) cells[i] = 'j2';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 5, width: 160 }}>
      {cells.map((c, i) => (
        <div key={i} style={{
          width: 28, height: 28, borderRadius: 7,
          background: c ? 'transparent' : 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {c && <div style={{
            width: 20, height: 20, borderRadius: '50%',
            background: c === 'j1'
              ? 'radial-gradient(circle at 35% 35%, #f472b6, #e040a0)'
              : 'radial-gradient(circle at 35% 35%, #67e8f9, #00d4ff)',
            boxShadow: c === 'j1'
              ? '0 0 8px rgba(224,64,160,0.5)'
              : '0 0 8px rgba(0,212,255,0.5)',
          }} />}
        </div>
      ))}
    </div>
  );
}

function MiniTrois() {
  return (
    <svg viewBox="0 0 160 160" width={140} height={140}>
      {[[0,80,160,80],[80,0,80,160],[0,0,160,160],[160,0,0,160]].map(([x1,y1,x2,y2], i) =>
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(0,212,255,0.25)" strokeWidth={1.5} />
      )}
      {[{x:16,y:16,c:'j1'},{x:80,y:80,c:'j2'},{x:144,y:144,c:'j1'},{x:144,y:16,c:'j2'}].map((p, i) =>
        <circle key={i} cx={p.x} cy={p.y} r={12}
          fill={p.c === 'j1' ? '#e040a0' : '#00d4ff'} opacity={0.85} />
      )}
    </svg>
  );
}