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

export default function App() {
  const [currentTab, setCurrentTab] = useState('papa'); // 'papa' | 'voiceAgent' | 'handScanner' | 'caregiver' | 'scanner' | 'report'
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [textSize, setTextSize] = useState(1); // 1 = 100%, 1.15 = 115%

  const [medications, setMedications] = useState(INITIAL_MEDICATIONS);
  const [symptomsLog, setSymptomsLog] = useState(INITIAL_SYMPTOMS_LOG);
  const [patientProfile, setPatientProfile] = useState(PATIENT_PROFILE);

  // Taken slots initialized from Cloud/LocalStorage persistence
  const [takenSlots, setTakenSlots] = useState(() => 
    CloudSyncService.getTakenSlots({ "mar-Matin": true })
  );

  const [activeModalData, setActiveModalData] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Subscribe to real-time cloud/multi-tab sync
  useEffect(() => {
    const unsubscribe = CloudSyncService.subscribeToUpdates(
      (updatedSlots) => {
        setTakenSlots(updatedSlots);
        showToast("⚡ Mise à jour du pilulier reçue en direct du cloud !");
      },
      (noticeMsg) => {
        showToast(`Message de votre enfant reçu : "${noticeMsg}"`);
        speakText(`Message de votre fils Thomas : ${noticeMsg}`);
      }
    );
    return () => unsubscribe();
  }, []);

  // Apply high contrast and font scaling to root
  useEffect(() => {
    document.documentElement.style.setProperty('--senior-scale', textSize);
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [textSize, highContrast]);

  // Speech synthesis helper
  const speakText = (text) => {
    if (!speechEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // Cancel any current speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.92; // Slightly slower for elderly comprehension
    window.speechSynthesis.speak(utterance);
  };

  const handleValidateSlot = (dayKey, slotKey) => {
    const key = `${dayKey}-${slotKey}`;
    const newSlots = { ...takenSlots, [key]: true };
    
    setTakenSlots(newSlots);
    CloudSyncService.saveTakenSlots(newSlots);

    // Show toast
    showToast(`✅ Case ${slotKey} du ${dayKey.toUpperCase()} certifiée et enregistrée avec succès !`);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleAddSymptom = (newSymptom) => {
    setSymptomsLog(prev => [newSymptom, ...prev]);
    showToast("Symptôme / Tension enregistré pour le médecin !");
  };

  const handleSendNotification = (textMsg) => {
    CloudSyncService.sendNotice(textMsg);
    showToast(`Message transmis à Papa : "${textMsg}"`);
    speakText(`Message de votre fils Thomas : ${textMsg}`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
      
      {/* Header Accessibility Bar & Navigation */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        speechEnabled={speechEnabled}
        setSpeechEnabled={setSpeechEnabled}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        textSize={textSize}
        setTextSize={setTextSize}
        patientName={patientProfile.name}
      />

      {/* Toast Notification Bar */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 120,
          background: 'var(--text-main)',
          color: 'var(--bg-main)',
          padding: '1rem 1.5rem',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
          fontWeight: 800,
          fontSize: '1.05rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          animation: 'slide-up 0.3s ease'
        }}>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Page Container */}
      <main style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '1.5rem 1.25rem' }}>
        
        {currentTab === 'papa' && (
          <SeniorPapaView
            medications={medications}
            takenSlots={takenSlots}
            onValidateSlot={handleValidateSlot}
            onOpenCompartment={(dayLabel, slotKey, meds, isTaken) => {
              setActiveModalData({ dayLabel, slotKey, meds, isTaken });
            }}
            speakText={speakText}
            timeSlots={TIME_SLOTS}
            daysOfWeek={DAYS_OF_WEEK}
          />
        )}

        {currentTab === 'voiceAgent' && (
          <VoiceAssistantAgent
            medications={medications}
            onValidateSlot={handleValidateSlot}
            onAddSymptom={handleAddSymptom}
            speakText={speakText}
            timeSlots={TIME_SLOTS}
          />
        )}

        {currentTab === 'handScanner' && (
          <HandPillScanner
            medications={medications}
            onValidateSlot={handleValidateSlot}
            speakText={speakText}
            timeSlots={TIME_SLOTS}
          />
        )}

        {currentTab === 'caregiver' && (
          <CaregiverView
            medications={medications}
            takenSlots={takenSlots}
            patientProfile={patientProfile}
            symptomsLog={symptomsLog}
            onAddSymptom={handleAddSymptom}
            onSendNotification={handleSendNotification}
          />
        )}

        {currentTab === 'scanner' && (
          <IAScanner
            onImportMedications={(newMeds) => {
              setMedications(newMeds);
              setCurrentTab('papa');
              showToast("Ordonnance intégrée avec succès au pilulier !");
            }}
          />
        )}

        {currentTab === 'report' && (
          <DoctorReport
            patientProfile={patientProfile}
            medications={medications}
            symptomsLog={symptomsLog}
          />
        )}

      </main>

      {/* Compartment Modal popup */}
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
        borderTop: '1px solid var(--border)',
        fontSize: '0.88rem',
        color: 'var(--text-muted)',
        fontWeight: 600,
        background: 'var(--card-bg)'
      }}>
        CarePill AI © 2026 • PWA & Voice AI Active • Développé avec amour pour Papa 💙
      </footer>

    </div>
  );
}
