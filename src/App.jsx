import { useState } from 'react';
import Home from './screens/Home.jsx';
import DouzePions from './screens/DouzePions.jsx';
import TroisPions from './screens/TroisPions.jsx';

const defaultStats = { wins: 0, losses: 0, draws: 0 };

export default function App() {
  const [screen, setScreen]       = useState('home');
  const [mode, setMode]           = useState('ai');
  const [difficulty, setDifficulty] = useState('normal');
  const [stats, setStats] = useState({
    douze: { ai: {...defaultStats}, '2p': {...defaultStats} },
    trois: { ai: {...defaultStats}, '2p': {...defaultStats} },
  });

  function onSelect(game, selectedMode, selectedDifficulty) {
    setMode(selectedMode);
    setDifficulty(selectedDifficulty || 'normal');
    setScreen(game);
  }

  function onStats(game, result) {
    setStats(s => ({
      ...s,
      [game]: {
        ...s[game],
        [mode]: { ...s[game][mode], [result]: s[game][mode][result] + 1 }
      }
    }));
  }

  return (
    <div style={{ minHeight:'100vh', background:'#0f0f14', overflowX:'hidden' }}>
      {screen === 'home' && (
        <Home onSelect={onSelect} />
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