import React, { useState } from 'react';
import { CheckCircle2, Pill, Clock, Sparkles, Smartphone } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HomeWidgetSimulator({ takenSlots, onValidateSlot, speakText, timeSlots }) {
  const currentHour = new Date().getHours();
  let currentSlotKey = 'Matin';
  if (currentHour >= 11 && currentHour < 17) currentSlotKey = 'Midi';
  else if (currentHour >= 17 && currentHour < 21) currentSlotKey = 'Soir';
  else if (currentHour >= 21 || currentHour < 6) currentSlotKey = 'Nuit';

  const currentDayKey = 'mar';
  const isTaken = takenSlots[`${currentDayKey}-${currentSlotKey}`];

  const handleQuickWidgetValidate = (e) => {
    e.stopPropagation();
    onValidateSlot(currentDayKey, currentSlotKey);
    
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });

    speakText(`Validation par Widget effectuée ! Traitement du ${currentSlotKey} enregistré.`);
  };

  return (
    <div style={{ margin: '1rem 0' }}>
      
      {/* Widget iOS / Android Floating Banner */}
      <div style={{
        background: isTaken 
          ? 'linear-gradient(135deg, rgba(5, 150, 105, 0.95), rgba(16, 185, 129, 0.95))' 
          : 'linear-gradient(135deg, rgba(2, 132, 199, 0.95), rgba(3, 105, 161, 0.95))',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        color: '#ffffff',
        borderRadius: '24px',
        padding: '1rem 1.25rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        
        {/* Widget Left Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '14px',
            background: 'rgba(255, 255, 255, 0.22)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            flexShrink: 0
          }}>
            {currentSlotKey === 'Matin' ? '☀️' : currentSlotKey === 'Midi' ? '🌤️' : currentSlotKey === 'Soir' ? '🌅' : '🌙'}
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', opacity: 0.85, fontWeight: 800, letterSpacing: '0.04em' }}>
              Widget Écran d'Accueil
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', lineHeight: 1.2 }}>
              {isTaken ? `Prise du ${currentSlotKey} Validée ✅` : `Traitement du ${currentSlotKey}`}
            </div>
            <div style={{ fontSize: '0.82rem', opacity: 0.9, fontWeight: 600 }}>
              {isTaken ? 'Aucune action requise' : '3 comprimés à prendre'}
            </div>
          </div>
        </div>

        {/* Widget Quick 1-Tap Action Button */}
        <div>
          {!isTaken ? (
            <button
              onClick={handleQuickWidgetValidate}
              style={{
                padding: '0.65rem 1.1rem',
                borderRadius: '14px',
                background: '#34c759',
                color: '#ffffff',
                border: '2px solid #ffffff',
                fontWeight: 800,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
              }}
            >
              <CheckCircle2 size={18} /> Valider 🟢
            </button>
          ) : (
            <span style={{ fontSize: '0.85rem', fontWeight: 800, background: 'rgba(255,255,255,0.25)', padding: '0.4rem 0.85rem', borderRadius: '12px' }}>
              ✓ Fait
            </span>
          )}
        </div>

      </div>

    </div>
  );
}
