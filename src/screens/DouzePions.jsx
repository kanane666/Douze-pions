import { useState, useCallback } from 'react';
import { makeBoard, getMoves, getCaptures, applyMove, checkEnd, aiMove, serializeBoard } from '../logic/douze.js';
import TopBar from '../components/TopBar.jsx';
import TurnBadge from '../components/TurnBadge.jsx';
import StatsBar from '../components/StatsBar.jsx';

export default function DouzePions({ onBack, stats, onStats, mode, difficulty }) {
  const [board, setBoard]       = useState(makeBoard);
  const [sel, setSel]           = useState(null);
  const [turn, setTurn]         = useState('j1');
  const [winner, setWinner]     = useState(null);
  const [thinking, setThinking] = useState(false);
  const [last, setLast]         = useState(null);
  const [chainPion, setChain]   = useState(null);
  const [history, setHistory]   = useState([serializeBoard(makeBoard())]);

  const currentMoves = sel !== null
    ? (chainPion !== null ? getCaptures(board, sel) : getMoves(board, sel))
    : [];
  const moveTargets = currentMoves.map(m => m.to);

  const reset = () => {
    const b = makeBoard();
    setBoard(b); setSel(null); setTurn('j1');
    setWinner(null); setThinking(false); setLast(null); setChain(null);
    setHistory([serializeBoard(b)]);
  };

  function endGame(result) {
    setWinner(result);
    if (result === 'j1') onStats('wins');
    else if (result === 'j2') onStats('losses');
    else onStats('draws');
  }

  function addHistory(b, hist) {
    return [...hist, serializeBoard(b)];
  }

  const doAI = useCallback((b, hist) => {
    setThinking(true);
    setTimeout(() => {
      let cur = b;
      let curHist = hist;

      const first = aiMove(cur, difficulty);
      if (!first) { endGame('j1'); setThinking(false); return; }

      const wasCapture = getCaptures(cur, first.from).some(m => m.to === first.to);
      cur = applyMove(cur, first.from, first.to);
      let pos = first.to;
      curHist = addHistory(cur, curHist);

      // Chaîne captures IA
      if (wasCapture) {
        while (true) {
          const caps = getCaptures(cur, pos);
          if (!caps.length) break;
          const pick = caps[Math.floor(Math.random() * caps.length)];
          cur = applyMove(cur, pos, pick.to);
          pos = pick.to;
          curHist = addHistory(cur, curHist);
        }
      }

      setBoard(cur); setLast(pos); setHistory(curHist);
      const end = checkEnd(cur, curHist);
      if (end) endGame(end);
      else setTurn('j1');
      setThinking(false);
    }, 400 + Math.random() * 400);
  }, [difficulty]);

  function onCell(i) {
    if (winner || thinking) return;
    const currentPlayer = turn;

    // ── Prise en chaîne ──────────────────────────────────────────
    if (chainPion !== null) {
      if (moveTargets.includes(i)) {
        const next = applyMove(board, chainPion, i);
        const newHist = addHistory(next, history);
        setBoard(next); setLast(i); setHistory(newHist);
        const end = checkEnd(next, newHist);
        if (end) { endGame(end); setSel(null); setChain(null); return; }
        if (getCaptures(next, i).length > 0) {
          setSel(i); setChain(i);
        } else {
          setSel(null); setChain(null);
          const nextTurn = turn === 'j1' ? 'j2' : 'j1';
          setTurn(nextTurn);
          if (mode === 'ai' && nextTurn === 'j2') doAI(next, newHist);
        }
      }
      return;
    }

    // ── Jeu normal ───────────────────────────────────────────────
    if (sel === null) {
      if (board[i]?.p === currentPlayer) setSel(i);
      return;
    }

    if (moveTargets.includes(i)) {
      const wasCapture = currentMoves.find(m => m.to === i)?.capture !== null;
      const next = applyMove(board, sel, i);
      const newHist = addHistory(next, history);
      setBoard(next); setLast(i); setHistory(newHist);
      const end = checkEnd(next, newHist);
      if (end) { endGame(end); setSel(null); return; }

      if (wasCapture && getCaptures(next, i).length > 0) {
        setSel(i); setChain(i);
      } else {
        setSel(null); setChain(null);
        const nextTurn = turn === 'j1' ? 'j2' : 'j1';
        setTurn(nextTurn);
        if (mode === 'ai' && nextTurn === 'j2') doAI(next, newHist);
      }
    } else if (board[i]?.p === currentPlayer) {
      setSel(i);
    } else {
      setSel(null);
    }
  }

  const j1c = board.filter(x => x?.p === 'j1').length;
  const j2c = board.filter(x => x?.p === 'j2').length;
  const j2Label = mode === 'ai' ? 'IA' : 'Joueur 2';

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <TopBar title="Douze Pions" onBack={onBack} onReset={reset} />
      <StatsBar stats={stats} mode={mode} />
      <TurnBadge turn={turn} thinking={thinking} winner={winner} mode={mode} />

      {chainPion !== null && (
        <div style={{ textAlign: 'center', fontSize: 13, color: '#e040a0', marginBottom: 8, fontWeight: 600 }}>
          Prise multiple — continuez avec ce pion !
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 24px 16px' }}>
        <PlayerCard label="Joueur 1" count={j1c} color="#e040a0" active={turn === 'j1' && !winner} />
        <PlayerCard label={j2Label} count={j2c} color="#00d4ff" active={turn === 'j2' && !winner} />
      </div>

      <div style={{ padding: '0 16px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 6,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 20, padding: 12,
        }}>
          {board.map((cell, i) => {
            const isSel   = sel === i;
            const isMov   = moveTargets.includes(i);
            const isLast  = last === i;
            const isChain = chainPion === i;
            // Distinguer visuellement captures vs simples
            const isCapture = isMov && currentMoves.find(m => m.to === i)?.capture !== null;
            return (
              <div key={i} onClick={() => onCell(i)} style={{
                aspectRatio: '1', borderRadius: 12,
                background: isSel      ? 'rgba(224,64,160,0.22)'
                          : isCapture  ? 'rgba(255,100,0,0.12)'
                          : isMov      ? 'rgba(0,230,118,0.12)'
                          : isLast     ? 'rgba(255,255,255,0.06)'
                          : 'rgba(255,255,255,0.03)',
                border: isSel      ? '1.5px solid rgba(224,64,160,0.7)'
                      : isCapture  ? '1.5px solid rgba(255,120,0,0.7)'
                      : isMov      ? '1.5px solid rgba(0,230,118,0.55)'
                      : isChain    ? '1.5px solid #e040a0'
                      : '1px solid rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: !winner && !thinking ? 'pointer' : 'default',
                transition: 'all 0.15s ease',
              }}>
                {cell && (
                  <div style={{
                    width: '70%', height: '70%', borderRadius: '50%',
                    background: cell.p === 'j1'
                      ? 'radial-gradient(circle at 35% 30%, #f9a8d4, #e040a0)'
                      : 'radial-gradient(circle at 35% 30%, #a5f3fc, #00d4ff)',
                    boxShadow: cell.p === 'j1'
                      ? '0 0 12px rgba(224,64,160,0.45), inset 0 1px 1px rgba(255,255,255,0.3)'
                      : '0 0 12px rgba(0,212,255,0.45), inset 0 1px 1px rgba(255,255,255,0.3)',
                    border: cell.dame ? '2px solid rgba(255,255,255,0.65)' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.9)',
                    transform: isSel ? 'scale(1.15)' : 'scale(1)',
                    transition: 'transform 0.15s ease',
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
        <div style={{ padding: '20px 16px 0' }}>
          <button onClick={reset} style={{
            width: '100%', padding: '16px', borderRadius: 16,
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer',
          }}>Rejouer</button>
        </div>
      )}
    </div>
  );
}

function PlayerCard({ label, count, color, active }) {
  return (
    <div style={{
      padding: '12px 20px', borderRadius: 16,
      background: active ? `${color}18` : 'rgba(255,255,255,0.04)',
      border: `1px solid ${active ? color + '44' : 'rgba(255,255,255,0.07)'}`,
      transition: 'all 0.2s', minWidth: 120, textAlign: 'center',
    }}>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: active ? color : 'rgba(255,255,255,0.6)' }}>{count}</div>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>PIONS</div>
    </div>
  );
}