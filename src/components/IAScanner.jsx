import React, { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, CheckCircle2, RefreshCw, FileText, Plus, Trash2, Edit3, ShieldAlert } from 'lucide-react';
import { VisionOcrService } from '../services/visionOcrService';

export default function IAScanner({ onImportMedications }) {
  const fileInputRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [uploadedImagePreview, setUploadedImagePreview] = useState(null);
  const [scanResult, setScanResult] = useState(null);

  // Manual Add Form State
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualMed, setManualMed] = useState({
    name: '',
    dosage: '',
    form: 'Comprimé',
    timeSlots: ['Matin'],
    instructions: 'Pendant le repas',
    stock: 28
  });

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setUploadedImagePreview(imageUrl);
    setScanning(true);
    setScanResult(null);

    // Call Real Canvas Vision OCR Service
    const result = await VisionOcrService.analyzePrescriptionImage(file);

    setScanning(false);

    if (result.success && result.medications) {
      // Format with required data fields
      const formattedMeds = result.medications.map((med, idx) => ({
        id: `med-scan-${Date.now()}-${idx}`,
        name: med.name,
        dosage: med.dosage,
        form: med.form || 'Comprimé',
        category: 'Ordonnance IA',
        timeSlots: med.timeSlots || ['Matin'],
        instructions: med.instructions || 'Prendre selon ordonnance',
        warning: med.warning || '',
        stock: med.stock || 30,
        unit: med.unit || 'comprimés',
        dailyDose: 1,
        pillIcon: med.form?.includes('Gélule') ? 'capsule-yellow' : med.form?.includes('Sachet') ? 'sachet' : 'round-white'
      }));

      setScanResult(formattedMeds);
    }
  };

  const handleAddManualMed = (e) => {
    e.preventDefault();
    if (!manualMed.name.trim()) return;

    const newMedObj = {
      id: `med-manual-${Date.now()}`,
      name: manualMed.name,
      dosage: manualMed.dosage || '10 mg',
      form: manualMed.form,
      category: 'Ordonnance',
      timeSlots: manualMed.timeSlots,
      instructions: manualMed.instructions,
      warning: '',
      stock: parseInt(manualMed.stock) || 28,
      unit: manualMed.form.includes('Sachet') ? 'sachets' : 'comprimés',
      dailyDose: 1,
      pillIcon: manualMed.form.includes('Gélule') ? 'capsule-yellow' : manualMed.form.includes('Sachet') ? 'sachet' : 'round-white'
    };

    setScanResult(prev => (prev ? [...prev, newMedObj] : [newMedObj]));
    setManualMed({ name: '', dosage: '', form: 'Comprimé', timeSlots: ['Matin'], instructions: 'Pendant le repas', stock: 28 });
    setShowManualForm(false);
  };

  const handleRemoveMed = (indexToRemove) => {
    setScanResult(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleConfirmImport = () => {
    if (!scanResult || scanResult.length === 0) return;
    onImportMedications(scanResult);
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }} className="animate-slide-up">
      
      <div className="card" style={{ padding: '2rem' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--accent-primary-light)',
            color: 'var(--accent-primary)',
            padding: '0.4rem 1.1rem',
            borderRadius: '999px',
            fontSize: '0.9rem',
            fontWeight: 800,
            marginBottom: '0.75rem'
          }}>
            <Sparkles size={18} /> Reconnaissance Optique & Gestion d'Ordonnance
          </div>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 800, fontFamily: 'var(--font-display)', margin: 0 }}>
            Scanner / Importer une Ordonnance
          </h2>
          <p style={{ color: 'var(--system-text-secondary)', fontSize: '1.05rem', marginTop: '0.4rem', fontWeight: 500 }}>
            Prenez une photo en direct, importez une ordonnance ou saisissez vos médicaments. L'IA planifie automatiquement le pilulier !
          </p>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />

        {/* Action Options */}
        {!scanResult && !scanning && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Camera / Photo Upload Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '3px dashed var(--accent-primary)',
                borderRadius: '28px',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                background: 'var(--system-bg)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '22px',
                background: 'var(--accent-primary-light)',
                color: 'var(--accent-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                boxShadow: 'var(--shadow-md)'
              }}>
                <Camera size={36} />
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.4rem 0' }}>
                Prendre une Photo d'Ordonnance ou de Boîte
              </h3>
              <p style={{ color: 'var(--system-text-secondary)', fontSize: '0.92rem', fontWeight: 600, maxWidth: '480px', margin: '0 auto 1.25rem auto' }}>
                Utilisez l'appareil photo du téléphone pour scanner les comprimés et posologies.
              </p>

              <button className="btn-giant btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1.08rem' }}>
                <Upload size={20} /> Sélectionner / Prender une Photo 📷
              </button>
            </div>

            {/* Manual Add Button */}
            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
              <button
                onClick={() => setShowManualForm(!showManualForm)}
                style={{
                  padding: '0.75rem 1.35rem',
                  borderRadius: '16px',
                  background: 'var(--system-bg)',
                  border: '1px solid var(--system-card-border)',
                  color: 'var(--accent-primary)',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Plus size={18} /> Saisie Manuelle d'un Médicament ✍️
              </button>
            </div>

          </div>
        )}

        {/* Manual Add Form Modal/Section */}
        {showManualForm && (
          <form onSubmit={handleAddManualMed} style={{
            background: 'var(--system-bg)',
            padding: '1.5rem',
            borderRadius: '24px',
            border: '2px solid var(--accent-primary-light)',
            marginTop: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--accent-primary)' }}>
              ✍️ Ajouter un Médicament à l'Ordonnance
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--system-text-secondary)' }}>Nom du médicament</label>
                <input
                  type="text"
                  placeholder="ex: Doliprane, Kardégic..."
                  value={manualMed.name}
                  onChange={(e) => setManualMed({ ...manualMed, name: e.target.value })}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '12px', border: '1px solid var(--system-card-border)', fontWeight: 700, marginTop: '0.25rem' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--system-text-secondary)' }}>Dosage</label>
                <input
                  type="text"
                  placeholder="ex: 1000 mg, 75 µg..."
                  value={manualMed.dosage}
                  onChange={(e) => setManualMed({ ...manualMed, dosage: e.target.value })}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '12px', border: '1px solid var(--system-card-border)', fontWeight: 700, marginTop: '0.25rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--system-text-secondary)' }}>Créneau de Prise</label>
                <select
                  value={manualMed.timeSlots[0]}
                  onChange={(e) => setManualMed({ ...manualMed, timeSlots: [e.target.value] })}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '12px', border: '1px solid var(--system-card-border)', fontWeight: 700, marginTop: '0.25rem' }}
                >
                  <option value="Matin">Matin</option>
                  <option value="Midi">Midi</option>
                  <option value="Soir">Soir</option>
                  <option value="Nuit">Nuit</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setShowManualForm(false)}
                style={{ padding: '0.65rem 1rem', borderRadius: '12px', background: 'transparent', color: 'var(--system-text-secondary)', fontWeight: 700 }}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn-primary"
                style={{ padding: '0.65rem 1.25rem', borderRadius: '12px', fontWeight: 800 }}
              >
                Ajouter à la Liste
              </button>
            </div>
          </form>
        )}

        {/* Image Preview & Scanner Progress */}
        {scanning && (
          <div style={{
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            background: 'var(--system-bg)',
            borderRadius: '28px',
            border: '2px solid var(--accent-primary-light)'
          }}>
            {uploadedImagePreview && (
              <img
                src={uploadedImagePreview}
                alt="Prescription Preview"
                style={{ maxWidth: '240px', maxHeight: '180px', borderRadius: '16px', marginBottom: '1.25rem', objectFit: 'cover', boxShadow: 'var(--shadow-md)' }}
              />
            )}
            <div style={{
              display: 'inline-block',
              width: '50px',
              height: '50px',
              border: '4px solid var(--accent-primary-light)',
              borderTopColor: 'var(--accent-primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '1rem'
            }} />
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
              Analyse optique de l'ordonnance en cours...
            </h3>
            <p style={{ color: 'var(--system-text-secondary)', fontSize: '0.95rem', fontWeight: 600, marginTop: '0.3rem' }}>
              Extraction automatique des noms de médicaments, posologies et unités.
            </p>
          </div>
        )}

        {/* Scan Results Review & Confirmation */}
        {scanResult && scanResult.length > 0 && (
          <div className="animate-slide-up">
            
            <div style={{
              background: 'var(--accent-success-light)',
              color: 'var(--accent-success)',
              padding: '1.15rem',
              borderRadius: '20px',
              border: '2px solid var(--accent-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <CheckCircle2 size={32} color="var(--accent-success)" flexShrink={0} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>
                    Ordonnance Analysée — {scanResult.length} Médicament(s) Détecté(s) ✨
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                    Vérifiez la liste ci-dessous avant d'intégrer au pilulier virtuel.
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowManualForm(true)}
                style={{
                  padding: '0.5rem 0.9rem',
                  borderRadius: '12px',
                  background: 'var(--system-card-bg)',
                  color: 'var(--accent-success)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  border: '1px solid var(--accent-success)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <Plus size={16} /> Ajouter
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.75rem' }}>
              {scanResult.map((med, idx) => (
                <div key={med.id || idx} style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '18px',
                  background: 'var(--system-bg)',
                  border: '1px solid var(--system-card-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>
                      {med.name} <span style={{ color: 'var(--accent-primary)' }}>{med.dosage}</span>
                    </div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--system-text-secondary)', fontWeight: 600, marginTop: '0.2rem' }}>
                      Créneau : <strong>{med.timeSlots.join(', ')}</strong> • Stock initial : {med.stock} {med.unit}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span className="badge badge-success">Certifié ✓</span>
                    <button
                      onClick={() => handleRemoveMed(idx)}
                      style={{ background: 'transparent', border: 'none', color: '#ff3b30', cursor: 'pointer', padding: '0.3rem' }}
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => {
                  setScanResult(null);
                  setUploadedImagePreview(null);
                }}
                style={{
                  padding: '0.95rem 1.25rem',
                  borderRadius: '16px',
                  border: '1px solid var(--system-card-border)',
                  background: 'var(--system-bg)',
                  color: 'var(--system-text)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <RefreshCw size={18} /> Réinitialiser
              </button>

              <button
                onClick={handleConfirmImport}
                className="btn-giant btn-success"
                style={{ flex: 1, padding: '1rem', fontSize: '1.18rem' }}
              >
                <CheckCircle2 size={26} /> Valider & Intégrer au Pilulier Virtuel 🟢
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
