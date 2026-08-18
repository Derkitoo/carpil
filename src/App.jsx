import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SeniorPapaView from './components/SeniorPapaView';
import CaregiverView from './components/CaregiverView';
import IAScanner from './components/IAScanner';
import HandPillScanner from './components/HandPillScanner';
import VoiceAssistantAgent from './components/VoiceAssistantAgent';
import DoctorReport from './components/DoctorReport';
import CompartmentModal from './components/CompartmentModal';
import OnboardingModal from './components/OnboardingModal';
import FamilyPairingModal from './components/FamilyPairingModal';
import PinCodeModal from './components/PinCodeModal';

import { RealtimeCloudSync } from './services/realtimeCloudSync';
import { 
  INITIAL_MEDICATIONS, 
  PATIENT_PROFILE, 
  DAYS_OF_WEEK, 
  TIME_SLOTS, 
  INITIAL_SYMPTOMS_LOG 
} from './data/initialData';

import { Heart, Hand, MessageSquare, Camera, FileText, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [appMode, setAppMode] = useState('papa');
  const [caregiverTab, setCaregiverTab] = useState('dashboard');
  const [showPairingModal, setShowPairingModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);

  // Defensive State Initializers
  const [speechEnabled, setSpeechEnabled] = useState(() => {
    try {
      return localStorage.getItem('carepill_speech') !== 'false';
    } catch {
      return true;
    }
  });

  const [highContrast, setHighContrast] = useState(() => {
    try {
      return localStorage.getItem('carepill_contrast') === 'true';
    } catch {
      return false;
    }
  });

  const [textSize, setTextSize] = useState(() => {
    try {
      const val = parseFloat(localStorage.getItem('carepill_textsize'));
      return (!isNaN(val) && val > 0) ? val : 1;
    } catch {
      return 1;
    }
  });

  const [medications, setMedications] = useState(INITIAL_MEDICATIONS);
  const [symptomsLog, setSymptomsLog] = useState(INITIAL_SYMPTOMS_LOG);

  const [patientProfile, setPatientProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('carepill_profile');
      if (saved && saved !== 'undefined' && saved !== 'null') {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.name) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn("Using default patient profile due to storage error:", err);
    }
    return PATIENT_PROFILE;
  });

  const [takenSlots, setTakenSlots] = useState(() => {
    try {
      const saved = localStorage.getItem('carepill_taken_slots');
      return saved ? JSON.parse(saved) : { "mar-Matin": true };
    } catch {
      return { "mar-Matin": true };
    }
  });

  const [activeModalData, setActiveModalData] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const [showOnboarding, setShowOnboarding] = useState(() => {
    try {
      return localStorage.getItem('carepill_onboarding_done') !== 'true';
    } catch {
      return false;
    }
  });

  // FUNCTIONS DEFINED AT TOP
  function showToast(msg) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  }

  function speakText(text) {
    if (!speechEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.92;

      const voices = window.speechSynthesis.getVoices();
      const frVoice = voices.find(v => v.lang && (v.lang.includes('fr') || v.lang.includes('FR')));
      if (frVoice) {
        utterance.voice = frVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  }

  function handleValidateSlot(dayKey, slotKey) {
    const key = `${dayKey}-${slotKey}`;
    setTakenSlots(prev => {
      const updated = { ...prev, [key]: true };
      return updated;
    });

    // Publish event over WebSockets / Cloud Relay to child phone
    RealtimeCloudSync.publishSlotValidated(dayKey, slotKey, patientProfile.name);

    showToast(`✅ Case ${slotKey} certifiée et synchronisée en direct !`);
  }

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    try {
      localStorage.setItem('carepill_onboarding_done', 'true');
    } catch (e) {
      console.warn(e);
    }
  };

  const handleUpdatePatientProfile = (newProfile) => {
    setPatientProfile(newProfile);
    try {
      localStorage.setItem('carepill_profile', JSON.stringify(newProfile));
    } catch (e) {
      console.warn(e);
    }
    showToast(`Fiche de ${newProfile.name} mise à jour avec succès !`);
  };

  const handleAddSymptom = (newSymptom) => {
    setSymptomsLog(prev => [newSymptom, ...prev]);
    showToast("Symptôme enregistré dans le journal de santé !");
  };

  const handleSendNotification = (textMsg) => {
    RealtimeCloudSync.publishNudgeMessage(textMsg, 'Enfant');
    showToast(`Message transmis en direct à ${patientProfile.name} : "${textMsg}"`);
    speakText(`Message de votre enfant : ${textMsg}`);
  };

  // Check URL parameters for role dissociation (?role=senior vs ?role=caregiver) or family pairing link
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const roleParam = urlParams.get('role') || urlParams.get('mode');

      if (roleParam === 'caregiver' || roleParam === 'enfant' || roleParam === 'proche') {
        setAppMode('caregiver');
      } else if (roleParam === 'senior' || roleParam === 'papa') {
        setAppMode('papa');
      }

      const pairingCode = urlParams.get('familyCode');
      if (pairingCode && pairingCode.trim().length >= 4) {
        RealtimeCloudSync.setFamilyCode(pairingCode);
        showToast(`🔗 Connecté au réseau familial : ${pairingCode.toUpperCase()}`);
      }

      const action = urlParams.get('action');
      if (action && action.startsWith('validate_')) {
        const slotToValidate = action.replace('validate_', '');
        const dayKey = 'mar';

        handleValidateSlot(dayKey, slotToValidate);
        
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 }
        });

        speakText(`Raccourci exécuté : Traitement du ${slotToValidate} validé instantanément pour ${patientProfile.name} !`);
        showToast(`🟢 Traitement du ${slotToValidate} validé avec succès pour ${patientProfile.name} !`);

        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (err) {
      console.warn("URL params handling error:", err);
    }
  }, [patientProfile.name]);

  // Subscribe to Real-time Cross-Device Events
  useEffect(() => {
    const unsubscribe = RealtimeCloudSync.subscribe((event) => {
      if (event.type === 'SLOT_VALIDATED') {
        const key = `${event.dayKey}-${event.slotKey}`;
        setTakenSlots(prev => ({ ...prev, [key]: true }));

        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });

        showToast(`🟢 EN DIRECT : ${event.patientName} a validé son traitement du ${event.slotKey} à ${event.timestamp} !`);
        speakText(`Notification en direct : ${event.patientName} a pris son traitement du ${event.slotKey}`);
      }

      if (event.type === 'NUDGE_RECEIVED') {
        showToast(`💬 Message en Direct de votre proche : "${event.textMsg}"`);
        speakText(`Message de votre enfant : ${event.textMsg}`);
      }
    });

    return () => unsubscribe();
  }, [patientProfile.name]);

  useEffect(() => {
    try {
      document.documentElement.style.setProperty('--senior-scale', textSize);
      localStorage.setItem('carepill_textsize', textSize.toString());

      if (highContrast) {
        document.body.classList.add('high-contrast');
        localStorage.setItem('carepill_contrast', 'true');
      } else {
        document.body.classList.remove('high-contrast');
        localStorage.setItem('carepill_contrast', 'false');
      }

      localStorage.setItem('carepill_speech', speechEnabled.toString());
    } catch (e) {
      console.warn(e);
    }
  }, [textSize, highContrast, speechEnabled]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--system-bg)' }}>
      
      {/* Toast Notification Bar */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '20px',
          zIndex: 120,
          background: 'var(--system-text)',
          color: 'var(--system-bg)',
          padding: '0.9rem 1.35rem',
          borderRadius: '20px',
          boxShadow: 'var(--shadow-lg)',
          fontWeight: 700,
          fontSize: '0.98rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          animation: 'fadeIn 0.25s ease'
        }}>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MODE 1: DAD'S ZERO-FRICTION 1-CARD VIEW */}
      {appMode === 'papa' ? (
        <main style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <SeniorPapaView
            medications={medications}
            takenSlots={takenSlots}
            onValidateSlot={handleValidateSlot}
            speakText={speakText}
            timeSlots={TIME_SLOTS}
            patientName={patientProfile.name}
            onSwitchToCaregiver={() => setShowPinModal(true)}
          />
        </main>
      ) : (
        /* MODE 2: CAREGIVER / ADMIN FULL HUB */
        <>
          {/* Header Bar for Caregiver Hub */}
          <Header
            activeTab={caregiverTab}
            setActiveTab={setCaregiverTab}
            speechEnabled={speechEnabled}
            setSpeechEnabled={setSpeechEnabled}
            highContrast={highContrast}
            setHighContrast={setHighContrast}
            textSize={textSize}
            setTextSize={setTextSize}
            patientName={patientProfile.name}
            onOpenOnboarding={() => setShowOnboarding(true)}
            onOpenPairing={() => setShowPairingModal(true)}
          />

          <main style={{ flex: 1, maxWidth: '1060px', width: '100%', margin: '0 auto', padding: '1.5rem 1rem' }}>
            
            {/* Back to Dad's Screen Button */}
            <div style={{ marginBottom: '1.25rem' }}>
              <button
                onClick={() => setAppMode('papa')}
                style={{
                  padding: '0.6rem 1.1rem',
                  borderRadius: '14px',
                  background: 'var(--system-card-bg)',
                  border: '1px solid var(--system-card-border)',
                  color: 'var(--accent-primary)',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <ArrowLeft size={18} /> Revenir à l'écran de {patientProfile.name}
              </button>
            </div>

            {/* Segmented control for Caregiver sub-features */}
            <div className="segmented-control" style={{ maxWidth: '680px', margin: '0 auto 1.5rem auto', width: '100%' }}>
              <button
                onClick={() => setCaregiverTab('dashboard')}
                className={`segmented-option ${caregiverTab === 'dashboard' ? 'active' : ''}`}
              >
                👥 Dashboard Proche
              </button>
              <button
                onClick={() => setCaregiverTab('scanner')}
                className={`segmented-option ${caregiverTab === 'scanner' ? 'active' : ''}`}
              >
                📸 Scan IA / Ordonnance
              </button>
              <button
                onClick={() => setCaregiverTab('handScanner')}
                className={`segmented-option ${caregiverTab === 'handScanner' ? 'active' : ''}`}
              >
                🖐️ Scan Main
              </button>
              <button
                onClick={() => setCaregiverTab('voiceAgent')}
                className={`segmented-option ${caregiverTab === 'voiceAgent' ? 'active' : ''}`}
              >
                🗣️ Voice AI
              </button>
              <button
                onClick={() => setCaregiverTab('report')}
                className={`segmented-option ${caregiverTab === 'report' ? 'active' : ''}`}
              >
                📄 Bilan PDF
              </button>
            </div>

            {caregiverTab === 'dashboard' && (
              <CaregiverView
                medications={medications}
                takenSlots={takenSlots}
                patientProfile={patientProfile}
                onUpdatePatientProfile={handleUpdatePatientProfile}
                symptomsLog={symptomsLog}
                onAddSymptom={handleAddSymptom}
                onSendNotification={handleSendNotification}
              />
            )}

            {caregiverTab === 'scanner' && (
              <IAScanner
                onImportMedications={(newMeds) => {
                  setMedications(prev => {
                    const existingNames = prev.map(m => m.name.toLowerCase());
                    const filteredNew = newMeds.filter(m => !existingNames.includes(m.name.toLowerCase()));
                    return [...filteredNew, ...prev];
                  });
                  setCaregiverTab('dashboard');
                  showToast("Ordonnance importée et planifiée dans le pilulier !");
                }}
              />
            )}

            {caregiverTab === 'handScanner' && (
              <HandPillScanner
                medications={medications}
                onValidateSlot={handleValidateSlot}
                speakText={speakText}
                timeSlots={TIME_SLOTS}
                patientName={patientProfile.name}
              />
            )}

            {caregiverTab === 'voiceAgent' && (
              <VoiceAssistantAgent
                medications={medications}
                onValidateSlot={handleValidateSlot}
                onAddSymptom={handleAddSymptom}
                speakText={speakText}
                timeSlots={TIME_SLOTS}
                patientName={patientProfile.name}
              />
            )}

            {caregiverTab === 'report' && (
              <DoctorReport
                patientProfile={patientProfile}
                medications={medications}
                symptomsLog={symptomsLog}
              />
            )}

          </main>
        </>
      )}

      {/* Onboarding Guide Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={handleCloseOnboarding}
        patientName={patientProfile.name}
      />

      {/* Real-time Family Pairing Modal */}
      <FamilyPairingModal
        isOpen={showPairingModal}
        onClose={() => setShowPairingModal(false)}
        onToast={showToast}
      />

      {/* Security PIN Lock Modal to Switch to Caregiver */}
      <PinCodeModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={() => {
          setShowPinModal(false);
          setAppMode('caregiver');
          showToast("🔓 Espace Proche / Aidant déverrouillé !");
        }}
      />

      {/* Compartment Sheet Popup */}
      <CompartmentModal
        modalData={activeModalData}
        onClose={() => setActiveModalData(null)}
        onValidateSlot={handleValidateSlot}
        speakText={speakText}
      />

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '1.5rem',
        borderTop: '1px solid var(--system-card-border)',
        fontSize: '0.85rem',
        color: 'var(--system-text-tertiary)',
        fontWeight: 600,
        background: 'var(--system-card-bg)'
      }}>
        CarePill AI © 2026 • Dissociated Senior / Caregiver Roles 🔒
      </footer>

    </div>
  );
}
