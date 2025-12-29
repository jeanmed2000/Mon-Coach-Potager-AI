
import React from 'react';
import { GardenPlanResponse, EncyclopediaPlant } from '../types';
import PlantCard from './PlantCard';

interface GardenDashboardProps {
  plan: GardenPlanResponse;
  onReset: () => void;
  onToggleFavorite: (plant: EncyclopediaPlant) => void;
  isFavorite: (plant: any) => boolean;
}

const GardenDashboard: React.FC<GardenDashboardProps> = ({ plan, onReset, onToggleFavorite, isFavorite }) => {
  const coachMessage = plan?.synthese_coach || "Planification terminée !";
  const config = plan?.configuration_globale || { difficulte_estimee: "5/10", conseil_arrosage: "N/A", surface_totale: 0 };
  const plansParZone = plan?.plans_par_zone || [];
  const planPlantation = plan?.plan_plantation || [];

  const diffValue = parseInt(config.difficulte_estimee || "5") || 5;

  const scrollToPlant = (plantName: string) => {
    const element = document.getElementById(`plant-${plantName.toLowerCase().replace(/\s+/g, '-')}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('ring-4', 'ring-green-500', 'ring-opacity-50');
      setTimeout(() => element.classList.remove('ring-4', 'ring-green-500', 'ring-opacity-50'), 2000);
    }
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto px-4 pb-20">
      {/* Overview Card */}
      <section className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-garden-gradient p-10 text-white relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 opacity-10 rotate-12">
            <i className="fas fa-seedling text-[20rem]"></i>
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase mb-6 border border-white/30">
              <i className="fas fa-check-circle"></i> Votre stratégie de saison
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">{coachMessage}</h2>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={onReset}
                className="px-8 py-3 bg-white text-green-800 font-bold rounded-2xl hover:bg-green-50 transition-all flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95"
              >
                <i className="fas fa-redo"></i> Nouvelle simulation
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <div className="p-8">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-4 tracking-[0.2em]">Complexité</h4>
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-5xl font-serif font-bold text-gray-900">{config.difficulte_estimee?.split('/')[0] || "5"}</span>
              <span className="text-sm text-gray-400 font-bold">/10</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full">
              <div className="h-full bg-orange-500 rounded-full" style={{ width: `${diffValue * 10}%` }}></div>
            </div>
          </div>

          <div className="p-8">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-4 tracking-[0.2em]">Espace Optimisé</h4>
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-5xl font-serif font-bold text-gray-900">{config.surface_totale || 0}</span>
              <span className="text-sm text-gray-400 font-bold">m²</span>
            </div>
            <p className="text-xs text-gray-500">Surface totale de vos zones de culture combinées.</p>
          </div>

          <div className="p-8 bg-blue-50/30">
            <h4 className="text-[10px] font-bold text-blue-400 uppercase mb-4 tracking-[0.2em]">Hydratation</h4>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <i className="fas fa-droplet text-xl"></i>
              </div>
              <p className="text-sm text-blue-800 font-medium leading-relaxed">{config.conseil_arrosage}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Spatial Zones */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-3">
            <i className="fas fa-th-large text-green-600"></i> Agencement des Secteurs
          </h3>
        </div>
        
        <div className="grid gap-10">
          {plansParZone.map((zone, idx) => {
            const occupationTotale = planPlantation
              .filter(p => p.zone === zone.nomZone)
              .reduce((acc, p) => acc + (p.surface_occupee_totale || 0), 0);
            const percentage = zone.surface_m2 > 0 ? (occupationTotale / zone.surface_m2) * 100 : 0;

            return (
              <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="space-y-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-widest">Zone {idx + 1}</span>
                    <h4 className="text-3xl font-serif font-bold text-gray-900">{zone.nomZone}</h4>
                    <p className="text-sm text-gray-500 italic max-w-xl">"{zone.optimisation}"</p>
                  </div>
                  
                  <div className="flex gap-8 text-center bg-gray-50 p-6 rounded-3xl border border-gray-100">
                    <div>
                      <span className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Surface</span>
                      <span className="text-xl font-bold text-gray-800">{zone.surface_m2 || 0}m²</span>
                    </div>
                    <div className="w-px h-10 bg-gray-200"></div>
                    <div>
                      <span className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Utilisé</span>
                      <span className={`text-xl font-bold ${percentage > 95 ? 'text-orange-600' : 'text-green-600'}`}>
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Grid Visualizer - Improved Accessibility & Interaction */}
                <div className="relative group bg-slate-900 p-8 rounded-[2rem] overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                  <div className="relative z-10 mb-4 flex justify-between items-center text-white/40 text-[10px] uppercase font-bold tracking-widest">
                    <span><i className="fas fa-arrows-alt-h mr-1"></i> {zone.surface_m2}m²</span>
                    <span>1 carré ≈ 1 plant / unité d'espace</span>
                  </div>
                  <div 
                    className="grid gap-3 relative z-10 mx-auto" 
                    style={{ 
                      gridTemplateColumns: `repeat(${zone.colonnes || 1}, minmax(80px, 1fr))`,
                      maxWidth: '800px'
                    }}
                  >
                    {Array(zone.lignes || 1).fill(null).map((_, y) => 
                      Array(zone.colonnes || 1).fill(null).map((_, x) => {
                        const cell = zone.grille?.find(c => c.x === x && c.y === y);
                        return (
                          <div 
                            key={`${x}-${y}`}
                            onClick={() => cell?.plante && scrollToPlant(cell.plante)}
                            className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center p-2 transition-all cursor-pointer transform hover:scale-105 hover:z-20 shadow-lg ${cell?.plante ? 'border-white/20 bg-white/5 active:scale-95' : 'border-white/5 bg-transparent'}`}
                            style={{ backgroundColor: cell?.plante ? `${cell.couleur}20` : 'transparent' }}
                          >
                            {cell?.plante ? (
                              <>
                                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] shadow-lg mb-2" style={{ backgroundColor: cell.couleur }}>
                                  <i className="fas fa-seedling"></i>
                                </div>
                                <span className="text-[10px] font-bold text-white text-center leading-tight line-clamp-2 uppercase tracking-tighter">
                                  {cell.plante}
                                </span>
                              </>
                            ) : (
                              <span className="text-white/5 text-[8px] uppercase">Libre</span>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                  <div className="absolute bottom-4 right-6 text-[9px] text-white/30 font-bold uppercase tracking-widest">Plan technique Interactif</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Detailed Plant Sheets */}
      <section className="space-y-8">
        <h3 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-3">
          <i className="fas fa-clipboard-list text-green-600"></i> Fiches de Plantation & Empreinte
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {planPlantation.map((plant, idx) => (
            <div 
              key={idx} 
              id={`plant-${plant.nom.toLowerCase().replace(/\s+/g, '-')}`} 
              className="relative transition-all duration-500 rounded-3xl"
            >
              <div className="absolute -top-4 left-6 z-20 px-4 py-1.5 bg-orange-600 text-white text-[10px] font-bold rounded-full shadow-lg border-2 border-white">
                <i className="fas fa-map-pin mr-1"></i> {plant.zone}
              </div>
              <PlantCard 
                plant={plant} 
                onAddToFavorites={onToggleFavorite}
                isSaved={isFavorite(plant)}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default GardenDashboard;
