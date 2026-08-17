import React, { useState } from 'react';
import { Heart, CheckCircle2, AlertTriangle, ShoppingBag, Plus, Activity, Send, MessageSquare, UserCheck, Edit3, Save, Sparkles, QrCode } from 'lucide-react';
import { PredictiveRiskService } from '../services/predictiveRiskService';
import PharmacyPassQR from './PharmacyPassQR';

export default function CaregiverView({ 
  medications, 
  takenSlots, 
  patientProfile,
  onUpdatePatientProfile,
  symptomsLog, 
  onAddSymptom,
  onSendNotification 
}) {
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState(patientProfile);
  const [showPharmacyPass, setShowPharmacyPass] = useState(false);

  const [newSymptomDetail, setNewSymptomDetail] = useState('');
  const [newSymptomType, setNewSymptomType] = useState('Sensations');
  const [customMsg, setCustomMsg] = useState('');
  const [sentNotice, setSentNotice] = useState('');

  // Generate predictive AI health risk alerts
  const riskAlerts = PredictiveRiskService.analyzeRiskProfile(patientProfile, medications, symptomsLog, takenSlots);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    onUpdatePatientProfile(profileForm);
    setEditingProfile(false);
  };

  const handleAddSymptomSubmit = (e) => {
    e.preventDefault();
    if (!newSymptomDetail.trim()) return;
    onAddSymptom({
      id: Date.now(),
      date: "Aujourd'hui, " + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      type: newSymptomType,
      detail: newSymptomDetail,
      status: newSymptomType === 'Tension Artérielle' ? 'normal' : 'warning'
    });
    setNewSymptomDetail('');
  };

  const handleQuickMsg = (txt) => {
    onSendNotification(txt);
    setSentNotice(`Message envoyé à ${patientProfile.name} : "${txt}" ❤️`);
    setTimeout(() => setSentNotice(''), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }} className="animate-slide-up">
      
      {/* 1. CAREGIVER HEADER DASHBOARD */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        color: '#ffffff',
        borderRadius: '28px',
        padding: '1.75rem',
        border: 'none',
        boxShadow: 'var(--shadow-lg)'
      }}>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span className="badge" style={{ background: '#38bdf8', color: '#0f172a', fontWeight: 800 }}>
                👥 Espace Proche & Aide-Soignant
              </span>
              <span style={{ fontSize: '0.85rem', opacity: 0.8, fontWeight: 600 }}>
                ● Connecté en direct
              </span>
            </div>

            <h2 style={{ fontSize: '1.9rem', fontWeight: 800, fontFamily: 'var(--font-display)', margin: 0, letterSpacing: '-0.02em' }}>
              Tableau de Bord Sérénité de {patientProfile.name}
            </h2>
            <p style={{ opacity: 0.9, marginTop: '0.35rem', fontSize: '1.05rem', fontWeight: 500 }}>
              Suivez l'observance du traitement en direct.
            </p>
          </div>

          {/* Adherence Score Widget */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '1.1rem 1.6rem',
            borderRadius: '20px',
            textAlign: 'center',
            minWidth: '180px'
          }}>
            <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', opacity: 0.8, fontWeight: 700, letterSpacing: '0.05em' }}>
              Observance
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#34c759', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>
              {patientProfile.adherenceScore}%
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, marginTop: '0.2rem' }}>
              Excellente régularité
            </div>
          </div>
        </div>

        {/* Live Status Notification Bar */}
        <div style={{
          marginTop: '1.25rem',
          padding: '0.85rem 1.1rem',
          borderRadius: '16px',
          background: 'rgba(52, 199, 89, 0.18)',
          border: '1px solid rgba(52, 199, 89, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <CheckCircle2 size={22} color="#34c759" flexShrink={0} />
          <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>
            Dernière activité : Prise des médicaments du <strong>Matin validée à 08:12</strong>.
          </div>
        </div>

      </div>


      {/* 2. PREDICTIVE HEALTH RISK AI ALERTS HUB */}
      {riskAlerts.length > 0 && (
        <div className="card" style={{ border: '2px solid var(--accent-warning)', background: 'var(--accent-warning-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
            <Sparkles size={24} color="var(--accent-warning)" />
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-display)', margin: 0, color: '#b45309' }}>
              IA Médicale Prédictive — Alertes de Vigilance ({riskAlerts.length})
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {riskAlerts.map(alert => (
              <div key={alert.id} style={{
                background: 'var(--system-card-bg)',
                padding: '1.1rem',
                borderRadius: '18px',
                border: '1px solid var(--system-card-border)'
              }}>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--system-text)', marginBottom: '0.25rem' }}>
                  {alert.title}
                </div>
                <div style={{ fontSize: '0.92rem', color: 'var(--system-text-secondary)', fontWeight: 600, marginBottom: '0.5rem' }}>
                  {alert.description}
                </div>
                <div style={{
                  background: 'var(--system-bg)',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '12px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: 'var(--accent-primary)',
                  border: '1px solid var(--system-card-border)'
                }}>
                  💡 Recommandation IA : {alert.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* 3. DYNAMIC PATIENT PROFILE CARD (EDITABLE) */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-display)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserCheck size={22} color="var(--accent-primary)" /> Fiche du Patient ({patientProfile.name})
            </h3>
            <p style={{ color: 'var(--system-text-secondary)', fontSize: '0.9rem', fontWeight: 500, margin: '0.2rem 0 0 0' }}>
              Personnalisez le nom et les coordonnées médicales du patient.
            </p>
          </div>

          {!editingProfile && (
            <button
              onClick={() => setEditingProfile(true)}
              style={{
                padding: '0.5rem 0.95rem',
                borderRadius: '12px',
                background: 'var(--accent-primary-light)',
                color: 'var(--accent-primary)',
                fontWeight: 800,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Edit3 size={16} /> Modifier Fiche
            </button>
          )}
        </div>

        {editingProfile ? (
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--system-bg)', padding: '1.25rem', borderRadius: '20px', border: '1px solid var(--system-card-border)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--system-text-secondary)' }}>Nom complet du patient</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '12px', border: '1px solid var(--system-card-border)', fontWeight: 700, marginTop: '0.25rem', outline: 'none' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--system-text-secondary)' }}>Âge</label>
                <input
                  type="number"
                  value={profileForm.age}
                  onChange={(e) => setProfileForm({ ...profileForm, age: parseInt(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '12px', border: '1px solid var(--system-card-border)', fontWeight: 700, marginTop: '0.25rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--system-text-secondary)' }}>Médecin Traitant</label>
                <input
                  type="text"
                  value={profileForm.doctor}
                  onChange={(e) => setProfileForm({ ...profileForm, doctor: e.target.value })}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '12px', border: '1px solid var(--system-card-border)', fontWeight: 700, marginTop: '0.25rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--system-text-secondary)' }}>Contact Proche Urgence</label>
                <input
                  type="text"
                  value={profileForm.emergencyContact}
                  onChange={(e) => setProfileForm({ ...profileForm, emergencyContact: e.target.value })}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '12px', border: '1px solid var(--system-card-border)', fontWeight: 700, marginTop: '0.25rem', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setEditingProfile(false)}
                style={{ padding: '0.65rem 1.1rem', borderRadius: '12px', background: 'transparent', color: 'var(--system-text-secondary)', fontWeight: 700 }}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn-primary"
                style={{ padding: '0.65rem 1.35rem', borderRadius: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Save size={16} /> Enregistrer la Fiche
              </button>
            </div>
          </form>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: 'var(--system-bg)', padding: '1rem 1.25rem', borderRadius: '18px', border: '1px solid var(--system-card-border)' }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--system-text-secondary)', fontWeight: 700 }}>Nom & Âge</div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{patientProfile.name} ({patientProfile.age} ans)</div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--system-text-secondary)', fontWeight: 700 }}>Médecin Referent</div>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>{patientProfile.doctor}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--system-text-secondary)', fontWeight: 700 }}>Contact Urgence</div>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>{patientProfile.emergencyContact}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--system-text-secondary)', fontWeight: 700 }}>Allergies Notées</div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--accent-danger)' }}>{patientProfile.allergies.join(', ')}</div>
            </div>
          </div>
        )}
      </div>


      {/* 4. PASS E-PHARMACIE QR HUB */}
      <PharmacyPassQR patientProfile={patientProfile} medications={medications} />


      {/* 5. SEND A GENTLE MESSAGE TO PAPA */}
      <div className="card">
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageSquare size={22} color="var(--accent-primary)" /> Envoyer un Message Doux à {patientProfile.name}
        </h3>
        <p style={{ color: 'var(--system-text-secondary)', fontSize: '0.92rem', fontWeight: 500, marginBottom: '1.1rem' }}>
          Votre message s'affichera directement sur son écran sous forme d'un rappel bienveillant.
        </p>

        {sentNotice && (
          <div style={{ background: 'var(--accent-success-light)', color: 'var(--accent-success)', padding: '0.75rem 1rem', borderRadius: '14px', fontWeight: 700, marginBottom: '1rem' }}>
            {sentNotice}
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginBottom: '1rem' }}>
          <button 
            onClick={() => handleQuickMsg("Bravo pour les cachets du matin ! Passe une belle journée ❤️")}
            style={{ padding: '0.6rem 0.95rem', borderRadius: '12px', background: 'var(--accent-primary-light)', color: 'var(--accent-primary)', fontWeight: 700, border: '1px solid var(--accent-primary)', fontSize: '0.9rem' }}
          >
            ❤️ Bravo pour ce matin !
          </button>
          <button 
            onClick={() => handleQuickMsg("N'oublie pas de bien boire un grand verre d'eau 💧")}
            style={{ padding: '0.6rem 0.95rem', borderRadius: '12px', background: 'var(--accent-primary-light)', color: 'var(--accent-primary)', fontWeight: 700, border: '1px solid var(--accent-primary)', fontSize: '0.9rem' }}
          >
            💧 Pense à bien boire de l'eau
          </button>
          <button 
            onClick={() => handleQuickMsg("Je passe te voir ce soir à 18h30 ! Grosses bises")}
            style={{ padding: '0.6rem 0.95rem', borderRadius: '12px', background: 'var(--accent-warning-light)', color: 'var(--accent-warning)', fontWeight: 700, border: '1px solid var(--accent-warning)', fontSize: '0.9rem' }}
          >
            👋 Je passe te voir ce soir !
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); if (customMsg.trim()) { handleQuickMsg(customMsg); setCustomMsg(''); } }} style={{ display: 'flex', gap: '0.65rem' }}>
          <input
            type="text"
            placeholder="Écrire un message personnalisé..."
            value={customMsg}
            onChange={(e) => setCustomMsg(e.target.value)}
            style={{
              flex: 1,
              padding: '0.8rem 1rem',
              borderRadius: '14px',
              border: '1px solid var(--system-card-border)',
              fontSize: '0.95rem',
              outline: 'none',
              background: 'var(--system-bg)'
            }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '0.8rem 1.35rem', borderRadius: '14px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Send size={18} /> Envoyer
          </button>
        </form>
      </div>


      {/* 6. HEALTH JOURNAL & SYMPTOMS LOG */}
      <div className="card">
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={22} color="var(--accent-success)" /> Journal des Symptômes & Tension
        </h3>
        <p style={{ color: 'var(--system-text-secondary)', fontSize: '0.92rem', fontWeight: 500, marginBottom: '1.1rem' }}>
          Consignez les constantes pour la prochaine consultation médicale.
        </p>

        <form onSubmit={handleAddSymptomSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginBottom: '1.25rem', background: 'var(--system-bg)', padding: '0.85rem', borderRadius: '18px', border: '1px solid var(--system-card-border)' }}>
          <select
            value={newSymptomType}
            onChange={(e) => setNewSymptomType(e.target.value)}
            style={{ padding: '0.65rem', borderRadius: '12px', border: '1px solid var(--system-card-border)', fontWeight: 700, fontSize: '0.9rem', outline: 'none' }}
          >
            <option value="Tension Artérielle">Tension Artérielle</option>
            <option value="Sensations">Sensations / Vertiges</option>
            <option value="Douleur">Douleur / Céphalée</option>
            <option value="Digestif">Problème Digestif</option>
          </select>

          <input
            type="text"
            placeholder="Détails (ex: Vertige après marche)..."
            value={newSymptomDetail}
            onChange={(e) => setNewSymptomDetail(e.target.value)}
            style={{ flex: 1, minWidth: '200px', padding: '0.65rem 0.85rem', borderRadius: '12px', border: '1px solid var(--system-card-border)', fontSize: '0.9rem', outline: 'none' }}
          />

          <button type="submit" className="btn-success" style={{ padding: '0.65rem 1.1rem', borderRadius: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.9rem' }}>
            <Plus size={16} /> Ajouter
          </button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {symptomsLog.map((item) => (
            <div key={item.id} style={{
              padding: '0.85rem 1.1rem',
              borderRadius: '16px',
              background: 'var(--system-bg)',
              border: '1px solid var(--system-card-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--system-text-secondary)', fontWeight: 700 }}>
                  {item.date}
                </span>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--system-text)' }}>
                  {item.type} : <span style={{ fontWeight: 600 }}>{item.detail}</span>
                </div>
              </div>

              <span className={`badge ${item.status === 'normal' ? 'badge-success' : 'badge-warning'}`}>
                {item.status === 'normal' ? '✓ Normal' : '⚠️ À surveiller'}
              </span>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
