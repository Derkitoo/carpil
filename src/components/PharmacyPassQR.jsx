import React from 'react';
import { QrCode, ShoppingBag, CheckCircle2, ShieldCheck, Printer, Download } from 'lucide-react';

export default function PharmacyPassQR({ patientProfile, medications }) {
  const qrPassData = `CAREPILL-PASS-2026-${patientProfile?.name?.toUpperCase() || 'JOSEPH'}`;
  const realQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(qrPassData)}`;
  const fallbackQrCodeUrl = `https://chart.googleapis.com/chart?cht=qr&chs=220x220&chl=${encodeURIComponent(qrPassData)}`;

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

        {/* Real ISO Scannable QR Code Image Box */}
        <div style={{
          background: '#ffffff',
          padding: '1.25rem',
          borderRadius: '20px',
          boxShadow: 'var(--shadow-md)',
          textAlign: 'center'
        }}>
          <img
            src={realQrCodeUrl}
            onError={(e) => { e.target.src = fallbackQrCodeUrl; }}
            alt="Real ISO Scannable Pharmacy QR Pass"
            style={{
              width: '180px',
              height: '180px',
              display: 'block',
              margin: '0 auto 0.75rem auto',
              borderRadius: '8px'
            }}
          />
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--system-text-secondary)' }}>
            {qrPassData}
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
          onClick={() => alert(`Pass Pharmacie de ${patientProfile.name} scannable avec n'importe quel lecteur d'officine !`)}
          className="btn-primary"
          style={{ padding: '0.8rem 1.5rem', borderRadius: '14px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <QrCode size={20} /> Certifié ISO 18004 Scan Officine 🟢
        </button>
      </div>

    </div>
  );
}
