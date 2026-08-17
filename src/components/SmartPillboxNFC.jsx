import React, { useState } from 'react';
import { Wifi, CheckCircle2, QrCode, Sparkles, Smartphone, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SmartPillboxNFC({ onValidateSlot, speakText, patientName, timeSlots }) {
  const [scanning, setScanning] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  const currentHour = new Date().getHours();
  let currentSlotKey = 'Matin';
  if (currentHour >= 11 && currentHour < 17) currentSlotKey = 'Midi';
  else if (currentHour >= 17 && currentHour < 21) currentSlotKey = 'Soir';
  else if (currentHour >= 21 || currentHour < 6) currentSlotKey = 'Nuit';

  const handleSimulateNFCTap = () => {
    setScanning(true);
    setSuccessMsg(null);

    // Simulate 1-tap NFC contact / QR scan
    setTimeout(() => {
      setScanning(false);
      onValidateSlot('mar', currentSlotKey);

      confetti({
        particleCount: 110,
        spread: 85,
        origin: { y: 0.6 }
      });

      const msg = `BIP 🟢 Contact NFC Pilulier réussi ! Traitement du ${currentSlotKey} certifié pour ${patientName}.`;
      setSuccessMsg(msg);
      speakText(msg);

      setTimeout(() => setSuccessMsg(null), 5000);
    }, 1200);
  };

  return (
    <div style={{ margin: '1rem 0' }}>
      
      {/* NFC Touchless Touch Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        color: '#ffffff',
        borderRadius: '24px',
        padding: '1.25rem 1.5rem',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '16px',
            background: 'rgba(56, 189, 248, 0.2)',
            color: '#38bdf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Wifi size={26} />
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 800, letterSpacing: '0.04em' }}>
              📡 Pilulier Physique NFC Sans Contact
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>
              Approchez le téléphone du vrai pilulier de {patientName}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>
              Puce NFC ou QR Code détecté instantanément
            </div>
          </div>
        </div>

        <div>
          <button
            onClick={handleSimulateNFCTap}
            disabled={scanning}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '16px',
              background: scanning ? '#0284c7' : 'linear-gradient(135deg, #0071e3, #34c759)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(0, 113, 227, 0.3)',
              cursor: 'pointer'
            }}
          >
            <Smartphone size={20} />
            <span>{scanning ? "Détection NFC en cours..." : "Simuler Contact NFC 🟢"}</span>
          </button>
        </div>

      </div>

      {successMsg && (
        <div style={{
          background: 'var(--accent-success-light)',
          color: 'var(--accent-success)',
          padding: '0.85rem 1.15rem',
          borderRadius: '16px',
          fontWeight: 800,
          marginTop: '0.75rem',
          border: '1.5px solid var(--accent-success)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'fadeIn 0.25s ease'
        }}>
          <CheckCircle2 size={20} /> {successMsg}
        </div>
      )}

    </div>
  );
}
