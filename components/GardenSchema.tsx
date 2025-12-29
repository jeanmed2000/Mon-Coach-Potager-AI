
import React from 'react';
import { ZonePlan } from '../types';

interface GardenSchemaProps {
  // Fix: Property 'schema_visuel' does not exist on 'GardenPlanResponse'. 
  // Using ZonePlan instead which contains the layout grid details.
  schema: ZonePlan;
}

const GardenSchema: React.FC<GardenSchemaProps> = ({ schema }) => {
  if (!schema || !schema.grille) return null;

  // Initialize a 2D grid representation based on the plan dimensions
  const grid = Array(schema.lignes).fill(null).map(() => Array(schema.colonnes).fill(null));
  
  // Map cells from the linear grille array to the 2D grid structure
  schema.grille.forEach(cell => {
    // Safety check for coordinates within bounds
    if (cell.y < schema.lignes && cell.x < schema.colonnes) {
      if (grid[cell.y] && grid[cell.y][cell.x] === null) {
        grid[cell.y][cell.x] = cell;
      }
    }
  });

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <i className="fas fa-th text-green-600"></i>
        Plan d'Agencement - {schema.nomZone} (Vue de dessus)
      </h3>
      
      <div className="overflow-x-auto">
        <div 
          className="grid gap-2 mx-auto" 
          style={{ 
            gridTemplateColumns: `repeat(${schema.colonnes}, minmax(100px, 1fr))`,
            width: 'fit-content'
          }}
        >
          {grid.map((row, y) => (
            row.map((cell, x) => (
              <div 
                key={`${x}-${y}`}
                className="aspect-square rounded-xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center p-2 text-center transition-all hover:border-green-200"
                style={{ backgroundColor: cell ? `${cell.couleur}15` : 'transparent' }}
              >
                {cell ? (
                  <>
                    <div className="w-8 h-8 rounded-full mb-2 flex items-center justify-center text-white text-xs shadow-sm" style={{ backgroundColor: cell.couleur }}>
                      <i className="fas fa-leaf"></i>
                    </div>
                    <span className="text-[10px] font-bold text-gray-700 leading-tight uppercase">{cell.plante}</span>
                  </>
                ) : (
                  <span className="text-gray-300 text-[10px]">Vide</span>
                )}
              </div>
            ))
          ))}
        </div>
      </div>
      <p className="mt-4 text-xs text-gray-400 italic text-center">
        Note: Ce schéma est une suggestion d'agencement pour maximiser le compagnonnage et l'ensoleillement.
      </p>
    </div>
  );
};

export default GardenSchema;
