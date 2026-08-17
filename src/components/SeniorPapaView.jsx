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
      
      {/* 1. HERO CARD: CURRENT TIME SLOT FOCUS */}
      <div className="card" style={{
        background: isTaken 
          ? 'linear-gradient(135deg, #059669, #10b981)' 
          : 'linear-gradient(135deg, #0284c7, #0369a1)',
        color: 'white',
        borderRadius: '28px',
        padding: '1.65rem',
        border: 'none',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: isTaken 
          ? '0 16px 35px -8px rgba(16, 185, 129, 0.35)' 
          : '0 16px 35px -8px rgba(2, 132, 199, 0.35)'
      }}>
        
        {/* Soft background glow decoration */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '180px',
          height: '180px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', zIndex: 2 }}>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(8px)',
                padding: '0.25rem 0.85rem',
                borderRadius: '999px',
                fontSize: '0.88rem',
                fontWeight: 800
              }}>
                📅 {currentDayLabel}
              </span>

              {isTaken && (
                <span style={{
                  background: '#ecfdf5',
                  color: '#047857',
                  padding: '0.25rem 0.85rem',
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
              fontSize: '1.85rem',
              fontWeight: 800,
              fontFamily: 'var(--font-family-heading)',
              margin: '0.25rem 0 0.4rem 0',
              lineHeight: 1.15,
              letterSpacing: '-0.02em'
            }}>
              {isTaken ? `Prise du ${selectedSlot} Validée ! 🎉` : `À prendre : ${selectedSlot}`}
            </h2>

            <p style={{ fontSize: '1.05rem', opacity: 0.95, fontWeight: 500, margin: 0 }}>
              {isTaken 
                ? "Tous vos comprimés ont été enregistrés avec succès."
                : `${currentMeds.length} médicament(s) à prendre dans votre pilulier.`
              }
            </p>
          </div>

          {/* Giant Action Button */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
            
            {!isTaken ? (
              <button
                onClick={handleValidateCurrent}
                className="btn-giant btn-success animate-pulse-gentle"
                style={{
                  background: '#10b981',
                  color: 'white',
                  border: '2px solid #ffffff'
                }}
              >
                <CheckCircle2 size={30} />
                <span>J'AI PRIS MES CACHETS 🟢</span>
              </button>
            ) : (
              <div style={{
                background: 'rgba(255,255,255,0.22)',
                backdropFilter: 'blur(8px)',
                padding: '0.95rem',
                borderRadius: '18px',
                textAlign: 'center',
                fontWeight: 800,
                fontSize: '1.1rem'
              }}>
                ✅ Traitement du {selectedSlot} validé !
              </div>
            )}

            <button
              onClick={handleSpeakSlotInstructions}
              style={{
                background: 'rgba(255, 255, 255, 0.18)',
                color: 'white',
                border: '1.5px solid rgba(255,255,255,0.35)',
                padding: '0.8rem 1rem',
                borderRadius: '16px',
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

        {/* Time slot selector buttons (Minimal Segmented Pill Grid) */}
        <div style={{
          marginTop: '1.35rem',
          paddingTop: '1rem',
          borderTop: '1px solid rgba(255,255,255,0.2)',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.4rem',
          width: '100%'
        }}>
          {timeSlots.map((slot) => {
            const isSlotTaken = takenSlots[`${currentDayKey}-${slot.key}`];
            const isSelected = selectedSlot === slot.key;

            return (
              <button
                key={slot.key}
                onClick={() => setSelectedSlot(slot.key)}
                style={{
                  padding: '0.65rem 0.2rem',
                  borderRadius: '14px',
                  background: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.18)',
                  color: isSelected ? 'var(--text-main)' : 'white',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem',
                  width: '100%',
                  textAlign: 'center',
                  boxShadow: isSelected ? '0 4px 14px rgba(0,0,0,0.12)' : 'none'
                }}
              >
                <span>{slot.key === 'Matin' ? '☀️' : slot.key === 'Midi' ? '🌤️' : slot.key === 'Soir' ? '🌅' : '🌙'}</span>
                <span>{slot.key}</span>
                {isSlotTaken && <span style={{ color: '#10b981', fontWeight: 900 }}>✓</span>}
              </button>
            );
          })}
        </div>

      </div>


      {/* 2. MEDICATIONS IN THIS TIME SLOT */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-family-heading)', marginBottom: '0.85rem', letterSpacing: '-0.015em' }}>
          💊 Case {selectedSlot} ({currentMeds.length} médicaments)
        </h3>

        <div className="grid-responsive-meds">
          {currentMeds.map((med) => (
            <div 
              key={med.id} 
              className="card card-clickable" 
              style={{
                borderLeft: `5px solid ${med.pillIcon.includes('yellow') ? '#f59e0b' : med.pillIcon.includes('blue') ? '#0284c7' : '#10b981'}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.01em' }}>
                    {med.name} <span style={{ color: 'var(--primary)', fontSize: '1rem' }}>{med.dosage}</span>
                  </h4>
                  <span className="badge badge-primary" style={{ marginTop: '0.25rem' }}>
                    {med.form}
                  </span>
                </div>

                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: med.color,
                  border: '1px solid var(--card-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}>
                  {med.pillIcon === 'capsule-yellow' ? '💊' : med.pillIcon === 'sachet' ? '✉️' : '⚪'}
                </div>
              </div>

              <div style={{
                background: 'var(--bg-main)',
                padding: '0.75rem 0.85rem',
                borderRadius: '14px',
                fontSize: '0.92rem',
                fontWeight: 600,
                color: 'var(--text-main)',
                marginBottom: '0.5rem',
                border: '1px solid var(--card-border)'
              }}>
                📌 {med.instructions}
              </div>

              {med.warning && (
                <div style={{
                  background: '#fffbeb',
                  color: '#b45309',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '12px',
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


      {/* 3. PHYSICAL PILLBOX MIRROR */}
      <div className="card">
        
        <div style={{ marginBottom: '1.1rem' }}>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-family-heading)', margin: 0, letterSpacing: '-0.015em' }}>
            📅 Pilulier Physique Semainier
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, margin: '0.2rem 0 0 0' }}>
            Sélectionnez un jour de la semaine pour consulter ses 4 casiers.
          </p>
        </div>

        {/* Days Grid (7 columns - NO scrollbar!) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '0.35rem',
          width: '100%',
          marginBottom: '1rem',
          paddingBottom: '0.85rem',
          borderBottom: '1px solid var(--card-border)'
        }}>
          {daysOfWeek.map((day) => {
            const isSelectedDay = selectedDayKey === day.key;
            const isToday = day.key === currentDayKey;
            return (
              <button
                key={day.key}
                onClick={() => setSelectedDayKey(day.key)}
                style={{
                  padding: '0.55rem 0.15rem',
                  borderRadius: '14px',
                  background: isSelectedDay ? 'var(--primary)' : isToday ? 'var(--primary-light)' : 'var(--bg-main)',
                  color: isSelectedDay ? 'white' : isToday ? 'var(--primary-dark)' : 'var(--text-main)',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  border: isSelectedDay ? 'none' : '1px solid var(--card-border)',
                  textAlign: 'center',
                  width: '100%',
                  boxShadow: isSelectedDay ? '0 4px 12px rgba(2, 132, 199, 0.25)' : 'none'
                }}
              >
                <div>{day.short}</div>
                {isToday && <div style={{ fontSize: '0.62rem', lineHeight: 1, marginTop: '0.15rem' }}>Auj.</div>}
              </button>
            );
          })}
        </div>

        {/* 4 Time Slot Compartment Cards for Selected Day */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
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
                  padding: '0.9rem 0.5rem',
                  borderRadius: '18px',
                  background: slotTaken ? 'var(--success-light)' : 'var(--bg-main)',
                  border: slotTaken ? '1.5px solid var(--success)' : '1px solid var(--card-border)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '0.92rem', marginBottom: '0.35rem' }}>
                  {slot.key === 'Matin' ? '☀️' : slot.key === 'Midi' ? '🌤️' : slot.key === 'Soir' ? '🌅' : '🌙'} {slot.key}
                </div>

                {slotTaken ? (
                  <span style={{ fontSize: '0.8rem', color: 'var(--success-dark)', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
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
