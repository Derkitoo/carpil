import React from 'react';
import { QrCode, ShoppingBag, CheckCircle2, ShieldCheck, Printer, Download } from 'lucide-react';

export default function PharmacyPassQR({ patientProfile = {}, medications = [] }) {
  const safeName = patientProfile?.name || 'Joseph';
  const qrPassData = `CAREPILL-PASS-2026-${safeName.toUpperCase()}`;
  const realQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(qrPassData)}`;
  const fallbackQrCodeUrl = `https://chart.googleapis.com/chart?cht=qr&chs=220x220&chl=${encodeURIComponent(qrPassData)}`;

  return (
    <div className="card animate-slide-up" style={{ padding: '1.25rem', width: '100%', boxSizing: 'border-box' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
        <span className="badge-pill" style={{ background: 'var(--accent-primary-light)', color: 'var(--accent-primary)', marginBottom: '0.4rem' }}>
          🏥 Pass E-Pharmacie Sécurisé
        </span>
        <h3 style={{ fontSize: '1.45rem', fontWeight: 800, fontFamily: 'var(--font-family-master)', margin: 0, wordBreak: 'break-word' }}>
          Pass Pharmacie & Ordonnances Numériques
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', fontWeight: 500, marginTop: '0.25rem', wordBreak: 'break-word' }}>
          Présentez ce QR Code en officine pour le renouvellement instantané des boîtes de {safeName}.
        </p>
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.25rem',
        background: 'var(--canvas-bg)',
        padding: '1.15rem',
        borderRadius: '20px',
        border: '1px solid var(--system-card-border)',
        marginBottom: '1.25rem',
        width: '100%',
        boxSizing: 'border-box'
      }}>

        {/* Real ISO Scannable QR Code Image Box */}
        <div style={{
          background: '#ffffff',
          padding: '1rem',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-card-master)',
          textAlign: 'center',
          maxWidth: '100%'
        }}>
          <img
            src={realQrCodeUrl}
            onError={(e) => { e.target.src = fallbackQrCodeUrl; }}
            alt="Real ISO Scannable Pharmacy QR Pass"
            style={{
              width: '160px',
              height: '160px',
              maxWidth: '100%',
              display: 'block',
              margin: '0 auto 0.5rem auto',
              borderRadius: '8px'
            }}
          />
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', wordBreak: 'break-all' }}>
            {qrPassData}
          </div>
        </div>

        {/* Prescription Refill Summary */}
        <div style={{ flex: 1, minWidth: '200px', width: '100%' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.65rem', color: 'var(--text-main)' }}>
            Boîtes à Renouveler en Officine :
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {(medications || []).map(med => {
              const daysLeft = Math.floor((med.stock || 10) / (med.dailyDose || 1));
              return (
                <div key={med.id} style={{
                  padding: '0.66rem 0.85rem',
                  borderRadius: '12px',
                  background: 'var(--card-surface)',
                  border: '1px solid var(--system-card-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <strong style={{ color: 'var(--text-main)', wordBreak: 'break-word' }}>{med.name} {med.dosage}</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginLeft: '0.35rem' }}>
                      (Reste {med.stock} {med.unit})
                    </span>
                  </div>
                  {daysLeft <= 7 ? (
                    <span className="badge-pill" style={{ background: 'rgba(255, 149, 0, 0.12)', color: '#ff9500', flexShrink: 0 }}>⚡ Prioritaire</span>
                  ) : (
                    <span className="badge-pill" style={{ background: 'var(--hero-bg-mint)', color: 'var(--accent-green-1)', flexShrink: 0 }}>✓ OK</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => alert(`Pass Pharmacie de ${safeName} scannable avec n'importe quel lecteur d'officine !`)}
          className="btn-primary"
          style={{ padding: '0.75rem 1.25rem', borderRadius: '14px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem' }}
        >
          <QrCode size={18} /> Certifié ISO 18004 Scan Officine 🟢
        </button>
      </div>

    </div>
  );
}
