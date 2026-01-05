
export interface PCComponent {
  id: string;
  name: string;
  category: 'Gabinete' | 'Monitor' | 'Periféricos' | 'Iluminação' | 'Estilo';
  description: string;
  icon: string;
}

export interface SetupState {
  originalImage: string | null;
  editedImage: string | null;
  selectedComponents: string[];
  isGenerating: boolean;
  error: string | null;
}

export type GenerationHistoryItem = {
  id: string;
  timestamp: number;
  original: string;
  edited: string;
  prompt: string;
};
