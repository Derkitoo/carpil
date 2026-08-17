import React from 'react';
import { Pill, Heart, Camera, FileText, Volume2, VolumeX, Eye, ZoomIn, ZoomOut, UserCheck, Hand, MessageSquare } from 'lucide-react';

export default function Header({ 
  currentTab, 
  setCurrentTab, 
  speechEnabled, 
  setSpeechEnabled, 
  highContrast, 
  setHighContrast,
  textSize,
  setTextSize,
  patientName
}) {

  const tabsConfig = [
    { id: 'papa', label: 'Mode Papa', emoji: '👴' },
    { id: 'handScanner', label: 'Scan Main', emoji: '🖐️' },
    { id: 'voiceAgent', label: 'Assistant Vocal', emoji: '🗣️' },
    { id: 'caregiver', label: 'Mode Proche', emoji: '👥' },
    { id: 'scanner', label: 'Scan Ordonnance', emoji: '📷' },
    { id: 'report', label: 'Bilan Médecin', emoji: '📄' },
  ];

  return (
    <>
      {/* Top Floating Glass Header Bar */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--card-border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 2px 16px rgba(15, 23, 42, 0.03)'
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0.65rem 0.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem'
        }}>
          
          {/* Brand Identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #0284c7, #10b981)',
              color: 'white',
              width: '40px',
              height: '40px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
              flexShrink: 0
            }}>
              <Pill size={22} />
            </div>
            <div>
              <h1 style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                fontFamily: 'var(--font-family-heading)',
                margin: 0,
                lineHeight: 1.1,
                letterSpacing: '-0.02em'
              }}>
                CarePill <span style={{ color: 'var(--primary)' }}>AI</span>
              </h1>
              <p style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                marginTop: '0.1rem'
              }}>
                <UserCheck size={12} color="#10b981" /> {patientName}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs (>= 768px) */}
          <nav style={{
            display: 'none',
            background: 'var(--bg-main)',
            padding: '0.25rem',
            borderRadius: '16px',
            border: '1px solid var(--card-border)',
            gap: '0.15rem'
          }} className="desktop-nav">
            <style>{`
              @media (min-width: 768px) {
                .desktop-nav { display: flex !important; }
              }
            `}</style>
            {tabsConfig.map((tab) => {
              const isSelected = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  style={{
                    padding: '0.5rem 0.85rem',
                    borderRadius: '12px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: isSelected ? 'var(--card-bg)' : 'transparent',
                    color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                    boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>{tab.emoji}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Minimal Accessibility Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <button
              onClick={() => setSpeechEnabled(!speechEnabled)}
              title="Synthèse vocale"
              style={{
                padding: '0.45rem 0.65rem',
                borderRadius: '12px',
                border: '1px solid var(--card-border)',
                background: speechEnabled ? 'var(--success-light)' : 'var(--card-bg)',
                color: speechEnabled ? 'var(--success-dark)' : 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              {speechEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span style={{ display: 'none' }} className="sm-show">Voix</span>
              <style>{`@media (min-width: 480px) { .sm-show { display: inline !important; } }`}</style>
            </button>

            <button
              onClick={() => setHighContrast(!highContrast)}
              title="Mode Haut Contraste"
              style={{
                padding: '0.45rem 0.65rem',
                borderRadius: '12px',
                border: '1px solid var(--card-border)',
                background: highContrast ? '#fef08a' : 'var(--card-bg)',
                color: highContrast ? '#854d0e' : 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <Eye size={16} />
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-main)',
              border: '1px solid var(--card-border)',
              borderRadius: '12px',
              padding: '0.15rem'
            }}>
              <button
                onClick={() => setTextSize(Math.max(0.85, textSize - 0.15))}
                style={{ padding: '0.3rem 0.45rem', background: 'transparent', color: 'var(--text-main)' }}
              >
                <ZoomOut size={14} />
              </button>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0 0.15rem' }}>
                {Math.round(textSize * 100)}%
              </span>
              <button
                onClick={() => setTextSize(Math.min(1.3, textSize + 0.15))}
                style={{ padding: '0.3rem 0.45rem', background: 'transparent', color: 'var(--text-main)' }}
              >
                <ZoomIn size={14} />
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Glass Bottom Navigation Bar (< 768px) */}
      <nav className="mobile-bottom-nav">
        {tabsConfig.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="nav-icon-container" style={{ fontSize: '1.2rem', lineHeight: 1 }}>
                {tab.emoji}
              </div>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '64px' }}>
                {tab.label.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
