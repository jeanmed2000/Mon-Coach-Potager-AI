
import React, { useState } from 'react';
import { GardenInput, GardenZone } from '../types';

interface GardenFormProps {
  onSubmit: (input: GardenInput) => void;
  isLoading: boolean;
}

const GardenForm: React.FC<GardenFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<GardenInput>({
    experience: 'debutant',
    zones: [
      { id: '1', nom: 'Zone 1', type: 'plein-air', largeur: 2, longueur: 2, hauteur: 0, notesSpecifiques: '' }
    ],
    sunlight: 'plein-soleil',
    location: '',
    preferences: [],
    arrosage: 'manuel'
  });

  const [currentPref, setCurrentPref] = useState('');

  const addZone = () => {
    const newZone: GardenZone = {
      id: Math.random().toString(36).substr(2, 9),
      nom: `Secteur ${formData.zones.length + 1}`,
      type: 'plein-air',
      largeur: 1,
      longueur: 1,
      hauteur: 0,
      notesSpecifiques: ''
    };
    setFormData(prev => ({ ...prev, zones: [...prev.zones, newZone] }));
  };

  const loadExample = () => {
    setFormData({
      ...formData,
      location: 'Bretagne, France',
      preferences: ['Tomates cerises', 'Basilic', 'Courgettes'],
      zones: [
        { 
          id: 'ex1', 
          nom: 'Ma grande serre', 
          type: 'serre', 
          largeur: 3, 
          longueur: 4, 
          hauteur: 0, 
          notesSpecifiques: 'Passage central de 1m sur toute la longueur' 
        },
        { 
          id: 'ex2', 
          nom: 'Bac surélevé', 
          type: 'bac', 
          largeur: 1, 
          longueur: 2, 
          hauteur: 50, 
          notesSpecifiques: 'Contre un mur exposé sud' 
        }
      ]
    });
  };

  const updateZone = (id: string, updates: Partial<GardenZone>) => {
    setFormData(prev => ({
      ...prev,
      zones: prev.zones.map(z => z.id === id ? { ...z, ...updates } : z)
    }));
  };

  const removeZone = (id: string) => {
    if (formData.zones.length > 1) {
      setFormData(prev => ({ ...prev, zones: prev.zones.filter(z => z.id !== id) }));
    }
  };

  const addPreference = () => {
    if (currentPref.trim()) {
      setFormData(prev => ({ ...prev, preferences: [...prev.preferences, currentPref.trim()] }));
      setCurrentPref('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.location) return alert("Indiquez votre localisation.");
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-garden-gradient px-8 py-10 text-white flex flex-col items-center">
        <i className="fas fa-magic text-4xl mb-4 text-green-300"></i>
        <h2 className="text-3xl font-serif font-bold">Votre Plan sur Mesure</h2>
        <p className="mt-2 text-green-100 opacity-90">L'IA experte analyse vos zones de culture.</p>
        <button 
          type="button"
          onClick={loadExample}
          className="mt-6 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-xs font-bold border border-white/30 transition-all"
        >
          <i className="fas fa-lightbulb mr-2"></i> Charger un exemple type
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Votre Niveau</label>
            <div className="flex bg-gray-50 p-1 rounded-xl">
              {(['debutant', 'intermediaire', 'expert'] as const).map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setFormData({ ...formData, experience: lvl })}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    formData.experience === lvl ? 'bg-white text-green-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {lvl.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Localisation (Climat)</label>
            <input
              type="text"
              placeholder="Ex: Lyon, Provence, Normandie..."
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <i className="fas fa-vector-square text-green-600"></i> Vos Espaces
            </h3>
            <button 
              type="button" onClick={addZone}
              className="text-xs font-bold text-green-600 bg-green-50 px-4 py-2 rounded-full border border-green-100 hover:bg-green-100 transition-colors"
            >
              <i className="fas fa-plus mr-2"></i> Ajouter une zone
            </button>
          </div>

          <div className="grid gap-6">
            {formData.zones.map((zone) => (
              <div key={zone.id} className="relative bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-4 hover:border-green-200 transition-colors">
                <button 
                  type="button" onClick={() => removeZone(zone.id)}
                  className="absolute top-4 right-4 text-gray-300 hover:text-red-500"
                >
                  <i className="fas fa-trash"></i>
                </button>

                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text" placeholder="Nom (ex: La Serre)"
                    className="px-3 py-2 bg-white border border-gray-100 rounded-lg text-sm font-bold"
                    value={zone.nom}
                    onChange={(e) => updateZone(zone.id, { nom: e.target.value })}
                  />
                  <select
                    className="px-3 py-2 bg-white border border-gray-100 rounded-lg text-sm"
                    value={zone.type}
                    onChange={(e) => updateZone(zone.id, { type: e.target.value as any })}
                  >
                    <option value="plein-air">Plein Air</option>
                    <option value="serre">Serre</option>
                    <option value="bac">Bac / Carré</option>
                    <option value="tunnel">Tunnel</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Largeur (m)</span>
                    <input
                      type="number" step="0.1"
                      className="w-full px-3 py-1.5 bg-white border border-gray-100 rounded-lg text-sm"
                      value={zone.largeur}
                      onChange={(e) => updateZone(zone.id, { largeur: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Longueur (m)</span>
                    <input
                      type="number" step="0.1"
                      className="w-full px-3 py-1.5 bg-white border border-gray-100 rounded-lg text-sm"
                      value={zone.longueur}
                      onChange={(e) => updateZone(zone.id, { longueur: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Haut. (cm)</span>
                    <input
                      type="number"
                      className="w-full px-3 py-1.5 bg-white border border-gray-100 rounded-lg text-sm"
                      value={zone.hauteur}
                      onChange={(e) => updateZone(zone.id, { hauteur: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Notes (Passage, murs, ombres...)</span>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 bg-white border border-gray-100 rounded-lg text-sm outline-none mt-1"
                    placeholder="Ex: Laisser un passage de 1m au centre..."
                    value={zone.notesSpecifiques}
                    onChange={(e) => updateZone(zone.id, { notesSpecifiques: e.target.value })}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
          <div className="space-y-4">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Ensoleillement</label>
            <div className="flex gap-2">
              {(['ombre', 'mi-ombre', 'plein-soleil'] as const).map(sun => (
                <button
                  key={sun}
                  type="button"
                  onClick={() => setFormData({ ...formData, sunlight: sun })}
                  className={`flex-1 py-2 text-[10px] font-bold rounded-lg border ${
                    formData.sunlight === sun ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-gray-50 border-gray-100 text-gray-400'
                  }`}
                >
                  {sun.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Arrosage</label>
            <select
              className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm"
              value={formData.arrosage}
              onChange={(e) => setFormData({ ...formData, arrosage: e.target.value as any })}
            >
              <option value="manuel">Manuel</option>
              <option value="goutte-a-goutte">Goutte-à-goutte</option>
              <option value="asperseur">Automatique</option>
              <option value="aucun">Pluie uniquement</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Légumes & Aromates souhaités</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ex: Tomates, Basilic..."
              className="flex-grow px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none"
              value={currentPref}
              onChange={(e) => setCurrentPref(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPreference())}
            />
            <button type="button" onClick={addPreference} className="bg-green-600 text-white px-6 rounded-xl hover:bg-green-700">
              <i className="fas fa-plus"></i>
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.preferences.map((p, i) => (
              <span key={i} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-100 flex items-center gap-2">
                {p} <i className="fas fa-times cursor-pointer" onClick={() => setFormData(prev => ({ ...prev, preferences: prev.preferences.filter((_, idx) => idx !== i) }))}></i>
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 rounded-2xl text-lg font-bold transition-all shadow-xl flex items-center justify-center gap-3 ${
            isLoading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700 hover:scale-[1.01]'
          }`}
        >
          {isLoading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-seedling"></i>}
          {isLoading ? "Raisonnement en cours..." : "Générer mon Plan Potager"}
        </button>
      </form>
    </div>
  );
};

export default GardenForm;
