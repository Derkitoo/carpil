export const PATIENT_PROFILE = {
  name: "Joseph Martin",
  age: 73,
  doctor: "Dr. Catherine Laurent (Generaliste)",
  emergencyContact: "Thomas Martin (Fils) - 06 12 34 56 78",
  allergies: ["Penicilline (Eruption cutanee)"],
  adherenceScore: 96, // percentage
};

export const INITIAL_MEDICATIONS = [
  {
    id: "med-1",
    name: "Kardégic",
    dosage: "75 mg",
    form: "Sachet de poudre",
    category: "Cardiovasculaire",
    color: "#e0f2fe", // soft blue
    pillIcon: "sachet",
    timeSlots: ["Matin"],
    instructions: "À prendre avec un grand verre d'eau pendant le petit-déjeuner.",
    warning: "Ne pas doubler en cas d'oubli. Consulter si saignements de nez.",
    stock: 24,
    unit: "sachets",
    totalStock: 30,
    dailyDose: 1
  },
  {
    id: "med-2",
    name: "Lévothyrox",
    dosage: "75 µg",
    form: "Petit comprimé rond",
    category: "Thyroïde",
    color: "#fef3c7", // soft yellow
    pillIcon: "round-white",
    timeSlots: ["Matin"],
    instructions: "⚠️ À JEUN impérativement 30 minutes AVANT le petit-déjeuner avec de l'eau.",
    warning: "Prendre à heure fixe chaque matin.",
    stock: 7, // ⚠️ Warning low stock
    unit: "comprimés",
    totalStock: 30,
    dailyDose: 1
  },
  {
    id: "med-3",
    name: "Amlor",
    dosage: "5 mg",
    form: "Gélule jaune et blanche",
    category: "Tension Artérielle",
    color: "#fde047", // yellow
    pillIcon: "capsule-yellow",
    timeSlots: ["Matin"],
    instructions: "Avaler sans croquer avec de l'eau.",
    warning: "Surveiller les petites enflures des chevilles.",
    stock: 21,
    unit: "gélules",
    totalStock: 30,
    dailyDose: 1
  },
  {
    id: "med-4",
    name: "Doliprane",
    dosage: "1000 mg",
    form: "Comprimé allongé blanc",
    category: "Douleur / Fièvre",
    color: "#f1f5f9", // white/gray
    pillIcon: "oval-white",
    timeSlots: ["Matin", "Midi", "Soir"],
    instructions: "Pendant le repas. Espacer d'au moins 4 à 6 heures.",
    warning: "Ne pas dépasser 3 comprimés (3g) par jour maximum.",
    stock: 18,
    unit: "comprimés",
    totalStock: 30,
    dailyDose: 3
  },
  {
    id: "med-5",
    name: "Tahor",
    dosage: "20 mg",
    form: "Comprimé pelliculé blanc",
    category: "Cholestérol",
    color: "#e2e8f0",
    pillIcon: "round-white",
    timeSlots: ["Soir"],
    instructions: "Au milieu du repas du soir.",
    warning: "🚫 Éviter la consommation de jus de pamplemousse !",
    stock: 14,
    unit: "comprimés",
    totalStock: 30,
    dailyDose: 1
  },
  {
    id: "med-6",
    name: "Imovane",
    dosage: "7.5 mg",
    form: "Comprimé bleu clair",
    category: "Sommeil",
    color: "#bfdbfe", // light blue
    pillIcon: "round-blue",
    timeSlots: ["Nuit"],
    instructions: "Juste au moment d'aller au lit.",
    warning: "⚠️ Risque de somnolence. Ne pas se lever brusquement la nuit.",
    stock: 4, // ⚠️ Very low stock
    unit: "comprimés",
    totalStock: 14,
    dailyDose: 1
  }
];

export const DAYS_OF_WEEK = [
  { key: "lun", label: "Lundi", short: "Lun" },
  { key: "mar", label: "Mardi", short: "Mar" },
  { key: "mer", label: "Mercredi", short: "Mer" },
  { key: "jeu", label: "Jeudi", short: "Jeu" },
  { key: "ven", label: "Vendredi", short: "Ven" },
  { key: "sam", label: "Samedi", short: "Sam" },
  { key: "dim", label: "Dimanche", short: "Dim" },
];

export const TIME_SLOTS = [
  { key: "Matin", time: "08:00", icon: "Sun", color: "#fef3c7", border: "#f59e0b", title: "Matin (8h00 - Petit Déjeuner)" },
  { key: "Midi", time: "12:30", icon: "SunMedium", color: "#e0f2fe", border: "#0284c7", title: "Midi (12h30 - Déjeuner)" },
  { key: "Soir", time: "19:30", icon: "Sunset", color: "#ffedd5", border: "#ea580c", title: "Soir (19h30 - Dîner)" },
  { key: "Nuit", time: "22:00", icon: "Moon", color: "#f3e8ff", border: "#9333ea", title: "Nuit (22h00 - Coucher)" },
];

export const INITIAL_SYMPTOMS_LOG = [
  { id: 1, date: "Aujourd'hui, 08:30", type: "Tension Artérielle", detail: "12/8 mmHg (Excellente)", status: "normal" },
  { id: 2, date: "Hier, 14:15", type: "Sensations", detail: "Leger vertige apres la marche du midi", status: "warning" },
  { id: 3, date: "15 Août, 09:00", type: "Tension Artérielle", detail: "13/8 mmHg", status: "normal" },
];
