import React, { useState, useRef, useEffect } from 'react';
import { X, QrCode, Wifi, CheckCircle2, ShieldCheck, Copy, RefreshCw, Smartphone, Camera, ExternalLink } from 'lucide-react';
import { RealtimeCloudSync } from '../services/realtimeCloudSync';

export default function FamilyPairingModal({ isOpen, onClose, onToast }) {
  const [familyCode, setFamilyCode] = useState(() => RealtimeCloudSync.getFamilyCode());
  const [inputCode, setInputCode] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
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
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 200,
      background: 'rgba(0, 0, 0, 0.72)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }} className="animate-fade-in">
      
      <div className="card" style={{
        maxWidth: '560px',
        width: '100%',
        padding: '2rem',
        position: 'relative',
        borderRadius: '28px',
        boxShadow: 'var(--shadow-xl)',
        background: 'var(--system-card-bg)',
        maxHeight: '92vh',
        overflowY: 'auto'
      }}>
        
        {/* Close Button */}
        <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'var(--system-bg)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--system-text)'
          }}
        >
          <X size={22} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--accent-primary-light)',
            color: 'var(--accent-primary)',
            padding: '0.4rem 1rem',
            borderRadius: '999px',
            fontSize: '0.85rem',
            fontWeight: 800,
            marginBottom: '0.75rem'
          }}>
            <Wifi size={16} /> QR Code Matériel ISO & Liaison Cloud
          </div>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-display)' }}>
            Jumelage Appareil Enfant ↔ Senior
          </h3>
          <p style={{ color: 'var(--system-text-secondary)', fontSize: '0.92rem', fontWeight: 600, marginTop: '0.35rem' }}>
            Scannez ce QR Code avec l'appareil photo d'un smartphone pour synchroniser automatiquement les 2 téléphones en direct !
          </p>
        </div>

        {/* Live Status Badge */}
        <div style={{
          background: 'var(--accent-success-light)',
          border: '1.5px solid var(--accent-success)',
          color: 'var(--accent-success)',
          padding: '0.75rem 1.1rem',
          borderRadius: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800, fontSize: '0.92rem' }}>
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: 'var(--accent-success)',
              boxShadow: '0 0 10px var(--accent-success)'
            }} />
            Relais WebSockets En Direct
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
            Latence : {status.latencyMs}ms
          </span>
        </div>

        {/* REAL SCANNABLE ISO QR CODE CONTAINER */}
        {!isCameraActive ? (
          <div style={{
            background: 'var(--system-bg)',
            padding: '1.5rem 1rem',
            borderRadius: '24px',
            border: '1px solid var(--system-card-border)',
            textAlign: 'center',
            marginBottom: '1.25rem'
          }}>
            {/* Real ISO 18004 QR Code Matrix Image */}
            <div style={{
              background: 'white',
              padding: '1rem',
              borderRadius: '20px',
              display: 'inline-block',
              boxShadow: 'var(--shadow-md)',
              marginBottom: '1rem'
            }}>
              <img
                src={realQrCodeApiUrl}
                onError={(e) => { e.target.src = fallbackQrCodeApiUrl; }}
                alt="Real ISO Scannable QR Code"
                style={{
                  width: '200px',
                  height: '200px',
                  display: 'block',
                  borderRadius: '12px'
                }}
              />
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--system-text-secondary)', fontWeight: 700 }}>
              Code de Liaison Unique de la Famille :
            </div>
            <div style={{
              fontSize: '1.75rem',
              fontWeight: 900,
              letterSpacing: '3px',
              color: 'var(--accent-primary)',
              fontFamily: 'monospace',
              marginTop: '0.15rem'
            }}>
              {familyCode}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1rem' }}>
              <button
                onClick={handleCopyLink}
                style={{
                  padding: '0.65rem 1.1rem',
                  borderRadius: '14px',
                  background: 'var(--accent-primary-light)',
                  color: 'var(--accent-primary)',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Copy size={16} /> Copier le Lien Direct 📋
              </button>

              <button
                onClick={startCameraScan}
                style={{
                  padding: '0.65rem 1.1rem',
                  borderRadius: '14px',
                  background: 'var(--system-card-bg)',
                  color: 'var(--system-text)',
                  border: '1px solid var(--system-card-border)',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Camera size={16} /> Scanner avec Caméra 📷
              </button>
            </div>
          </div>
        ) : (
          /* Live Camera Stream Scanner View */
          <div style={{
            background: '#000000',
            padding: '1.25rem',
            borderRadius: '24px',
            textAlign: 'center',
            color: '#ffffff',
            marginBottom: '1.25rem'
          }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{ width: '100%', maxHeight: '240px', borderRadius: '16px', objectFit: 'cover', marginBottom: '1rem' }}
            />
            <p style={{ fontSize: '0.88rem', fontWeight: 600, margin: '0 0 1rem 0' }}>
              Pointez la caméra vers le QR Code affiché sur le téléphone de votre proche.
            </p>
            <button
              onClick={stopCamera}
              style={{
                padding: '0.6rem 1.2rem',
                borderRadius: '14px',
                background: '#ff3b30',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800
              }}
            >
              Fermer la Caméra ✖
            </button>
          </div>
        )}

        {/* Pair with another device form */}
        <form onSubmit={handleSaveCode} style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            type="text"
            placeholder="Ou saisissez un code (ex: CARPIL-8842)"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              borderRadius: '16px',
              border: '1px solid var(--system-card-border)',
              background: 'var(--system-bg)',
              fontWeight: 700,
              fontSize: '0.92rem'
            }}
          />
          <button
            type="submit"
            className="btn-primary"
            style={{ padding: '0.75rem 1.2rem', borderRadius: '16px', fontWeight: 800 }}
          >
            Connecter 🔗
          </button>
        </form>

      </div>

    </div>
  );
}
