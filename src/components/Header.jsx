import React from 'react';
import { Pill, Heart, Camera, FileText, Volume2, VolumeX, Eye, ZoomIn, ZoomOut, UserCheck, HelpCircle } from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  speechEnabled, 
  setSpeechEnabled, 
  highContrast, 
  setHighContrast,
  textSize,
  setTextSize,
  patientName,
  onOpenOnboarding
}) {

  return (
    <header style={{
      background: 'var(--glass-bg)',
      backdropFilter: 'var(--glass-blur)',
      WebkitBackdropFilter: 'var(--glass-blur)',
      borderBottom: '1px solid var(--system-card-border)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{
        maxWidth: '1060px',
        margin: '0 auto',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem'
      }}>
        
        {/* Brand & Patient Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0071e3, #34c759)',
            color: '#ffffff',
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(0, 113, 227, 0.25)',
            flexShrink: 0
          }}>
            <Pill size={22} />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.2rem',
              fontWeight: 800,
              color: 'var(--system-text)',
              fontFamily: 'var(--font-display)',
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: '-0.025em'
            }}>
              CarePill <span style={{ color: 'var(--accent-primary)' }}>AI</span>
            </h1>
            <p style={{
              fontSize: '0.76rem',
              color: 'var(--system-text-secondary)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              marginTop: '0.1rem'
            }}>
              <UserCheck size={12} color="var(--accent-success)" /> {patientName}
            </p>
          </div>
        </div>

        {/* Primary Desktop Navigation */}
        <nav style={{ display: 'none' }} className="desktop-segmented">
          <style>{`
            @media (min-width: 768px) {
              .desktop-segmented { display: flex !important; }
            }
          `}</style>
          <div className="segmented-control" style={{ padding: '4px' }}>
            <button
              onClick={() => setActiveTab('pillbox')}
              className={`segmented-option ${activeTab === 'pillbox' ? 'active' : ''}`}
            >
              🏠 Pilulier Papa
            </button>

            <button
              onClick={() => setActiveTab('assistants')}
              className={`segmented-option ${activeTab === 'assistants' ? 'active' : ''}`}
            >
              ✨ Assistants IA
            </button>

            <button
              onClick={() => setActiveTab('caregiver')}
              className={`segmented-option ${activeTab === 'caregiver' ? 'active' : ''}`}
            >
              👥 Proche & Médecin
            </button>
          </div>
        </nav>

        {/* Minimal Accessibility Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            onClick={onOpenOnboarding}
            title="Guide & Tutoriel"
            style={{
              padding: '0.45rem 0.65rem',
              borderRadius: '11px',
              border: '1px solid var(--system-card-border)',
              background: 'var(--system-card-bg)',
              color: 'var(--accent-primary)',
              fontSize: '0.8rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <HelpCircle size={16} /> Guide
          </button>

          <button
            onClick={() => setSpeechEnabled(!speechEnabled)}
            title="Lecture Vocale"
            style={{
              padding: '0.45rem 0.65rem',
              borderRadius: '11px',
              border: '1px solid var(--system-card-border)',
              background: speechEnabled ? 'var(--accent-success-light)' : 'var(--system-card-bg)',
              color: speechEnabled ? 'var(--accent-success)' : 'var(--system-text-secondary)',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            {speechEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          <button
            onClick={() => setHighContrast(!highContrast)}
            title="Mode Haut Contraste"
            style={{
              padding: '0.45rem 0.65rem',
              borderRadius: '11px',
              border: '1px solid var(--system-card-border)',
              background: highContrast ? '#ffd60a' : 'var(--system-card-bg)',
              color: highContrast ? '#000000' : 'var(--system-text-secondary)',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Eye size={16} />
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(118, 118, 128, 0.12)',
            borderRadius: '11px',
            padding: '0.15rem'
          }}>
            <button
              onClick={() => setTextSize(Math.max(0.85, textSize - 0.15))}
              style={{ padding: '0.3rem 0.45rem', background: 'transparent', color: 'var(--system-text)' }}
            >
              <ZoomOut size={14} />
            </button>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0 0.15rem' }}>
              {Math.round(textSize * 100)}%
            </span>
            <button
              onClick={() => setTextSize(Math.min(1.3, textSize + 0.15))}
              style={{ padding: '0.3rem 0.45rem', background: 'transparent', color: 'var(--system-text)' }}
            >
              <ZoomIn size={14} />
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}
