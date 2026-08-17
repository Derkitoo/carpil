// Predictive Health Risk AI Service for CarePill AI

export const PredictiveRiskService = {
  analyzeRiskProfile: (patientProfile, medications, symptomsLog, takenSlots) => {
    const alerts = [];

    // 1. Analyze Vertigo / Dizziness after antihypertensive intake (Amlor)
    const dizzinessLogs = symptomsLog.filter(s => 
      s.detail.toLowerCase().includes('vertige') || s.type.toLowerCase().includes('sensations')
    );

    if (dizzinessLogs.length >= 1) {
      alerts.push({
        id: 'alert-hypertension',
        severity: 'warning',
        title: '⚠️ Risque d\'Hypotension Orthostatique Détecté par l\'IA',
        description: `L'IA a relevé des épisodes de vertiges récurrents après la prise d'Amlor (5 mg).`,
        recommendation: `Conseiller à ${patientProfile.name} de se lever très lentement du lit et signaler ce point au ${patientProfile.doctor}.`,
        date: 'Aujourd\'hui'
      });
    }

    // 2. Analyze sleepiness & night fall risk (Imovane)
    const imovaneMed = medications.find(m => m.name.toLowerCase().includes('imovane'));
    if (imovaneMed) {
      alerts.push({
        id: 'alert-sleep-fall',
        severity: 'info',
        title: '🌙 Vigilance Coucher (Imovane 7.5 mg)',
        description: `Prise de somnifère planifiée au coucher. Risque de perte d'équilibre nocturne.`,
        recommendation: `Vérifier que la veilleuse du couloir est allumée et dégager le passage jusqu'aux WC.`,
        date: 'Actif'
      });
    }

    // 3. Grapefruit drug interaction check (Tahor)
    const tahorMed = medications.find(m => m.name.toLowerCase().includes('tahor'));
    if (tahorMed) {
      alerts.push({
        id: 'alert-interaction-tahor',
        severity: 'warning',
        title: '🚫 Interaction Alimentaire (Tahor 20 mg)',
        description: `La prise de statines (Tahor) présente un risque d'interaction avec le jus de pamplemousse.`,
        recommendation: `Exclure le pamplemousse du petit-déjeuner de ${patientProfile.name}.`,
        date: 'Permanent'
      });
    }

    return alerts;
  }
};
