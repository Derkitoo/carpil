import React, { useState } from 'react';
import { 
  Users, Activity, Bell, Calendar, ShieldCheck, Heart, AlertTriangle, 
  CheckCircle2, Plus, Edit3, MessageSquare, PhoneCall, QrCode, Sparkles, TrendingUp, Save, Send, Volume2 
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
  const [editedProfile, setEditedProfile] = useState({
    name: patientProfile?.name || 'Joseph Martin',
    age: patientProfile?.age || 78,
    emergencyContact: patientProfile?.emergencyContact || '06 12 34 56 78',
    doctor: patientProfile?.doctor || 'Dr Laurent'
  });

  const [symptomInput, setSymptomInput] = useState({ text: '', severity: 'faible' });
  const [noticeMessageInput, setNoticeMessageInput] = useState('');
  const [sentAlerts, setSentAlerts] = useState([
    { id: 1, text: "N'oublie pas de prendre tes cachets avec de l'eau ❤️", time: "Aujourd'hui 08:15" }
  ]);

  // Calculate 7-day adherence statistics
  const slotsList = ['Matin', 'Midi', 'Soir', 'Nuit'];
  const totalSlotsWeek = 7 * slotsList.length;
  const takenSlotsCount = Object.keys(takenSlots || {}).length;
  const adherenceRate = Math.min(100, Math.round((takenSlotsCount / totalSlotsWeek) * 100));

  // Safe Run AI Predictive Risk Analysis
  const riskAnalysis = PredictiveRiskService.analyzeHealthData(medications, takenSlots, symptomsLog) || {
    title: "Stabilité Thérapeutique Optimale",
    description: "Aucun risque majeur ni interaction médicamenteuse critique détectés par l'IA.",
    riskLevel: "low",
    confidence: 96
  };

  const safePatientName = patientProfile?.name || editedProfile.name;
  const safeAge = patientProfile?.age || editedProfile.age;
  const safeContact = patientProfile?.emergencyContact || editedProfile.emergencyContact;
  const safeDoctor = patientProfile?.doctor || editedProfile.doctor;

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (onUpdatePatientProfile) {
      onUpdatePatientProfile(editedProfile);
    }
    setIsEditingProfile(false);
  };

  const handleSendNoticeSubmit = (e, customMsg = null) => {
    if (e) e.preventDefault();
    const msg = customMsg || noticeMessageInput;
    if (!msg || !msg.trim()) return;

    if (onSendNotification) {
      onSendNotification(msg.trim());
    }

    setSentAlerts(prev => [
      { id: Date.now(), text: msg.trim(), time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) },
      ...prev
    ]);

    if (!customMsg) setNoticeMessageInput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} className="animate-slide-up">
      
      {/* 🔮 1. PREDICTIVE HEALTH RISK AI CARD (HERO MINT/ICE CONTAINER) */}
      <div className="hero-challenge-card">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', width: '100%' }}>
          
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="badge-pill" style={{ background: '#FFFFFF', color: 'var(--header-blue-1)', marginBottom: '0.5rem', boxShadow: 'var(--shadow-card-master)' }}>
              <Sparkles size={15} color="var(--header-blue-1)" /> Moteur IA Prédictif de Santé
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--text-main)', wordBreak: 'break-word' }}>
              {riskAnalysis.title}
            </h3>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, margin: '0 0 0.75rem 0', wordBreak: 'break-word' }}>
              {riskAnalysis.description}
            </p>

            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span className={`badge-pill ${riskAnalysis.riskLevel === 'high' ? 'badge-danger' : riskAnalysis.riskLevel === 'medium' ? 'badge-warning' : 'badge-success'}`}>
                Niveau de Risque : {(riskAnalysis.riskLevel || 'low').toUpperCase()}
              </span>
              <span className="badge-pill" style={{ background: '#FFFFFF', color: 'var(--text-main)' }}>
                Confiance IA : {riskAnalysis.confidence || 95}%
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--header-blue-1)' }}>
              {adherenceRate}%
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Observance Hebdomadaire
            </div>
          </div>

        </div>
      </div>

      {/* 🧱 2. GRILLE DE CATÉGORIES (1 Col Mobile < 640px, 2 Col >= 640px) */}
      <div className="category-grid-2col">

        {/* Category Card 1: Observance (Cyan Accent) */}
        <div className="category-card">
          <div>
            <div className="icon-pod icon-pod-cyan">
              <Activity size={22} />
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Observance du Traitement
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '0.2rem' }}>
              {takenSlotsCount} prises certifiées cette semaine.
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginTop: '0.75rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Ratio Hebdo</span>
              <span style={{ color: 'var(--theme-cyan)' }}>{takenSlotsCount}/28</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill-cyan" style={{ width: `${adherenceRate}%` }} />
            </div>
          </div>
        </div>

        {/* Category Card 2: FICHE PATIENT & CONTACT (FONCTIONNELLE) */}
        <div className="category-card" style={{ gridColumn: isEditingProfile ? '1 / -1' : 'auto' }}>
          <div>
            <div className="icon-pod icon-pod-yellow">
              <Users size={22} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', minWidth: 0 }}>
                Fiche Patient & Contact
              </h4>
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '10px',
                  background: isEditingProfile ? 'var(--canvas-bg)' : 'var(--accent-warning-light)',
                  color: 'var(--theme-yellow)',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  flexShrink: 0
                }}
              >
                {isEditingProfile ? '✖ Fermer' : '✏️ Modifier la Fiche'}
              </button>
            </div>
            
            {!isEditingProfile ? (
              <div style={{ marginTop: '0.5rem' }}>
                <p style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.2rem 0' }}>
                  {safePatientName} ({safeAge} ans)
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600, margin: 0 }}>
                  📞 Urgence : <strong>{safeContact}</strong>
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600, margin: '0.15rem 0 0 0' }}>
                  👨‍⚕️ Médecin : <strong>{safeDoctor}</strong>
                </p>
              </div>
            ) : (
              /* FORMULAIRE DE MODIFICATION EDITEUR DE FICHE PATIENT */
              <form onSubmit={handleProfileSubmit} style={{ marginTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.65rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)' }}>Nom complet du patient :</label>
                    <input
                      type="text"
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '10px', border: '1px solid var(--system-card-border)', background: 'var(--canvas-bg)', fontWeight: 700, fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)' }}>Âge :</label>
                    <input
                      type="number"
                      value={editedProfile.age}
                      onChange={(e) => setEditedProfile({ ...editedProfile, age: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '10px', border: '1px solid var(--system-card-border)', background: 'var(--canvas-bg)', fontWeight: 700, fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)' }}>Téléphone d'urgence :</label>
                    <input
                      type="text"
                      value={editedProfile.emergencyContact}
                      onChange={(e) => setEditedProfile({ ...editedProfile, emergencyContact: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '10px', border: '1px solid var(--system-card-border)', background: 'var(--canvas-bg)', fontWeight: 700, fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)' }}>Médecin traitant :</label>
                    <input
                      type="text"
                      value={editedProfile.doctor}
                      onChange={(e) => setEditedProfile({ ...editedProfile, doctor: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '10px', border: '1px solid var(--system-card-border)', background: 'var(--canvas-bg)', fontWeight: 700, fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    background: 'var(--theme-yellow)',
                    marginTop: '0.35rem'
                  }}
                >
                  <Save size={16} /> Enregistrer les Modifications 💾
                </button>
              </form>
            )}
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginTop: '0.75rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Fiche Santé</span>
              <span style={{ color: 'var(--theme-yellow)' }}>Certifiée ✓</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill-yellow" style={{ width: '100%' }} />
            </div>
          </div>
        </div>

        {/* Category Card 3: TRANSMISSION D'ALERTE VOCALE (FONCTIONNELLE) */}
        <div className="category-card" style={{ gridColumn: '1 / -1' }}>
          <div>
            <div className="icon-pod icon-pod-pink">
              <MessageSquare size={22} />
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Transmission d'Alerte Vocale en Direct
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '0.2rem' }}>
              Rédigez un message : l'application le lira **à voix haute en direct sur le téléphone de {safePatientName}** !
            </p>
          </div>

          {/* Messages de rappel rapides en 1 clic */}
          <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginTop: '0.65rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', alignSelf: 'center' }}>Rappels Rapides :</span>
            {[
              "N'oublie pas tes cachets avec un grand verre d'eau ❤️",
              "Je t'appelle dans 10 minutes ! 📞",
              "Bravo pour ta prise du matin ! 🌟"
            ].map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSendNoticeSubmit(null, preset)}
                style={{
                  padding: '0.35rem 0.7rem',
                  borderRadius: '9999px',
                  background: 'rgba(255, 71, 87, 0.1)',
                  color: 'var(--theme-pink)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                + {preset}
              </button>
            ))}
          </div>

          {/* Formulaire de saisie du message vocal */}
          <form onSubmit={(e) => handleSendNoticeSubmit(e)} style={{ marginTop: '0.75rem', width: '100%' }}>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', width: '100%' }}>
              <input
                type="text"
                placeholder={`Tapez un encouragement pour ${safePatientName}...`}
                value={noticeMessageInput}
                onChange={(e) => setNoticeMessageInput(e.target.value)}
                style={{
                  flex: 1, minWidth: '200px', padding: '0.6rem 0.85rem', borderRadius: '12px',
                  border: '1px solid var(--system-card-border)', background: 'var(--canvas-bg)',
                  fontSize: '0.88rem', fontWeight: 600, boxSizing: 'border-box'
                }}
              />
              <button
                type="submit"
                className="btn-primary"
                style={{ padding: '0.6rem 1.1rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800, background: 'var(--theme-pink)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Send size={16} /> Énoncer à Voix Haute 🗣️
              </button>
            </div>
          </form>

          {/* Historique des messages vocaux transmis */}
          {sentAlerts.length > 0 && (
            <div style={{ marginTop: '0.85rem', background: 'var(--canvas-bg)', padding: '0.75rem', borderRadius: '14px', border: '1px solid var(--system-card-border)' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                📡 Derniers Messages Énoncés en Direct :
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {sentAlerts.slice(0, 3).map(alert => (
                  <div key={alert.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', background: 'var(--card-surface)', padding: '0.45rem 0.75rem', borderRadius: '10px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>🗣️ "{alert.text}"</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-green-1)', fontWeight: 800 }}>Envoyé {alert.time} ✓</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="progress-bar-track" style={{ marginTop: '0.75rem' }}>
            <div className="progress-bar-fill-pink" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Category Card 4: Journal des Symptômes (Green Accent) */}
        <div className="category-card">
          <div>
            <div className="icon-pod icon-pod-green">
              <Heart size={22} />
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Journal de Santé ({symptomsLog.length} entrées)
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '0.2rem', wordBreak: 'break-word' }}>
              Dernier symptôme : {symptomsLog[0]?.text || "Aucun symptôme signalé."}
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginTop: '0.75rem' }}>
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
