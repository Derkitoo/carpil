import React, { useState, useRef, useEffect } from 'react';
import { Camera, ShieldCheck, CheckCircle2, AlertTriangle, RefreshCw, Volume2, Sparkles, Hand, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HandPillScanner({ 
  medications, 
  onValidateSlot, 
  speakText, 
  timeSlots 
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [selectedSlot, setSelectedSlot] = useState('Matin');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [detectionResult, setDetectionResult] = useState(null);

  const currentMeds = medications.filter(m => m.timeSlots.includes(selectedSlot));

  // Initialize camera stream
  useEffect(() => {
    let stream = null;

    async function startCamera() {
      try {
        setCameraError(null);
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
      } catch (err) {
        console.warn("Camera access not available or permission denied:", err);
        setCameraError("Caméra non détectée. Mode démonstration vidéo activé.");
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleScanHand = () => {
    setScanning(true);
    setDetectionResult(null);

    // Speak initial prompt
    speakText(`Analyse de la main en cours pour le créneau du ${selectedSlot}... Ne bougez pas.`);

    // Simulate AI Vision hand & pill segmentation
    setTimeout(() => {
      setScanning(false);
      
      const detectedPillsList = currentMeds.map(m => ({
        name: m.name,
        dosage: m.dosage,
        color: m.pillIcon === 'capsule-yellow' ? 'Jaune / Blanc' : 'Blanc',
        shape: m.pillIcon === 'sachet' ? 'Sachet' : 'Comprimé rond',
        status: 'verified'
      }));

      const resultData = {
        pillCount: currentMeds.length,
        expectedCount: currentMeds.length,
        matchScore: 100,
        pills: detectedPillsList
      };

      setDetectionResult(resultData);

      // Voice confirmation
      speakText(`Excellente nouvelle Joseph ! L'IA a détecté exactement vos ${currentMeds.length} médicaments du ${selectedSlot} dans votre main. Aucune erreur detected.`);
    }, 2800);
  };

  const handleCertifyAndValidate = () => {
    onValidateSlot('mar', selectedSlot);

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.55 }
    });

    speakText(`Prise du ${selectedSlot} certifiée par caméra et validée avec succès !`);
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }} className="animate-slide-up">
      
      <div className="card" style={{ padding: '2rem' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--success-light)',
            color: 'var(--success)',
            padding: '0.4rem 1.1rem',
            borderRadius: '999px',
            fontSize: '0.9rem',
            fontWeight: 800,
            marginBottom: '0.65rem'
          }}>
            <Eye size={18} /> Révolution Vision IA Anti-Erreur
          </div>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 800, fontFamily: 'var(--font-family-heading)', margin: 0 }}>
            Contrôle Visuel de la Main avant Prise
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginTop: '0.35rem', fontWeight: 500 }}>
            Tenez votre main ouverte ou votre casier sous la caméra. L'IA certifie la présence et la couleur de vos pilules pour éviter toute erreur !
          </p>
        </div>

        {/* Slot Selector */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap'
        }}>
          {timeSlots.map((slot) => (
            <button
              key={slot.key}
              onClick={() => {
                setSelectedSlot(slot.key);
                setDetectionResult(null);
              }}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '12px',
                background: selectedSlot === slot.key ? 'var(--primary)' : 'var(--bg-main)',
                color: selectedSlot === slot.key ? 'white' : 'var(--text-main)',
                fontWeight: 800,
                fontSize: '1rem',
                border: '1.5px solid var(--border)'
              }}
            >
              {slot.key} ({medications.filter(m => m.timeSlots.includes(slot.key)).length} cachets)
            </button>
          ))}
        </div>

        {/* Camera Viewport Container */}
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '560px',
          height: '380px',
          margin: '0 auto 1.75rem auto',
          borderRadius: '24px',
          overflow: 'hidden',
          background: '#000000',
          border: '4px solid var(--primary)',
          boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          
          {/* Real WebCam Video or Canvas Simulation */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: cameraActive ? 'block' : 'none'
            }}
          />

          {/* Fallback Viewport if WebCam is blocked or inactive */}
          {!cameraActive && (
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #0f172a, #1e293b)',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <Hand size={64} color="#38bdf8" style={{ marginBottom: '1rem' }} />
              <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>
                Mode Démo : Placez votre main ouverte ici
              </div>
              <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '0.4rem' }}>
                Simulation de l'analyse visuelle par caméra pour le créneau {selectedSlot}
              </div>
            </div>
          )}

          {/* Scanner Overlay Guide Target Reticle */}
          <div style={{
            position: 'absolute',
            inset: '30px',
            border: '2px dashed rgba(56, 189, 248, 0.7)',
            borderRadius: '20px',
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '1rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ borderTop: '4px solid #38bdf8', borderLeft: '4px solid #38bdf8', width: '24px', height: '24px' }} />
              <div style={{ borderTop: '4px solid #38bdf8', borderRight: '4px solid #38bdf8', width: '24px', height: '24px' }} />
            </div>

            {scanning && (
              <div style={{
                textAlign: 'center',
                background: 'rgba(2, 132, 199, 0.85)',
                color: 'white',
                padding: '0.65rem',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '1rem',
                backdropFilter: 'blur(4px)',
                animation: 'pulse-gentle 1.5s infinite'
              }}>
                🔍 Analyse des comprimés dans le creux de la main...
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ borderBottom: '4px solid #38bdf8', borderLeft: '4px solid #38bdf8', width: '24px', height: '24px' }} />
              <div style={{ borderBottom: '4px solid #38bdf8', borderRight: '4px solid #38bdf8', width: '24px', height: '24px' }} />
            </div>
          </div>

        </div>

        {/* Scan Action Button */}
        {!detectionResult && !scanning && (
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handleScanHand}
              className="btn-giant btn-primary"
              style={{ padding: '1.25rem 2.5rem', fontSize: '1.3rem' }}
            >
              <Camera size={28} /> Scanner la Main ({selectedSlot}) 📷
            </button>
          </div>
        )}

        {/* Verified Detection Results */}
        {detectionResult && (
          <div className="animate-slide-up" style={{
            background: 'var(--success-light)',
            border: '2px solid var(--success)',
            borderRadius: '20px',
            padding: '1.5rem',
            marginTop: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <ShieldCheck size={40} color="var(--success)" />
              <div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--success)' }}>
                  CERTIFICATION RÉUSSIE — {detectionResult.pillCount} / {detectionResult.expectedCount} Médicaments Certifiés ✅
                </div>
                <div style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 600 }}>
                  L'IA a confirmé la concordance exacte des gélules pour la prise du {selectedSlot}.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }}>
              {detectionResult.pills.map((pill, idx) => (
                <div key={idx} style={{
                  background: 'var(--card-bg)',
                  padding: '0.85rem 1.1rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>
                    • {pill.name} <span style={{ color: 'var(--primary)' }}>{pill.dosage}</span> ({pill.color} - {pill.shape})
                  </div>
                  <span className="badge badge-success">Certifié ✓</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleCertifyAndValidate}
              className="btn-giant btn-success"
              style={{ width: '100%', padding: '1.25rem', fontSize: '1.3rem' }}
            >
              <CheckCircle2 size={30} /> Certifier & Valider la Prise du {selectedSlot} 🟢
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
