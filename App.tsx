
import React, { useState, useEffect } from 'react';
import GardenForm from './components/GardenForm';
import GardenDashboard from './components/GardenDashboard';
import LoadingState from './components/LoadingState';
import PlantEncyclopedia from './components/PlantEncyclopedia';
import MyPlants from './components/MyPlants';
import { generateGardenPlan } from './services/geminiService';
import { GardenInput, GardenPlanResponse, EncyclopediaPlant } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'planner' | 'encyclopedia' | 'favorites'>('planner');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gardenPlan, setGardenPlan] = useState<GardenPlanResponse | null>(null);
  const [hasKey, setHasKey] = useState(true);
  const [savedPlants, setSavedPlants] = useState<EncyclopediaPlant[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('garden_coach_favorites');
    if (stored) {
      try { setSavedPlants(JSON.parse(stored)); } catch (e) { console.error(e); }
    }
    if (window.aistudio) {
      window.aistudio.hasSelectedApiKey().then(setHasKey);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('garden_coach_favorites', JSON.stringify(savedPlants));
  }, [savedPlants]);

  const toggleFavorite = (plant: EncyclopediaPlant) => {
    setSavedPlants(prev => {
      const exists = prev.find(p => p.nom_commun === plant.nom_commun);
      if (exists) {
        return prev.filter(p => p.nom_commun !== plant.nom_commun);
      }
      return [...prev, plant];
    });
  };

  const isFavorite = (plant: any) => {
    const name = plant.nom_commun || plant.nom;
    return savedPlants.some(p => p.nom_commun === name);
  };

  const handleFormSubmit = async (input: GardenInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const plan = await generateGardenPlan(input);
      setGardenPlan(plan);
    } catch (err: any) {
      setError(err.message || "Erreur technique.");
      if (err.message?.includes("API key")) setHasKey(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setGardenPlan(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#fcfdfb] flex flex-col font-sans">
      <header className="bg-white/90 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { handleReset(); setActiveTab('planner'); }}>
            <div className="bg-green-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
              <i className="fas fa-leaf"></i>
            </div>
            <h1 className="font-serif font-bold text-2xl text-gray-900 tracking-tight hidden sm:block">
              Garden Coach <span className="text-green-600 font-sans font-black">AI</span>
            </h1>
          </div>

          <nav className="flex bg-gray-100/80 p-1.5 rounded-2xl border border-gray-200">
            <button 
              onClick={() => setActiveTab('planner')}
              className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${activeTab === 'planner' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <i className="fas fa-compass"></i> <span className="hidden md:inline">Planificateur</span>
            </button>
            <button 
              onClick={() => setActiveTab('encyclopedia')}
              className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${activeTab === 'encyclopedia' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <i className="fas fa-search"></i> <span className="hidden md:inline">Herbier</span>
            </button>
            <button 
              onClick={() => setActiveTab('favorites')}
              className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${activeTab === 'favorites' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <div className="relative">
                <i className="fas fa-heart"></i>
                {savedPlants.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full animate-bounce">{savedPlants.length}</span>}
              </div>
              <span className="hidden md:inline">Mes Plantes</span>
            </button>
          </nav>

          <div className="flex items-center gap-4">
             {!hasKey && (
              <button onClick={() => window.aistudio?.openSelectKey()} className="text-[10px] bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-bold border border-orange-200 hover:bg-orange-200 transition-colors">
                CLEF API REQUISTE
              </button>
            )}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-50 to-green-100 flex items-center justify-center text-green-600 border border-green-200 shadow-inner">
              <i className="fas fa-user text-sm"></i>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow py-12">
        {activeTab === 'planner' && (
          <>
            {!gardenPlan && !isLoading && (
              <div className="max-w-4xl mx-auto px-6 mb-16 text-center space-y-4">
                <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 leading-tight">
                  Cultivez l'excellence avec <br/><span className="text-green-600 underline decoration-green-100 underline-offset-8">l'IA spatiale</span>.
                </h1>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">L'outil de calcul agronomique qui définit l'empreinte réelle de vos plantes au centimètre près.</p>
              </div>
            )}
            {error && (
              <div className="max-w-2xl mx-auto px-6 mb-10">
                <div className="bg-red-50 border border-red-200 text-red-800 px-8 py-5 rounded-3xl shadow-sm flex items-center gap-4">
                  <i className="fas fa-exclamation-triangle text-2xl text-red-500"></i>
                  <p className="text-sm font-bold">{error}</p>
                </div>
              </div>
            )}
            {isLoading ? <LoadingState /> : gardenPlan ? <GardenDashboard plan={gardenPlan} onReset={handleReset} onToggleFavorite={toggleFavorite} isFavorite={isFavorite} /> : <GardenForm onSubmit={handleFormSubmit} isLoading={isLoading} />}
          </>
        )}

        {activeTab === 'encyclopedia' && <PlantEncyclopedia onToggleFavorite={toggleFavorite} isFavorite={isFavorite} />}
        {activeTab === 'favorites' && <MyPlants plants={savedPlants} onToggleFavorite={toggleFavorite} />}
      </main>

      <footer className="bg-white border-t border-gray-100 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="bg-gray-100 w-8 h-8 rounded-lg flex items-center justify-center text-gray-400"><i className="fas fa-seedling"></i></div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Garden Coach AI V2.5</span>
          </div>
          <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-bold">Données agronomiques locales • Stockage Browser local</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
