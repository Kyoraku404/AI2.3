export const SUGGESTIONS = [
  {
    id: 1,
    icon: '📈',
    label: 'Définition',
    prompt: "Définis l'inflation simplement",
    category: 'Concepts',
  },
  {
    id: 2,
    icon: '💵',
    label: 'Monnaie',
    prompt: 'Explique la monnaie avec un exemple concret',
    category: 'Concepts',
  },
  {
    id: 3,
    icon: '🧮',
    label: 'Calcul',
    prompt: 'Calcule le solde commercial si X=400 et M=550',
    category: 'Calculs',
  },
  {
    id: 4,
    icon: '📚',
    label: 'Chômage',
    prompt: 'Résume le chômage pour un élève du bac',
    category: 'Révision',
  },
  {
    id: 5,
    icon: '🔍',
    label: 'Comparaison',
    prompt: 'Quelle est la différence entre croissance et développement ?',
    category: 'Concepts',
  },
  {
    id: 6,
    icon: '📊',
    label: 'PIB',
    prompt: 'Comment calculer et interpréter le PIB ?',
    category: 'Calculs',
  },
];

export const MODES = [
  {
    id: 'normal',
    label: 'Normal',
    description: 'Réponses pédagogiques équilibrées',
    icon: '💬',
    badge: 'Général',
    color: 'accent',
  },
  {
    id: 'simple',
    label: 'Explication simple',
    description: 'Langage accessible pour débutants',
    icon: '🎓',
    badge: 'Simple',
    color: 'emerald',
  },
  {
    id: 'calcul',
    label: 'Calcul économique',
    description: 'Formule → Étapes → Résultat',
    icon: '🧮',
    badge: 'Calcul',
    color: 'amber',
  },
  {
    id: 'revision',
    label: 'Révision Bac',
    description: 'Fiches concises pour l\'examen',
    icon: '📝',
    badge: 'Bac',
    color: 'rose',
  },
];
