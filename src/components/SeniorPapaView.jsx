import React, { useState } from 'react';
import { CheckCircle2, Volume2, AlertTriangle, ShieldCheck, Sun, SunMedium, Sunset, Moon, Sparkles, ChevronRight, Info } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SeniorPapaView({ 
  medications, 
  takenSlots, 
  onValidateSlot, 
  onOpenCompartment,
  speakText,
  timeSlots,
  daysOfWeek
}) {
  const [selectedSlot, setSelectedSlot] = useState('Matin');
  const [selectedDayKey, setSelectedDayKey] = useState('mar'); // Default Today = Mardi
  const currentDayKey = 'mar';
  const currentDayLabel = 'Mardi 17 Août';

  const isTaken = takenSlots[`${currentDayKey}-${selectedSlot}`];
  const currentMeds = medications.filter(med => med.timeSlots.includes(selectedSlot));

  const handleValidateCurrent = () => {
    onValidateSlot(currentDayKey, selectedSlot);
    
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    speakText(`Bravo Joseph ! Votre traitement du ${selectedSlot} est validé avec succès.`);
  };

  const handleSpeakSlotInstructions = () => {
    let text = `Pour la prise du ${selectedSlot}, vous devez prendre : `;
    currentMeds.forEach((m, idx) => {
      text += `${idx + 1}. ${m.name} ${m.dosage}. ${m.instructions}. `;
    });
    speakText(text);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-slide-up">
      
      {/* 1. HERO BANNER: CURRENT TIME SLOT FOCUS */}
      <div className="card" style={{
        background: isTaken 
          ? 'linear-gradient(135deg, #15803d, #16a34a)' 
          : 'linear-gradient(135deg, #0284c7, #0369a1)',
        color: 'white',
        borderRadius: '24px',
        padding: '1.5rem',
        border: 'none',
        position: 'relative',
        overflow: 'hidden'
      }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', zIndex: 2 }}>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '0.25rem 0.75rem',
                borderRadius: '999px',
                fontSize: '0.9rem',
                fontWeight: 800
              }}>
                📅 {currentDayLabel}
              </span>

              {isTaken && (
                <span style={{
                  background: '#dcfce7',
                  color: '#15803d',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '999px',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}>
                  <CheckCircle2 size={16} /> Validé
                </span>
              )}
            </div>

            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              fontFamily: 'var(--font-family-heading)',
              margin: '0.25rem 0 0.5rem 0',
              lineHeight: 1.15
            }}>
              {isTaken ? `Prise du ${selectedSlot} Validée ! 🎉` : `À prendre : ${selectedSlot}`}
            </h2>

            <p style={{ fontSize: '1rem', opacity: 0.95, fontWeight: 500, margin: 0 }}>
              {isTaken 
                ? "Tous vos comprimés ont été enregistrés avec succès."
                : `${currentMeds.length} médicament(s) à prendre dans votre pilulier.`
              }
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', width: '100%' }}>
            
            {!isTaken ? (
              <button
                onClick={handleValidateCurrent}
                className="btn-giant btn-success animate-pulse-gentle"
                style={{
                  background: '#16a34a',
                  color: 'white',
                  border: '2px solid #ffffff'
                }}
              >
                <CheckCircle2 size={28} />
                <span>J'AI PRIS MES CACHETS 🟢</span>
              </button>
            ) : (
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '0.85rem',
                borderRadius: '16px',
                textAlign: 'center',
                fontWeight: 800,
                fontSize: '1.05rem'
              }}>
                ✅ Traitement du {selectedSlot} validé !
              </div>
            )}

            <button
              onClick={handleSpeakSlotInstructions}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1.5px solid rgba(255,255,255,0.4)',
                padding: '0.75rem 1rem',
                borderRadius: '14px',
                fontWeight: 700,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Volume2 size={20} /> Écouter les consignes vocales
            </button>

          </div>

        </div>

        {/* Time slot selector pills */}
        <div style={{
          marginTop: '1.25rem',
          paddingTop: '1rem',
          borderTop: '1px solid rgba(255,255,255,0.2)',
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.2rem'
        }}>
          {timeSlots.map((slot) => {
            const isSlotTaken = takenSlots[`${currentDayKey}-${slot.key}`];
            const isSelected = selectedSlot === slot.key;

            return (
              <button
                key={slot.key}
                onClick={() => setSelectedSlot(slot.key)}
                style={{
                  padding: '0.6rem 0.95rem',
                  borderRadius: '12px',
                  background: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.15)',
                  color: isSelected ? 'var(--text-main)' : 'white',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  flexShrink: 0
                }}
              >
                <span>{slot.key === 'Matin' ? '☀️' : slot.key === 'Midi' ? '🌤️' : slot.key === 'Soir' ? '🌅' : '🌙'}</span>
                <span>{slot.key}</span>
                {isSlotTaken && <span style={{ color: '#16a34a' }}>✓</span>}
              </button>
            );
          })}
        </div>

      </div>


      {/* 2. MEDICATIONS IN THIS TIME SLOT */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-family-heading)', marginBottom: '0.85rem' }}>
          💊 Case {selectedSlot} ({currentMeds.length} médicaments)
        </h3>

        <div className="grid-responsive-meds">
          {currentMeds.map((med) => (
            <div 
              key={med.id} 
              className="card card-clickable" 
              style={{
                borderLeft: `6px solid ${med.pillIcon.includes('yellow') ? '#eab308' : med.pillIcon.includes('blue') ? '#3b82f6' : 'var(--primary)'}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                    {med.name} <span style={{ color: 'var(--primary)', fontSize: '1rem' }}>{med.dosage}</span>
                  </h4>
                  <span className="badge badge-primary" style={{ marginTop: '0.25rem' }}>
                    {med.form}
                  </span>
                </div>

                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: med.color,
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  flexShrink: 0
                }}>
                  {med.pillIcon === 'capsule-yellow' ? '💊' : med.pillIcon === 'sachet' ? '✉️' : '⚪'}
                </div>
              </div>

              <div style={{
                background: 'var(--bg-main)',
                padding: '0.75rem',
                borderRadius: '12px',
                fontSize: '0.92rem',
                fontWeight: 600,
                color: 'var(--text-main)',
                marginBottom: '0.5rem',
                border: '1px solid var(--border)'
              }}>
                📌 {med.instructions}
              </div>

              {med.warning && (
                <div style={{
                  background: '#fef3c7',
                  color: '#92400e',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  <AlertTriangle size={16} color="#d97706" flexShrink={0} />
                  <span>{med.warning}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>


      {/* 3. PHYSICAL PILLBOX MIRROR (RESPONSIVE: MOBILE DAY CARDS / DESKTOP TABLE) */}
      <div className="card">
        
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-family-heading)', margin: 0 }}>
            📅 Pilulier Physique Semainier
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, margin: '0.2rem 0 0 0' }}>
            Reproduction visuelle des 7 jours de la semaine.
          </p>
        </div>

        {/* Mobile Day Selector Tabs (< 768px) */}
        <div style={{
          display: 'flex',
          gap: '0.35rem',
          overflowX: 'auto',
          paddingBottom: '0.85rem',
          marginBottom: '1rem',
          borderBottom: '1px solid var(--border)'
        }} className="mobile-day-tabs">
          {daysOfWeek.map((day) => {
            const isSelectedDay = selectedDayKey === day.key;
            const isToday = day.key === currentDayKey;
            return (
              <button
                key={day.key}
                onClick={() => setSelectedDayKey(day.key)}
                style={{
                  padding: '0.55rem 0.85rem',
                  borderRadius: '12px',
                  background: isSelectedDay ? 'var(--primary)' : isToday ? 'var(--primary-light)' : 'var(--bg-main)',
                  color: isSelectedDay ? 'white' : isToday ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  border: isSelectedDay ? 'none' : '1px solid var(--border)',
                  flexShrink: 0,
                  textAlign: 'center'
                }}
              >
                <div>{day.short}</div>
                {isToday && <div style={{ fontSize: '0.65rem' }}>Auj.</div>}
              </button>
            );
          })}
        </div>

        {/* Mobile Day Slots Cards (< 768px) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }} className="mobile-day-cards">
          {timeSlots.map((slot) => {
            const dayObj = daysOfWeek.find(d => d.key === selectedDayKey) || daysOfWeek[0];
            const slotKey = `${selectedDayKey}-${slot.key}`;
            const slotTaken = takenSlots[slotKey];
            const slotMeds = medications.filter(m => m.timeSlots.includes(slot.key));

            return (
              <div
                key={slot.key}
                onClick={() => onOpenCompartment(dayObj.label, slot.key, slotMeds, slotTaken)}
                style={{
                  padding: '0.85rem',
                  borderRadius: '16px',
                  background: slotTaken ? 'var(--success-light)' : 'var(--bg-main)',
                  border: slotTaken ? '2px solid var(--success)' : '1.5px solid var(--border)',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.35rem' }}>
                  {slot.key === 'Matin' ? '☀️' : slot.key === 'Midi' ? '🌤️' : slot.key === 'Soir' ? '🌅' : '🌙'} {slot.key}
                </div>

                {slotTaken ? (
                  <span style={{ fontSize: '0.82rem', color: 'var(--success)', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
                    <CheckCircle2 size={16} /> Validé
                  </span>
                ) : (
                  <div>
                    <div style={{ display: 'flex', gap: '0.2rem', justifyContent: 'center', margin: '0.2rem 0' }}>
                      {slotMeds.map(m => (
                        <span key={m.id} style={{ fontSize: '0.85rem' }}>
                          {m.pillIcon === 'capsule-yellow' ? '💊' : m.pillIcon === 'sachet' ? '✉️' : '⚪'}
                        </span>
                      ))}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                      {slotMeds.length} cachet(s)
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
