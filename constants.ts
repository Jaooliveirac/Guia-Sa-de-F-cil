
import { Symptom, Intensity } from './types';

export const SYMPTOMS: Symptom[] = [
  // Dores
  { id: 'dor-cabeca', label: 'Dor de cabeça', category: 'Dores', icon: 'fa-head-side-virus' },
  { id: 'dor-garganta', label: 'Dor de garganta', category: 'Dores', icon: 'fa-head-side-mask' },
  { id: 'dor-muscular', label: 'Dor muscular', category: 'Dores', icon: 'fa-child' },
  { id: 'dor-articulacoes', label: 'Dor nas articulações', category: 'Dores', icon: 'fa-bone' },
  { id: 'dor-abdominal', label: 'Dor abdominal', category: 'Dores', icon: 'fa-stomach' },
  { id: 'dor-peito', label: 'Dor no peito', category: 'Dores', icon: 'fa-heart-pulse' },
  { id: 'dor-costas', label: 'Dor nas costas', category: 'Dores', icon: 'fa-user-injured' },
  { id: 'dor-ouvido', label: 'Dor de ouvido', category: 'Dores', icon: 'fa-ear-listen' },

  // Geral
  { id: 'febre', label: 'Febre', category: 'Geral', icon: 'fa-temperature-high' },
  { id: 'fadiga', label: 'Fadiga', category: 'Geral', icon: 'fa-battery-empty' },
  { id: 'tontura', label: 'Tontura', category: 'Geral', icon: 'fa-spinner' },
  { id: 'calafrios', label: 'Calafrios', category: 'Geral', icon: 'fa-snowflake' },
  { id: 'sudorese', label: 'Sudorese excessiva', category: 'Geral', icon: 'fa-droplet' },

  // Respiratório
  { id: 'tosse', label: 'Tosse', category: 'Respiratório', icon: 'fa-lungs' },
  { id: 'congestao-nasal', label: 'Congestão nasal', category: 'Respiratório', icon: 'fa-nose-otter' },
  { id: 'coriza', label: 'Coriza', category: 'Respiratório', icon: 'fa-droplet' },
  { id: 'falta-ar', label: 'Falta de ar', category: 'Respiratório', icon: 'fa-wind' },

  // Digestivo
  { id: 'nausea', label: 'Náusea', category: 'Digestivo', icon: 'fa-face-vomit' },
  { id: 'vomito', label: 'Vômito', category: 'Digestivo', icon: 'fa-face-vomit' },
  { id: 'diarreia', label: 'Diarreia', category: 'Digestivo', icon: 'fa-toilet' },
  { id: 'constipacao', label: 'Constipação', category: 'Digestivo', icon: 'fa-toilet' },
  { id: 'perda-apetite', label: 'Perda de apetite', category: 'Digestivo', icon: 'fa-utensils' },
  { id: 'aumento-apetite', label: 'Aumento de apetite', category: 'Digestivo', icon: 'fa-burger' },

  // Pele/Sentidos
  { id: 'coceira', label: 'Coceira', category: 'Pele/Sentidos', icon: 'fa-hand-dots' },
  { id: 'erupcoes', label: 'Erupções na pele', category: 'Pele/Sentidos', icon: 'fa-disease' },
  { id: 'olhos-vermelhos', label: 'Olhos vermelhos', category: 'Pele/Sentidos', icon: 'fa-eye' },
  { id: 'visao-turva', label: 'Visão turva', category: 'Pele/Sentidos', icon: 'fa-eye-slash' },
  { id: 'zumbido', label: 'Zumbido no ouvido', category: 'Pele/Sentidos', icon: 'fa-ear-deaf' },
  { id: 'luz-sensibilidade', label: 'Sensibilidade à luz', category: 'Pele/Sentidos', icon: 'fa-sun' },
  { id: 'inchaco', label: 'Inchaço', category: 'Pele/Sentidos', icon: 'fa-up-right-and-down-left-from-center' },

  // Mental/Peso
  { id: 'ansiedade', label: 'Ansiedade', category: 'Mental/Peso', icon: 'fa-brain' },
  { id: 'insonia', label: 'Insônia', category: 'Mental/Peso', icon: 'fa-moon' },
  { id: 'humor', label: 'Alterações de humor', category: 'Mental/Peso', icon: 'fa-face-smile-wink' },
  { id: 'perda-peso', label: 'Perda de peso involuntária', category: 'Mental/Peso', icon: 'fa-weight-scale' },
  { id: 'ganho-peso', label: 'Ganho de peso involuntário', category: 'Mental/Peso', icon: 'fa-weight-scale' },
  { id: 'palpitacoes', label: 'Palpitações', category: 'Mental/Peso', icon: 'fa-heart' },
];

export const INTENSITY_OPTIONS: Intensity[] = ['Baixa', 'Média', 'Alta'];
