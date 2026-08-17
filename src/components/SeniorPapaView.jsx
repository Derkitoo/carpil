import React from 'react';
import { CheckCircle2, Volume2, ShieldCheck, Heart, Sparkles, UserCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import HomeWidgetSimulator from './HomeWidgetSimulator';

export default function SeniorPapaView({ 
  medications, 
  takenSlots, 
  onValidateSlot, 
  speakText, 
  timeSlots,
  patientName,
  onSwitchToCaregiver
}) {
  const currentHour = new Date().getHours();
  let currentSlotKey = 'Matin';
  if (currentHour >= 11 && currentHour < 17) currentSlotKey = 'Midi';
  else if (currentHour >= 17 && currentHour < 21) currentSlotKey = 'Soir';
  else if (currentHour >= 21 || currentHour < 6) currentSlotKey = 'Nuit';

  const currentDayKey = 'mar'; // Mardi
  const currentDayLabel = 'Mardi 17 Août';
  const isTaken = takenSlots[`${currentDayKey}-${currentSlotKey}`];

  const currentMeds = medications.filter(med => med.timeSlots.includes(currentSlotKey));

  const handleValidateCurrent = () => {
    onValidateSlot(currentDayKey, currentSlotKey);
    
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });

    speakText(`Bravo ${patientName} ! Votre traitement du ${currentSlotKey} est validé avec succès. Passez une excellente journée.`);
  };

  const handleSpeakInstructions = () => {
    let text = `Pour votre prise du ${currentSlotKey}, vous avez ${currentMeds.length} médicaments : `;
    currentMeds.forEach((m, idx) => {
      text += `${idx + 1}. ${m.name} ${m.dosage}. ${m.instructions}. `;
    });
    speakText(text);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }} className="animate-slide-up">
      
      {/* Discreet Caregiver Access Toggle Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.85 }}>
          <span style={{ fontSize: '1.2rem' }}>👴</span>
          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--system-text)' }}>Bonjour {patientName}</span>
        </div>

        <button
          onClick={onSwitchToCaregiver}
          style={{
            padding: '0.45rem 0.85rem',
            borderRadius: '12px',
            background: 'var(--system-card-bg)',
            border: '1px solid var(--system-card-border)',
            color: 'var(--system-text-secondary)',
            fontSize: '0.8rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <Heart size={14} color="var(--accent-primary)" /> Espace Enfant
        </button>
      </div>

      {/* 1-TAP HOME SCREEN WIDGET SIMULATOR BANNER */}
      <HomeWidgetSimulator
        takenSlots={takenSlots}
        onValidateSlot={handleValidateSlot}
        speakText={speakText}
        timeSlots={timeSlots}
        patientName={patientName}
      />

      {/* THE ONE SINGLE HERO CARD FOR PAPA */}
      <div className="card" style={{
        background: isTaken 
          ? 'linear-gradient(135deg, #059669, #10b981)' 
          : 'linear-gradient(135deg, #0071e3, #005bb5)',
        color: '#ffffff',
        borderRadius: '36px',
        padding: '2rem 1.65rem',
        border: 'none',
        boxShadow: 'var(--shadow-lg)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.35rem' }}>
          
          {/* Header Info */}
          <div>
            <span style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              padding: '0.35rem 1.1rem',
              borderRadius: '999px',
              fontSize: '0.92rem',
              fontWeight: 800,
              display: 'inline-block',
              marginBottom: '0.75rem'
            }}>
              📅 {currentDayLabel} — Créneau {currentSlotKey}
            </span>

            <h2 style={{
              fontSize: '2.1rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              margin: '0.2rem 0 0.45rem 0',
              lineHeight: 1.15,
              letterSpacing: '-0.03em'
            }}>
              {isTaken ? `Prise du ${currentSlotKey} Validée ! 🎉` : `Vos médicaments du ${currentSlotKey}`}
            </h2>

            <p style={{ fontSize: '1.1rem', opacity: 0.95, fontWeight: 500, margin: 0 }}>
              {isTaken 
                ? "Vous avez pris tous vos comprimés. La confirmation a bien été envoyée !"
                : `Vous avez ${currentMeds.length} comprimé(s) à prendre actuellement.`
              }
            </p>
          </div>

          {/* List of Medications in Current Slot */}
          {!isTaken && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '24px',
              padding: '1.1rem',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              textAlign: 'left'
            }}>
              {currentMeds.map((med) => (
                <div key={med.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      background: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.3rem',
                      flexShrink: 0
                    }}>
                      {med.pillIcon === 'capsule-yellow' ? '💊' : med.pillIcon === 'sachet' ? '✉️' : '⚪'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>
                        {med.name} <span style={{ opacity: 0.9, fontSize: '0.95rem' }}>{med.dosage}</span>
                      </div>
                      <div style={{ fontSize: '0.85rem', opacity: 0.9, fontWeight: 600 }}>
                        {med.instructions}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* THE GIANT 1-TAP VALIDATION BUTTON */}
          {!isTaken ? (
            <button
              onClick={handleValidateCurrent}
              className="btn-giant animate-pulse-gentle"
              style={{
                background: '#34c759',
                color: '#ffffff',
                border: '3px solid #ffffff',
                minHeight: '70px',
                fontSize: '1.35rem'
              }}
            >
              <CheckCircle2 size={32} />
              <span>J'AI PRIS MES CACHETS 🟢</span>
            </button>
          ) : (
            <div style={{
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(10px)',
              padding: '1.15rem',
              borderRadius: '24px',
              width: '100%',
              fontSize: '1.15rem',
              fontWeight: 800
            }}>
              ✨ Passez une très belle journée {patientName} ! ❤️
            </div>
          )}

          {/* Audio helper button */}
          <button
            onClick={handleSpeakInstructions}
            style={{
              background: 'transparent',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.95rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              opacity: 0.95
            }}
          >
            <Volume2 size={20} /> Écouter les consignes vocales
          </button>

        </div>

      </div>

    </div>
  );
}
