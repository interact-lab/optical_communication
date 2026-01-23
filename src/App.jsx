import React, { useState, useEffect, lazy, Suspense } from 'react';
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

// Imports
import Home from './pages/Home';
import Intro from './pages/Lasers/Intro';
import WhyStandingWaves from './pages/Lasers/Resonators/WhyStandingWaves';
import BoundaryConditions from './pages/Lasers/Resonators/BoundaryConditions';
import SemiconductorCavities from './pages/Lasers/Resonators/SemiconductorCavities';

// Modulation
import DirectModulation from './pages/Lasers/Modulation/DirectModulation';
import ExternalModulation from './pages/Lasers/Modulation/ExternalModulation';
import MZM from './pages/Lasers/Modulation/MZM';
// Tunable
import TemperatureTuning from './pages/Lasers/Tunables/TemperatureTuning';
import VernierEffect from './pages/Lasers/Tunables/VernierEffect';
import CMA_DMA from './pages/Lasers/Tunables/CMA_DMA';

// Lazy loaded problematic page
const Modes = lazy(() => import('./pages/Lasers/Resonators/Modes'));

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
              <Route path="modes" element={
                <Suspense fallback={<div className="p-20 text-center animate-pulse">Loading Visualization...</div>}>
                  <Modes />
                </Suspense>
              } />
              <Route path="semiconductor-cavities" element={<SemiconductorCavities />} />
            </Route>



            {/* Topic 3: Modulation */}
            <Route path="modulation">
              <Route index element={<Navigate to="direct" replace />} />
              <Route path="direct" element={<DirectModulation />} />
              <Route path="external" element={<ExternalModulation />} />
              <Route path="mzm" element={<MZM />} />
            </Route>

            {/* Topic 4: Tunable */}
            <Route path="tunable">
              <Route index element={<Navigate to="thermal" replace />} />
              <Route path="thermal" element={<TemperatureTuning />} />
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
