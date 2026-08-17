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

import { Hand, MessageSquare, Camera, Heart, FileText } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('pillbox'); // 'pillbox' | 'assistants' | 'caregiver'
  const [assistantSubTab, setAssistantSubTab] = useState('handScanner'); // 'handScanner' | 'voiceAgent' | 'scanner'
  const [caregiverSubTab, setCaregiverSubTab] = useState('dashboard'); // 'dashboard' | 'report'

  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [textSize, setTextSize] = useState(1);

  const [medications, setMedications] = useState(INITIAL_MEDICATIONS);
  const [symptomsLog, setSymptomsLog] = useState(INITIAL_SYMPTOMS_LOG);
  const [patientProfile, setPatientProfile] = useState(PATIENT_PROFILE);

  const [takenSlots, setTakenSlots] = useState(() => 
    CloudSyncService.getTakenSlots({ "mar-Matin": true })
  );

  const [activeModalData, setActiveModalData] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const unsubscribe = CloudSyncService.subscribeToUpdates(
      (updatedSlots) => {
        setTakenSlots(updatedSlots);
        showToast("⚡ Synchronisation pilulier mise à jour en direct !");
      },
      (noticeMsg) => {
        showToast(`Message de votre enfant : "${noticeMsg}"`);
        speakText(`Message de votre fils Thomas : ${noticeMsg}`);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--senior-scale', textSize);
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [textSize, highContrast]);

  const speakText = (text) => {
    if (!speechEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.92;
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
    showToast(`Message transmis à Papa : "${textMsg}"`);
    speakText(`Message de votre fils Thomas : ${textMsg}`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--system-bg)' }}>
      
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
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
          bottom: '88px',
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

      {/* Main Container */}
      <main style={{ flex: 1, maxWidth: '1060px', width: '100%', margin: '0 auto', padding: '1.5rem 1rem' }}>
        
        {/* TAB 1: PILULIER PAPA */}
        {activeTab === 'pillbox' && (
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

        {/* TAB 2: ASSISTANTS IA HUB */}
        {activeTab === 'assistants' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-slide-up">
            
            {/* Apple Segmented Control for Assistants */}
            <div className="segmented-control" style={{ maxWidth: '600px', margin: '0 auto 0.5rem auto', width: '100%' }}>
              <button
                onClick={() => setAssistantSubTab('handScanner')}
                className={`segmented-option ${assistantSubTab === 'handScanner' ? 'active' : ''}`}
              >
                🖐️ Scan Main
              </button>
              <button
                onClick={() => setAssistantSubTab('voiceAgent')}
                className={`segmented-option ${assistantSubTab === 'voiceAgent' ? 'active' : ''}`}
              >
                🗣️ Assistant Vocal
              </button>
              <button
                onClick={() => setAssistantSubTab('scanner')}
                className={`segmented-option ${assistantSubTab === 'scanner' ? 'active' : ''}`}
              >
                📷 Scan Ordonnance
              </button>
            </div>

            {assistantSubTab === 'handScanner' && (
              <HandPillScanner
                medications={medications}
                onValidateSlot={handleValidateSlot}
                speakText={speakText}
                timeSlots={TIME_SLOTS}
              />
            )}

            {assistantSubTab === 'voiceAgent' && (
              <VoiceAssistantAgent
                medications={medications}
                onValidateSlot={handleValidateSlot}
                onAddSymptom={handleAddSymptom}
                speakText={speakText}
                timeSlots={TIME_SLOTS}
              />
            )}

            {assistantSubTab === 'scanner' && (
              <IAScanner
                onImportMedications={(newMeds) => {
                  setMedications(newMeds);
                  setActiveTab('pillbox');
                  showToast("Ordonnance importée et planifiée dans le pilulier !");
                }}
              />
            )}

          </div>
        )}

        {/* TAB 3: PROCHE & MÉDECIN HUB */}
        {activeTab === 'caregiver' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-slide-up">
            
            {/* Apple Segmented Control for Proche & Doctor */}
            <div className="segmented-control" style={{ maxWidth: '420px', margin: '0 auto 0.5rem auto', width: '100%' }}>
              <button
                onClick={() => setCaregiverSubTab('dashboard')}
                className={`segmented-option ${caregiverSubTab === 'dashboard' ? 'active' : ''}`}
              >
                👥 Tableau Proche
              </button>
              <button
                onClick={() => setCaregiverSubTab('report')}
                className={`segmented-option ${caregiverSubTab === 'report' ? 'active' : ''}`}
              >
                📄 Bilan Médecin PDF
              </button>
            </div>

            {caregiverSubTab === 'dashboard' && (
              <CaregiverView
                medications={medications}
                takenSlots={takenSlots}
                patientProfile={patientProfile}
                symptomsLog={symptomsLog}
                onAddSymptom={handleAddSymptom}
                onSendNotification={handleSendNotification}
              />
            )}

            {caregiverSubTab === 'report' && (
              <DoctorReport
                patientProfile={patientProfile}
                medications={medications}
                symptomsLog={symptomsLog}
              />
            )}

          </div>
        )}

      </main>

      {/* Compartment Sheet Popup */}
      <CompartmentModal
        modalData={activeModalData}
        onClose={() => setActiveModalData(null)}
        onValidateSlot={handleValidateSlot}
        speakText={speakText}
      />

      {/* Mobile Tab Bar */}
      <nav className="mobile-tab-bar">
        <button
          onClick={() => setActiveTab('pillbox')}
          className={`mobile-tab-btn ${activeTab === 'pillbox' ? 'active' : ''}`}
        >
          <div className="nav-icon-container" style={{ fontSize: '1.3rem', lineHeight: 1 }}>🏠</div>
          <span>Pilulier</span>
        </button>

        <button
          onClick={() => setActiveTab('assistants')}
          className={`mobile-tab-btn ${activeTab === 'assistants' ? 'active' : ''}`}
        >
          <div className="nav-icon-container" style={{ fontSize: '1.3rem', lineHeight: 1 }}>✨</div>
          <span>Assistants IA</span>
        </button>

        <button
          onClick={() => setActiveTab('caregiver')}
          className={`mobile-tab-btn ${activeTab === 'caregiver' ? 'active' : ''}`}
        >
          <div className="nav-icon-container" style={{ fontSize: '1.3rem', lineHeight: 1 }}>👥</div>
          <span>Proche</span>
        </button>
      </nav>

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
