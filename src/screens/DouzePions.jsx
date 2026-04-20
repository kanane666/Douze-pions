import { useState, useCallback } from 'react';
import { makeBoard, getMoves, getCaptures, applyMove, checkEnd, aiMove } from '../logic/douze.js';
import TopBar from '../components/TopBar.jsx';
import TurnBadge from '../components/TurnBadge.jsx';
import StatsBar from '../components/StatsBar.jsx';

export default function DouzePions({ onBack, stats, onStats }) {
  const [board, setBoard]       = useState(makeBoard);
  const [sel, setSel]           = useState(null);
  const [turn, setTurn]         = useState('j1');
  const [winner, setWinner]     = useState(null);
  const [thinking, setThinking] = useState(false);
  const [last, setLast]         = useState(null);
  // null = pas de prise en cours | number = index du pion qui doit continuer
  const [chainPion, setChain]   = useState(null);

  // Si prise en chaîne active → uniquement les captures de ce pion
  // Sinon → mouvements normaux du pion sélectionné
  const currentMoves = sel !== null
    ? (chainPion !== null ? getCaptures(board, sel) : getMoves(board, sel))
    : [];
  const moveTargets = currentMoves.map(m => m.to);

  const reset = () => {
    setBoard(makeBoard()); setSel(null); setTurn('j1');
    setWinner(null); setThinking(false); setLast(null); setChain(null);
  };

  function endGame(result) {
    setWinner(result);
    if (result === 'j1') onStats('wins');
    else if (result === 'j2') onStats('losses');
    else onStats('draws');
  }

  const doAI = useCallback((b) => {
    setThinking(true);
    setTimeout(() => {
      let cur = b;
      let pos = null;

      const first = aiMove(cur);
      if (!first) { endGame('j1'); setThinking(false); return; }
      cur = applyMove(cur, first.from, first.to);
      pos = first.to;

      // Chaîne captures IA : uniquement si le coup était une capture
      if (first.score >= 15 || getCaptures(b, first.from).some(m => m.to === first.to)) {
        while (true) {
          const nextCaps = getCaptures(cur, pos);
          if (!nextCaps.length) break;
          const pick = nextCaps[Math.floor(Math.random() * nextCaps.length)];
          cur = applyMove(cur, pos, pick.to);
          pos = pick.to;
        }
      }

      setBoard(cur); setLast(pos);
      const end = checkEnd(cur);
      if (end) endGame(end);
      else setTurn('j1');
      setThinking(false);
    }, 400 + Math.random() * 400);
  }, []);

  function onCell(i) {
    if (winner || turn !== 'j1' || thinking) return;

    // ── Prise en chaîne active ──────────────────────────────────
    if (chainPion !== null) {
      if (moveTargets.includes(i)) {
        const next = applyMove(board, chainPion, i);
        setBoard(next); setLast(i);
        const end = checkEnd(next);
        if (end) { endGame(end); setSel(null); setChain(null); return; }

        const moreCaps = getCaptures(next, i);
        if (moreCaps.length > 0) {
          // Encore des prises disponibles → on continue avec ce pion
          setSel(i); setChain(i);
        } else {
          // Plus de prise → fin du tour
          setSel(null); setChain(null);
          setTurn('j2'); doAI(next);
        }
      }
      // En mode chaîne on ignore tout clic ailleurs
      return;
    }

    // ── Jeu normal ──────────────────────────────────────────────
    if (sel === null) {
      if (board[i]?.p === 'j1') setSel(i);
      return;
    }

    if (moveTargets.includes(i)) {
      const wasCapture = currentMoves.find(m => m.to === i)?.capture !== null;
      const next = applyMove(board, sel, i);
      setBoard(next); setLast(i);
      const end = checkEnd(next);
      if (end) { endGame(end); setSel(null); return; }

      if (wasCapture && getCaptures(next, i).length > 0) {
        // Prise + encore des prises dispo → chaîne !
        setSel(i); setChain(i);
      } else {
        // Déplacement simple OU prise sans suite → fin du tour
        setSel(null); setChain(null);
        setTurn('j2'); doAI(next);
      }
    } else if (board[i]?.p === 'j1') {
      setSel(i);
    } else {
      setSel(null);
    }
  }

  const j1c = board.filter(x => x?.p === 'j1').length;
  const j2c = board.filter(x => x?.p === 'j2').length;

  return (
    <div style={{ maxWidth:480, margin:'0 auto' }}>
      <TopBar title="Douze Pions" onBack={onBack} onReset={reset} />
      <StatsBar stats={stats} />
      <TurnBadge turn={turn} thinking={thinking} winner={winner} />

      {chainPion !== null && (
        <div style={{
          textAlign:'center', fontSize:13, color:'#e040a0',
          marginBottom:8, fontWeight:600, letterSpacing:0.3
        }}>
          Prise multiple — continuez avec ce pion !
        </div>
      )}

      <div style={{ display:'flex', justifyContent:'space-between', padding:'0 24px 16px' }}>
        <PlayerCard label="Vous" count={j1c} color="#e040a0" active={turn==='j1'&&!winner} />
        <PlayerCard label="IA" count={j2c} color="#00d4ff" active={turn==='j2'&&!winner} />
      </div>

      <div style={{ padding:'0 16px' }}>
        <div style={{
          display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:6,
          background:'rgba(255,255,255,0.02)',
          border:'1px solid rgba(255,255,255,0.06)',
          borderRadius:20, padding:12,
        }}>
          {board.map((cell, i) => {
            const isSel   = sel === i;
            const isMov   = moveTargets.includes(i);
            const isLast  = last === i;
            const isChain = chainPion === i;
            return (
              <div key={i} onClick={() => onCell(i)} style={{
                aspectRatio:'1', borderRadius:12,
                background: isSel   ? 'rgba(224,64,160,0.22)'
                          : isMov   ? 'rgba(0,230,118,0.12)'
                          : isLast  ? 'rgba(255,255,255,0.06)'
                          : 'rgba(255,255,255,0.03)',
                border: isSel    ? '1.5px solid rgba(224,64,160,0.7)'
                      : isMov    ? '1.5px solid rgba(0,230,118,0.55)'
                      : isChain  ? '1.5px solid #e040a0'
                      : '1px solid rgba(255,255,255,0.06)',
                display:'flex', alignItems:'center', justifyContent:'center',
                cursor: !winner && !thinking ? 'pointer' : 'default',
                transition:'all 0.15s ease',
              }}>
                {cell && (
                  <div style={{
                    width:'70%', height:'70%', borderRadius:'50%',
                    background: cell.p === 'j1'
                      ? 'radial-gradient(circle at 35% 30%, #f9a8d4, #e040a0)'
                      : 'radial-gradient(circle at 35% 30%, #a5f3fc, #00d4ff)',
                    boxShadow: cell.p === 'j1'
                      ? '0 0 12px rgba(224,64,160,0.45), inset 0 1px 1px rgba(255,255,255,0.3)'
                      : '0 0 12px rgba(0,212,255,0.45), inset 0 1px 1px rgba(255,255,255,0.3)',
                    border: cell.dame ? '2px solid rgba(255,255,255,0.65)' : 'none',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.9)',
                    transform: isSel ? 'scale(1.15)' : 'scale(1)',
                    transition:'transform 0.15s ease',
                  }}>
                    {cell.dame ? 'D' : ''}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {winner && (
        <div style={{ padding:'20px 16px 0' }}>
          <button onClick={reset} style={{
            width:'100%', padding:'16px', borderRadius:16,
            background:'rgba(255,255,255,0.07)',
            border:'1px solid rgba(255,255,255,0.12)',
            color:'#fff', fontSize:15, fontWeight:600,
          }}>
            Rejouer
          </button>
        </div>
      )}
    </div>
  );
}

function PlayerCard({ label, count, color, active }) {
  return (
    <div style={{
      padding:'12px 20px', borderRadius:16,
      background: active ? `${color}18` : 'rgba(255,255,255,0.04)',
      border:`1px solid ${active ? color+'44' : 'rgba(255,255,255,0.07)'}`,
      transition:'all 0.2s', minWidth:120, textAlign:'center',
    }}>
      <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', letterSpacing:1, textTransform:'uppercase', marginBottom:6 }}>{label}</div>
      <div style={{ fontSize:28, fontWeight:700, color: active ? color : 'rgba(255,255,255,0.6)' }}>{count}</div>
      <div style={{ fontSize:10, color:'rgba(255,255,255,0.25)', marginTop:2 }}>PIONS</div>
    </div>
  );
}