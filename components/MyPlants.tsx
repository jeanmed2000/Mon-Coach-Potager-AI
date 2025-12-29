
import React from 'react';
import { EncyclopediaPlant } from '../types';

interface MyPlantsProps {
  plants: EncyclopediaPlant[];
  onToggleFavorite: (plant: EncyclopediaPlant) => void;
}

const MyPlants: React.FC<MyPlantsProps> = ({ plants, onToggleFavorite }) => {
  if (plants.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto border border-green-100 shadow-inner">
          <i className="fas fa-seedling text-4xl text-green-300"></i>
        </div>
        <h2 className="text-3xl font-serif font-bold text-gray-900">Votre collection est vide</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Explorez l'encyclopédie et enregistrez les plantes que vous souhaitez cultiver pour les retrouver ici.
        </p>
        <button 
          onClick={() => {}}
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full font-bold shadow-lg hover:bg-green-700 transition-all"
        >
          <i className="fas fa-search"></i> Parcourir l'encyclopédie
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20 space-y-12">
      <section className="text-center space-y-4">
        <h2 className="text-4xl font-serif font-bold text-gray-900">Mes Cultures Favorites</h2>
        <p className="text-gray-500">
          Retrouvez ici toutes vos fiches enregistrées. Données stockées dans votre navigateur.
        </p>
      </section>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plants.map((plant) => (
          <div key={plant.id || plant.nom_commun} className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden flex flex-col hover:border-green-200 transition-all">
            <div className="bg-garden-gradient p-6 text-white relative">
              <button 
                onClick={() => onToggleFavorite(plant)}
                className="absolute top-4 right-4 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg border border-red-400"
              >
                <i className="fas fa-times"></i>
              </button>
              <h3 className="text-xl font-serif font-bold">{plant.nom_commun}</h3>
              <p className="text-green-100 text-[10px] italic">{plant.nom_variete}</p>
            </div>

            <div className="p-6 space-y-4 flex-grow">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                <span>Difficulté: {plant.difficulte || 3}/5</span>
                <span className="text-blue-500"><i className="fas fa-tint mr-1"></i> {plant.sol_exposition?.split(',')[0] || 'Soleil'}</span>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-green-700 uppercase">En bref</h4>
                <p className="text-xs text-gray-600 line-clamp-3">{plant.introduction || 'Pas de description disponible.'}</p>
              </div>

              {plant.recette && plant.recette !== "N/A" && (
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <h4 className="text-[10px] font-bold text-blue-800 uppercase mb-1 flex items-center gap-1">
                    <i className="fas fa-utensils"></i> Cuisine
                  </h4>
                  <p className="text-[10px] text-blue-700">{plant.recette}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                <div>
                  <h4 className="text-[10px] font-bold text-green-700 uppercase mb-1">Amis</h4>
                  <div className="flex flex-wrap gap-1">
                    {plant.associations?.positives?.slice(0, 2).map(p => (
                      <span key={p} className="px-1.5 py-0.5 bg-green-50 text-green-600 rounded text-[9px] font-bold">{p}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-red-700 uppercase mb-1">Ennemis</h4>
                  <div className="flex flex-wrap gap-1">
                    {plant.associations?.negatives?.slice(0, 2).map(p => (
                      <span key={p} className="px-1.5 py-0.5 bg-red-50 text-red-600 rounded text-[9px] font-bold">{p}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-center">
              <span className="text-[10px] font-bold text-gray-400">
                Récolte : {plant.mois_recolte?.[0] || 'Saison'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPlants;
