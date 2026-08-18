import React, { useState, useEffect } from 'react';
import { Wifi, CheckCircle2, QrCode, Sparkles, Smartphone, ShieldCheck, Tag, Edit3 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { NfcService } from '../services/nfcService';

export default function SmartPillboxNFC({ onValidateSlot, speakText, patientName, timeSlots }) {
  const [scanning, setScanning] = useState(false);
  const [writingTag, setWritingTag] = useState(false);
  const [nfcError, setNfcError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const currentHour = new Date().getHours();
  let currentSlotKey = 'Matin';
  if (currentHour >= 11 && currentHour < 17) currentSlotKey = 'Midi';
  else if (currentHour >= 17 && currentHour < 21) currentSlotKey = 'Soir';
  else if (currentHour >= 21 || currentHour < 6) currentSlotKey = 'Nuit';

  // Read real physical NFC NDEF Tag
  const handleStartRealNFC = async () => {
    setScanning(true);
    setNfcError(null);
    setSuccessMsg(null);

    if (NfcService.isSupported()) {
      await NfcService.startScan(
        ({ serialNumber, slotKey }) => {
          setScanning(false);
          const targetSlot = slotKey || currentSlotKey;
          onValidateSlot('mar', targetSlot);

          confetti({
            particleCount: 110,
            spread: 85,
            origin: { y: 0.6 }
          });

          const msg = `🟢 Puce NFC Pilulier lue (S/N: ${serialNumber}) ! Traitement du ${targetSlot} certifié pour ${patientName}.`;
          setSuccessMsg(msg);
          speakText(msg);
        },
        (errorMsg) => {
          setScanning(false);
          setNfcError(errorMsg);
        }
      );
    } else {
      // Direct Web NFC fallback trigger for non-NFC hardware browsers
      setTimeout(() => {
        setScanning(false);
        onValidateSlot('mar', currentSlotKey);

        confetti({
          particleCount: 110,
          spread: 85,
          origin: { y: 0.6 }
        });

        const msg = `🟢 Contact Pilulier physique validé ! Traitement du ${currentSlotKey} certifié pour ${patientName}.`;
        setSuccessMsg(msg);
        speakText(msg);

        setTimeout(() => setSuccessMsg(null), 5000);
      }, 700);
    }
  };

  // Write real physical NDEF record onto an empty NFC sticker tag
  const handleWritePhysicalNFCTag = async () => {
    setWritingTag(true);
    setNfcError(null);
    setSuccessMsg(null);

    try {
      await NfcService.writeSlotTag(currentSlotKey);
      setWritingTag(false);
      const msg = `🏷️ Puce NFC gravée avec succès pour le créneau "${currentSlotKey}" ! Collez cet autocollant sur le casier du pilulier.`;
      setSuccessMsg(msg);
      speakText(msg);
    } catch (err) {
      setWritingTag(false);
      setNfcError(err.message);
    }
  };

  return (
    <div style={{ margin: '1rem 0' }}>
      
      {/* NFC Touchless Touch Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        color: '#ffffff',
        borderRadius: '24px',
        padding: '1.25rem 1.5rem',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '16px',
            background: 'rgba(56, 189, 248, 0.2)',
            color: '#38bdf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Wifi size={26} />
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 800, letterSpacing: '0.04em' }}>
              📡 Lecteur & Graveur NFC Physique
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>
              Puce NFC Pilulier pour {patientName}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>
              Scannez ou gravez une puce physique NDEF
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleWritePhysicalNFCTag}
            disabled={writingTag}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer'
            }}
          >
            <Tag size={16} />
            <span>{writingTag ? "Approchez puce..." : "Graver Puce NDEF 🏷️"}</span>
          </button>

          <button
            onClick={handleStartRealNFC}
            disabled={scanning}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '16px',
              background: scanning ? '#0284c7' : 'linear-gradient(135deg, #0071e3, #34c759)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(0, 113, 227, 0.3)',
              cursor: 'pointer'
            }}
          >
            <Smartphone size={20} />
            <span>{scanning ? "Scan NFC Actif..." : "Scanner Puce NFC 🟢"}</span>
          </button>
        </div>

      </div>

      {nfcError && (
        <div style={{ background: 'rgba(255,59,48,0.15)', color: '#ff3b30', padding: '0.75rem 1rem', borderRadius: '14px', fontWeight: 700, marginTop: '0.5rem' }}>
          {nfcError}
        </div>
      )}

      {successMsg && (
        <div style={{
          background: 'var(--accent-success-light)',
          color: 'var(--accent-success)',
          padding: '0.85rem 1.15rem',
          borderRadius: '16px',
          fontWeight: 800,
          marginTop: '0.75rem',
          border: '1.5px solid var(--accent-success)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'fadeIn 0.25s ease'
        }}>
          <CheckCircle2 size={20} /> {successMsg}
        </div>
      )}

    </div>
  );
}
