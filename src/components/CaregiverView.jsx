import React, { useState } from 'react';
import { Heart, CheckCircle2, AlertTriangle, BellRing, ShoppingBag, Plus, Activity, Calendar, ShieldCheck, Send, MessageSquare } from 'lucide-react';

export default function CaregiverView({ 
  medications, 
  takenSlots, 
  patientProfile, 
  symptomsLog, 
  onAddSymptom,
  onSendNotification 
}) {
  const [newSymptomDetail, setNewSymptomDetail] = useState('');
  const [newSymptomType, setNewSymptomType] = useState('Sensations');
  const [customMsg, setCustomMsg] = useState('');
  const [sentNotice, setSentNotice] = useState('');

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
    setSentNotice(`Message envoyé à Papa : "${txt}" ❤️`);
    setTimeout(() => setSentNotice(''), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }} className="animate-slide-up">
      
      {/* 1. CAREGIVER HEADER DASHBOARD */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        color: 'white',
        borderRadius: '28px',
        padding: '1.75rem',
        border: 'none',
        boxShadow: '0 16px 35px -8px rgba(15, 23, 42, 0.35)'
      }}>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span className="badge" style={{ background: '#38bdf8', color: '#0f172a', fontWeight: 800 }}>
                👥 Espace Proche & Aide-Soignant
              </span>
              <span style={{ fontSize: '0.85rem', opacity: 0.8, fontWeight: 600 }}>
                ● Connecté au pilulier en temps réel
              </span>
            </div>

            <h2 style={{ fontSize: '1.9rem', fontWeight: 800, fontFamily: 'var(--font-family-heading)', margin: 0, letterSpacing: '-0.02em' }}>
              Tableau de Bord Sérénité de {patientProfile.name}
            </h2>
            <p style={{ opacity: 0.9, marginTop: '0.35rem', fontSize: '1.05rem', fontWeight: 500 }}>
              Suivez l'observance du traitement de votre papa en direct.
            </p>
          </div>

          {/* Adherence Score Widget */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.15)',
            padding: '1.1rem 1.6rem',
            borderRadius: '20px',
            textAlign: 'center',
            minWidth: '180px'
          }}>
            <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', opacity: 0.8, fontWeight: 700, letterSpacing: '0.05em' }}>
              Observance
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#4ade80', fontFamily: 'var(--font-family-heading)', lineHeight: 1.1 }}>
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
          background: 'rgba(34, 197, 94, 0.15)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <CheckCircle2 size={22} color="#4ade80" flexShrink={0} />
          <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>
            Dernière activité : Papa a validé sa prise de comprimés du <strong>Matin à 08:12</strong>.
          </div>
        </div>

      </div>


      {/* 2. SEND A GENTLE MESSAGE TO PAPA */}
      <div className="card">
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-family-heading)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '-0.015em' }}>
          <MessageSquare size={22} color="var(--primary)" /> Envoyer un Message Doux à Papa
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', fontWeight: 500, marginBottom: '1.1rem' }}>
          Votre message s'affichera directement sur l'écran de son application sous forme d'un rappel bienveillant.
        </p>

        {sentNotice && (
          <div style={{ background: 'var(--success-light)', color: 'var(--success-dark)', padding: '0.75rem 1rem', borderRadius: '14px', fontWeight: 700, marginBottom: '1rem' }}>
            {sentNotice}
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginBottom: '1rem' }}>
          <button 
            onClick={() => handleQuickMsg("Bravo pour les cachets du matin ! Passé une belle journée ❤️")}
            style={{ padding: '0.6rem 0.95rem', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary-dark)', fontWeight: 700, border: '1px solid var(--primary)', fontSize: '0.9rem' }}
          >
            ❤️ Bravo pour ce matin !
          </button>
          <button 
            onClick={() => handleQuickMsg("N'oublie pas de bien boire un grand verre d'eau 💧")}
            style={{ padding: '0.6rem 0.95rem', borderRadius: '12px', background: '#f0f9ff', color: '#0369a1', fontWeight: 700, border: '1px solid #0284c7', fontSize: '0.9rem' }}
          >
            💧 Pense à bien boire de l'eau
          </button>
          <button 
            onClick={() => handleQuickMsg("Je passe te voir ce soir à 18h30 ! Grosses bises")}
            style={{ padding: '0.6rem 0.95rem', borderRadius: '12px', background: '#fffbeb', color: '#b45309', fontWeight: 700, border: '1px solid #f59e0b', fontSize: '0.9rem' }}
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
              border: '1px solid var(--card-border)',
              fontSize: '0.95rem',
              outline: 'none',
              background: 'var(--bg-main)'
            }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '0.8rem 1.35rem', borderRadius: '14px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Send size={18} /> Envoyer
          </button>
        </form>
      </div>


      {/* 3. PHARMACY REFILL TRACKER (STOCK DES BOÎTES) */}
      <div className="card">
        <div style={{ marginBottom: '1.1rem' }}>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-family-heading)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '-0.015em' }}>
            <ShoppingBag size={22} color="#f59e0b" /> Suivi du Stock Pharmacie & Renouvellements
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', fontWeight: 500, margin: '0.2rem 0 0 0' }}>
            Alertes de stock calculées automatiquement selon la posologie.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {medications.map((med) => {
            const daysLeft = Math.floor(med.stock / med.dailyDose);
            const isLowStock = daysLeft <= 7;

            return (
              <div key={med.id} style={{
                padding: '1.1rem',
                borderRadius: '18px',
                background: isLowStock ? '#fffbeb' : 'var(--bg-main)',
                border: isLowStock ? '1.5px solid #f59e0b' : '1px solid var(--card-border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>
                      {med.name} <span style={{ color: 'var(--primary)', fontSize: '0.92rem' }}>{med.dosage}</span>
                    </span>
                    {isLowStock && (
                      <span className="badge badge-warning">
                        ⚠️ Stock Faible
                      </span>
                    )}
                  </div>

                  <div style={{ margin: '0.75rem 0', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Stock : <strong>{med.stock} {med.unit}</strong> (~{daysLeft} jours)
                  </div>

                  {/* Progress bar */}
                  <div style={{ height: '7px', background: 'rgba(0,0,0,0.08)', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(100, (med.stock / med.totalStock) * 100)}%`,
                      background: isLowStock ? '#d97706' : 'var(--success)'
                    }} />
                  </div>
                </div>

                {isLowStock ? (
                  <button 
                    onClick={() => alert(`Rappel enregistré : Penser à faire renouveler l'ordonnance de ${med.name} à la pharmacie.`)}
                    style={{
                      padding: '0.55rem',
                      borderRadius: '12px',
                      background: '#f59e0b',
                      color: 'white',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      textAlign: 'center'
                    }}
                  >
                    🛒 Commander à la Pharmacie
                  </button>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--success-dark)', fontWeight: 700, textAlign: 'right' }}>
                    ✓ Stock Suffisant
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>


      {/* 4. HEALTH JOURNAL & SYMPTOMS LOG */}
      <div className="card">
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-family-heading)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '-0.015em' }}>
          <Activity size={22} color="#10b981" /> Journal des Symptômes & Tension
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', fontWeight: 500, marginBottom: '1.1rem' }}>
          Consignez les constantes pour la prochaine consultation médicale.
        </p>

        {/* Add Symptom Form */}
        <form onSubmit={handleAddSymptomSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginBottom: '1.25rem', background: 'var(--bg-main)', padding: '0.85rem', borderRadius: '16px', border: '1px solid var(--card-border)' }}>
          <select
            value={newSymptomType}
            onChange={(e) => setNewSymptomType(e.target.value)}
            style={{ padding: '0.65rem', borderRadius: '12px', border: '1px solid var(--card-border)', fontWeight: 700, fontSize: '0.9rem', outline: 'none' }}
          >
            <option value="Tension Artérielle">Tension Artérielle</option>
            <option value="Sensations">Sensations / Vertiges</option>
            <option value="Douleur">Douleur / Céphalée</option>
            <option value="Digestif">Problème Digestif</option>
          </select>

          <input
            type="text"
            placeholder="Détails (ex: Tension à 13/8)..."
            value={newSymptomDetail}
            onChange={(e) => setNewSymptomDetail(e.target.value)}
            style={{ flex: 1, minWidth: '200px', padding: '0.65rem 0.85rem', borderRadius: '12px', border: '1px solid var(--card-border)', fontSize: '0.9rem', outline: 'none' }}
          />

          <button type="submit" className="btn-success" style={{ padding: '0.65rem 1.1rem', borderRadius: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.9rem' }}>
            <Plus size={16} /> Ajouter
          </button>
        </form>

        {/* List of Logged Symptoms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {symptomsLog.map((item) => (
            <div key={item.id} style={{
              padding: '0.8rem 1rem',
              borderRadius: '14px',
              background: 'var(--bg-main)',
              border: '1px solid var(--card-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                  {item.date}
                </span>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>
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
