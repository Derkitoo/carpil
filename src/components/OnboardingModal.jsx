import React, { useState } from 'react';
import { Pill, Heart, CheckCircle2, ShieldCheck, Sparkles, ChevronRight, X } from 'lucide-react';

export default function OnboardingModal({ isOpen, onClose, patientName }) {
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const slides = [
    {
      title: `Bienvenue sur CarePill AI 💊`,
      subtitle: `L'application de suivi médical pensée pour la sérénité de ${patientName} et de ses proches.`,
      icon: <Pill size={48} color="var(--accent-primary)" />,
      badge: "Pensé pour la Polymédication",
      content: (
        <div style={{ textAlign: 'center', color: 'var(--system-text-secondary)', fontSize: '0.98rem', fontWeight: 600, lineHeight: 1.5 }}>
          Une interface épurée, sans superflu, qui élimine le risque d'erreur ou d'oubli de prise de médicaments.
        </div>
      )
    },
    {
      title: `1 Écran Unique pour ${patientName} 👴`,
      subtitle: `0 menu, 0 onglet compliqué. Interaction en 3 secondes chrono !`,
      icon: <CheckCircle2 size={48} color="var(--accent-success)" />,
      badge: "Simplicité Absolue",
      content: (
        <div style={{ textAlign: 'center', color: 'var(--system-text-secondary)', fontSize: '0.98rem', fontWeight: 600, lineHeight: 1.5 }}>
          L'application détecte automatiquement le créneau courant (Matin, Midi, Soir) et propose un <strong>Unique Bouton Vert Géant 🟢</strong> pour valider sa prise.
        </div>
      )
    },
    {
      title: `Supervision Proche & IA 👥`,
      subtitle: `Suivi en temps réel et bilan médical à portée de main.`,
      icon: <ShieldCheck size={48} color="var(--accent-primary)" />,
      badge: "Sérénité Familiale",
      content: (
        <div style={{ textAlign: 'center', color: 'var(--system-text-secondary)', fontSize: '0.98rem', fontWeight: 600, lineHeight: 1.5 }}>
          Accédez au tableau d'observance, envoyez des mots doux à {patientName}, scannez des ordonnances et générez un bilan PDF pour le médecin.
        </div>
      )
    }
  ];

  const currentSlide = slides[step - 1];

  return (
    <div className="modal-backdrop">
      <div className="modal-content animate-slide-up" style={{ textAlign: 'center', position: 'relative' }}>
        
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'var(--system-bg)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--system-text-secondary)'
          }}
        >
          <X size={20} />
        </button>

        {/* Icon & Badge */}
        <div style={{ marginBottom: '1rem', marginTop: '0.5rem' }}>
          <div style={{
            width: '88px',
            height: '88px',
            borderRadius: '28px',
            background: 'var(--system-bg)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '0.75rem'
          }}>
            {currentSlide.icon}
          </div>
          <div>
            <span className="badge badge-primary">{currentSlide.badge}</span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-display)', margin: '0.5rem 0 0.35rem 0' }}>
          {currentSlide.title}
        </h2>
        <p style={{ color: 'var(--system-text)', fontWeight: 700, fontSize: '1.05rem', marginBottom: '1rem' }}>
          {currentSlide.subtitle}
        </p>

        {/* Slide Content */}
        <div style={{ background: 'var(--system-bg)', padding: '1.1rem', borderRadius: '20px', marginBottom: '1.5rem', border: '1px solid var(--system-card-border)' }}>
          {currentSlide.content}
        </div>

        {/* Step Indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {slides.map((_, idx) => (
            <div
              key={idx}
              style={{
                width: idx + 1 === step ? '28px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: idx + 1 === step ? 'var(--accent-primary)' : 'var(--system-card-border)',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              style={{
                padding: '0.85rem 1.25rem',
                borderRadius: '16px',
                background: 'var(--system-bg)',
                color: 'var(--system-text)',
                fontWeight: 700,
                border: '1px solid var(--system-card-border)'
              }}
            >
              Précédent
            </button>
          )}

          {step < slides.length ? (
            <button
              onClick={() => setStep(step + 1)}
              className="btn-primary"
              style={{ flex: 1, padding: '0.85rem 1.5rem', borderRadius: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
            >
              Suivant <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="btn-success"
              style={{ flex: 1, padding: '0.85rem 1.5rem', borderRadius: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
            >
              Découvrir CarePill AI 🚀
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
