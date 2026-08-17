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
      particleCount: 90,
      spread: 75,
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }} className="animate-slide-up">
      
      {/* 1. HERO CARD: CURRENT TIME SLOT INTENT */}
      <div className="card" style={{
        background: isTaken 
          ? 'linear-gradient(135deg, #24b446, #34c759)' 
          : 'linear-gradient(135deg, #0071e3, #005bb5)',
        color: '#ffffff',
        borderRadius: '32px',
        padding: '1.75rem',
        border: 'none',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem', position: 'relative', zIndex: 2 }}>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                padding: '0.25rem 0.85rem',
                borderRadius: '999px',
                fontSize: '0.88rem',
                fontWeight: 700
              }}>
                📅 {currentDayLabel}
              </span>

              {isTaken && (
                <span style={{
                  background: '#ffffff',
                  color: '#24b446',
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
              fontSize: '2rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              margin: '0.2rem 0 0.35rem 0',
              lineHeight: 1.15,
              letterSpacing: '-0.03em'
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

          {/* Giant Single Action Focus */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
            
            {!isTaken ? (
              <button
                onClick={handleValidateCurrent}
                className="btn-giant btn-success animate-pulse-gentle"
                style={{
                  background: '#34c759',
                  color: '#ffffff',
                  border: '2px solid #ffffff'
                }}
              >
                <CheckCircle2 size={30} />
                <span>J'AI PRIS MES CACHETS 🟢</span>
              </button>
            ) : (
              <div style={{
                background: 'rgba(255, 255, 255, 0.22)',
                backdropFilter: 'blur(10px)',
                padding: '1rem',
                borderRadius: '20px',
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
                color: '#ffffff',
                border: '1.5px solid rgba(255, 255, 255, 0.35)',
                padding: '0.8rem 1rem',
                borderRadius: '18px',
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

        {/* Time slot segmented pill buttons */}
        <div style={{
          marginTop: '1.5rem',
          paddingTop: '1.1rem',
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
                  color: isSelected ? 'var(--system-text)' : '#ffffff',
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
                {isSlotTaken && <span style={{ color: '#34c759', fontWeight: 900 }}>✓</span>}
              </button>
            );
          })}
        </div>

      </div>


      {/* 2. MEDICATIONS IN THIS TIME SLOT */}
      <div>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '0.85rem', letterSpacing: '-0.02em' }}>
          💊 Case {selectedSlot} ({currentMeds.length} médicaments)
        </h3>

        <div className="grid-responsive-meds">
          {currentMeds.map((med) => (
            <div 
              key={med.id} 
              className="card card-clickable" 
              style={{
                borderLeft: `5px solid ${med.pillIcon.includes('yellow') ? '#ff9500' : med.pillIcon.includes('blue') ? '#0071e3' : '#34c759'}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--system-text)', margin: 0, letterSpacing: '-0.015em' }}>
                    {med.name} <span style={{ color: 'var(--accent-primary)', fontSize: '1rem' }}>{med.dosage}</span>
                  </h4>
                  <span className="badge badge-primary" style={{ marginTop: '0.25rem' }}>
                    {med.form}
                  </span>
                </div>

                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '14px',
                  background: med.color,
                  border: '1px solid var(--system-card-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                  flexShrink: 0,
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {med.pillIcon === 'capsule-yellow' ? '💊' : med.pillIcon === 'sachet' ? '✉️' : '⚪'}
                </div>
              </div>

              <div style={{
                background: 'var(--system-bg)',
                padding: '0.8rem 0.95rem',
                borderRadius: '16px',
                fontSize: '0.92rem',
                fontWeight: 600,
                color: 'var(--system-text)',
                marginBottom: '0.5rem',
                border: '1px solid var(--system-card-border)'
              }}>
                📌 {med.instructions}
              </div>

              {med.warning && (
                <div style={{
                  background: 'var(--accent-warning-light)',
                  color: '#b45309',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '14px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  <AlertTriangle size={16} color="var(--accent-warning)" flexShrink={0} />
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
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-display)', margin: 0, letterSpacing: '-0.02em' }}>
            📅 Pilulier Physique Semainier
          </h3>
          <p style={{ color: 'var(--system-text-secondary)', fontSize: '0.9rem', fontWeight: 500, margin: '0.2rem 0 0 0' }}>
            Sélectionnez un jour de la semaine pour consulter ses 4 casiers.
          </p>
        </div>

        {/* Days Grid (7 columns) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '0.35rem',
          width: '100%',
          marginBottom: '1.1rem',
          paddingBottom: '0.85rem',
          borderBottom: '1px solid var(--system-card-border)'
        }}>
          {daysOfWeek.map((day) => {
            const isSelectedDay = selectedDayKey === day.key;
            const isToday = day.key === currentDayKey;
            return (
              <button
                key={day.key}
                onClick={() => setSelectedDayKey(day.key)}
                style={{
                  padding: '0.6rem 0.15rem',
                  borderRadius: '14px',
                  background: isSelectedDay ? 'var(--accent-primary)' : isToday ? 'var(--accent-primary-light)' : 'var(--system-bg)',
                  color: isSelectedDay ? '#ffffff' : isToday ? 'var(--accent-primary)' : 'var(--system-text)',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  border: isSelectedDay ? 'none' : '1px solid var(--system-card-border)',
                  textAlign: 'center',
                  width: '100%',
                  boxShadow: isSelectedDay ? '0 4px 14px rgba(0, 113, 227, 0.25)' : 'none'
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
                  padding: '0.95rem 0.5rem',
                  borderRadius: '20px',
                  background: slotTaken ? 'var(--accent-success-light)' : 'var(--system-bg)',
                  border: slotTaken ? '1.5px solid var(--accent-success)' : '1px solid var(--system-card-border)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '0.92rem', marginBottom: '0.35rem' }}>
                  {slot.key === 'Matin' ? '☀️' : slot.key === 'Midi' ? '🌤️' : slot.key === 'Soir' ? '🌅' : '🌙'} {slot.key}
                </div>

                {slotTaken ? (
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-success)', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
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
                    <span style={{ fontSize: '0.75rem', color: 'var(--system-text-secondary)', fontWeight: 700 }}>
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
