import React, { useState, useRef, useEffect } from 'react';
import { X, QrCode, Wifi, CheckCircle2, ShieldCheck, Copy, RefreshCw, Smartphone, Camera, ExternalLink, Zap } from 'lucide-react';
import { RealtimeCloudSync } from '../services/realtimeCloudSync';

export default function FamilyPairingModal({ isOpen, onClose, onToast }) {
  const [familyCode, setFamilyCode] = useState(() => RealtimeCloudSync.getFamilyCode());
  const [inputCode, setInputCode] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (!isOpen && isCameraActive) {
      stopCamera();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const pairUrl = `${window.location.origin}${window.location.pathname}?familyCode=${familyCode}`;
  const realQrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(pairUrl)}`;
  const fallbackQrCodeApiUrl = `https://chart.googleapis.com/chart?cht=qr&chs=260x260&chl=${encodeURIComponent(pairUrl)}`;

  const handleSaveCode = (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    const formatted = inputCode.trim().toUpperCase();
    RealtimeCloudSync.setFamilyCode(formatted);
    setFamilyCode(formatted);
    setInputCode('');
    onToast(`🔗 Code Familial mis à jour : ${formatted}`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pairUrl);
    onToast("📋 Lien de jumelage copié dans le presse-papier !");
  };

  const handleRunPingTest = () => {
    RealtimeCloudSync.sendTestPing("Téléphone Enfant/Aidant");
    setTestResult("⚡ Signal de test envoyé sur le réseau cloud !");
    onToast("⚡ Signal de test envoyé sur l'autre téléphone !");
  };

  const startCameraScan = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Camera access error:", err);
      onToast("⚠️ Impossible d'accéder à la caméra. Vérifiez les autorisations.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const status = RealtimeCloudSync.getLiveStatus();

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 200,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.85rem'
    }} className="animate-fade-in">
      
      <div className="card" style={{
        maxWidth: '540px',
        width: '100%',
        padding: '1.5rem',
        position: 'relative',
        borderRadius: '24px',
        boxShadow: 'var(--shadow-card-hover)',
        background: 'var(--card-surface)',
        maxHeight: '90dvh',
        overflowY: 'auto',
        boxSizing: 'border-box'
      }}>
        
        {/* Close Button */}
        <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'var(--canvas-bg)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-main)'
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'var(--accent-primary-light)',
            color: 'var(--accent-primary)',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            fontSize: '0.82rem',
            fontWeight: 800,
            marginBottom: '0.65rem',
            maxWidth: '100%'
          }}>
            <Wifi size={15} /> QR Code Matériel ISO & Liaison Cloud
          </div>
          <h3 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-family-master)', wordBreak: 'break-word' }}>
            Jumelage Appareil Enfant ↔ Senior
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', fontWeight: 600, marginTop: '0.25rem', wordBreak: 'break-word' }}>
            Scannez ce QR Code avec l'appareil photo d'un smartphone pour synchroniser automatiquement les 2 téléphones en direct !
          </p>
        </div>

        {/* Live Status Badge */}
        <div style={{
          background: 'var(--hero-bg-mint)',
          border: '1.5px solid var(--accent-green-1)',
          color: 'var(--accent-green-1)',
          padding: '0.65rem 0.95rem',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.15rem',
          gap: '0.5rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '0.88rem' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--accent-green-1)',
              boxShadow: '0 0 8px var(--accent-green-1)'
            }} />
            Relais WebSockets En Direct ({familyCode})
          </div>
          <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>
            Latence : {status.latencyMs}ms
          </span>
        </div>

        {/* Test Ping Button */}
        <button
          onClick={handleRunPingTest}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '14px',
            fontWeight: 800,
            fontSize: '0.9rem',
            marginBottom: '1.15rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            background: 'linear-gradient(135deg, #00C853, #2ED573)'
          }}
        >
          <Zap size={18} /> Tester le Signal entre les 2 Téléphones ⚡
        </button>

        {testResult && (
          <div style={{
            background: 'var(--accent-primary-light)',
            color: 'var(--header-blue-1)',
            padding: '0.65rem 0.95rem',
            borderRadius: '12px',
            fontSize: '0.85rem',
            fontWeight: 800,
            textAlign: 'center',
            marginBottom: '1.15rem'
          }}>
            {testResult}
          </div>
        )}

        {/* REAL SCANNABLE ISO QR CODE CONTAINER */}
        {!isCameraActive ? (
          <div style={{
            background: 'var(--canvas-bg)',
            padding: '1.25rem 0.85rem',
            borderRadius: '20px',
            border: '1px solid var(--system-card-border)',
            textAlign: 'center',
            marginBottom: '1.15rem',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            {/* Real ISO 18004 QR Code Matrix Image */}
            <div style={{
              background: 'white',
              padding: '0.85rem',
              borderRadius: '16px',
              display: 'inline-block',
              boxShadow: 'var(--shadow-card-master)',
              marginBottom: '0.85rem',
              maxWidth: '100%'
            }}>
              <img
                src={realQrCodeApiUrl}
                onError={(e) => { e.target.src = fallbackQrCodeApiUrl; }}
                alt="Real ISO Scannable QR Code"
                style={{
                  width: '180px',
                  height: '180px',
                  maxWidth: '100%',
                  display: 'block',
                  borderRadius: '10px'
                }}
              />
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
              Code de Liaison Unique de la Famille :
            </div>
            <div style={{
              fontSize: '1.6rem',
              fontWeight: 900,
              letterSpacing: '2px',
              color: 'var(--header-blue-1)',
              fontFamily: 'monospace',
              marginTop: '0.1rem',
              wordBreak: 'break-all'
            }}>
              {familyCode}
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', marginTop: '0.85rem', flexWrap: 'wrap' }}>
              <button
                onClick={handleCopyLink}
                style={{
                  padding: '0.6rem 0.95rem',
                  borderRadius: '12px',
                  background: 'var(--accent-primary-light)',
                  color: 'var(--accent-primary)',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Copy size={15} /> Copier le Lien Direct 📋
              </button>

              <button
                onClick={startCameraScan}
                style={{
                  padding: '0.6rem 0.95rem',
                  borderRadius: '12px',
                  background: 'var(--card-surface)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--system-card-border)',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Camera size={15} /> Scanner avec Caméra 📷
              </button>
            </div>
          </div>
        ) : (
          /* Live Camera Stream Scanner View */
          <div style={{
            background: '#000000',
            padding: '1rem',
            borderRadius: '20px',
            textAlign: 'center',
            color: '#ffffff',
            marginBottom: '1.15rem'
          }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{ width: '100%', maxHeight: '220px', borderRadius: '14px', objectFit: 'cover', marginBottom: '0.85rem' }}
            />
            <p style={{ fontSize: '0.82rem', fontWeight: 600, margin: '0 0 0.85rem 0' }}>
              Pointez la caméra vers le QR Code affiché sur le téléphone de votre proche.
            </p>
            <button
              onClick={stopCamera}
              style={{
                padding: '0.55rem 1.1rem',
                borderRadius: '12px',
                background: '#ff3b30',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.85rem'
              }}
            >
              Fermer la Caméra ✖
            </button>
          </div>
        )}

        {/* Pair with another device form */}
        <form onSubmit={handleSaveCode} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', width: '100%' }}>
          <input
            type="text"
            placeholder="Saisissez un code (ex: CARPIL-8842)"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            style={{
              flex: 1,
              minWidth: '150px',
              padding: '0.65rem 0.85rem',
              borderRadius: '14px',
              border: '1px solid var(--system-card-border)',
              background: 'var(--canvas-bg)',
              fontWeight: 700,
              fontSize: '0.85rem',
              boxSizing: 'border-box'
            }}
          />
          <button
            type="submit"
            className="btn-primary"
            style={{ padding: '0.65rem 1rem', borderRadius: '14px', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}
          >
            Connecter 🔗
          </button>
        </form>

      </div>

    </div>
  );
}
