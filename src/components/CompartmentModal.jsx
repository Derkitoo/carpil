import React from 'react';
import { X, CheckCircle2, AlertCircle, Volume2, ShieldAlert } from 'lucide-react';

export default function CompartmentModal({ 
  modalData, 
  onClose, 
  onValidateSlot, 
  speakText 
}) {
  if (!modalData) return null;

  const { dayLabel, slotKey, meds, isTaken } = modalData;

  const handleSpeakDetails = () => {
    let msg = `Le casier du ${dayLabel} ${slotKey} contient ${meds.length} médicaments. `;
    meds.forEach((m, idx) => {
      msg += `${idx + 1}. ${m.name} ${m.dosage}. ${m.instructions}. `;
    });
    speakText(msg);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content animate-slide-up" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>
              📍 Détail du Pilulier
            </span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0.1rem 0 0 0', fontFamily: 'var(--font-family-heading)' }}>
              {dayLabel} — {slotKey}
            </h3>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-main)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '0.45rem',
              color: 'var(--text-main)'
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Status indicator */}
        <div style={{
          padding: '0.85rem 1rem',
          borderRadius: '16px',
          marginBottom: '1.25rem',
          background: isTaken ? 'var(--success-light)' : '#fff7ed',
          border: isTaken ? '2px solid var(--success)' : '2px solid #f97316',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {isTaken ? (
              <CheckCircle2 size={28} color="var(--success)" flexShrink={0} />
            ) : (
              <AlertCircle size={28} color="#ea580c" flexShrink={0} />
            )}
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: isTaken ? 'var(--success)' : '#c2410c' }}>
                {isTaken ? 'Prise déjà validée ✅' : 'À prendre ou vérifier ⏰'}
              </div>
            </div>
          </div>

          <button
            onClick={handleSpeakDetails}
            style={{
              padding: '0.45rem 0.75rem',
              borderRadius: '10px',
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              color: 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              flexShrink: 0
            }}
          >
            <Volume2 size={16} /> Lire
          </button>
        </div>

        {/* List of Medications */}
        <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.65rem' }}>
          Médicaments dans ce casier ({meds.length}) :
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {meds.map((med) => (
            <div key={med.id} style={{
              padding: '0.85rem',
              borderRadius: '14px',
              background: 'var(--bg-main)',
              border: '1.5px solid var(--border)',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: med.color,
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
                flexShrink: 0
              }}>
                {med.pillIcon === 'capsule-yellow' ? '💊' : med.pillIcon === 'sachet' ? '✉️' : '⚪'}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                  {med.name} <span style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>{med.dosage}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.15rem' }}>
                  {med.instructions}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action button */}
        {!isTaken ? (
          <button
            onClick={() => {
              onValidateSlot(dayLabel.toLowerCase().slice(0,3), slotKey);
              onClose();
            }}
            className="btn-giant btn-success"
          >
            <CheckCircle2 size={24} /> Valider ce casier 🟢
          </button>
        ) : (
          <button
            onClick={onClose}
            className="btn-giant btn-primary"
          >
            Fermer le casier
          </button>
        )}

      </div>
    </div>
  );
}
