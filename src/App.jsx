import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';

// Placeholder Pages (Temporary)
const Placeholder = ({ title }) => (
  <div className="space-y-6">
    <h1 className="text-4xl font-serif font-bold text-secondary mb-4 border-b-2 border-accent/50 pb-2 inline-block">
      {title}
    </h1>
    <p className="text-lg text-secondary/70">
      This section is under construction.
    </p>
  </div>
);

// Lazy load pages eventually, for now direct imports or placeholders
import Home from './pages/Home';
import Intro from './pages/Lasers/Intro';
// Optical Resonators
import WhyStandingWaves from './pages/Lasers/Resonators/WhyStandingWaves';
import BoundaryConditions from './pages/Lasers/Resonators/BoundaryConditions';
import Modes from './pages/Lasers/Resonators/Modes';
import SemiconductorCavities from './pages/Lasers/Resonators/SemiconductorCavities';
// Gain & Loss
import FrequencyGain from './pages/Lasers/GainLoss/FrequencyGain';
import SourcesOfLoss from './pages/Lasers/GainLoss/SourcesOfLoss';
import ReasonForLinewidth from './pages/Lasers/GainLoss/ReasonForLinewidth';
import SchawlowTownes from './pages/Lasers/GainLoss/SchawlowTownes';
// Modulation
import DirectModulation from './pages/Lasers/Modulation/DirectModulation';
import Chirp from './pages/Lasers/Modulation/Chirp';
import ExternalModulation from './pages/Lasers/Modulation/ExternalModulation';
import ModulationBW from './pages/Lasers/Modulation/ModulationBW';
import MZM from './pages/Lasers/Modulation/MZM';
// Tunable
import ThermalTuning from './pages/Lasers/Tunables/ThermalTuning';
import VernierEffect from './pages/Lasers/Tunables/VernierEffect';
import CMA_DMA from './pages/Lasers/Tunables/CMA_DMA';

function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout toggleTheme={toggleTheme} isDark={isDark} />}>
          <Route index element={<Home />} />

          {/* Laser Section */}
          <Route path="lasers">
            <Route index element={<Navigate to="intro" replace />} />
            <Route path="intro" element={<Intro />} />

            {/* Topic 1: Optical Resonators */}
            <Route path="resonators">
              <Route index element={<Navigate to="why-standing-waves" replace />} />
              <Route path="why-standing-waves" element={<WhyStandingWaves />} />
              <Route path="boundary-conditions" element={<BoundaryConditions />} />
              <Route path="modes" element={<Modes />} />
              <Route path="semiconductor-cavities" element={<SemiconductorCavities />} />
            </Route>

            {/* Topic 2: Gain Loss */}
            <Route path="gain-loss">
              <Route index element={<Navigate to="frequency-gain" replace />} />
              <Route path="frequency-gain" element={<FrequencyGain />} />
              <Route path="sources-of-loss" element={<SourcesOfLoss />} />
              <Route path="linewidth-reason" element={<ReasonForLinewidth />} />
              <Route path="schawlow-townes" element={<SchawlowTownes />} />
            </Route>

            {/* Topic 3: Modulation */}
            <Route path="modulation">
              <Route index element={<Navigate to="direct" replace />} />
              <Route path="direct" element={<DirectModulation />} />
              <Route path="chirp" element={<Chirp />} />
              <Route path="external" element={<ExternalModulation />} />
              <Route path="bandwidth" element={<ModulationBW />} />
              <Route path="mzm" element={<MZM />} />
            </Route>

            {/* Topic 4: Tunable */}
            <Route path="tunable">
              <Route index element={<Navigate to="thermal" replace />} />
              <Route path="thermal" element={<ThermalTuning />} />
              <Route path="vernier" element={<VernierEffect />} />
              <Route path="cma-dma" element={<CMA_DMA />} />
            </Route>
          </Route>

          {/* Other Sections */}
          <Route path="fiber-optics" element={<Placeholder title="Fiber Optics" />} />
          <Route path="optical-comm" element={<Placeholder title="Optical Communications" />} />
          <Route path="nonlinear" element={<Placeholder title="Non-linear Optics" />} />
          <Route path="networks" element={<Placeholder title="Optical Networks" />} />
          <Route path="faq" element={<Placeholder title="FAQ" />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
