
import React from 'react';
import { Symptom } from '../types';

interface SymptomCardProps {
  symptom: Symptom;
  isSelected: boolean;
  onToggle: () => void;
}

export const SymptomCard: React.FC<SymptomCardProps> = ({ symptom, isSelected, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' 
          : 'border-gray-100 bg-white text-gray-600 hover:border-blue-200'
      }`}
    >
      <div className={`text-2xl mb-2 ${isSelected ? 'text-blue-500' : 'text-gray-400'}`}>
        <i className={`fa-solid ${symptom.icon}`}></i>
      </div>
      <span className="text-xs font-medium text-center leading-tight">
        {symptom.label}
      </span>
      {isSelected && (
        <div className="absolute top-1 right-1">
          <i className="fa-solid fa-circle-check text-blue-500 text-sm"></i>
        </div>
      )}
    </button>
  );
};
