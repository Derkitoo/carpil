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
      padding: '1rem'
    }} className="animate-fade-in">
      
      <div className="card" style={{
        maxWidth: '380px',
        width: '100%',
        padding: '2rem',
        textAlign: 'center',
        borderRadius: '28px',
        background: 'var(--system-card-bg)',
        boxShadow: 'var(--shadow-xl)',
        position: 'relative'
      }}>
        
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            background: 'var(--system-bg)', border: 'none',
            borderRadius: '50%', width: '36px', height: '36px',
            color: 'var(--system-text)'
          }}
        >
          <X size={20} />
        </button>

        <div style={{
          width: '56px', height: '56px', borderRadius: '18px',
          background: 'var(--accent-primary-light)',
          color: 'var(--accent-primary)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '1rem'
        }}>
          <Lock size={28} />
        </div>

        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.3rem 0' }}>
          Code PIN Aidant Requis
        </h3>
        <p style={{ color: 'var(--system-text-secondary)', fontSize: '0.88rem', fontWeight: 600, marginBottom: '1.5rem' }}>
          Entrez le code PIN (par défaut : <strong>1234</strong>) pour déverrouiller l'Espace Proche.
        </p>

        {/* PIN Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          {[0, 1, 2, 3].map(idx => (
            <div key={idx} style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              border: '2px solid var(--accent-primary)',
              background: pin.length > idx ? 'var(--accent-primary)' : 'transparent',
              borderColor: error ? '#ff3b30' : 'var(--accent-primary)',
              transition: 'all 0.15s ease'
            }} />
          ))}
        </div>

        {error && (
          <div style={{ color: '#ff3b30', fontSize: '0.85rem', fontWeight: 800, marginBottom: '1rem' }}>
            ❌ Code PIN incorrect (Essayez : 1234)
          </div>
        )}

        {/* Keypad */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handleDigit(num.toString())}
              style={{
                padding: '1rem',
                borderRadius: '16px',
                background: 'var(--system-bg)',
                border: '1px solid var(--system-card-border)',
                fontSize: '1.3rem',
                fontWeight: 800,
                color: 'var(--system-text)'
              }}
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            style={{
              padding: '1rem',
              borderRadius: '16px',
              background: 'var(--system-bg)',
              border: '1px solid var(--system-card-border)',
              fontSize: '0.9rem',
              fontWeight: 800,
              color: 'var(--system-text-secondary)'
            }}
          >
            Effacer
          </button>
          <button
            onClick={() => handleDigit('0')}
            style={{
              padding: '1rem',
              borderRadius: '16px',
              background: 'var(--system-bg)',
              border: '1px solid var(--system-card-border)',
              fontSize: '1.3rem',
              fontWeight: 800,
              color: 'var(--system-text)'
            }}
          >
            0
          </button>
        </div>

      </div>

    </div>
  );
}
