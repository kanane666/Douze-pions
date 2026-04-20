import { useState } from 'react';
import Home from './screens/Home.jsx';
import DouzePions from './screens/DouzePions.jsx';
import TroisPions from './screens/TroisPions.jsx';

const defaultStats = { wins: 0, losses: 0, draws: 0 };

export default function App() {
  const [screen, setScreen] = useState('home');
  const [stats, setStats] = useState({ douze: {...defaultStats}, trois: {...defaultStats} });

  function onStats(game, result) {
    setStats(s => ({
      ...s,
      [game]: { ...s[game], [result]: s[game][result] + 1 }
    }));
  }

  return (
    <div style={{ minHeight:'100vh', background:'#0f0f14', overflowX:'hidden' }}>
      {screen === 'home' && (
        <Home onSelect={setScreen} />
      )}
      {screen === 'douze' && (
        <DouzePions
          onBack={() => setScreen('home')}
          stats={stats.douze}
          onStats={(r) => onStats('douze', r)}
        />
      )}
      {screen === 'trois' && (
        <TroisPions
          onBack={() => setScreen('home')}
          stats={stats.trois}
          onStats={(r) => onStats('trois', r)}
        />
      )}
    </div>
  );
}