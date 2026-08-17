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
      <div 
        className="card animate-slide-up" 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '24px',
          padding: '2rem',
          position: 'relative'
        }}
      >
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>
              📍 Détail du Pilulier
            </span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.2rem 0 0 0', fontFamily: 'var(--font-family-heading)' }}>
              Casier : {dayLabel} - {slotKey}
            </h3>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-main)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '0.5rem',
              color: 'var(--text-main)'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Status indicator */}
        <div style={{
          padding: '1rem',
          borderRadius: '16px',
          marginBottom: '1.5rem',
          background: isTaken ? 'var(--success-light)' : '#fff7ed',
          border: isTaken ? '2px solid var(--success)' : '2px solid #f97316',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {isTaken ? (
              <CheckCircle2 size={32} color="var(--success)" />
            ) : (
              <AlertCircle size={32} color="#ea580c" />
            )}
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: isTaken ? 'var(--success)' : '#c2410c' }}>
                {isTaken ? 'Prise déjà validée ✅' : 'À prendre ou vérifier ⏰'}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {isTaken ? 'Tous les cachets ont été enregistrés.' : 'Vérifiez la concordance avec votre pilulier en plastique.'}
              </div>
            </div>
          </div>

          <button
            onClick={handleSpeakDetails}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: '10px',
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              color: 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Volume2 size={18} /> Lire
          </button>
        </div>

        {/* List of Medications */}
        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          Médicaments dans cette case ({meds.length}) :
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.75rem' }}>
          {meds.map((med) => (
            <div key={med.id} style={{
              padding: '1rem',
              borderRadius: '16px',
              background: 'var(--bg-main)',
              border: '1.5px solid var(--border)',
              display: 'flex',
              gap: '1rem',
              alignItems: 'center'
            }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: med.color,
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                flexShrink: 0
              }}>
                {med.pillIcon === 'capsule-yellow' ? '💊' : med.pillIcon === 'sachet' ? '✉️' : '⚪'}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>
                  {med.name} <span style={{ color: 'var(--primary)' }}>{med.dosage}</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.2rem' }}>
                  {med.instructions}
                </div>
                {med.warning && (
                  <div style={{ fontSize: '0.82rem', color: '#b45309', fontWeight: 700, marginTop: '0.35rem' }}>
                    {med.warning}
                  </div>
                )}
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
            style={{ width: '100%' }}
          >
            <CheckCircle2 size={26} /> Valider ce casier maintenant 🟢
          </button>
        ) : (
          <button
            onClick={onClose}
            className="btn-giant btn-primary"
            style={{ width: '100%' }}
          >
            Fermer le casier
          </button>
        )}

      </div>
    </div>
  );
}
