
import React, { useState, useCallback, useRef } from 'react';
import { PC_COMPONENTS } from './constants.ts';
import { SetupState, GenerationHistoryItem } from './types.ts';
import { generateDreamSetup } from './services/geminiService.ts';
import ComponentCard from './components/ComponentCard.tsx';

const App: React.FC = () => {
  const [state, setState] = useState<SetupState>({
    originalImage: null,
    editedImage: null,
    selectedComponents: [],
    isGenerating: false,
    error: null,
  });

  const [history, setHistory] = useState<GenerationHistoryItem[]>([]);
  const [customInstructions, setCustomInstructions] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({ 
          ...prev, 
          originalImage: reader.result as string, 
          editedImage: null,
          error: null 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleComponent = (id: string) => {
    setState(prev => ({
      ...prev,
      selectedComponents: prev.selectedComponents.includes(id)
        ? prev.selectedComponents.filter(c => c !== id)
        : [...prev.selectedComponents, id]
    }));
  };

  const handleGenerate = async () => {
    if (!state.originalImage) return;
    
    setState(prev => ({ ...prev, isGenerating: true, error: null }));
    
    try {
      const result = await generateDreamSetup(
        state.originalImage,
        state.selectedComponents.map(id => PC_COMPONENTS.find(c => c.id === id)?.name || id),
        customInstructions
      );
      
      const newHistoryItem: GenerationHistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        original: state.originalImage,
        edited: result,
        prompt: state.selectedComponents.join(', ')
      };

      setHistory(prev => [newHistoryItem, ...prev]);
      setState(prev => ({ ...prev, editedImage: result, isGenerating: false }));
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        isGenerating: false, 
        error: "Falha ao gerar o setup dos seus sonhos. Verifique se a chave de API está configurada." 
      }));
    }
  };

  const resetSetup = () => {
    setState({
      originalImage: null,
      editedImage: null,
      selectedComponents: [],
      isGenerating: false,
      error: null,
    });
    setCustomInstructions('');
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-500 p-2 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.5)]">
              <i className="fas fa-microchip text-slate-900 text-xl"></i>
            </div>
            <h1 className="font-orbitron text-xl font-bold tracking-wider hidden sm:block">
              MONTE SEU <span className="text-cyan-400">SETUP</span>
            </h1>
          </div>
          <button 
            onClick={resetSetup}
            className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
          >
            <i className="fas fa-rotate-left mr-2"></i> Resetar Espaço
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Coluna Esquerda: Editor & Canvas */}
        <div className="lg:col-span-8 space-y-6">
          <section className="glass rounded-3xl overflow-hidden min-h-[400px] flex flex-col relative group">
            {!state.originalImage ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex flex-col items-center justify-center p-12 cursor-pointer hover:bg-white/5 transition-all group"
              >
                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl">
                  <i className="fas fa-camera text-3xl text-cyan-400"></i>
                </div>
                <h2 className="text-2xl font-bold mb-2">Envie seu Espaço Atual</h2>
                <p className="text-slate-400 text-center max-w-sm">
                  Tire uma foto nítida da sua mesa para começar a construir seu setup gamer ideal.
                </p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
            ) : (
              <div className="relative flex-1 bg-slate-900 flex items-center justify-center p-4">
                {state.isGenerating ? (
                  <div className="absolute inset-0 z-20 glass flex flex-col items-center justify-center text-center px-4">
                    <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mb-6"></div>
                    <p className="font-orbitron text-cyan-400 animate-pulse">CONSTRUINDO SEU SETUP DOS SONHOS...</p>
                    <p className="text-slate-500 text-sm mt-2">Integrando componentes de ponta e efeitos RGB</p>
                  </div>
                ) : null}

                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/5">
                  <img 
                    src={state.editedImage || state.originalImage} 
                    alt="Espaço do Setup" 
                    className="w-full h-full object-cover"
                  />
                  
                  {state.editedImage && (
                    <div className="absolute top-4 right-4 flex gap-2">
                       <button className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold border border-white/10">
                        <i className="fas fa-sparkles text-cyan-400 mr-2"></i> GERADO PELA IA
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Histórico / Gerações Anteriores */}
          {history.length > 0 && (
            <section>
              <h2 className="font-orbitron text-sm text-slate-500 uppercase tracking-widest mb-4">Gerações Recentes</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {history.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => setState(prev => ({ ...prev, editedImage: item.edited }))}
                    className={`flex-shrink-0 w-48 aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                      state.editedImage === item.edited ? 'border-cyan-400 scale-95' : 'border-transparent hover:border-white/20'
                    }`}
                  >
                    <img src={item.edited} className="w-full h-full object-cover" alt="Histórico" />
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Coluna Direita: Controles */}
        <div className="lg:col-span-4 space-y-6">
          <section className="glass rounded-3xl p-6 flex flex-col h-full">
            <div className="mb-6">
              <h2 className="font-orbitron text-lg font-bold mb-1">CONFIGURAR</h2>
              <p className="text-slate-400 text-xs">Selecione os componentes que deseja adicionar</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {PC_COMPONENTS.map(comp => (
                <ComponentCard 
                  key={comp.id} 
                  component={comp} 
                  isSelected={state.selectedComponents.includes(comp.id)}
                  onToggle={toggleComponent}
                />
              ))}
            </div>

            <div className="mb-6">
              <label className="block text-xs font-orbitron text-slate-500 mb-2 uppercase tracking-tighter">Prompt Personalizado (Opcional)</label>
              <textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="Ex: Adicione uma luminária de lava e painéis Nanoleaf na parede..."
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all resize-none"
                rows={3}
              />
            </div>

            <div className="mt-auto pt-6 border-t border-white/5">
              {state.error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-xs flex items-center gap-2">
                  <i className="fas fa-triangle-exclamation"></i>
                  {state.error}
                </div>
              )}
              
              <button
                disabled={!state.originalImage || state.isGenerating}
                onClick={handleGenerate}
                className={`w-full py-4 rounded-xl font-orbitron font-bold tracking-widest text-slate-900 transition-all flex items-center justify-center gap-3 ${
                  !state.originalImage || state.isGenerating
                    ? 'bg-slate-700 cursor-not-allowed text-slate-400'
                    : 'bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.4)] active:scale-95'
                }`}
              >
                {state.isGenerating ? (
                  <>
                    <i className="fas fa-spinner animate-spin"></i>
                    PROJETANDO...
                  </>
                ) : (
                  <>
                    <i className="fas fa-bolt"></i>
                    CONSTRUIR SETUP
                  </>
                )}
              </button>
              
              <p className="text-[10px] text-center text-slate-500 mt-4 leading-relaxed">
                Desenvolvido com Gemini 2.5 Flash Image. A geração pode levar de 15 a 30 segundos dependendo da complexidade.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Botão Flutuante para Mobile */}
      <div className="fixed bottom-6 right-6 lg:hidden">
         <button 
           onClick={() => fileInputRef.current?.click()}
           className="w-14 h-14 bg-cyan-400 rounded-full shadow-2xl flex items-center justify-center text-slate-900 text-xl"
         >
           <i className="fas fa-plus"></i>
         </button>
      </div>
    </div>
  );
};

export default App;
