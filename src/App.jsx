import { useState, useEffect } from 'react';
import Home from './screens/Home.jsx';
import DouzePions from './screens/DouzePions.jsx';
import TroisPions from './screens/TroisPions.jsx';

const defaultStats = { wins: 0, losses: 0, draws: 0 };
const defaultAllStats = {
  douze: { ai: {...defaultStats}, '2p': {...defaultStats} },
  trois: { ai: {...defaultStats}, '2p': {...defaultStats} },
};

function loadStats() {
  try {
    const saved = localStorage.getItem('jeux-stats');
    if (saved) return JSON.parse(saved);
  } catch {}
  return defaultAllStats;
}

export default function App() {
  const [screen, setScreen]         = useState('home');
  const [mode, setMode]             = useState('ai');
  const [difficulty, setDifficulty] = useState('normal');
  const [stats, setStats]           = useState(loadStats);

  // Sauvegarde automatique à chaque changement de stats
  useEffect(() => {
    try { localStorage.setItem('jeux-stats', JSON.stringify(stats)); } catch {}
  }, [stats]);

  function onSelect(game, selectedMode, selectedDifficulty) {
    setMode(selectedMode);
    setDifficulty(selectedDifficulty || 'normal');
    setScreen(game);
  }

  function onStats(game, result) {
    setStats(s => {
      const updated = {
        ...s,
        [game]: {
          ...s[game],
          [mode]: {
            ...s[game][mode],
            [result]: s[game][mode][result] + 1
          }
        }
      };
      return updated;
    });
  }

  function resetStats() {
    setStats(defaultAllStats);
  }

  return (
    <div style={{ minHeight:'100vh', background:'#0f0f14', overflowX:'hidden' }}>
      {screen === 'home' && (
        <Home
          onSelect={onSelect}
          stats={stats}
          onResetStats={resetStats}
        />
      )}
      {screen === 'douze' && (
        <DouzePions
          key={mode + difficulty}
          mode={mode}
          difficulty={difficulty}
          onBack={() => setScreen('home')}
          stats={stats.douze[mode]}
          onStats={(r) => onStats('douze', r)}
        />
      )}
      {screen === 'trois' && (
        <TroisPions
          key={mode + difficulty}
          mode={mode}
          difficulty={difficulty}
          onBack={() => setScreen('home')}
          stats={stats.trois[mode]}
          onStats={(r) => onStats('trois', r)}
        />
      )}
    </div>
  );
}