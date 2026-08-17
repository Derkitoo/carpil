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
    { id: 'papa', label: 'Mode Papa', emoji: '👴', icon: null },
    { id: 'handScanner', label: 'Scan Main', emoji: '🖐️', icon: Hand },
    { id: 'voiceAgent', label: 'Assistant Vocal', emoji: '🗣️', icon: MessageSquare },
    { id: 'caregiver', label: 'Mode Proche', emoji: '👥', icon: Heart },
    { id: 'scanner', label: 'Scan Ordonnance', emoji: '📷', icon: Camera },
    { id: 'report', label: 'Bilan Médecin', emoji: '📄', icon: FileText },
  ];

  return (
    <>
      {/* Top Header Bar */}
      <header style={{
        background: 'var(--card-bg)',
        borderBottom: '1.5px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
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
          
          {/* Brand Logo & Senior Identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #0284c7, #16a34a)',
              color: 'white',
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Pill size={24} />
            </div>
            <div>
              <h1 style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                fontFamily: 'var(--font-family-heading)',
                margin: 0,
                lineHeight: 1.1
              }}>
                CarePill <span style={{ color: 'var(--primary)' }}>AI</span>
              </h1>
              <p style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <UserCheck size={12} color="#16a34a" /> {patientName}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs (>= 768px) */}
          <nav style={{
            display: 'none',
            background: 'var(--bg-main)',
            padding: '0.3rem',
            borderRadius: '14px',
            border: '1px solid var(--border)',
            gap: '0.2rem'
          }} className="desktop-nav">
            <style>{`
              @media (min-width: 768px) {
                .desktop-nav { display: flex !important; }
              }
            `}</style>
            {tabsConfig.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                style={{
                  padding: '0.55rem 0.95rem',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: currentTab === tab.id ? 'var(--primary)' : 'transparent',
                  color: currentTab === tab.id ? 'white' : 'var(--text-main)'
                }}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Accessibility Toolbar Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <button
              onClick={() => setSpeechEnabled(!speechEnabled)}
              title="Lecture vocale"
              style={{
                padding: '0.45rem 0.65rem',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                background: speechEnabled ? 'var(--success-light)' : 'var(--card-bg)',
                color: speechEnabled ? 'var(--success)' : 'var(--text-muted)',
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
              title="Haut Contraste"
              style={{
                padding: '0.45rem 0.65rem',
                borderRadius: '10px',
                border: '1px solid var(--border)',
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
              border: '1px solid var(--border)',
              borderRadius: '10px',
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

      {/* Mobile Bottom Navigation Bar (< 768px) */}
      <nav className="mobile-bottom-nav">
        {tabsConfig.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="nav-icon-container" style={{ fontSize: '1.25rem', lineHeight: 1 }}>
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
