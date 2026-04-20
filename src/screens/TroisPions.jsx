import { useState, useCallback } from 'react';
import { POSITIONS, SVG_LINES, checkWin, aiMove, getPhase, countPions } from '../logic/trois.js';
import TopBar from '../components/TopBar.jsx';
import TurnBadge from '../components/TurnBadge.jsx';
import StatsBar from '../components/StatsBar.jsx';

export default function TroisPions({ onBack, stats, onStats }) {
  const [board, setBoard] = useState(() => Array(9).fill(null));
  const [turn, setTurn] = useState('j1');
  const [winner, setWinner] = useState(null);
  const [winLine, setWinLine] = useState(null);
  const [thinking, setThinking] = useState(false);
  const [hist, setHist] = useState([]);
  const [selPion, setSelPion] = useState(null); // index du pion sélectionné en phase move

  const reset = () => {
    setBoard(Array(9).fill(null)); setTurn('j1');
    setWinner(null); setWinLine(null);
    setThinking(false); setHist([]); setSelPion(null);
  };

  function chkRep(h, b) {
    const s = JSON.stringify(b);
    return h.filter(x => x === s).length >= 2;
  }

  function applyAndCheck(next, player, h) {
    const nh = [...h, JSON.stringify(next)];
    const wl = checkWin(next, player);
    if (wl) return { next, nh, result: player === 'j1' ? 'win' : 'lose', winLine: wl };
    if (chkRep(nh, next)) return { next, nh, result: 'draw', winLine: null };
    return { next, nh, result: null, winLine: null };
  }

  const doAI = useCallback((b, h) => {
    setThinking(true);
    setTimeout(() => {
      const move = aiMove(b);
      if (!move) { setWinner('draw'); onStats('draws'); setThinking(false); return; }
      const next = [...b];
      if (move.type === 'place') next[move.to] = 'j2';
      else { next[move.from] = null; next[move.to] = 'j2'; }
      const { nh, result, winLine: wl } = applyAndCheck(next, 'j2', h);
      setBoard(next); setHist(nh);
      if (result === 'lose') { setWinner('j2'); setWinLine(wl); onStats('losses'); }
      else if (result === 'draw') { setWinner('draw'); onStats('draws'); }
      else setTurn('j1');
      setThinking(false);
    }, 400 + Math.random() * 300);
  }, [onStats]);

  function onCell(i) {
    if (winner || turn !== 'j1' || thinking) return;
    const phase = getPhase(board, 'j1');

    if (phase === 'place') {
      if (board[i] !== null) return;
      const next = [...board]; next[i] = 'j1';
      const { nh, result, winLine: wl } = applyAndCheck(next, 'j1', hist);
      setBoard(next); setHist(nh);
      if (result === 'win') { setWinner('j1'); setWinLine(wl); onStats('wins'); return; }
      if (result === 'draw') { setWinner('draw'); onStats('draws'); return; }
      setTurn('j2'); doAI(next, nh);

    } else {
      // Phase déplacement
      if (selPion === null) {
        // Sélectionner un de nos pions
        if (board[i] === 'j1') setSelPion(i);
      } else {
        if (i === selPion) {
          // Désélectionner
          setSelPion(null);
        } else if (board[i] === 'j1') {
          // Changer de pion sélectionné
          setSelPion(i);
        } else if (board[i] === null) {
          // Déplacer vers case vide
          const next = [...board]; next[selPion] = null; next[i] = 'j1';
          const { nh, result, winLine: wl } = applyAndCheck(next, 'j1', hist);
          setBoard(next); setHist(nh); setSelPion(null);
          if (result === 'win') { setWinner('j1'); setWinLine(wl); onStats('wins'); return; }
          if (result === 'draw') { setWinner('draw'); onStats('draws'); return; }
          setTurn('j2'); doAI(next, nh);
        }
      }
    }
  }

  const phase = getPhase(board, 'j1');
  const wlc = winLine ? [POSITIONS[winLine[0]], POSITIONS[winLine[2]]] : null;
  const phaseMsg = turn === 'j1' && !winner
    ? phase === 'place' ? `Posez vos pions (${countPions(board,'j1')}/3)` : 'Déplacez un de vos pions'
    : '';

  return (
    <div style={{ maxWidth:480, margin:'0 auto' }}>
      <TopBar title="Trois Pions" onBack={onBack} onReset={reset} />
      <StatsBar stats={stats} />
      <TurnBadge turn={turn} thinking={thinking} winner={winner} />

      {phaseMsg && (
        <div style={{ textAlign:'center', fontSize:13, color:'rgba(255,255,255,0.45)', marginBottom:4 }}>
          {phaseMsg}
        </div>
      )}

      <div style={{ display:'flex', justifyContent:'center', padding:'16px 20px 24px' }}>
        <div style={{
          background:'rgba(255,255,255,0.02)',
          border:'1px solid rgba(0,212,255,0.12)',
          borderRadius:24, padding:24,
        }}>
          <svg viewBox="0 0 400 400" width={300} height={300}>
            {SVG_LINES.map(([[x1,y1],[x2,y2]],i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="rgba(0,212,255,0.2)" strokeWidth={1.5} />
            ))}
            {wlc && (
              <line x1={wlc[0].x} y1={wlc[0].y} x2={wlc[1].x} y2={wlc[1].y}
                stroke="#00e676" strokeWidth={5} strokeLinecap="round" opacity={0.8} />
            )}
            {POSITIONS.map((pos, i) => {
              const isMine = board[i] === 'j1';
              const isAI   = board[i] === 'j2';
              const isSel  = selPion === i;
              const isTarget = selPion !== null && board[i] === null;
              return (
                <g key={i} onClick={() => onCell(i)}
                  style={{ cursor: !winner && !thinking ? 'pointer' : 'default' }}>
                  {/* Zone de clic */}
                  <circle cx={pos.x} cy={pos.y} r={28} fill="transparent" />
                  {/* Case vide */}
                  {!board[i] && (
                    <circle cx={pos.x} cy={pos.y} r={isTarget ? 14 : 10}
                      fill={isTarget ? 'rgba(0,230,118,0.15)' : 'rgba(255,255,255,0.05)'}
                      stroke={isTarget ? 'rgba(0,230,118,0.5)' : 'rgba(255,255,255,0.1)'}
                      strokeWidth={1}
                    />
                  )}
                  {/* Pion joueur */}
                  {isMine && (
                    <circle cx={pos.x} cy={pos.y} r={20}
                      fill={isSel ? '#f472b6' : '#e040a0'}
                      stroke={isSel ? 'rgba(255,255,255,0.7)' : 'rgba(224,64,160,0.4)'}
                      strokeWidth={isSel ? 2.5 : 1}
                    />
                  )}
                  {/* Pion IA */}
                  {isAI && (
                    <circle cx={pos.x} cy={pos.y} r={20}
                      fill="#00d4ff"
                      stroke="rgba(0,212,255,0.4)" strokeWidth={1}
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {winner && (
        <div style={{ padding:'0 16px' }}>
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