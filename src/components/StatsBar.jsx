export default function StatsBar({ stats, mode }) {
  const total = stats.wins + stats.losses + stats.draws;
  const winRate = total > 0 ? Math.round((stats.wins / total) * 100) : 0;

  return (
    <div style={{ padding: '0 20px 16px' }}>
      {/* Barre de stats */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        {[
          { label: 'Victoires', val: stats.wins,   color: '#e040a0' },
          { label: 'Défaites',  val: stats.losses, color: '#00d4ff' },
          { label: 'Nuls',      val: stats.draws,  color: 'rgba(255,255,255,0.35)' },
        ].map(({ label, val, color }) => (
          <div key={label} style={{
            flex: 1, padding: '12px 10px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 14, textAlign: 'center',
          }}>
            <div style={{ fontSize: 22, fontWeight: 700, color }}>{val}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 2, letterSpacing: 0.5 }}>
              {label.toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      {/* Barre de progression taux victoire */}
      {total > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: 1 }}>
              TAUX DE VICTOIRE
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: winRate >= 50 ? '#e040a0' : '#00d4ff' }}>
              {winRate}%
            </span>
          </div>
          <div style={{
            height: 4, borderRadius: 4,
            background: 'rgba(255,255,255,0.08)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${winRate}%`,
              borderRadius: 4,
              background: winRate >= 50
                ? 'linear-gradient(90deg, #e040a0, #f472b6)'
                : 'linear-gradient(90deg, #185FA5, #00d4ff)',
              transition: 'width 0.5s ease',
            }} />
          </div>
          <div style={{
            fontSize: 10, color: 'rgba(255,255,255,0.2)',
            marginTop: 5, textAlign: 'right',
          }}>
            {total} partie{total > 1 ? 's' : ''} · {mode === 'ai' ? 'vs IA' : '2 joueurs'}
          </div>
        </div>
      )}
    </div>
  );
}