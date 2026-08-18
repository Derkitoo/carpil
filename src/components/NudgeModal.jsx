import React from 'react';
import { Heart, Volume2, X, Sparkles, Check } from 'lucide-react';
import { RealtimeCloudSync } from '../services/realtimeCloudSync';

export default function NudgeModal({ nudgeData, onClose, speakText, patientName = 'Joseph' }) {
  if (!nudgeData) return null;

  const handleReplay = () => {
    // Transmit read confirmation receipt
    RealtimeCloudSync.publishNudgeReadReceipt(nudgeData.textMsg, patientName);
    
    if (speakText) {
      speakText(`Message de votre enfant : ${nudgeData.textMsg}`);
    }
  };

  const handleConfirmRead = () => {
    // Transmit read confirmation receipt
    RealtimeCloudSync.publishNudgeReadReceipt(nudgeData.textMsg, patientName);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 400,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      boxSizing: 'border-box'
    }} className="animate-fade-in">

      <div style={{
        background: 'linear-gradient(135deg, #FF4757, #FF6B81)',
        color: '#ffffff',
        textAlign: 'center',
        borderRadius: '32px',
        padding: '2.25rem 1.5rem',
        maxWidth: '460px',
        width: '100%',
        boxShadow: '0 20px 50px rgba(255, 71, 87, 0.45)',
        position: 'relative',
        boxSizing: 'border-box'
      }} className="animate-slide-up">

        {/* Close Button */}
        <button
          onClick={handleConfirmRead}
          style={{
            position: 'absolute',
            top: '1.15rem',
            right: '1.15rem',
            background: 'rgba(255, 255, 255, 0.22)',
            border: 'none',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Heart Icon Header */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            background: '#ffffff',
            color: '#FF4757',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            marginBottom: '0.85rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            animation: 'pulse-gentle 1.5s infinite'
          }}>
            💌
          </div>

          <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.95)', fontWeight: 800, letterSpacing: '0.05em' }}>
            MESSAGE EN DIRECT EN VENANCE DE VOTRE ENFANT
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'var(--font-family-master)', margin: '0.4rem 0 0.85rem 0', lineHeight: 1.25, color: '#ffffff', wordBreak: 'break-word' }}>
            "{nudgeData.textMsg}"
          </h2>

          <div style={{ fontSize: '0.82rem', opacity: 0.9, fontWeight: 700 }}>
            Reçu en direct à {nudgeData.timestamp}
          </div>
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', marginTop: '1.25rem' }}>
          <button
            onClick={handleReplay}
            style={{
              width: '100%',
              padding: '0.9rem',
              borderRadius: '16px',
              background: '#ffffff',
              color: '#FF4757',
              border: 'none',
              fontWeight: 800,
              fontSize: '1.05rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)'
            }}
          >
            <Volume2 size={22} /> ÉCOUTER À VOIX HAUTE 🔊
          </button>

          <button
            onClick={handleConfirmRead}
            style={{
              width: '100%',
              padding: '0.85rem',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              fontWeight: 800,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <Check size={20} /> J'AI BIEN LU LE MESSAGE ❤️
          </button>
        </div>

      </div>

    </div>
  );
}
