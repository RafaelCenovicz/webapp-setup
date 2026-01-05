
import { PCComponent } from './types';

export const PC_COMPONENTS: PCComponent[] = [
  { id: 'glass-case', name: 'Gabinete de Vidro', category: 'Gabinete', description: 'Torre moderna com laterais em vidro temperado', icon: 'fa-box' },
  { id: 'rgb-fans', name: 'Coolers RGB', category: 'Iluminação', description: 'Fans LED vibrantes e customizáveis', icon: 'fa-fan' },
  { id: 'ultrawide', name: 'Monitor Ultrawide 49"', category: 'Monitor', description: 'Tela curva massiva e imersiva', icon: 'fa-desktop' },
  { id: 'dual-monitor', name: 'Setup Dual Monitor', category: 'Monitor', description: 'Dois displays 4K para multitasking', icon: 'fa-display' },
  { id: 'mech-kb', name: 'Teclado Mecânico', category: 'Periféricos', description: 'Teclas táteis com retroiluminação RGB', icon: 'fa-keyboard' },
  { id: 'gaming-mouse', name: 'Mouse Gamer Pro', category: 'Periféricos', description: 'Mouse wireless de alta performance', icon: 'fa-mouse' },
  { id: 'led-strips', name: 'Fitas LED Ambientais', category: 'Iluminação', description: 'Iluminação de acento para parede e mesa', icon: 'fa-lightbulb' },
  { id: 'cyberpunk', name: 'Tema Cyberpunk', category: 'Estilo', description: 'Estética neon rosa e ciano', icon: 'fa-city' },
  { id: 'minimalist', name: 'Branco Minimalista', category: 'Estilo', description: 'Setup limpo, clínico e todo branco', icon: 'fa-circle-dot' },
  { id: 'stealth', name: 'Stealth Black', category: 'Estilo', description: 'Visual profissional em preto fosco', icon: 'fa-moon' },
];

export const MODEL_NAME = 'gemini-2.5-flash-image';
