
import React, { useState } from 'react';
import { SYMPTOMS, INTENSITY_OPTIONS } from './constants';
import { UserAssessment, EducationalResult, Intensity } from './types';
import { Button } from './components/Button';
import { SymptomCard } from './components/SymptomCard';
import { getEducationalGuidance } from './services/geminiService';

enum Step {
  Welcome,
  Symptoms,
  Personal,
  Details,
  Loading,
  Results
}

const App: React.FC = () => {
  const [step, setStep] = useState<Step>(Step.Welcome);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [intensity, setIntensity] = useState<Intensity>('Baixa');
  const [continuousMedication, setContinuousMedication] = useState('');
  const [allergies, setAllergies] = useState('');
  
  // New States
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  
  const [result, setResult] = useState<EducationalResult | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('Analisando informações...');
  const [error, setError] = useState<string | null>(null);

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleStart = () => setStep(Step.Symptoms);

  const calculateBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (w > 0 && h > 0) return w / (h * h);
    return null;
  };

  const handleSubmit = async () => {
    setStep(Step.Loading);
    setError(null);
    
    const messages = [
      "Processando seus sintomas...",
      "Analisando fatores regionais...",
      "Calculando índices corporais...",
      "Consultando guias educativos...",
      "Verificando sinais de alerta..."
    ];
    
    let msgIdx = 0;
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % messages.length;
      setLoadingMessage(messages[msgIdx]);
    }, 2000);

    try {
      const bmi = calculateBMI();
      const assessment: UserAssessment = {
        selectedSymptoms: selectedSymptoms.map(id => SYMPTOMS.find(s => s.id === id)?.label || ''),
        description,
        intensity,
        continuousMedication,
        allergies,
        weight: parseFloat(weight) || undefined,
        height: parseFloat(height) || undefined,
        bmi: bmi || undefined,
        location
      };
      const data = await getEducationalGuidance(assessment);
      setResult(data);
      setStep(Step.Results);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro inesperado.");
      setStep(Step.Details);
    } finally {
      clearInterval(interval);
    }
  };

  const reset = () => {
    setStep(Step.Welcome);
    setSelectedSymptoms([]);
    setDescription('');
    setIntensity('Baixa');
    setContinuousMedication('');
    setAllergies('');
    setWeight('');
    setHeight('');
    setLocation('');
    setResult(null);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Abaixo do peso', color: 'text-amber-500' };
    if (bmi < 25) return { label: 'Peso normal', color: 'text-green-500' };
    if (bmi < 30) return { label: 'Sobrepeso', color: 'text-amber-500' };
    return { label: 'Obesidade', color: 'text-red-500' };
  };

  const renderStep = () => {
    switch (step) {
      case Step.Welcome:
        return (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-fadeIn">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <i className="fa-solid fa-heart-pulse text-4xl text-blue-600"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Guia Saúde Fácil</h1>
            <p className="text-gray-600 mb-8 max-w-sm">
              Entenda melhor seus sintomas com inteligência artificial e receba orientações personalizadas.
            </p>
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8 text-left rounded-r-lg">
              <div className="flex items-start">
                <i className="fa-solid fa-triangle-exclamation text-amber-500 mt-1 mr-3"></i>
                <p className="text-sm text-amber-800 font-medium">
                  Aviso Importante: Este app é educativo. Em emergências, ligue para o 192 ou procure um hospital.
                </p>
              </div>
            </div>
            <Button onClick={handleStart} className="w-full max-w-xs">
              Começar Avaliação
            </Button>
          </div>
        );

      case Step.Symptoms:
        return (
          <div className="p-4 animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-800 mb-2">O que você está sentindo?</h2>
            <p className="text-sm text-gray-500 mb-6">Selecione todos os sintomas aplicáveis.</p>
            
            <div className="grid grid-cols-3 gap-3 mb-24">
              {SYMPTOMS.map(s => (
                <SymptomCard 
                  key={s.id} 
                  symptom={s} 
                  isSelected={selectedSymptoms.includes(s.id)} 
                  onToggle={() => toggleSymptom(s.id)} 
                />
              ))}
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 flex gap-4 max-w-md mx-auto">
               <Button variant="ghost" onClick={() => setStep(Step.Welcome)} className="flex-1">Voltar</Button>
               <Button onClick={() => setStep(Step.Personal)} className="flex-[2]" disabled={selectedSymptoms.length === 0}>
                 Próximo ({selectedSymptoms.length})
               </Button>
            </div>
          </div>
        );

      case Step.Personal:
        const currentBMI = calculateBMI();
        return (
          <div className="p-4 animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Informações Pessoais</h2>
            
            <div className="bg-blue-50 p-5 rounded-2xl mb-8 border border-blue-100">
              <p className="text-sm text-blue-700 mb-4 font-medium flex items-center gap-2">
                <i className="fa-solid fa-calculator"></i>
                Seu IMC será usado para refinar a análise.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-blue-900 mb-1 uppercase">Peso (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Ex: 75"
                    className="w-full p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-blue-900 mb-1 uppercase">Altura (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="Ex: 170"
                    className="w-full p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                  />
                </div>
              </div>
              {currentBMI && (
                <div className="mt-4 pt-4 border-t border-blue-200 flex justify-between items-center">
                  <span className="text-sm text-blue-800 font-semibold">Seu IMC: {currentBMI.toFixed(1)}</span>
                  <span className={`text-sm font-bold ${getBMICategory(currentBMI).color}`}>
                    {getBMICategory(currentBMI).label}
                  </span>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sua Localização</label>
              <div className="relative">
                <i className="fa-solid fa-location-dot absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Cidade - UF"
                  className="w-full p-3 pl-12 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Ajuda a identificar surtos regionais e riscos climáticos.
              </p>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 flex gap-4 max-w-md mx-auto">
               <Button variant="ghost" onClick={() => setStep(Step.Symptoms)} className="flex-1">Voltar</Button>
               <Button onClick={() => setStep(Step.Details)} className="flex-[2]">Continuar</Button>
            </div>
          </div>
        );

      case Step.Details:
        return (
          <div className="p-4 animate-fadeIn">
             <h2 className="text-xl font-bold text-gray-800 mb-6">Últimos Detalhes</h2>
             
             <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Intensidade da Dor/Sintoma</label>
                <div className="flex gap-2">
                  {INTENSITY_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setIntensity(opt)}
                      className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${
                        intensity === opt 
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' 
                          : 'border-gray-100 bg-white text-gray-500'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
             </div>

             <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Descreva mais (opcional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Algum outro detalhe importante?"
                  className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none text-gray-700"
                />
             </div>

             <div className="mb-24">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Medicamentos & Alergias</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Uso contínuo?</label>
                  <input
                    type="text"
                    value={continuousMedication}
                    onChange={(e) => setContinuousMedication(e.target.value)}
                    placeholder="Medicamentos que toma sempre..."
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Alguma alergia?</label>
                  <input
                    type="text"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder="Remédios que você tem alergia..."
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
             </div>

             {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

             <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 flex gap-4 max-w-md mx-auto">
               <Button variant="ghost" onClick={() => setStep(Step.Personal)} className="flex-1">Voltar</Button>
               <Button onClick={handleSubmit} className="flex-[2]">Analisar Agora</Button>
            </div>
          </div>
        );

      case Step.Loading:
        return (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-8 animate-pulse">
            <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-8"></div>
            <h2 className="text-xl font-bold text-gray-800 mb-3">{loadingMessage}</h2>
            <p className="text-sm text-gray-500">Estamos cruzando seus sintomas com dados regionais e corporais.</p>
          </div>
        );

      case Step.Results:
        if (!result) return null;
        return (
          <div className="p-4 animate-fadeIn pb-32">
            <div className={`mb-6 p-6 rounded-3xl border-2 ${result.isUrgent ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'}`}>
              <div className="flex items-center gap-3 mb-3">
                <i className={`fa-solid ${result.isUrgent ? 'fa-circle-exclamation text-red-500' : 'fa-circle-info text-blue-500'} text-3xl`}></i>
                <h2 className="text-2xl font-bold text-gray-800">{result.potentialCondition}</h2>
              </div>
              <p className="text-gray-700 leading-relaxed font-medium">{result.explanation}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-8">
               {result.locationContext && (
                 <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex gap-4 items-start">
                   <div className="text-emerald-500 text-xl"><i className="fa-solid fa-earth-americas"></i></div>
                   <div>
                     <h4 className="text-sm font-bold text-emerald-900 mb-1">Contexto Regional</h4>
                     <p className="text-xs text-emerald-800 leading-tight">{result.locationContext}</p>
                   </div>
                 </div>
               )}
               {result.bmiContext && (
                 <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 flex gap-4 items-start">
                   <div className="text-indigo-500 text-xl"><i className="fa-solid fa-weight-scale"></i></div>
                   <div>
                     <h4 className="text-sm font-bold text-indigo-900 mb-1">Impacto do Peso</h4>
                     <p className="text-xs text-indigo-800 leading-tight">{result.bmiContext}</p>
                   </div>
                 </div>
               )}
            </div>

            <section className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-pills text-blue-600"></i>
                Guia de Medicamentos Comuns
              </h3>
              <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{result.generalMedicationInfo}</p>
                <div className="bg-amber-50 p-3 rounded-xl">
                  <p className="text-[10px] font-bold text-amber-800 uppercase mb-1">Aviso de Segurança</p>
                  <p className="text-[11px] text-amber-700">
                    O uso de medicamentos sem prescrição pode mascarar problemas sérios ou causar interações perigosas. Nunca exceda a dose recomendada.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-hospital-user text-red-500"></i>
                Sinais de Alerta
              </h3>
              <div className="space-y-2">
                {result.warningSigns.map((sign, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-red-50/30 p-3 rounded-xl border border-red-50">
                    <i className="fa-solid fa-triangle-exclamation text-red-400 text-xs"></i>
                    <p className="text-gray-700 text-sm">{sign}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="bg-gray-100 p-6 rounded-2xl mb-8">
              <p className="text-[10px] text-gray-500 text-center italic">
                Este relatório foi gerado por IA para fins educativos. Não substitui consulta médica. Procure ajuda profissional se os sintomas persistirem.
              </p>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 max-w-md mx-auto">
               <Button onClick={reset} variant="primary" className="w-full">
                 Nova Avaliação
               </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto relative shadow-2xl overflow-x-hidden border-x border-gray-100">
      {step !== Step.Welcome && (
        <header className="p-4 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b border-gray-100">
          <button onClick={reset} className="text-blue-600 font-bold flex items-center gap-2 transition-opacity hover:opacity-70">
            <i className="fa-solid fa-house"></i>
            <span className="text-xs uppercase tracking-wider">Início</span>
          </button>
          <div className="text-center">
            <h1 className="text-sm font-extrabold text-gray-900 uppercase tracking-[0.2em]">Guia Saúde</h1>
          </div>
          <div className="w-10"></div>
        </header>
      )}

      <main className="pb-20">
        {renderStep()}
      </main>
    </div>
  );
};

export default App;
