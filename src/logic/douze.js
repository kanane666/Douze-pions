export function makeBoard() {
  const b = Array(25).fill(null);
  for (let i = 0; i < 12; i++) b[i] = { p: 'j2', dame: false };
  for (let i = 13; i < 25; i++) b[i] = { p: 'j1', dame: false };
  return b;
}

function nb(i, dr, dc) {
  const r = Math.floor(i / 5) + dr, c = (i % 5) + dc;
  return (r < 0 || r > 4 || c < 0 || c > 4) ? null : r * 5 + c;
}

function getCap(board, from, to) {
  const rf = Math.floor(from/5), cf = from%5;
  const rt = Math.floor(to/5),   ct = to%5;
  const dr = Math.sign(rt-rf),   dc = Math.sign(ct-cf);
  let r = rf+dr, c = cf+dc;
  while (r !== rt || c !== ct) {
    const idx = r*5+c;
    if (board[idx]) return idx;
    r += dr; c += dc;
  }
  return null;
}

export function getCaptures(board, i) {
  const pion = board[i];
  if (!pion) return [];
  const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
  const captures = [];

  if (pion.dame) {
    for (const [dr,dc] of dirs) {
      let cur = i, jumped = false;
      while (true) {
        const n = nb(cur, dr, dc);
        if (n === null) break;
        if (!board[n]) {
          if (jumped) { captures.push({ to: n, capture: getCap(board, i, n) }); break; }
          cur = n;
        } else if (board[n].p !== pion.p && !jumped) {
          jumped = true; cur = n;
        } else break;
      }
    }
  } else {
    for (const [dr,dc] of dirs) {
      const n = nb(i, dr, dc);
      if (n === null) continue;
      if (board[n]?.p && board[n].p !== pion.p) {
        const land = nb(n, dr, dc);
        if (land !== null && !board[land]) captures.push({ to: land, capture: n });
      }
    }
  }
  return captures;
}

export function getSimpleMoves(board, i) {
  const pion = board[i];
  if (!pion) return [];
  const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
  const moves = [];

  if (pion.dame) {
    for (const [dr,dc] of dirs) {
      let cur = i;
      while (true) {
        const n = nb(cur, dr, dc);
        if (n === null || board[n]) break;
        moves.push({ to: n, capture: null });
        cur = n;
      }
    }
  } else {
    for (const [dr,dc] of dirs) {
      const n = nb(i, dr, dc);
      if (n !== null && !board[n]) moves.push({ to: n, capture: null });
    }
  }
  return moves;
}

// MODIFIÉ : retourne captures + simples ensemble — prise non obligatoire
export function getMoves(board, i) {
  const caps    = getCaptures(board, i);
  const simples = getSimpleMoves(board, i);
  return [...caps, ...simples];
}

export function applyMove(board, from, to) {
  const b = [...board];
  const cap = getCap(b, from, to);
  if (cap !== null) b[cap] = null;
  b[to] = { ...b[from] };
  b[from] = null;
  if (b[to].p === 'j1' && Math.floor(to/5) === 0) b[to].dame = true;
  if (b[to].p === 'j2' && Math.floor(to/5) === 4) b[to].dame = true;
  return b;
}

// Sérialise le plateau pour comparaison
export function serializeBoard(board) {
  return board.map(c => c ? `${c.p}${c.dame?'D':''}` : '.').join('');
}

export function checkEnd(board, history = []) {
  const j1 = board.filter(x => x?.p === 'j1').length;
  const j2 = board.filter(x => x?.p === 'j2').length;
  if (j1 === 0) return 'j2';
  if (j2 === 0) return 'j1';
  if (j1 === 1 && j2 === 1) return 'draw';

  // Nul par répétition — même position 3 fois
  if (history.length > 0) {
    const current = serializeBoard(board);
    const count = history.filter(h => h === current).length;
    if (count >= 3) return 'draw';
  }

  // Plus de mouvements possibles
  const j2pieces = board.map((v,i) => ({v,i})).filter(x => x.v?.p === 'j2');
  if (j2pieces.every(x => getMoves(board, x.i).length === 0)) return 'j1';

  return null;
}

export function aiMove(board, difficulty = 'normal') {
  const pieces = board.map((v,i) => ({v,i})).filter(x => x.v?.p === 'j2');
  let candidates = [];

  for (const {i} of pieces) {
    for (const m of getMoves(board, i)) {
      let score = 0;

      if (difficulty === 'easy') {
        score = Math.random() * 10;
      } else if (difficulty === 'normal') {
        score = (m.capture ? 10 : 0) + Math.random() * 8;
      } else {
        score = (m.capture ? 20 : 0)
          + (Math.floor(m.to/5) === 4 ? 10 : 0)
          + (Math.floor(m.to/5) >= 3 ? 4 : 0)
          + ([0,4,5,9,10,14,15,19,20,24].includes(m.to) ? -2 : 0)
          + Math.random() * 2;
      }

      candidates.push({ from: i, to: m.to, score });
    }
  }

  if (!candidates.length) return null;
  candidates.sort((a,b) => b.score - a.score);
  return candidates[0];
}