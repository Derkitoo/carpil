import React, { useState } from 'react';
import { Camera, Upload, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, RefreshCw, FileImage } from 'lucide-react';

export default function IAScanner({ onImportMedications }) {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const sampleOrdonnanceData = [
    { name: "Kardégic", dosage: "75 mg", form: "Sachet de poudre", timeSlots: ["Matin"], instructions: "Pendant le petit-déjeuner", warning: "Avec un grand verre d'eau" },
    { name: "Amlor", dosage: "5 mg", form: "Gélule jaune et blanche", timeSlots: ["Matin"], instructions: "Prendre le matin à heure fixe", warning: "" },
    { name: "Tahor", dosage: "20 mg", form: "Comprimé blanc", timeSlots: ["Soir"], instructions: "Pendant le repas du soir", warning: "Éviter le jus de pamplemousse" },
    { name: "Imovane", dosage: "7.5 mg", form: "Comprimé bleu", timeSlots: ["Nuit"], instructions: "Avant le coucher", warning: "Risque de somnolence" },
  ];

  const handleStartScan = () => {
    setScanning(true);
    setScanResult(null);
    
    // Simulate AI Vision recognition delay
    setTimeout(() => {
      setScanning(false);
      setScanResult(sampleOrdonnanceData);
    }, 2500);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }} className="animate-slide-up">
      
      <div className="card" style={{ padding: '2rem' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            padding: '0.4rem 1rem',
            borderRadius: '999px',
            fontSize: '0.9rem',
            fontWeight: 800,
            marginBottom: '0.75rem'
          }}>
            <Sparkles size={18} /> Reconnaissance par Vision Artificielle
          </div>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 800, fontFamily: 'var(--font-family-heading)', margin: 0 }}>
            Scanner une Ordonnance ou une Boîte
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginTop: '0.4rem', fontWeight: 500 }}>
            Prenez une simple photo de l'ordonnance du médecin. Notre IA extrait automatiquement les traitements et remplit le pilulier virtuel de votre papa !
          </p>
        </div>


        {/* Dropzone & Scanner Viewport */}
        {!scanResult && !scanning && (
          <div style={{
            border: '3px dashed var(--primary)',
            borderRadius: '24px',
            padding: '3rem 1.5rem',
            textAlign: 'center',
            background: 'var(--bg-main)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }} onClick={handleStartScan}>
            
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              boxShadow: '0 8px 20px rgba(2, 132, 199, 0.2)'
            }}>
              <Camera size={40} />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
              Cliquez pour Scanner une Ordonnance
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 600, maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
              Format supporté : Photo avec smartphone, PDF de la pharmacie, ou boîte de comprimés.
            </p>

            <button className="btn-giant btn-primary" style={{ padding: '0.9rem 1.75rem', fontSize: '1.1rem' }}>
              <Upload size={22} /> Démo Scan Photo Ordonnance 📷
            </button>
          </div>
        )}

        {/* Loading Spinner during Vision Extraction */}
        {scanning && (
          <div style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            background: 'var(--bg-main)',
            borderRadius: '24px',
            border: '2px solid var(--primary-light)'
          }}>
            <div style={{
              display: 'inline-block',
              width: '56px',
              height: '56px',
              border: '5px solid var(--primary-light)',
              borderTopColor: 'var(--primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '1.5rem'
            }} />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              L'IA analyse le document médical...
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 600, marginTop: '0.5rem' }}>
              Extraction automatique des noms de médicaments, dosages et consignes de prise.
            </p>
          </div>
        )}

        {/* Scan Results Review & Confirmation */}
        {scanResult && (
          <div className="animate-slide-up">
            <div style={{
              background: 'var(--success-light)',
              color: 'var(--success)',
              padding: '1.25rem',
              borderRadius: '18px',
              border: '2px solid var(--success)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.75rem'
            }}>
              <CheckCircle2 size={32} color="var(--success)" />
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>
                  Ordonnance Analysée avec Succès ! ✨
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                  4 médicaments ont été extraits et planifiés dans les créneaux du pilulier.
                </div>
              </div>
            </div>

            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
              Détails des Médicaments Détectés :
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
              {scanResult.map((med, idx) => (
                <div key={idx} style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '16px',
                  background: 'var(--bg-main)',
                  border: '1.5px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>
                      {med.name} <span style={{ color: 'var(--primary)' }}>{med.dosage}</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.2rem' }}>
                      Créneau : <strong>{med.timeSlots.join(', ')}</strong> • {med.instructions}
                    </div>
                  </div>

                  <span className="badge badge-primary">
                    Détecté ✓
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setScanResult(null)}
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '14px',
                  border: '1.5px solid var(--border)',
                  background: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <RefreshCw size={18} /> Recommencer
              </button>

              <button
                onClick={() => {
                  alert("Ordonnance importée dans le pilulier de Papa !");
                  setScanResult(null);
                }}
                className="btn-giant btn-success"
                style={{ flex: 1, padding: '1rem', fontSize: '1.15rem' }}
              >
                <CheckCircle2 size={24} /> Valider & Intégrer au Pilulier Virtuel 🟢
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
