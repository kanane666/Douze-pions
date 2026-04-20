export const POSITIONS = [
  {x:50,y:50},{x:200,y:50},{x:350,y:50},
  {x:50,y:200},{x:200,y:200},{x:350,y:200},
  {x:50,y:350},{x:200,y:350},{x:350,y:350},
];

export const LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
];

export const SVG_LINES = [
  [[50,50],[350,50]],[[50,200],[350,200]],[[50,350],[350,350]],
  [[50,50],[50,350]],[[200,50],[200,350]],[[350,50],[350,350]],
  [[50,50],[350,350]],[[350,50],[50,350]],
];

export function checkWin(board, p) {
  return LINES.find(l => l.every(i => board[i] === p)) || null;
}

export function countPions(board, p) {
  return board.filter(x => x === p).length;
}

// Phase : 'place' (moins de 3 posés) ou 'move' (3 posés, on déplace)
export function getPhase(board, p) {
  return countPions(board, p) < 3 ? 'place' : 'move';
}

export function aiMove(board, difficulty = 'normal') {
  const phase = getPhase(board, 'j2');
  const empty = board.map((v,i) => v===null ? i : -1).filter(x => x >= 0);

  if (phase === 'place') {
    // Gagner
    for (const i of empty) {
      const b=[...board]; b[i]='j2';
      if (checkWin(b,'j2')) return { type:'place', to:i };
    }
    // Bloquer
    for (const i of empty) {
      const b=[...board]; b[i]='j1';
      if (checkWin(b,'j1')) return { type:'place', to:i };
    }
    if (difficulty === 'easy') return { type:'place', to: empty[Math.floor(Math.random()*empty.length)] };
    const pref = [4,0,2,6,8,1,3,5,7].find(i => board[i]===null);
    return { type:'place', to: pref ?? empty[0] };
  } else {
    // Phase déplacement : essayer chaque pion j2 vers chaque case vide
    const myPions = board.map((v,i) => v==='j2' ? i : -1).filter(x => x >= 0);
    let best = null, bestScore = -Infinity;
    for (const from of myPions) {
      for (const to of empty) {
        const b=[...board]; b[from]=null; b[to]='j2';
        let score = 0;
        if (checkWin(b,'j2')) score = 1000;
        else {
          // Bloquer j1
          for (const e of empty.filter(x=>x!==to)) {
            const b2=[...board]; b2[e]='j1';
            if (checkWin(b2,'j1')) score += 50;
          }
          score += Math.random() * 3;
        }
        if (score > bestScore) { bestScore = score; best = { type:'move', from, to }; }
      }
    }
    return best;
  }
}