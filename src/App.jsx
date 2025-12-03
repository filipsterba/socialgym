import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Training from './pages/Training';
import Missions from './pages/Missions';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="training" element={<Training />} />
            <Route path="missions" element={<Missions />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
}

export default App;
