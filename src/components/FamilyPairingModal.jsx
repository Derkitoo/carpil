import React, { useState } from 'react';
import { X, QrCode, Wifi, CheckCircle2, ShieldCheck, Copy, RefreshCw, Smartphone } from 'lucide-react';
import { RealtimeCloudSync } from '../services/realtimeCloudSync';

export default function FamilyPairingModal({ isOpen, onClose, onToast }) {
  const [familyCode, setFamilyCode] = useState(() => RealtimeCloudSync.getFamilyCode());
  const [inputCode, setInputCode] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  if (!isOpen) return null;

  const handleSaveCode = (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    RealtimeCloudSync.setFamilyCode(inputCode);
    setFamilyCode(inputCode.toUpperCase());
    setInputCode('');
    onToast(`🔗 Code Familial mis à jour : ${inputCode.toUpperCase()}`);
  };

  const handleCopyLink = () => {
    const pairUrl = `${window.location.origin}${window.location.pathname}?familyCode=${familyCode}`;
    navigator.clipboard.writeText(pairUrl);
    onToast("📋 Lien de jumelage copié dans le presse-papier !");
  };

  const status = RealtimeCloudSync.getLiveStatus();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 200,
      background: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }} className="animate-fade-in">
      
      <div className="card" style={{
        maxWidth: '540px',
        width: '100%',
        padding: '2rem',
        position: 'relative',
        borderRadius: '28px',
        boxShadow: 'var(--shadow-xl)',
        background: 'var(--system-card-bg)'
      }}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'var(--system-bg)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--system-text)'
          }}
        >
          <X size={22} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--accent-primary-light)',
            color: 'var(--accent-primary)',
            padding: '0.4rem 1rem',
            borderRadius: '999px',
            fontSize: '0.85rem',
            fontWeight: 800,
            marginBottom: '0.75rem'
          }}>
            <Wifi size={16} /> Interconnexion Temps Réel Cloud
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-display)' }}>
            Jumelage Appareil Enfant ↔ Senior
          </h3>
          <p style={{ color: 'var(--system-text-secondary)', fontSize: '0.95rem', fontWeight: 600, marginTop: '0.35rem' }}>
            Scannez ce QR Code ou entrez ce code pour synchroniser deux téléphones en direct à n'importe quelle distance.
          </p>
        </div>

        {/* Live Status Badge */}
        <div style={{
          background: 'var(--accent-success-light)',
          border: '1.5px solid var(--accent-success)',
          color: 'var(--accent-success)',
          padding: '0.85rem 1.1rem',
          borderRadius: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800, fontSize: '0.95rem' }}>
            <span style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'var(--accent-success)',
              boxShadow: '0 0 10px var(--accent-success)'
            }} />
            Cloud Relay En Direct (Actif)
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
            Latence : {status.latencyMs}ms
          </span>
        </div>

        {/* QR Code & Family Code Block */}
        <div style={{
          background: 'var(--system-bg)',
          padding: '1.5rem',
          borderRadius: '24px',
          border: '1px solid var(--system-card-border)',
          textAlign: 'center',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            background: 'white',
            padding: '1rem',
            borderRadius: '20px',
            display: 'inline-block',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '1rem'
          }}>
            {/* SVG QR Code Simulation */}
            <svg width="140" height="140" viewBox="0 0 100 100" fill="none">
              <rect width="100" height="100" fill="white"/>
              {/* Corner 1 */}
              <rect x="10" y="10" width="25" height="25" fill="#007AFF" rx="4"/>
              <rect x="15" y="15" width="15" height="15" fill="white" rx="2"/>
              <rect x="18" y="18" width="9" height="9" fill="#007AFF" rx="1"/>
              {/* Corner 2 */}
              <rect x="65" y="10" width="25" height="25" fill="#007AFF" rx="4"/>
              <rect x="70" y="15" width="15" height="15" fill="white" rx="2"/>
              <rect x="73" y="18" width="9" height="9" fill="#007AFF" rx="1"/>
              {/* Corner 3 */}
              <rect x="10" y="65" width="25" height="25" fill="#007AFF" rx="4"/>
              <rect x="15" y="70" width="15" height="15" fill="white" rx="2"/>
              <rect x="18" y="73" width="9" height="9" fill="#007AFF" rx="1"/>
              {/* Data Dots */}
              <rect x="40" y="10" width="8" height="8" fill="#1C1C1E" rx="2"/>
              <rect x="52" y="18" width="8" height="8" fill="#1C1C1E" rx="2"/>
              <rect x="40" y="30" width="12" height="8" fill="#007AFF" rx="2"/>
              <rect x="40" y="45" width="8" height="8" fill="#1C1C1E" rx="2"/>
              <rect x="55" y="45" width="12" height="12" fill="#34C759" rx="3"/>
              <rect x="70" y="45" width="15" height="8" fill="#1C1C1E" rx="2"/>
              <rect x="40" y="65" width="8" height="15" fill="#1C1C1E" rx="2"/>
              <rect x="55" y="70" width="12" height="8" fill="#007AFF" rx="2"/>
              <rect x="73" y="73" width="12" height="12" fill="#007AFF" rx="3"/>
            </svg>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--system-text-secondary)', fontWeight: 700 }}>
            Code de Liaison Unique de la Famille :
          </div>
          <div style={{
            fontSize: '1.8rem',
            fontWeight: 900,
            letterSpacing: '3px',
            color: 'var(--accent-primary)',
            fontFamily: 'monospace',
            marginTop: '0.2rem'
          }}>
            {familyCode}
          </div>

          <button
            onClick={handleCopyLink}
            style={{
              marginTop: '0.85rem',
              padding: '0.6rem 1.1rem',
              borderRadius: '14px',
              background: 'var(--accent-primary-light)',
              color: 'var(--accent-primary)',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Copy size={16} /> Copier le Lien d'Invitation 📋
          </button>
        </div>

        {/* Pair with another device form */}
        <form onSubmit={handleSaveCode} style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            type="text"
            placeholder="Entrer un autre code (ex: PAPA-99)"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              borderRadius: '16px',
              border: '1px solid var(--system-card-border)',
              background: 'var(--system-bg)',
              fontWeight: 700,
              fontSize: '0.95rem'
            }}
          />
          <button
            type="submit"
            className="btn-primary"
            style={{ padding: '0.75rem 1.25rem', borderRadius: '16px', fontWeight: 800 }}
          >
            Connecter 🔗
          </button>
        </form>

      </div>

    </div>
  );
}
