import React, { useState } from 'react';
import { CheckCircle2, Volume2, ShieldCheck, Heart, Sparkles, UserCheck, PhoneCall, Wifi, Award, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import HomeWidgetSimulator from './HomeWidgetSimulator';
import SmartPillboxNFC from './SmartPillboxNFC';
import PhoneCallSimulator from './PhoneCallSimulator';

export default function SeniorPapaView({ 
  medications = [], 
  takenSlots = {}, 
  onValidateSlot, 
  speakText, 
  timeSlots = [],
  patientName = 'Joseph',
  onSwitchToCaregiver
}) {
  const [showCallModal, setShowCallModal] = useState(false);

  const currentHour = new Date().getHours();
  let currentSlotKey = 'Matin';
  if (currentHour >= 11 && currentHour < 17) currentSlotKey = 'Midi';
  else if (currentHour >= 17 && currentHour < 21) currentSlotKey = 'Soir';
  else if (currentHour >= 21 || currentHour < 6) currentSlotKey = 'Nuit';

  const currentDayKey = 'mar';
  const currentDayLabel = 'Mardi 17 Août';
  const safeTakenSlots = takenSlots || {};
  const isTaken = Boolean(safeTakenSlots[`${currentDayKey}-${currentSlotKey}`]);

  const safeMedications = medications || [];
  const currentMeds = safeMedications.filter(med => med && med.timeSlots && med.timeSlots.includes(currentSlotKey));

  // Compute daily adherence percentage for the Donut Progress
  const totalSlotsCount = 4;
  const takenSlotsCount = ['Matin', 'Midi', 'Soir', 'Nuit'].filter(slot => safeTakenSlots[`${currentDayKey}-${slot}`]).length;
  const adherencePercent = Math.round((takenSlotsCount / totalSlotsCount) * 100);

  const handleValidateCurrent = () => {
    if (onValidateSlot) {
      onValidateSlot(currentDayKey, currentSlotKey);
    }
    
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.warn(e);
    }

    if (speakText) {
      speakText(`Bravo ${patientName} ! Votre traitement du ${currentSlotKey} est validé avec succès. Passez une excellente journée.`);
    }
  };

  const handleSpeakInstructions = () => {
    if (!speakText) return;
    let text = `Pour votre prise du ${currentSlotKey}, vous avez ${currentMeds.length} médicaments : `;
    currentMeds.forEach((m, idx) => {
      text += `${idx + 1}. ${m.name} ${m.dosage}. ${m.instructions}. `;
    });
    speakText(text);
  };

  const patientInitials = patientName
    ? patientName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'JM';

  return (
    <div style={{ maxWidth: '620px', margin: '0 auto', minHeight: '80vh', display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-slide-up">
      
      {/* 1. Curved Top Header Bar (Orange Chaleureux #FFA629 / #FF9F1C) */}
      <div className="header-curved-orange" style={{ padding: '1.25rem 1.35rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: '#FFFFFF',
              color: 'var(--header-orange-1)',
              fontWeight: 800,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}>
              {patientInitials}
            </div>
            
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.95)', fontWeight: 800, letterSpacing: '0.04em' }}>
                PATIENT SUIVI
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF' }}>
                Espace Personnalisé de {patientName}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.45rem' }}>
            <button
              onClick={() => setShowCallModal(true)}
              style={{
                padding: '0.45rem 0.75rem',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.22)',
                backdropFilter: 'blur(10px)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                fontSize: '0.8rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <PhoneCall size={14} /> Rappel Vocal
            </button>

            <button
              onClick={onSwitchToCaregiver}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '9999px',
                background: '#FFFFFF',
                color: 'var(--header-orange-1)',
                fontSize: '0.8rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)'
              }}
            >
              <Heart size={14} color="var(--accent-reward)" /> Espace Enfant
            </button>
          </div>

        </div>
      </div>

      {/* 2. Hero Challenge Card (Mint / Ice Container #EBF5FF with Donut Progress) */}
      <div className="hero-challenge-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <span className="badge-pill" style={{ background: '#FFFFFF', color: 'var(--header-blue-1)', marginBottom: '0.5rem', boxShadow: 'var(--shadow-card-master)' }}>
              <Award size={16} color="var(--header-orange-1)" /> Objectif Santé Quotidien
            </span>
            <h3 style={{ fontSize: '1.45rem', fontWeight: 700, margin: '0.2rem 0 0.3rem 0', color: 'var(--text-main)' }}>
              Suivi du Traitement de {patientName}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', fontWeight: 600, margin: 0 }}>
              {takenSlotsCount} sur {totalSlotsCount} créneaux certifiés aujourd'hui.
            </p>
          </div>

          {/* Donut Progress Circle (43% / 100%) */}
          <div className="donut-progress-container">
            <svg width="76" height="76" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgba(0, 153, 255, 0.15)"
                strokeWidth="3.8"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="url(#blueGreenGrad)"
                strokeWidth="3.8"
                strokeDasharray={`${adherencePercent}, 100`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="blueGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0099FF" />
                  <stop offset="100%" stopColor="#00C853" />
                </linearGradient>
              </defs>
            </svg>
            <div className="donut-progress-text">
              {adherencePercent}%
            </div>
          </div>

        </div>
      </div>

      {/* 3. 1-Tap Home Screen Widget Simulator Banner */}
      <HomeWidgetSimulator
        takenSlots={safeTakenSlots}
        onValidateSlot={onValidateSlot}
        speakText={speakText}
        timeSlots={timeSlots}
        patientName={patientName}
      />

      {/* 4. Touchless NFC Pillbox Scanner Banner */}
      <SmartPillboxNFC
        onValidateSlot={onValidateSlot}
        speakText={speakText}
        patientName={patientName}
        timeSlots={timeSlots}
      />

      {/* 5. THE HERO VALIDATION CARD (WARM GREEN GRADIENT & MODERN SHADOW) */}
      <div className="card" style={{
        background: isTaken 
          ? 'linear-gradient(135deg, #00C853, #2ED573)' 
          : 'linear-gradient(135deg, #0099FF, #00C2FF)',
        color: '#ffffff',
        borderRadius: '26px',
        padding: '2rem 1.65rem',
        border: 'none',
        boxShadow: '0 16px 36px rgba(0, 153, 255, 0.25)',
        textAlign: 'center',
        position: 'relative'
      }}>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.35rem' }}>
          
          {/* Header Info */}
          <div>
            <span style={{
              background: 'rgba(255, 255, 255, 0.22)',
              backdropFilter: 'blur(10px)',
              padding: '0.4rem 1.2rem',
              borderRadius: '9999px',
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
              fontFamily: 'var(--font-family-master)',
              margin: '0.2rem 0 0.45rem 0',
              lineHeight: 1.15,
              letterSpacing: '-0.03em'
            }}>
              {isTaken ? `Prise du ${currentSlotKey} Validée ! 🎉` : `Vos médicaments du ${currentSlotKey}`}
            </h2>

            <p style={{ fontSize: '1.05rem', opacity: 0.95, fontWeight: 500, margin: 0 }}>
              {isTaken 
                ? "Vous avez pris tous vos comprimés. La confirmation a bien été transmise !"
                : `Vous avez ${currentMeds.length} comprimé(s) à prendre actuellement.`
              }
            </p>
          </div>

          {/* List of Medications in Current Slot */}
          {!isTaken && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.18)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
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
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
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
                background: 'linear-gradient(135deg, #00C853, #2ED573)',
                color: '#ffffff',
                border: '3px solid #ffffff',
                minHeight: '70px',
                fontSize: '1.3rem'
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
              borderRadius: '20px',
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

      {/* Automated Voice Phone Call Modal System */}
      <PhoneCallSimulator
        isOpen={showCallModal}
        onClose={() => setShowCallModal(false)}
        patientName={patientName}
        onValidateSlot={onValidateSlot}
        speakText={speakText}
      />

    </div>
  );
}
