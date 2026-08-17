import React from 'react';
import { Download, Printer, FileText, CheckCircle2, User, Stethoscope, Calendar, ShieldCheck, Heart } from 'lucide-react';
import jsPDF from 'jspdf';

export default function DoctorReport({ patientProfile, medications, symptomsLog }) {
  
  const generatePDFReport = () => {
    const doc = new jsPDF();

    // Header Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(2, 132, 199); // Blue
    doc.text("RAPPORT DE SUIVI MÉDICAL & OBSERVANCE", 20, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} • CarePill AI`, 20, 27);

    // Patient Info Box
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(20, 32, 170, 28, 3, 3, "FD");

    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(`Patient : ${patientProfile.name} (73 ans)`, 25, 40);
    doc.text(`Médecin Traitant : ${patientProfile.doctor}`, 25, 47);
    doc.text(`Taux d'Observance Globale : ${patientProfile.adherenceScore}%`, 25, 54);
    doc.text(`Contact d'Urgence : ${patientProfile.emergencyContact}`, 105, 40);
    doc.text(`Allergies Connues : ${patientProfile.allergies.join(', ')}`, 105, 47);

    // Section 1: Active Treatments
    doc.setFontSize(14);
    doc.setTextColor(2, 132, 199);
    doc.text("1. Traitements Actuels & Schéma Posologique", 20, 70);

    let y = 78;
    medications.forEach((med, idx) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(`• ${med.name} ${med.dosage} (${med.form})`, 25, y);
      
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      doc.text(`Créneaux : ${med.timeSlots.join(', ')} | ${med.instructions}`, 25, y + 5);
      y += 12;
    });

    // Section 2: Symptoms & Vitals Log
    y += 5;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(2, 132, 199);
    doc.text("2. Relevés de Constant & Symptômes Récents", 20, y);

    y += 8;
    symptomsLog.forEach((item) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(15, 23, 42);
      doc.text(`[${item.date}] - ${item.type} : ${item.detail}`, 25, y);
      y += 6;
    });

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("Ce document est un relevé à l'attention exclusive du médecin traitant pour faciliter la consultation.", 20, 280);

    // Save PDF
    doc.save(`Bilan_Medical_${patientProfile.name.replace(' ', '_')}.pdf`);
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }} className="animate-slide-up">
      
      {/* Top Banner */}
      <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
            📄 Consultation Médecin Traitant
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-family-heading)', margin: 0 }}>
            Bilan de Consultation 1-Page
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500, marginTop: '0.2rem' }}>
            Imprimez ou téléchargez la synthèse complète du traitement de votre papa avant son rendez-vous chez le docteur.
          </p>
        </div>

        <button
          onClick={generatePDFReport}
          className="btn-giant btn-primary"
          style={{ padding: '1rem 1.5rem', fontSize: '1.1rem' }}
        >
          <Download size={22} /> Télécharger le PDF 📄
        </button>
      </div>


      {/* Document Sheet Preview */}
      <div className="card" style={{
        background: '#ffffff',
        border: '2px solid var(--border)',
        borderRadius: '20px',
        padding: '2.5rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
      }}>

        {/* PDF Header Preview */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--primary-light)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.4rem', fontFamily: 'var(--font-family-heading)' }}>
              RAPPORT DE SUIVI MÉDICAL & OBSERVANCE
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, marginTop: '0.2rem' }}>
              Délivré pour consultation médicale • CarePill AI
            </div>
          </div>
          <Stethoscope size={36} color="var(--primary)" />
        </div>

        {/* Patient Ident Card */}
        <div style={{
          background: 'var(--bg-main)',
          padding: '1.25rem',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.75rem'
        }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>PATIENT</span>
            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{patientProfile.name} (73 ans)</div>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>MÉDECIN TRAITANT</span>
            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{patientProfile.doctor}</div>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>OBSERVANCE MOYENNE</span>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--success)' }}>{patientProfile.adherenceScore}% (Excellente)</div>
          </div>
        </div>

        {/* Section 1: Active Treatments */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.85rem', fontFamily: 'var(--font-family-heading)' }}>
            1. Traitements Médicamenteux Actuels & Schéma Posologique
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {medications.map((med) => (
              <div key={med.id} style={{
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                background: 'var(--bg-main)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>
                    {med.name} <span style={{ color: 'var(--primary)' }}>{med.dosage}</span>
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '0.75rem', fontWeight: 600 }}>
                    ({med.form})
                  </span>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginTop: '0.2rem', fontWeight: 500 }}>
                    Créneaux : <strong>{med.timeSlots.join(', ')}</strong> • {med.instructions}
                  </div>
                </div>

                <span className="badge badge-success">Actif</span>
              </div>
            ))}
          </div>
        </div>


        {/* Section 2: Vitals & Symptoms */}
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.85rem', fontFamily: 'var(--font-family-heading)' }}>
            2. Relevés de Constant & Symptômes Récents Signalés
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {symptomsLog.map((s) => (
              <div key={s.id} style={{ fontSize: '0.95rem', padding: '0.5rem 0', borderBottom: '1px dashed var(--border)' }}>
                <strong>[{s.date}]</strong> — {s.type} : <span>{s.detail}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
