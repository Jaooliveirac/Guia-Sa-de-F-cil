
export type Intensity = 'Baixa' | 'Média' | 'Alta';

export interface Symptom {
  id: string;
  label: string;
  category: 'Geral' | 'Dores' | 'Respiratório' | 'Digestivo' | 'Pele/Sentidos' | 'Mental/Peso';
  icon: string;
}

export interface UserAssessment {
  selectedSymptoms: string[];
  description: string;
  intensity: Intensity;
  continuousMedication: string;
  allergies: string;
  weight?: number;
  height?: number;
  bmi?: number;
  location?: string;
}

export interface EducationalResult {
  potentialCondition: string;
  explanation: string;
  generalMedicationInfo: string;
  warningSigns: string[];
  isUrgent: boolean;
  bmiContext?: string;
  locationContext?: string;
}
