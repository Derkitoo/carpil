import React from 'react';
import { QrCode, ShoppingBag, CheckCircle2, ShieldCheck, Printer, Download } from 'lucide-react';

export default function PharmacyPassQR({ patientProfile, medications }) {
  // Generate a clean SVG QR Code simulation matrix
  return (
    <div className="card animate-slide-up" style={{ padding: '1.75rem' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
          🏥 Pass E-Pharmacie Sécurisé
        </span>
        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-display)', margin: 0 }}>
          Pass Pharmacie & Ordonnances Numériques
        </h3>
        <p style={{ color: 'var(--system-text-secondary)', fontSize: '0.95rem', fontWeight: 500, marginTop: '0.3rem' }}>
          Présentez ce QR Code en officine pour le renouvellement instantané des boîtes de {patientProfile.name}.
        </p>
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        background: 'var(--system-bg)',
        padding: '1.5rem',
        borderRadius: '24px',
        border: '1px solid var(--system-card-border)',
        marginBottom: '1.5rem'
      }}>

        {/* QR Code Graphic Box */}
        <div style={{
          background: '#ffffff',
          padding: '1.25rem',
          borderRadius: '20px',
          boxShadow: 'var(--shadow-md)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '160px',
            height: '160px',
            background: 'linear-gradient(135deg, #0f172a, #1e293b)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            margin: '0 auto 0.75rem auto'
          }}>
            <QrCode size={120} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--system-text-secondary)' }}>
            CAREPILL-PASS-2026-JM73
          </div>
        </div>

        {/* Prescription Refill Summary */}
        <div style={{ flex: 1, minWidth: '260px' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--system-text)' }}>
            Boîtes à Renouveler en Officine :
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {medications.map(med => {
              const daysLeft = Math.floor(med.stock / med.dailyDose);
              return (
                <div key={med.id} style={{
                  padding: '0.65rem 0.95rem',
                  borderRadius: '14px',
                  background: 'var(--system-card-bg)',
                  border: '1px solid var(--system-card-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.9rem'
                }}>
                  <div>
                    <strong style={{ color: 'var(--system-text)' }}>{med.name} {med.dosage}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--system-text-secondary)', marginLeft: '0.5rem' }}>
                      (Reste {med.stock} {med.unit})
                    </span>
                  </div>
                  {daysLeft <= 7 ? (
                    <span className="badge badge-warning">⚡ Prioritaire</span>
                  ) : (
                    <span className="badge badge-success">✓ OK</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
        <button
          onClick={() => alert(`Pass Pharmacie de ${patientProfile.name} prêt à être scanné en officine !`)}
          className="btn-primary"
          style={{ padding: '0.8rem 1.5rem', borderRadius: '14px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <QrCode size={20} /> Afficher Plein Écran
        </button>
      </div>

    </div>
  );
}
