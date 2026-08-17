import React, { useState } from 'react';
import { Phone, PhoneOff, Volume2, Bot, CheckCircle2, UserCheck, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PhoneCallSimulator({ isOpen, onClose, patientName, onValidateSlot, speakText }) {
  const [callActive, setCallActive] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  if (!isOpen) return null;

  const handleAnswerCall = () => {
    setCallActive(true);
    speakText(`Bonjour ${patientName} ! C'est l'assistant vocal de votre fils Thomas. J'espère que vous allez bien ! As-tu pensé à prendre tes 3 cachets du matin avec votre verre d'eau ? Appuyez sur le bouton vert pour valider.`);
  };

  const handleConfirmPillsInCall = () => {
    onValidateSlot('mar', 'Matin');
    
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 }
    });

    speakText(`Super ${patientName} ! J'ai bien validé votre prise du matin. Passez une excellente journée ! Bisous de toute la famille.`);
    setCallActive(false);
    setCallEnded(true);

    setTimeout(() => {
      onClose();
      setCallEnded(false);
    }, 3000);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content animate-slide-up" style={{
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        color: '#ffffff',
        textAlign: 'center',
        borderRadius: '32px',
        padding: '2.25rem 1.5rem',
        maxWidth: '480px'
      }}>
        
        {/* Phone Call Icon Header */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            background: callActive ? 'rgba(52, 199, 89, 0.2)' : 'rgba(2, 132, 199, 0.2)',
            color: callActive ? '#34c759' : '#38bdf8',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.75rem',
            animation: 'pulse-gentle 1.5s infinite'
          }}>
            <Phone size={44} />
          </div>

          <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 800, letterSpacing: '0.04em' }}>
            📞 APPEL AUTOMATISÉ BIENTRAITANT
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)', margin: '0.3rem 0' }}>
            Rappel Téléphonique pour {patientName}
          </h2>

          <p style={{ color: '#94a3b8', fontSize: '0.95rem', fontWeight: 600 }}>
            {callActive 
              ? "Communication en cours avec l'assistant IA..." 
              : callEnded 
              ? "Prise confirmée par téléphone ! Merci." 
              : "Le créneau du Matin est dépassé de 45 min. L'IA appelle le téléphone fixe/mobile."}
          </p>
        </div>

        {/* Call Actions */}
        {!callActive && !callEnded && (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            <button
              onClick={onClose}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#ff3b30',
                color: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(255, 59, 48, 0.4)'
              }}
            >
              <PhoneOff size={28} />
            </button>

            <button
              onClick={handleAnswerCall}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#34c759',
                color: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(52, 199, 89, 0.4)'
              }}
            >
              <Phone size={28} />
            </button>
          </div>
        )}

        {callActive && (
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', padding: '1rem', borderRadius: '18px', fontSize: '0.95rem', fontWeight: 600, color: '#f1f5f9' }}>
              🗣️ "As-tu bien pris tes 3 cachets du matin avec ton grand verre d'eau ?"
            </div>

            <button
              onClick={handleConfirmPillsInCall}
              className="btn-giant btn-success"
              style={{ padding: '1rem', fontSize: '1.2rem' }}
            >
              <CheckCircle2 size={26} /> OUI, J'AI PRIS MES CACHETS 🟢
            </button>

            <button
              onClick={() => { setCallActive(false); onClose(); }}
              style={{ background: 'transparent', color: '#94a3b8', border: 'none', fontWeight: 700, fontSize: '0.9rem' }}
            >
              Raccrocher
            </button>
          </div>
        )}

        {callEnded && (
          <div style={{ marginTop: '1rem', color: '#34c759', fontWeight: 800, fontSize: '1.1rem' }}>
            ✅ Traitement validé par appel vocal !
          </div>
        )}

      </div>
    </div>
  );
}
