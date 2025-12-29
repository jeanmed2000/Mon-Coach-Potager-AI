
import { GoogleGenAI, Type } from "@google/genai";
import { GardenInput, GardenPlanResponse, EncyclopediaResponse } from "../types";

export const generateGardenPlan = async (input: GardenInput): Promise<GardenPlanResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const zonesDescription = input.zones.map(z => 
    `- Zone "${z.nom}" (${z.type}): ${z.largeur}m x ${z.longueur}m (Surface: ${z.largeur * z.longueur}m²). Notes: ${z.notesSpecifiques}`
  ).join("\n");

  const prompt = `Tu es un expert en ingénierie agronomique et design de potager. 
    Génère un plan de culture ultra-précis pour : ${input.location}.
    ZONES DISPONIBLES :
    ${zonesDescription}

    CONSIGNES CRITIQUES :
    1. Calcule la surface réelle occupée par chaque plante (envergure adulte en m²).
    2. Détermine précisément combien de plants (quantite_plants) peuvent tenir dans chaque zone sans étouffer.
    3. Précise l'espacement recommandé en cm (ex: "40x40").
    4. Assure-toi que la somme des surfaces occupées ne dépasse pas la surface de la zone.

    RETOURNE CE JSON STRICT :
    {
      "synthese_coach": "string",
      "configuration_globale": { 
        "difficulte_estimee": "X/10", 
        "conseil_arrosage": "string",
        "surface_totale": number
      },
      "plans_par_zone": [ 
        { 
          "zoneId": "string", 
          "nomZone": "string", 
          "surface_m2": number,
          "optimisation": "string", 
          "colonnes": number, 
          "lignes": number, 
          "grille": [ { "x": 0, "y": 0, "plante": "string", "couleur": "string" } ] 
        } 
      ],
      "plan_plantation": [ 
        { 
          "nom": "string", 
          "zone": "string", 
          "variete_conseillee": "string", 
          "methode": "string", 
          "espacement_cm": "string",
          "envergure_m2": number,
          "quantite_plants": number,
          "surface_occupee_totale": number,
          "calendrier": { "plantation": "string", "recolte_estimee": "string" }, 
          "conseil_expert": "string", 
          "besoin_eau": "string" 
        } 
      ]
    }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text.replace(/```json|```/g, "").trim());
  } catch (error: any) {
    throw new Error(`Erreur génération plan spatial : ${error.message}`);
  }
};

export const searchEncyclopedia = async (query: string): Promise<EncyclopediaResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Tu es un expert botaniste. Génère 2-4 fiches détaillées pour la recherche : "${query}".
    Tu DOIS retourner un JSON valide respectant exactement cette structure :
    {
      "message_intro": "Texte d'accueil personnalisé sur la recherche",
      "resultats": [
        {
          "id": "unique-id",
          "nom_commun": "Nom",
          "nom_variete": "Variété",
          "introduction": "Description",
          "difficulte": 3,
          "mois_semis": ["Mars"],
          "mois_plantation": ["Avril"],
          "mois_recolte": ["Juillet"],
          "maladies": [],
          "ravageurs": [],
          "techniques": [],
          "sol_exposition": "Plein soleil",
          "associations": { "positives": ["Basilic"], "negatives": ["Chou"] },
          "coupe_repousse": "Oui",
          "entretien": "Arrosage régulier",
          "recette": "Utilisation cuisine",
          "conservation_bocaux": "Oui",
          "conservation_lacto": "Non",
          "astuce_jardinier": "Astuce",
          "image_prompt": "Description visuelle"
        }
      ]
    }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    const text = response.text.replace(/```json|```/g, "").trim();
    if (!text) throw new Error("Réponse vide de l'IA");
    return JSON.parse(text);
  } catch (error: any) {
    console.error("Erreur searchEncyclopedia:", error);
    throw new Error(`Erreur lors de la recherche dans l'herbier.`);
  }
};
