import React, { useState } from 'react';
import { X, Lock, KeyRound, ShieldCheck } from 'lucide-react';

export default function PinCodeModal({ isOpen, onClose, onSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleDigit = (digit) => {
    if (pin.length >= 4) return;
    const newPin = pin + digit;
    setPin(newPin);
    setError(false);

    if (newPin.length === 4) {
      if (newPin === '1234' || newPin === '0000') {
        onSuccess();
        setPin('');
      } else {
        setError(true);
        setTimeout(() => setPin(''), 600);
      }
    }
  };

  const handleClear = () => {
    setPin('');
    setError(false);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 300,
      background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.85rem'
    }} className="animate-fade-in">
      
      <div className="card" style={{
        maxWidth: '360px',
        width: '100%',
        padding: '1.5rem 1.25rem',
        textAlign: 'center',
        borderRadius: '24px',
        background: 'var(--card-surface)',
        boxShadow: 'var(--shadow-card-hover)',
        position: 'relative',
        maxHeight: '90dvh',
        overflowY: 'auto',
        boxSizing: 'border-box'
      }}>
        
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '0.85rem', right: '0.85rem',
            background: 'var(--canvas-bg)', border: 'none',
            borderRadius: '50%', width: '34px', height: '34px',
            color: 'var(--text-main)'
          }}
        >
          <X size={18} />
        </button>

        <div style={{
          width: '50px', height: '50px', borderRadius: '16px',
          background: 'var(--accent-primary-light)',
          color: 'var(--accent-primary)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '0.85rem'
        }}>
          <Lock size={24} />
        </div>

        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 0.25rem 0', fontFamily: 'var(--font-family-master)' }}>
          Code PIN Aidant Requis
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.25rem' }}>
          Entrez le code PIN (par défaut : <strong>1234</strong>) pour déverrouiller l'Espace Proche.
        </p>

        {/* PIN Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
          {[0, 1, 2, 3].map(idx => (
            <div key={idx} style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              border: '2px solid var(--header-blue-1)',
              background: pin.length > idx ? 'var(--header-blue-1)' : 'transparent',
              borderColor: error ? '#ff3b30' : 'var(--header-blue-1)',
              transition: 'all 0.15s ease'
            }} />
          ))}
        </div>

        {error && (
          <div style={{ color: '#ff3b30', fontSize: '0.82rem', fontWeight: 800, marginBottom: '0.85rem' }}>
            ❌ Code PIN incorrect (Essayez : 1234)
          </div>
        )}

        {/* Keypad */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handleDigit(num.toString())}
              style={{
                padding: '0.85rem',
                borderRadius: '14px',
                background: 'var(--canvas-bg)',
                border: '1px solid var(--system-card-border)',
                fontSize: '1.2rem',
                fontWeight: 800,
                color: 'var(--text-main)'
              }}
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            style={{
              padding: '0.85rem',
              borderRadius: '14px',
              background: 'var(--canvas-bg)',
              border: '1px solid var(--system-card-border)',
              fontSize: '0.82rem',
              fontWeight: 800,
              color: 'var(--text-secondary)'
            }}
          >
            Effacer
          </button>
          <button
            onClick={() => handleDigit('0')}
            style={{
              padding: '0.85rem',
              borderRadius: '14px',
              background: 'var(--canvas-bg)',
              border: '1px solid var(--system-card-border)',
              fontSize: '1.2rem',
              fontWeight: 800,
              color: 'var(--text-main)'
            }}
          >
            0
          </button>
        </div>

      </div>

    </div>
  );
}
