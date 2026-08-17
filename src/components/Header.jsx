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
  return (
    <header style={{
      background: 'var(--card-bg)',
      borderBottom: '2px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0.85rem 1.25rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        
        {/* Brand Logo & Senior Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0284c7, #16a34a)',
            color: 'white',
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
          }}>
            <Pill size={28} />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.4rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              fontFamily: 'var(--font-family-heading)',
              margin: 0,
              lineHeight: 1.1
            }}>
              CarePill <span style={{ color: 'var(--primary)' }}>AI</span>
            </h1>
            <p style={{
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <UserCheck size={14} color="#16a34a" /> Traitement de <strong>{patientName}</strong>
            </p>
          </div>
        </div>

        {/* Navigation Mode Tabs */}
        <nav style={{
          display: 'flex',
          background: 'var(--bg-main)',
          padding: '0.35rem',
          borderRadius: '14px',
          border: '1px solid var(--border)',
          gap: '0.25rem',
          overflowX: 'auto'
        }}>
          <button
            onClick={() => setCurrentTab('papa')}
            style={{
              padding: '0.6rem 1.1rem',
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: currentTab === 'papa' ? 'var(--primary)' : 'transparent',
              color: currentTab === 'papa' ? 'white' : 'var(--text-main)',
              boxShadow: currentTab === 'papa' ? '0 2px 8px rgba(2,132,199,0.3)' : 'none',
              flexShrink: 0
            }}
          >
            👴 <span style={{ fontSize: '1rem' }}>Mode Papa</span>
          </button>

          <button
            onClick={() => setCurrentTab('voiceAgent')}
            style={{
              padding: '0.6rem 1.1rem',
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: currentTab === 'voiceAgent' ? '#9333ea' : 'transparent',
              color: currentTab === 'voiceAgent' ? 'white' : 'var(--text-main)',
              boxShadow: currentTab === 'voiceAgent' ? '0 2px 8px rgba(147,51,234,0.3)' : 'none',
              flexShrink: 0
            }}
          >
            <MessageSquare size={18} /> <span>Assistant Vocal IA</span>
          </button>

          <button
            onClick={() => setCurrentTab('handScanner')}
            style={{
              padding: '0.6rem 1.1rem',
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: currentTab === 'handScanner' ? '#16a34a' : 'transparent',
              color: currentTab === 'handScanner' ? 'white' : 'var(--text-main)',
              boxShadow: currentTab === 'handScanner' ? '0 2px 8px rgba(22,163,74,0.3)' : 'none',
              flexShrink: 0
            }}
          >
            <Hand size={18} /> <span>Scan Main Anti-Erreur</span>
          </button>

          <button
            onClick={() => setCurrentTab('caregiver')}
            style={{
              padding: '0.6rem 1.1rem',
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: currentTab === 'caregiver' ? 'var(--primary)' : 'transparent',
              color: currentTab === 'caregiver' ? 'white' : 'var(--text-main)',
              boxShadow: currentTab === 'caregiver' ? '0 2px 8px rgba(2,132,199,0.3)' : 'none',
              flexShrink: 0
            }}
          >
            <Heart size={18} color={currentTab === 'caregiver' ? 'white' : '#dc2626'} /> Mode Proche
          </button>

          <button
            onClick={() => setCurrentTab('scanner')}
            style={{
              padding: '0.6rem 1.1rem',
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: currentTab === 'scanner' ? 'var(--primary)' : 'transparent',
              color: currentTab === 'scanner' ? 'white' : 'var(--text-main)',
              boxShadow: currentTab === 'scanner' ? '0 2px 8px rgba(2,132,199,0.3)' : 'none',
              flexShrink: 0
            }}
          >
            <Camera size={18} /> Scan Ordonnance
          </button>

          <button
            onClick={() => setCurrentTab('report')}
            style={{
              padding: '0.6rem 1.1rem',
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: currentTab === 'report' ? 'var(--primary)' : 'transparent',
              color: currentTab === 'report' ? 'white' : 'var(--text-main)',
              boxShadow: currentTab === 'report' ? '0 2px 8px rgba(2,132,199,0.3)' : 'none',
              flexShrink: 0
            }}
          >
            <FileText size={18} /> Bilan Médecin
          </button>
        </nav>

        {/* Accessibility Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setSpeechEnabled(!speechEnabled)}
            title={speechEnabled ? "Désactiver la lecture vocale" : "Activer la lecture vocale"}
            style={{
              padding: '0.55rem 0.85rem',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              background: speechEnabled ? 'var(--success-light)' : 'var(--card-bg)',
              color: speechEnabled ? 'var(--success)' : 'var(--text-muted)',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            {speechEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            <span>Voix {speechEnabled ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => setHighContrast(!highContrast)}
            title="Basculer le mode haut contraste"
            style={{
              padding: '0.55rem 0.85rem',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              background: highContrast ? '#fef08a' : 'var(--card-bg)',
              color: highContrast ? '#854d0e' : 'var(--text-muted)',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Eye size={18} />
            <span>Contraste</span>
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-main)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '0.2rem'
          }}>
            <button
              onClick={() => setTextSize(Math.max(0.85, textSize - 0.15))}
              style={{ padding: '0.35rem 0.6rem', background: 'transparent', color: 'var(--text-main)' }}
              title="Réduire la taille du texte"
            >
              <ZoomOut size={16} />
            </button>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, padding: '0 0.25rem' }}>
              {Math.round(textSize * 100)}%
            </span>
            <button
              onClick={() => setTextSize(Math.min(1.4, textSize + 0.15))}
              style={{ padding: '0.35rem 0.6rem', background: 'transparent', color: 'var(--text-main)' }}
              title="Agrandir la taille du texte"
            >
              <ZoomIn size={16} />
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}
