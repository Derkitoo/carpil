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
      padding: '0.75rem 0.85rem 1.25rem 0.85rem',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{
        maxWidth: '1060px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.6rem',
        flexWrap: 'wrap',
        width: '100%'
      }}>
        
        {/* Brand & Patient Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', minWidth: 0, flexShrink: 1 }}>
          <div style={{
            background: '#FFFFFF',
            color: 'var(--header-blue-1)',
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            flexShrink: 0
          }}>
            <Pill size={22} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{
              fontSize: '1.15rem',
              fontWeight: 800,
              color: '#FFFFFF',
              fontFamily: 'var(--font-family-master)',
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              CarePill <span style={{ color: '#FFD60A' }}>AI</span>
            </h1>
            <p style={{
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              marginTop: '0.1rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              <UserCheck size={12} color="#2ED573" /> {patientName}
            </p>
          </div>
        </div>

        {/* Real-time Cloud Sync Pairing Button */}
        <button
          onClick={onOpenPairing}
          style={{
            padding: '0.4rem 0.75rem',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.35)',
            fontWeight: 800,
            fontSize: '0.78rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
          title="Liaison Directe Cloud Appareil Enfant <-> Parent"
        >
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: '#2ED573',
            boxShadow: '0 0 6px #2ED573'
          }} />
          <Wifi size={13} /> {familyCode}
        </button>

        {/* Minimal Accessibility Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}>
          <button
            onClick={onOpenOnboarding}
            title="Guide & Tutoriel"
            style={{
              padding: '0.4rem 0.55rem',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.18)',
              backdropFilter: 'blur(8px)',
              color: '#FFFFFF',
              fontSize: '0.78rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <HelpCircle size={15} /> Guide
          </button>

          <button
            onClick={() => setSpeechEnabled(!speechEnabled)}
            title="Lecture Vocale"
            style={{
              padding: '0.4rem 0.55rem',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: speechEnabled ? '#2ED573' : 'rgba(255, 255, 255, 0.18)',
              color: '#FFFFFF',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {speechEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>

          <button
            onClick={() => setHighContrast(!highContrast)}
            title="Mode Haut Contraste"
            style={{
              padding: '0.4rem 0.55rem',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: highContrast ? '#FFD60A' : 'rgba(255, 255, 255, 0.18)',
              color: highContrast ? '#000000' : '#FFFFFF',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Eye size={15} />
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '10px',
            padding: '0.1rem'
          }}>
            <button
              onClick={() => setTextSize(Math.max(0.85, textSize - 0.15))}
              style={{ padding: '0.25rem 0.35rem', background: 'transparent', color: '#FFFFFF' }}
            >
              <ZoomOut size={13} />
            </button>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0 0.15rem', color: '#FFFFFF' }}>
              {Math.round(textSize * 100)}%
            </span>
            <button
              onClick={() => setTextSize(Math.min(1.3, textSize + 0.15))}
              style={{ padding: '0.25rem 0.35rem', background: 'transparent', color: '#FFFFFF' }}
            >
              <ZoomIn size={13} />
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}
