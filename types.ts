
export interface GardenZone {
  id: string;
  nom: string;
  type: 'plein-air' | 'serre' | 'bac' | 'tunnel';
  largeur: number;
  longueur: number;
  hauteur: number;
  notesSpecifiques: string;
}

export interface GardenInput {
  experience: 'debutant' | 'intermediaire' | 'expert';
  zones: GardenZone[];
  sunlight: 'ombre' | 'mi-ombre' | 'plein-soleil';
  location: string;
  preferences: string[];
  arrosage: 'manuel' | 'goutte-a-goutte' | 'asperseur' | 'aucun';
}

export interface GridCell {
  x: number;
  y: number;
  plante: string;
  couleur: string;
}

export interface ZonePlan {
  zoneId: string;
  nomZone: string;
  optimisation: string;
  grille: GridCell[];
  colonnes: number;
  lignes: number;
  surface_m2: number;
}

export interface PlantationPlan {
  nom: string;
  zone: string;
  variete_conseillee: string;
  methode: string;
  calendrier: {
    plantation: string;
    recolte_estimee: string;
  };
  conseil_expert: string;
  besoin_eau: 'Faible' | 'Moyen' | 'Fort';
  // Nouvelles propriétés spatiales
  espacement_cm: string; // ex: "50x60"
  envergure_m2: number; // ex: 0.3
  quantite_plants: number; // ex: 4
  surface_occupee_totale: number; // ex: 1.2
}

export interface GardenPlanResponse {
  synthese_coach: string;
  configuration_globale: {
    difficulte_estimee: string;
    conseil_arrosage: string;
    surface_totale: number;
  };
  plans_par_zone: ZonePlan[];
  plan_plantation: PlantationPlan[];
}

export interface EncyclopediaPlant {
  id: string;
  nom_commun: string;
  nom_variete: string;
  introduction: string;
  difficulte: 1 | 2 | 3 | 4 | 5;
  mois_semis: string[];
  mois_plantation: string[];
  mois_recolte: string[];
  maladies: string[];
  ravageurs: string[];
  techniques: string[];
  sol_exposition: string;
  associations: {
    positives: string[];
    negatives: string[];
  };
  coupe_repousse: string;
  entretien: string;
  recette: string;
  conservation_bocaux: string;
  conservation_lacto: string;
  astuce_jardinier: string;
  image_prompt: string;
  // Propriétés optionnelles pour la conversion depuis le plan
  origine_zone?: string;
  notes_planification?: string;
}

export interface EncyclopediaResponse {
  resultats: EncyclopediaPlant[];
  message_intro: string;
}
