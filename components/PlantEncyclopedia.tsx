
import React, { useState } from 'react';
import { searchEncyclopedia } from '../services/geminiService';
import { EncyclopediaPlant, EncyclopediaResponse } from '../types';
import LoadingState from './LoadingState';

interface PlantEncyclopediaProps {
  onToggleFavorite: (plant: EncyclopediaPlant) => void;
  isFavorite: (plant: EncyclopediaPlant) => boolean;
}

const PlantEncyclopedia: React.FC<PlantEncyclopediaProps> = ({ onToggleFavorite, isFavorite }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<EncyclopediaResponse | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await searchEncyclopedia(query);
      if (!data.resultats || data.resultats.length === 0) {
        setError("Aucun résultat trouvé pour cette recherche. Essayez avec un nom plus commun.");
        setResults(null);
      } else {
        setResults(data);
      }
    } catch (err: any) {
      console.error(err);
      setError("Une erreur est survenue lors de la recherche. Vérifiez votre connexion.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20 space-y-12">
      <section className="text-center space-y-6">
        <h2 className="text-4xl font-serif font-bold text-gray-900">L'herbier du Jardinier</h2>
        <p className="text-gray-500 max-w-2xl mx-auto italic">
          "Cherchez une plante par son nom, ou demandez conseil : 'Quoi planter en pot à Paris ?'..."
        </p>
        
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group">
          <input
            type="text"
            className="w-full pl-6 pr-20 py-5 bg-white border border-gray-100 rounded-3xl shadow-xl outline-none focus:ring-4 focus:ring-green-500/10 transition-all text-lg"
            placeholder="Ex: Tomate, Basilic, Radis..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="absolute right-3 top-3 bottom-3 px-6 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-search"></i>}
          </button>
        </form>

        <div className="flex flex-wrap justify-center gap-3">
          {['Tomates', 'Légumes Balcon', 'Herbes Aromatiques', 'Potager d\'hiver'].map(tag => (
            <button 
              key={tag}
              onClick={() => { setQuery(tag); setTimeout(() => handleSearch(), 100); }}
              className="px-4 py-2 bg-white border border-gray-100 rounded-full text-xs font-bold text-gray-500 hover:border-green-300 hover:text-green-600 transition-all shadow-sm"
            >
              # {tag}
            </button>
          ))}
        </div>
      </section>

      {error && (
        <div className="max-w-2xl mx-auto p-6 bg-orange-50 border border-orange-100 rounded-2xl text-orange-800 text-center flex flex-col items-center gap-4">
          <i className="fas fa-search-minus text-3xl opacity-50"></i>
          <p className="font-bold">{error}</p>
        </div>
      )}

      {isLoading ? (
        <LoadingState />
      ) : results ? (
        <div className="space-y-10">
          <div className="bg-green-50 p-6 rounded-2xl border border-green-100 text-green-800 text-center italic">
            "{results.message_intro}"
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {results.resultats?.map((plant) => {
              const favorite = isFavorite(plant);
              return (
                <div key={plant.id || plant.nom_commun} className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden flex flex-col group hover:border-green-200 transition-all">
                  <div className="bg-garden-gradient p-8 text-white relative">
                    <div className="flex justify-between items-start mb-2">
                      <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                        Difficulté: {plant.difficulte || 3}/5
                      </div>
                      <button 
                        onClick={() => onToggleFavorite(plant)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg ${favorite ? 'bg-red-500 text-white scale-110' : 'bg-white/20 text-white hover:bg-white/40'}`}
                      >
                        <i className={`${favorite ? 'fas' : 'far'} fa-heart`}></i>
                      </button>
                    </div>
                    <h3 className="text-3xl font-serif font-bold mb-1">{plant.nom_commun}</h3>
                    <p className="text-green-100 italic text-sm">{plant.nom_variete}</p>
                  </div>

                  <div className="p-8 space-y-6 flex-grow">
                    <p className="text-gray-600 leading-relaxed text-sm">{plant.introduction}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Exposition</span>
                        <p className="text-xs font-bold text-gray-700 flex items-center gap-2">
                          <i className="fas fa-sun text-orange-400"></i> {plant.sol_exposition || 'Non précisé'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Entretien</span>
                        <p className="text-xs font-bold text-gray-700">{plant.entretien || 'Standard'}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400 font-bold uppercase">Calendrier optimal</span>
                        <div className="flex gap-4">
                          <span className="text-blue-600"><i className="fas fa-seedling mr-1"></i> {plant.mois_semis?.[0] || 'Printemps'}</span>
                          <span className="text-orange-600"><i className="fas fa-shopping-basket mr-1"></i> {plant.mois_recolte?.[0] || 'Été'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                      <div>
                        <h4 className="text-[10px] font-bold text-green-700 uppercase mb-2">Amis du jardin</h4>
                        <div className="flex flex-wrap gap-1">
                          {plant.associations?.positives?.map(p => (
                            <span key={p} className="px-2 py-0.5 bg-green-50 text-green-600 rounded text-[9px] border border-green-100 font-bold">{p}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold text-red-700 uppercase mb-2">À éloigner</h4>
                        <div className="flex flex-wrap gap-1">
                          {plant.associations?.negatives?.map(p => (
                            <span key={p} className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-[9px] border border-red-100 font-bold">{p}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 space-y-3">
                      <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
                        <h4 className="text-xs font-bold text-orange-800 flex items-center gap-2 mb-1">
                          <i className="fas fa-lightbulb"></i> L'astuce du Coach
                        </h4>
                        <p className="text-xs text-orange-700 italic">"{plant.astuce_jardinier || 'Paillez le pied pour garder l\'humidité.'}"</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 border-t border-gray-50 bg-gray-50/30">
                    <button 
                      onClick={() => onToggleFavorite(plant)}
                      className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${favorite ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-600 text-white hover:bg-green-700 shadow-md'}`}
                    >
                      <i className={`${favorite ? 'fas fa-minus-circle' : 'fas fa-plus-circle'}`}></i>
                      {favorite ? 'Retirer de mes plantes' : 'Enregistrer pour plus tard'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        !error && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <i className="fas fa-book-open text-6xl text-gray-100 mb-6"></i>
            <p className="text-gray-400 font-medium">Votre herbier numérique vous attend.</p>
          </div>
        )
      )}
    </div>
  );
};

export default PlantEncyclopedia;
