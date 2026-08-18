import React, { useState } from 'react';
import { 
  Users, Activity, Bell, Calendar, ShieldCheck, Heart, AlertTriangle, 
  CheckCircle2, Plus, Edit3, MessageSquare, PhoneCall, QrCode, Sparkles, TrendingUp 
} from 'lucide-react';
import { PredictiveRiskService } from '../services/predictiveRiskService';
import PharmacyPassQR from './PharmacyPassQR';

export default function CaregiverView({ 
  medications = [], 
  takenSlots = {}, 
  patientProfile = {}, 
  onUpdatePatientProfile,
  symptomsLog = [],
  onAddSymptom,
  onSendNotification
}) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState(patientProfile);
  const [symptomInput, setSymptomInput] = useState({ text: '', severity: 'faible' });
  const [noticeMessageInput, setNoticeMessageInput] = useState('');

  // Calculate 7-day adherence statistics
  const slotsList = ['Matin', 'Midi', 'Soir', 'Nuit'];
  const totalSlotsWeek = 7 * slotsList.length;
  const takenSlotsCount = Object.keys(takenSlots || {}).length;
  const adherenceRate = Math.min(100, Math.round((takenSlotsCount / totalSlotsWeek) * 100));

  // Run AI Predictive Risk Analysis
  const riskAnalysis = PredictiveRiskService.analyzeHealthData(medications, takenSlots, symptomsLog);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    onUpdatePatientProfile(editedProfile);
    setIsEditingProfile(false);
  };

  const handleAddSymptomSubmit = (e) => {
    e.preventDefault();
    if (!symptomInput.text.trim()) return;

    onAddSymptom({
      id: Date.now(),
      date: new Date().toLocaleDateString('fr-FR'),
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      text: symptomInput.text,
      severity: symptomInput.severity
    });

    setSymptomInput({ text: '', severity: 'faible' });
  };

  const handleSendNoticeSubmit = (e) => {
    e.preventDefault();
    if (!noticeMessageInput.trim()) return;
    onSendNotification(noticeMessageInput);
    setNoticeMessageInput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-slide-up">
      
      {/* 🔮 1. PREDICTIVE HEALTH RISK AI CARD (HERO MINT/ICE CONTAINER) */}
      <div className="hero-challenge-card">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyBetween: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div className="badge-pill" style={{ background: '#FFFFFF', color: 'var(--header-blue-1)', marginBottom: '0.6rem', boxShadow: 'var(--shadow-card-master)' }}>
              <Sparkles size={16} color="var(--header-blue-1)" /> Moteur IA Prédictif de Santé
            </div>

            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 0.3rem 0', color: 'var(--text-main)' }}>
              {riskAnalysis.title}
            </h3>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 600, margin: '0 0 0.85rem 0' }}>
              {riskAnalysis.description}
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className={`badge-pill ${riskAnalysis.riskLevel === 'high' ? 'badge-danger' : riskAnalysis.riskLevel === 'medium' ? 'badge-warning' : 'badge-success'}`}>
                Niveau de Risque : {riskAnalysis.riskLevel.toUpperCase()}
              </span>
              <span className="badge-pill" style={{ background: '#FFFFFF', color: 'var(--text-main)' }}>
                Confiance IA : {riskAnalysis.confidence}%
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--header-blue-1)' }}>
              {adherenceRate}%
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Observance Hebdomadaire
            </div>
          </div>

        </div>
      </div>

      {/* 🧱 2. GRILLE DE CATÉGORIES (2 COLONNES) */}
      <div className="category-grid-2col">

        {/* Category Card 1: Observance (Cyan Accent) */}
        <div className="category-card">
          <div>
            <div className="icon-pod icon-pod-cyan">
              <Activity size={24} />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Observance du Traitement
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '0.25rem' }}>
              {takenSlotsCount} prises certifiées cette semaine.
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginTop: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Ratio Hebdo</span>
              <span style={{ color: 'var(--theme-cyan)' }}>{takenSlotsCount}/28</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill-cyan" style={{ width: `${adherenceRate}%` }} />
            </div>
          </div>
        </div>

        {/* Category Card 2: Fiche Patient (Yellow Accent) */}
        <div className="category-card">
          <div>
            <div className="icon-pod icon-pod-yellow">
              <Users size={24} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Fiche Patient & Contact
              </h4>
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                style={{ background: 'transparent', color: 'var(--theme-yellow)', fontWeight: 800, fontSize: '0.85rem' }}
              >
                {isEditingProfile ? 'Annuler' : 'Modifier'}
              </button>
            </div>
            
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '0.25rem' }}>
              {patientProfile.name} • {patientProfile.age} ans • Tél: {patientProfile.emergencyContact}
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginTop: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Mise à jour</span>
              <span style={{ color: 'var(--theme-yellow)' }}>Certifiée ✓</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill-yellow" style={{ width: '100%' }} />
            </div>
          </div>
        </div>

        {/* Category Card 3: Notifications Vocales (Pink Accent) */}
        <div className="category-card">
          <div>
            <div className="icon-pod icon-pod-pink">
              <MessageSquare size={24} />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Transmission d'Alerte Vocale
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '0.25rem' }}>
              Envoyer un encouragement ou rappel énoncé à voix haute.
            </p>
          </div>

          <form onSubmit={handleSendNoticeSubmit} style={{ marginTop: '0.85rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Message à lire à voix haute..."
                value={noticeMessageInput}
                onChange={(e) => setNoticeMessageInput(e.target.value)}
                style={{
                  flex: 1, padding: '0.55rem 0.85rem', borderRadius: '12px',
                  border: '1px solid var(--system-card-border)', background: 'var(--canvas-bg)',
                  fontSize: '0.85rem', fontWeight: 600
                }}
              />
              <button
                type="submit"
                className="btn-primary"
                style={{ padding: '0.55rem 1rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800, background: 'var(--theme-pink)' }}
              >
                Envoyer
              </button>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill-pink" style={{ width: '85%' }} />
            </div>
          </form>
        </div>

        {/* Category Card 4: Journal des Symptômes (Green Accent) */}
        <div className="category-card">
          <div>
            <div className="icon-pod icon-pod-green">
              <Heart size={24} />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Journal de Santé ({symptomsLog.length} entrées)
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '0.25rem' }}>
              Dernier symptôme : {symptomsLog[0]?.text || "Aucun symptôme signalé."}
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginTop: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Stabilité</span>
              <span style={{ color: 'var(--theme-green)' }}>Bonne (92%)</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill-green" style={{ width: '92%' }} />
            </div>
          </div>
        </div>

      </div>

      {/* 🏥 3. E-PHARMACY PASS QR CODE COMPONENT */}
      <PharmacyPassQR
        patientProfile={patientProfile}
        medications={medications}
      />

    </div>
  );
}
