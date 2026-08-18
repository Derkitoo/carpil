import React from 'react';
import { Pill, Heart, Volume2, VolumeX, Eye, ZoomIn, ZoomOut, UserCheck, HelpCircle, Wifi, QrCode } from 'lucide-react';
import { RealtimeCloudSync } from '../services/realtimeCloudSync';

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
  onOpenOnboarding,
  onOpenPairing
}) {

  const familyCode = RealtimeCloudSync.getFamilyCode();

  return (
    <header className="header-curved-blue" style={{
      padding: '0.85rem 1rem 1.35rem 1rem',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{
        maxWidth: '1060px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem'
      }}>
        
        {/* Brand & Patient Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            background: '#FFFFFF',
            color: 'var(--header-blue-1)',
            width: '42px',
            height: '42px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
            flexShrink: 0
          }}>
            <Pill size={24} />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#FFFFFF',
              fontFamily: 'var(--font-family-master)',
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: '-0.025em'
            }}>
              CarePill <span style={{ color: '#FFD60A' }}>AI</span>
            </h1>
            <p style={{
              fontSize: '0.78rem',
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              marginTop: '0.15rem'
            }}>
              <UserCheck size={13} color="#2ED573" /> {patientName}
            </p>
          </div>
        </div>

        {/* Real-time Cloud Sync Pairing Button */}
        <button
          onClick={onOpenPairing}
          style={{
            padding: '0.45rem 0.85rem',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.35)',
            fontWeight: 800,
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            cursor: 'pointer'
          }}
          title="Liaison Directe Cloud Appareil Enfant <-> Parent"
        >
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#2ED573',
            boxShadow: '0 0 8px #2ED573'
          }} />
          <Wifi size={14} /> Direct : {familyCode}
        </button>

        {/* Minimal Accessibility Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            onClick={onOpenOnboarding}
            title="Guide & Tutoriel"
            style={{
              padding: '0.45rem 0.65rem',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.18)',
              backdropFilter: 'blur(8px)',
              color: '#FFFFFF',
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
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: speechEnabled ? '#2ED573' : 'rgba(255, 255, 255, 0.18)',
              color: '#FFFFFF',
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
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: highContrast ? '#FFD60A' : 'rgba(255, 255, 255, 0.18)',
              color: highContrast ? '#000000' : '#FFFFFF',
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
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '0.15rem'
          }}>
            <button
              onClick={() => setTextSize(Math.max(0.85, textSize - 0.15))}
              style={{ padding: '0.3rem 0.45rem', background: 'transparent', color: '#FFFFFF' }}
            >
              <ZoomOut size={14} />
            </button>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0 0.15rem', color: '#FFFFFF' }}>
              {Math.round(textSize * 100)}%
            </span>
            <button
              onClick={() => setTextSize(Math.min(1.3, textSize + 0.15))}
              style={{ padding: '0.3rem 0.45rem', background: 'transparent', color: '#FFFFFF' }}
            >
              <ZoomIn size={14} />
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}
