import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SeniorPapaView from './components/SeniorPapaView';
import CaregiverView from './components/CaregiverView';
import IAScanner from './components/IAScanner';
import HandPillScanner from './components/HandPillScanner';
import VoiceAssistantAgent from './components/VoiceAssistantAgent';
import DoctorReport from './components/DoctorReport';
import CompartmentModal from './components/CompartmentModal';

import { CloudSyncService } from './services/cloudSync';
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
  const [appMode, setAppMode] = useState('papa'); // 'papa' (Dad's 1-Card view) | 'caregiver' (Child/Admin hub)
  const [caregiverTab, setCaregiverTab] = useState('dashboard');

  // Accessibility State with LocalStorage Persistence
  const [speechEnabled, setSpeechEnabled] = useState(() => {
    return localStorage.getItem('carepill_speech') !== 'false';
  });
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('carepill_contrast') === 'true';
  });
  const [textSize, setTextSize] = useState(() => {
    return parseFloat(localStorage.getItem('carepill_textsize')) || 1;
  });

  const [medications, setMedications] = useState(INITIAL_MEDICATIONS);
  const [symptomsLog, setSymptomsLog] = useState(INITIAL_SYMPTOMS_LOG);

  // Dynamic Patient Profile with LocalStorage Persistence
  const [patientProfile, setPatientProfile] = useState(() => {
    const saved = localStorage.getItem('carepill_profile');
    return saved ? JSON.parse(saved) : PATIENT_PROFILE;
  });

  const [takenSlots, setTakenSlots] = useState(() => 
    CloudSyncService.getTakenSlots({ "mar-Matin": true })
  );

  const [activeModalData, setActiveModalData] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Check URL parameters for PWA Manifest Quick-Action Shortcut triggers
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');

    if (action && action.startsWith('validate_')) {
      const slotToValidate = action.replace('validate_', '');
      const dayKey = 'mar'; // Mardi

      handleValidateSlot(dayKey, slotToValidate);
      
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 }
      });

      speakText(`Raccourci exécuté : Traitement du ${slotToValidate} validé instantanément pour ${patientProfile.name} !`);
      showToast(`⚡ Validé via Raccourci Écran d'Accueil (${slotToValidate}) !`);

      // Clean up URL parameter
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = CloudSyncService.subscribeToUpdates(
      (updatedSlots) => {
        setTakenSlots(updatedSlots);
        showToast("⚡ Synchronisation pilulier mise à jour en direct !");
      },
      (noticeMsg) => {
        showToast(`Message de votre enfant : "${noticeMsg}"`);
        speakText(`Message pour ${patientProfile.name} : ${noticeMsg}`);
      }
    );
    return () => unsubscribe();
  }, [patientProfile.name]);

  useEffect(() => {
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
  }, [textSize, highContrast, speechEnabled]);

  const handleUpdatePatientProfile = (newProfile) => {
    setPatientProfile(newProfile);
    localStorage.setItem('carepill_profile', JSON.stringify(newProfile));
    showToast(`Fiche de ${newProfile.name} mise à jour avec succès !`);
  };

  const speakText = (text) => {
    if (!speechEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.92;

    // Highest quality French voice detection
    const voices = window.speechSynthesis.getVoices();
    const frVoice = voices.find(v => v.lang.includes('fr') || v.lang.includes('FR'));
    if (frVoice) {
      utterance.voice = frVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const handleValidateSlot = (dayKey, slotKey) => {
    const key = `${dayKey}-${slotKey}`;
    const newSlots = { ...takenSlots, [key]: true };
    
    setTakenSlots(newSlots);
    CloudSyncService.saveTakenSlots(newSlots);

    showToast(`✅ Case ${slotKey} du ${dayKey.toUpperCase()} certifiée et enregistrée !`);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleAddSymptom = (newSymptom) => {
    setSymptomsLog(prev => [newSymptom, ...prev]);
    showToast("Symptôme enregistré dans le journal de santé !");
  };

  const handleSendNotification = (textMsg) => {
    CloudSyncService.sendNotice(textMsg);
    showToast(`Message transmis à ${patientProfile.name} : "${textMsg}"`);
    speakText(`Message de votre enfant : ${textMsg}`);
  };

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
            onSwitchToCaregiver={() => setAppMode('caregiver')}
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
                <ArrowLeft size={18} /> Revenir à l'écran de {patientProfile.name} 👴
              </button>
            </div>

            {/* Segmented control for Caregiver sub-features */}
            <div className="segmented-control" style={{ maxWidth: '640px', margin: '0 auto 1.5rem auto', width: '100%' }}>
              <button
                onClick={() => setCaregiverTab('dashboard')}
                className={`segmented-option ${caregiverTab === 'dashboard' ? 'active' : ''}`}
              >
                👥 Dashboard Proche
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

            {caregiverTab === 'handScanner' && (
              <HandPillScanner
                medications={medications}
                onValidateSlot={handleValidateSlot}
                speakText={speakText}
                timeSlots={TIME_SLOTS}
              />
            )}

            {caregiverTab === 'voiceAgent' && (
              <VoiceAssistantAgent
                medications={medications}
                onValidateSlot={handleValidateSlot}
                onAddSymptom={handleAddSymptom}
                speakText={speakText}
                timeSlots={TIME_SLOTS}
              />
            )}

            {caregiverTab === 'scanner' && (
              <IAScanner
                onImportMedications={(newMeds) => {
                  setMedications(newMeds);
                  setCaregiverTab('dashboard');
                  showToast("Ordonnance importée et planifiée dans le pilulier !");
                }}
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
        CarePill AI © 2026 • Designed for Senior Care & Peace of Mind 💙
      </footer>

    </div>
  );
}
