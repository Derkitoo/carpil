import React from 'react';
import { CheckCircle2, Pill, Clock, Sparkles, Smartphone } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HomeWidgetSimulator({ takenSlots = {}, onValidateSlot, speakText, timeSlots, patientName }) {
  const currentHour = new Date().getHours();
  let currentSlotKey = 'Matin';
  if (currentHour >= 11 && currentHour < 17) currentSlotKey = 'Midi';
  else if (currentHour >= 17 && currentHour < 21) currentSlotKey = 'Soir';
  else if (currentHour >= 21 || currentHour < 6) currentSlotKey = 'Nuit';

  const currentDayKey = 'mar';
  const isTaken = Boolean(takenSlots[`${currentDayKey}-${currentSlotKey}`]);

  const handleQuickWidgetValidate = (e) => {
    e.stopPropagation();
    if (onValidateSlot) onValidateSlot(currentDayKey, currentSlotKey);
    
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (err) {
      console.warn(err);
    }

    if (speakText) {
      speakText(`Validation par Widget effectuée ! Traitement du ${currentSlotKey} enregistré pour ${patientName || 'votre traitement'}.`);
    }
  };

  return (
    <div style={{ margin: '0.65rem 0', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Widget iOS / Android Floating Banner */}
      <div style={{
        background: isTaken 
          ? 'linear-gradient(135deg, rgba(5, 150, 105, 0.95), rgba(16, 185, 129, 0.95))' 
          : 'linear-gradient(135deg, rgba(2, 132, 199, 0.95), rgba(3, 105, 161, 0.95))',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        color: '#ffffff',
        borderRadius: '22px',
        padding: '0.9rem 1.15rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.85rem',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        
        {/* Widget Left Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: 1 }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.22)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3rem',
            flexShrink: 0
          }}>
            {currentSlotKey === 'Matin' ? '☀️' : currentSlotKey === 'Midi' ? '🌤️' : currentSlotKey === 'Soir' ? '🌅' : '🌙'}
          </div>

          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', opacity: 0.85, fontWeight: 800, letterSpacing: '0.04em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Widget Écran d'Accueil ({patientName || 'Papa'})
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {isTaken ? `Prise du ${currentSlotKey} Validée ✅` : `Traitement du ${currentSlotKey}`}
            </div>
            <div style={{ fontSize: '0.78rem', opacity: 0.9, fontWeight: 600 }}>
              {isTaken ? 'Aucune action requise' : 'Comprimés en attente'}
            </div>
          </div>
        </div>

        {/* Widget Quick 1-Tap Action Button */}
        <div style={{ flexShrink: 0 }}>
          {!isTaken ? (
            <button
              onClick={handleQuickWidgetValidate}
              style={{
                padding: '0.55rem 0.95rem',
                borderRadius: '14px',
                background: '#34c759',
                color: '#ffffff',
                border: '2px solid #ffffff',
                fontWeight: 800,
                fontSize: '0.88rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
              }}
            >
              <CheckCircle2 size={16} /> Valider 🟢
            </button>
          ) : (
            <span style={{
              fontSize: '0.85rem',
              fontWeight: 800,
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(10px)',
              padding: '0.45rem 0.95rem',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              whiteSpace: 'nowrap',
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              flexShrink: 0
            }}>
              <CheckCircle2 size={16} /> Fait
            </span>
          )}
        </div>

      </div>

    </div>
  );
}
