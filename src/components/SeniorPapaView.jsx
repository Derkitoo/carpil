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
  const currentDayKey = 'mar'; // Mardi (Today in simulation)
  const currentDayLabel = 'Mardi 17 Août';

  const slotConfig = timeSlots.find(s => s.key === selectedSlot) || timeSlots[0];
  const isTaken = takenSlots[`${currentDayKey}-${selectedSlot}`];

  // Filter meds for current selected slot
  const currentMeds = medications.filter(med => med.timeSlots.includes(selectedSlot));

  const handleValidateCurrent = () => {
    onValidateSlot(currentDayKey, selectedSlot);
    
    // Confetti effect
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Voice feedback
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 1. HERO BANNER: CURRENT TIME SLOT FOCUS */}
      <div className="card animate-slide-up" style={{
        background: isTaken 
          ? 'linear-gradient(135deg, #15803d, #16a34a)' 
          : 'linear-gradient(135deg, #0284c7, #0369a1)',
        color: 'white',
        borderRadius: '24px',
        padding: '2rem',
        boxShadow: '0 12px 35px -5px rgba(2, 132, 199, 0.35)',
        border: 'none',
        position: 'relative',
        overflow: 'hidden'
      }}>
        
        {/* Background glow decoration */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '200px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.12)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          position: 'relative',
          zIndex: 2
        }}>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(4px)',
                padding: '0.35rem 0.85rem',
                borderRadius: '999px',
                fontSize: '1rem',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                📅 {currentDayLabel}
              </span>

              {isTaken && (
                <span style={{
                  background: '#dcfce7',
                  color: '#15803d',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '999px',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  <CheckCircle2 size={18} /> Validé
                </span>
              )}
            </div>

            <h2 style={{
              fontSize: '2.2rem',
              fontWeight: 800,
              fontFamily: 'var(--font-family-heading)',
              margin: '0.25rem 0 0.75rem 0',
              lineHeight: 1.15
            }}>
              {isTaken ? `Prise du ${selectedSlot} Validée ! 🎉` : `À prendre maintenant : ${selectedSlot}`}
            </h2>

            <p style={{ fontSize: '1.15rem', opacity: 0.95, maxWidth: '600px', fontWeight: 500 }}>
              {isTaken 
                ? "Tous vos comprimés pour ce créneau ont été enregistrés. Votre fils Thomas a reçu la confirmation."
                : `Vous avez ${currentMeds.length} médicament(s) dans votre case ${selectedSlot} du pilulier.`
              }
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: '360px' }}>
            
            {!isTaken ? (
              <button
                onClick={handleValidateCurrent}
                className="btn-giant btn-success animate-pulse-gentle"
                style={{
                  width: '100%',
                  fontSize: '1.4rem',
                  padding: '1.4rem 1.5rem',
                  background: '#16a34a',
                  color: 'white',
                  border: '3px solid #ffffff'
                }}
              >
                <CheckCircle2 size={32} />
                <span>J'AI PRIS MES CACHETS 🟢</span>
              </button>
            ) : (
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '1rem',
                borderRadius: '16px',
                textAlign: 'center',
                fontWeight: 700,
                fontSize: '1.1rem'
              }}>
                ✅ Traitement pris avec succès !
              </div>
            )}

            <button
              onClick={handleSpeakSlotInstructions}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1.5px solid rgba(255,255,255,0.4)',
                padding: '0.85rem 1.25rem',
                borderRadius: '14px',
                fontWeight: 700,
                fontSize: '1.05rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem'
              }}
            >
              <Volume2 size={22} /> Écouter les consignes vocales
            </button>

          </div>

        </div>

        {/* Time slot selector pills */}
        <div style={{
          marginTop: '1.75rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid rgba(255,255,255,0.2)',
          display: 'flex',
          gap: '0.75rem',
          overflowX: 'auto',
          paddingBottom: '0.25rem'
        }}>
          {timeSlots.map((slot) => {
            const isSlotTaken = takenSlots[`${currentDayKey}-${slot.key}`];
            const isSelected = selectedSlot === slot.key;

            return (
              <button
                key={slot.key}
                onClick={() => setSelectedSlot(slot.key)}
                style={{
                  padding: '0.75rem 1.25rem',
                  borderRadius: '14px',
                  background: isSelected 
                    ? '#ffffff' 
                    : 'rgba(255, 255, 255, 0.15)',
                  color: isSelected ? 'var(--text-main)' : 'white',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: isSelected ? '0 4px 15px rgba(0,0,0,0.2)' : 'none',
                  flexShrink: 0
                }}
              >
                <span>{slot.key === 'Matin' ? '☀️' : slot.key === 'Midi' ? '🌤️' : slot.key === 'Soir' ? '🌅' : '🌙'}</span>
                <span>{slot.key} ({slot.time})</span>
                {isSlotTaken && <span style={{ color: '#16a34a' }}>✓</span>}
              </button>
            );
          })}
        </div>

      </div>


      {/* 2. MEDICATIONS IN THIS TIME SLOT */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-family-heading)' }}>
            💊 Contenu de votre case {selectedSlot} ({currentMeds.length} médicaments)
          </h3>
          <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Toutes les boîtes sont vérifiées par le docteur
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {currentMeds.map((med) => (
            <div 
              key={med.id} 
              className="card card-clickable" 
              style={{
                borderLeft: `8px solid ${med.pillIcon.includes('yellow') ? '#eab308' : med.pillIcon.includes('blue') ? '#3b82f6' : 'var(--primary)'}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                    {med.name} <span style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>{med.dosage}</span>
                  </h4>
                  <span className="badge badge-primary" style={{ marginTop: '0.35rem' }}>
                    {med.form}
                  </span>
                </div>

                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: med.color,
                  border: '1.5px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
                }}>
                  {med.pillIcon === 'capsule-yellow' ? '💊' : med.pillIcon === 'sachet' ? '✉️' : '⚪'}
                </div>
              </div>

              <div style={{
                background: 'var(--bg-main)',
                padding: '0.85rem',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--text-main)',
                marginBottom: '0.75rem',
                border: '1px solid var(--border)'
              }}>
                📌 {med.instructions}
              </div>

              {med.warning && (
                <div style={{
                  background: '#fef3c7',
                  color: '#92400e',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <AlertTriangle size={18} color="#d97706" flexShrink={0} />
                  <span>{med.warning}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>


      {/* 3. PHYSICAL PILLBOX MIRROR GRID (PILULIER SEMAINIER VISUEL) */}
      <div className="card" style={{ padding: '1.75rem' }}>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-family-heading)', margin: 0 }}>
              📅 Votre Pilulier Physique Semainier
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500, margin: '0.25rem 0 0 0' }}>
              Reproduction visuelle de votre pilulier de la semaine. Cliquez sur une case pour la vérifier.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', fontWeight: 700 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '14px', height: '14px', borderRadius: '4px', background: 'var(--success-light)', border: '1px solid var(--success)' }} /> Pris ✅
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '14px', height: '14px', borderRadius: '4px', background: '#fef3c7', border: '1px solid #f59e0b' }} /> À prendre ⏰
            </span>
          </div>
        </div>

        {/* 7 Days Grid x 4 Time slots */}
        <div style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0.6rem', minWidth: '700px' }}>
            <thead>
              <tr>
                <th style={{ padding: '0.75rem', textTransform: 'uppercase', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'left' }}>
                  Créneaux
                </th>
                {daysOfWeek.map((day) => {
                  const isToday = day.key === currentDayKey;
                  return (
                    <th 
                      key={day.key} 
                      style={{
                        padding: '0.75rem',
                        textAlign: 'center',
                        fontSize: '1.05rem',
                        fontWeight: 800,
                        background: isToday ? 'var(--primary-light)' : 'transparent',
                        color: isToday ? 'var(--primary)' : 'var(--text-main)',
                        borderRadius: '12px',
                        border: isToday ? '2px solid var(--primary)' : 'none'
                      }}
                    >
                      {day.label}
                      {isToday && <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>Aujourd'hui</div>}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot) => (
                <tr key={slot.key}>
                  {/* Slot Title Header */}
                  <td style={{
                    padding: '0.75rem 1rem',
                    fontWeight: 800,
                    fontSize: '1rem',
                    background: 'var(--bg-main)',
                    borderRadius: '14px',
                    border: '1.5px solid var(--border)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>
                        {slot.key === 'Matin' ? '☀️' : slot.key === 'Midi' ? '🌤️' : slot.key === 'Soir' ? '🌅' : '🌙'}
                      </span>
                      <div>
                        <div>{slot.key}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{slot.time}</div>
                      </div>
                    </div>
                  </td>

                  {/* 7 Days Cells for this slot */}
                  {daysOfWeek.map((day) => {
                    const slotKey = `${day.key}-${slot.key}`;
                    const slotTaken = takenSlots[slotKey];
                    const isTodaySlot = day.key === currentDayKey && slot.key === selectedSlot;

                    // Get meds for this slot
                    const slotMeds = medications.filter(m => m.timeSlots.includes(slot.key));

                    return (
                      <td
                        key={slotKey}
                        onClick={() => onOpenCompartment(day.label, slot.key, slotMeds, slotTaken)}
                        style={{
                          padding: '0.85rem 0.5rem',
                          textAlign: 'center',
                          borderRadius: '16px',
                          background: slotTaken 
                            ? 'var(--success-light)' 
                            : isTodaySlot 
                              ? '#fff7ed' 
                              : 'var(--card-bg)',
                          border: isTodaySlot 
                            ? '3px solid #f97316' 
                            : slotTaken 
                              ? '2px solid var(--success)' 
                              : '1.5px solid var(--border)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: slotTaken ? 'var(--success)' : 'var(--text-main)' }}>
                          {slotTaken ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                              <CheckCircle2 size={24} color="var(--success)" />
                              <span style={{ fontSize: '0.8rem' }}>Validé</span>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                              <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
                                {slotMeds.map(m => (
                                  <span key={m.id} style={{ fontSize: '0.9rem' }} title={m.name}>
                                    {m.pillIcon === 'capsule-yellow' ? '💊' : m.pillIcon === 'sachet' ? '✉️' : '⚪'}
                                  </span>
                                ))}
                              </div>
                              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                                {slotMeds.length} cachet(s)
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
