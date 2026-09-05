/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CaseProvider } from './context/CaseContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { ProfilePage } from './pages/ProfilePage';
import { PanelPage } from './pages/PanelPage';
import { BlueprintPage } from './pages/BlueprintPage';

export default function App() {
  return (
    <BrowserRouter>
      <CaseProvider>
        <div className="relative min-h-screen bg-[#0B0F17] text-[#F1F5F9] font-sans antialiased selection:bg-[#FBBF24] selection:text-[#0B0F17] flex flex-col justify-between overflow-x-hidden">
          {/* Signature PromptWars Glowing Dusk Dome at the bottom (like on the presentation screen) */}
          <div className="pointer-events-none fixed bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[360px] promptwars-dome rounded-t-[600px] z-0" />

          <Header />
          <main className="relative z-10 flex-1 pt-20">
            <Routes>
              <Route path="/" element={<Navigate to="/profile" replace />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/panel" element={<PanelPage />} />
              <Route path="/blueprint" element={<BlueprintPage />} />
              <Route path="*" element={<Navigate to="/profile" replace />} />
            </Routes>
          </main>
          <Footer />
          <AuthModal />
        </div>
      </CaseProvider>
    </BrowserRouter>
  );
}
