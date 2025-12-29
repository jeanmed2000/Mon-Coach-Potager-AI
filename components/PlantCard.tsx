
import React from 'react';
import { PlantationPlan, EncyclopediaPlant } from '../types';

interface PlantCardProps {
  plant: PlantationPlan;
  onAddToFavorites?: (plant: EncyclopediaPlant) => void;
  isSaved?: boolean;
}

const PlantCard: React.FC<PlantCardProps> = ({ plant, onAddToFavorites, isSaved }) => {
  const getWaterIcon = (level: string) => {
    const l = level?.toLowerCase();
    if (l === 'faible') return <i className="fas fa-tint text-blue-300"></i>;
    if (l === 'moyen') return <><i className="fas fa-tint text-blue-400"></i><i className="fas fa-tint text-blue-400"></i></>;
    return <><i className="fas fa-tint text-blue-600"></i><i className="fas fa-tint text-blue-600"></i><i className="fas fa-tint text-blue-600"></i></>;
  };

  const handleSave = () => {
    if (!onAddToFavorites) return;
    
    // Conversion d'un plan de plantation en fiche encyclopédique minimale
    const mockPlant: EncyclopediaPlant = {
      id: `plan-${plant.nom}-${Date.now()}`,
      nom_commun: plant.nom,
      nom_variete: plant.variete_conseillee,
      introduction: plant.conseil_expert,
      difficulte: 3,
      mois_semis: plant.calendrier?.plantation ? [plant.calendrier.plantation] : ['Printemps'],
      mois_plantation: plant.calendrier?.plantation ? [plant.calendrier.plantation] : ['Printemps'],
      mois_recolte: plant.calendrier?.recolte_estimee ? [plant.calendrier.recolte_estimee] : ['Été'],
      maladies: [],
      ravageurs: [],
      techniques: [plant.methode],
      sol_exposition: "Selon plan",
      associations: { positives: [], negatives: [] },
      coupe_repousse: "N/A",
      entretien: "Voir conseil expert",
      recette: "N/A",
      conservation_bocaux: "N/A",
      conservation_lacto: "N/A",
      astuce_jardinier: plant.conseil_expert,
      image_prompt: plant.nom,
      origine_zone: plant.zone
    };
    onAddToFavorites(mockPlant);
  };

  const safeQty = Math.max(0, parseInt(String(plant.quantite_plants)) || 1);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all overflow-hidden flex flex-col h-full group">
      <div className="bg-gray-50 px-6 py-5 border-b border-gray-100 flex justify-between items-start">
        <div className="space-y-1">
          <h4 className="font-serif font-bold text-gray-900 text-xl leading-tight">{plant.nom}</h4>
          <p className="text-green-600 text-[10px] font-bold uppercase tracking-widest">{plant.variete_conseillee}</p>
        </div>
        <button 
          onClick={handleSave}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isSaved ? 'bg-red-500 text-white shadow-red-200' : 'bg-white text-gray-300 hover:text-red-500 shadow-sm border border-gray-100'}`}
        >
          <i className={`${isSaved ? 'fas' : 'far'} fa-heart`}></i>
        </button>
      </div>
      
      <div className="p-6 flex-grow space-y-5">
        {/* Spatial Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50/50 p-3 rounded-2xl border border-blue-100/50">
            <span className="block text-[9px] font-bold text-blue-400 uppercase tracking-tighter mb-1">📐 Espacement</span>
            <span className="text-sm font-bold text-blue-800">{plant.espacement_cm || 'Standard'} cm</span>
          </div>
          <div className="bg-orange-50/50 p-3 rounded-2xl border border-orange-100/50">
            <span className="block text-[9px] font-bold text-orange-400 uppercase tracking-tighter mb-1">🪴 Quantité</span>
            <span className="text-sm font-bold text-orange-800">{safeQty} plants</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-gray-400 font-bold uppercase">Empreinte au sol</span>
            <span className="text-gray-700 font-bold">{(plant.surface_occupee_totale || 0).toFixed(2)} m² total</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500" style={{ width: `${Math.min(100, (plant.envergure_m2 || 0.1) * 100)}%` }}></div>
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-y border-gray-50">
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-400 font-bold uppercase">Plantation</span>
            <span className="text-xs font-bold text-gray-800">{plant.calendrier?.plantation || 'Printemps'}</span>
          </div>
          <div className="h-8 w-[1px] bg-gray-100"></div>
          <div className="flex flex-col text-right">
            <span className="text-[9px] text-gray-400 font-bold uppercase">Besoins eau</span>
            <div className="flex gap-0.5 justify-end">{getWaterIcon(plant.besoin_eau || 'Moyen')}</div>
          </div>
        </div>

        <div className="relative">
          <i className="fas fa-quote-left absolute -top-1 -left-2 text-gray-100 text-2xl"></i>
          <p className="text-gray-600 text-xs italic leading-relaxed relative z-10 pl-2">
            {plant.conseil_expert || "Prenez soin de cette plante pour une belle récolte."}
          </p>
        </div>
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <span className="text-[10px] text-gray-400 font-medium">Méthode : <span className="text-gray-700 font-bold">{plant.methode || 'Standard'}</span></span>
        <div className="flex -space-x-2">
          {[...Array(Math.min(3, safeQty))].map((_, i) => (
            <div key={i} className="w-5 h-5 rounded-full bg-green-100 border-2 border-white flex items-center justify-center">
              <i className="fas fa-seedling text-[8px] text-green-600"></i>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlantCard;
