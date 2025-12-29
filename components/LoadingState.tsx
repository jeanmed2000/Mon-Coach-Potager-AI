
import React, { useState, useEffect } from 'react';

const LoadingState: React.FC = () => {
  const [message, setMessage] = useState("Analyse de vos zones...");
  
  const messages = [
    "Analyse de vos zones...",
    "Calcul des compagnonnages optimaux...",
    "Respect des passages et contraintes...",
    "Sélection des variétés pour votre région...",
    "Finalisation de l'agencement visuel...",
    "Presque prêt ! Le coach fignole les détails."
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % messages.length;
      setMessage(messages[i]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <div className="relative w-24 h-24 mb-10">
        <div className="absolute inset-0 border-8 border-green-100 rounded-full"></div>
        <div className="absolute inset-0 border-8 border-green-600 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <i className="fas fa-brain text-3xl text-green-600 animate-pulse"></i>
        </div>
      </div>
      <h3 className="text-3xl font-serif font-bold text-gray-800 mb-3">{message}</h3>
      <p className="text-gray-500 max-w-sm mx-auto">
        L'intelligence artificielle Pro prend le temps de réfléchir à l'agencement idéal pour maximiser votre récolte.
      </p>
      <div className="mt-10 flex gap-3">
        {[0, 1, 2].map(i => (
          <div key={i} className={`w-3 h-3 bg-green-500 rounded-full animate-bounce`} style={{ animationDelay: `${i * 0.2}s` }}></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingState;
