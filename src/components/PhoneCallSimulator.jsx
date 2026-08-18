import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Volume2, Bot, CheckCircle2, UserCheck, X, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PhoneCallSimulator({ isOpen, onClose, patientName, onValidateSlot, speakText }) {
  const [callActive, setCallActive] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [ringtoneAudioContext, setRingtoneAudioContext] = useState(null);

  // Synthesize realistic Phone Ringtone via Web Audio API
  const startRingtone = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(440, ctx.currentTime);
      osc2.frequency.setValueAtTime(480, ctx.currentTime);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      setRingtoneAudioContext(ctx);
    } catch (e) {
      console.warn("AudioContext error:", e);
    }
  };

  const stopRingtone = () => {
    if (ringtoneAudioContext) {
      try {
        ringtoneAudioContext.close();
      } catch (e) {
        console.warn(e);
      }
      setRingtoneAudioContext(null);
    }
  };

  useEffect(() => {
    if (isOpen && !callActive && !callEnded) {
      startRingtone();
    } else {
      stopRingtone();
    }
    return () => stopRingtone();
  }, [isOpen, callActive, callEnded]);

  if (!isOpen) return null;

  const handleAnswerCall = () => {
    stopRingtone();
    setCallActive(true);
    if (speakText) {
      speakText(`Bonjour ${patientName} ! C'est le service vocal de votre fils Thomas. J'espère que vous allez bien ! Avez-vous pensé à prendre vos cachets du matin avec votre verre d'eau ? Appuyez sur le bouton vert pour valider.`);
    }
  };

  const handleConfirmPillsInCall = () => {
    if (onValidateSlot) onValidateSlot('mar', 'Matin');
    
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.warn(e);
    }

    if (speakText) {
      speakText(`Super ${patientName} ! J'ai bien validé votre prise du matin. Passez une excellente journée ! Bisous de toute la famille.`);
    }

    setCallActive(false);
    setCallEnded(true);

    setTimeout(() => {
      onClose();
      setCallEnded(false);
    }, 2800);
  };

  const handleNativePhoneCall = () => {
    window.location.href = "tel:0612345678";
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 300,
      background: 'rgba(0, 0, 0, 0.82)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      boxSizing: 'border-box'
    }} className="animate-fade-in">

      <div className="card" style={{
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        color: '#ffffff',
        textAlign: 'center',
        borderRadius: '28px',
        padding: '2rem 1.35rem',
        maxWidth: '440px',
        width: '100%',
        boxShadow: 'var(--shadow-card-hover)',
        position: 'relative',
        boxSizing: 'border-box',
        maxHeight: '90dvh',
        overflowY: 'auto'
      }}>
        
        {/* Close Button */}
        <button
          onClick={() => { stopRingtone(); onClose(); }}
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            background: 'rgba(255,255,255,0.12)', border: 'none',
            borderRadius: '50%', width: '36px', height: '36px',
            color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <X size={18} />
        </button>

        {/* Phone Call Icon Header */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            background: callActive ? 'rgba(52, 199, 89, 0.2)' : 'rgba(2, 132, 199, 0.2)',
            color: callActive ? '#34c759' : '#38bdf8',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.75rem',
            animation: 'pulse-gentle 1.5s infinite'
          }}>
            <Phone size={40} />
          </div>

          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 800, letterSpacing: '0.04em' }}>
            📞 APPEL VOCAL DÉCLENCHÉ EN DIRECT
          </div>

          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, fontFamily: 'var(--font-family-master)', margin: '0.3rem 0', color: '#ffffff' }}>
            Appel pour {patientName}
          </h2>

          <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}>
            {callActive 
              ? "Communication en cours avec l'assistant vocal..." 
              : callEnded 
              ? "Prise confirmée par téléphone ! Merci." 
              : "La sonnerie retentit sur l'appareil. Répondez pour valider le traitement."}
          </p>
        </div>

        {/* Call Actions */}
        {!callActive && !callEnded && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center', marginTop: '1.25rem', width: '100%' }}>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
              <button
                onClick={() => { stopRingtone(); onClose(); }}
                title="Refuser l'appel"
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
                title="Décrocher l'appel vocal"
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

            <button
              onClick={handleNativePhoneCall}
              style={{
                padding: '0.6rem 1rem',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.12)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.2)',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <ExternalLink size={15} /> Passer un vrai appel GSM (tel:)
            </button>
          </div>
        )}

        {callActive && (
          <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%' }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', padding: '0.9rem', borderRadius: '16px', fontSize: '0.9rem', fontWeight: 600, color: '#f1f5f9' }}>
              🗣️ "Avez-vous bien pris vos cachets du matin avec votre grand verre d'eau ?"
            </div>

            <button
              onClick={handleConfirmPillsInCall}
              className="btn-giant btn-success"
              style={{ padding: '0.9rem', fontSize: '1.1rem', width: '100%' }}
            >
              <CheckCircle2 size={24} /> OUI, J'AI PRIS MES CACHETS 🟢
            </button>

            <button
              onClick={() => { stopRingtone(); setCallActive(false); onClose(); }}
              style={{ background: 'transparent', color: '#94a3b8', border: 'none', fontWeight: 700, fontSize: '0.85rem' }}
            >
              Raccrocher
            </button>
          </div>
        )}

        {callEnded && (
          <div style={{ marginTop: '1rem', color: '#34c759', fontWeight: 800, fontSize: '1.05rem' }}>
            ✅ Traitement validé par appel vocal !
          </div>
        )}

      </div>
    </div>
  );
}
