import React, { useState, useEffect } from 'react';
import { GameState, Subject, GameMode } from './types';
import { Game } from './components/MathGame';
import { Play, Sparkles, Calculator, FlaskConical, Languages, ArrowLeft, Trophy } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<GameState>({ view: 'MENU', subject: null, mode: null });
  const [totalScore, setTotalScore] = useState(() => {
    try {
      const saved = localStorage.getItem('littleLearnersTotalScore');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    localStorage.setItem('littleLearnersTotalScore', totalScore.toString());
  }, [totalScore]);

  const handleScoreUpdate = () => {
    setTotalScore(prev => prev + 1);
  };

  const selectSubject = (subject: Subject) => {
    setState(prev => ({ ...prev, subject }));
  };

  const selectMode = (mode: GameMode) => {
    setState(prev => ({ ...prev, view: 'GAME', mode }));
  };

  const reset = () => {
    setState({ view: 'MENU', subject: null, mode: null });
  };

  const backToSubject = () => {
    setState(prev => ({ ...prev, subject: null }));
  };

  const getSubjectDetails = (subject: Subject) => {
    switch (subject) {
      case Subject.MATH: 
        return { 
          name: 'Math World', 
          icon: Calculator, 
          color: 'text-brand-blue', 
          bg: 'bg-brand-blue',
          gradient: 'from-brand-blue to-blue-600',
          desc: 'Numbers & Counting'
        };
      case Subject.ENGLISH: 
        return { 
          name: 'English Fun', 
          icon: Languages, 
          color: 'text-brand-pink', 
          bg: 'bg-brand-pink',
          gradient: 'from-brand-pink to-rose-500',
          desc: 'Words & Letters'
        };
      case Subject.SCIENCE: 
        return { 
          name: 'Science Lab', 
          icon: FlaskConical, 
          color: 'text-brand-teal', 
          bg: 'bg-brand-teal',
          gradient: 'from-brand-teal to-emerald-600',
          desc: 'Nature & World'
        };
      default: 
        return { 
          name: 'Unknown', 
          icon: Sparkles, 
          color: 'text-gray-500', 
          bg: 'bg-gray-500',
          gradient: 'from-gray-400 to-gray-600',
          desc: ''
        };
    }
  };

  // Render Logic
  if (state.view === 'GAME' && state.subject && state.mode) {
    return (
      <Game 
        mode={state.mode} 
        subject={state.subject} 
        onExit={reset} 
        onScore={handleScoreUpdate}
      />
    );
  }

  // Sub-Menu: Mode Selection
  if (state.subject && !state.mode) {
    const subjectInfo = getSubjectDetails(state.subject);
    const SubjectIcon = subjectInfo.icon;

    return (
      <div className="h-full flex flex-col items-center justify-center p-6 space-y-8 animate-pop relative overflow-hidden">
         {/* Background accent */}
         <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${subjectInfo.gradient}`}></div>

         <button onClick={backToSubject} className="absolute top-6 left-6 p-3 bg-white rounded-full shadow-md text-gray-500 hover:bg-gray-100 z-10 transition-transform hover:scale-110">
           <ArrowLeft />
         </button>
         
         <div className="text-center space-y-4 relative z-10">
           {/* Subject Indicator */}
           <div className="flex flex-col items-center gap-3">
             <div className={`p-5 rounded-[2rem] bg-gradient-to-br ${subjectInfo.gradient} shadow-2xl transform -rotate-3`}>
               <SubjectIcon size={48} className="text-white drop-shadow-md" />
             </div>
             <div>
                <h2 className={`text-5xl font-black ${subjectInfo.color} drop-shadow-sm`}>{subjectInfo.name}</h2>
                <p className="text-xl text-gray-500 font-medium mt-1">Choose your adventure</p>
             </div>
           </div>
         </div>

         <div className="grid gap-6 w-full max-w-md z-10 mt-8">
            <button 
              onClick={() => selectMode(GameMode.CLASSIC)}
              className="flex items-center gap-6 bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 group border-2 border-transparent hover:border-gray-200"
            >
              <div className={`bg-gray-100 p-4 rounded-2xl group-hover:${subjectInfo.bg} group-hover:text-white transition-colors ${subjectInfo.color}`}>
                <Play size={36} fill="currentColor" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-gray-800">Quick Practice</h3>
                <p className="text-gray-500 font-medium">Fast & Fun Questions</p>
              </div>
            </button>

            <button 
              onClick={() => selectMode(GameMode.STORY)}
              className="flex items-center gap-6 bg-gradient-to-r from-brand-purple to-indigo-600 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 group text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-2 bg-brand-yellow text-black text-xs font-bold rounded-bl-xl shadow-sm">
                 AI MAGIC
              </div>
              <div className="bg-white/20 p-4 rounded-2xl">
                <Sparkles size={36} className="animate-spin" style={{ animationDuration: '4s' }} />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold">Story Adventure</h3>
                <p className="text-white/80 font-medium">Magical tales & learning</p>
              </div>
            </button>
         </div>
      </div>
    );
  }

  // Main Menu: Subject Selection
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center animate-fade-in relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-brand-yellow rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-brand-pink rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="space-y-6 mb-12 relative z-10 flex flex-col items-center w-full">
        <div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-800 tracking-tight drop-shadow-sm">
            Little<span className="text-brand-blue">Learners</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-semibold max-w-md mx-auto mt-2">
            Pick a subject to start your journey!
          </p>
        </div>

        {/* Central Total Score Field */}
        <div className="glass-panel px-8 py-4 rounded-3xl flex items-center gap-5 shadow-xl transform hover:scale-105 transition-all duration-300 ring-4 ring-white/50 animate-pop">
          <div className="bg-brand-yellow p-3 rounded-full text-white shadow-lg animate-bounce-slow">
            <Trophy size={32} fill="currentColor" />
          </div>
          <div className="flex flex-col items-start">
             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Score</span>
             <span className="text-4xl font-black text-gray-800 leading-none">{totalScore}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl z-10">
        
        {/* Math Card */}
        <button 
          onClick={() => selectSubject(Subject.MATH)}
          className="group relative flex flex-col items-center justify-center p-8 h-64 rounded-[2.5rem] bg-gradient-to-br from-brand-blue to-blue-600 shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
        >
          <div className="absolute inset-0 bg-white/10 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Calculator className="w-20 h-20 text-white mb-4 drop-shadow-md group-hover:rotate-12 transition-transform duration-300" />
          <span className="text-3xl font-black text-white tracking-wide">Math</span>
          <span className="text-blue-100 font-medium mt-2">Numbers & Counting</span>
        </button>

        {/* English Card */}
        <button 
          onClick={() => selectSubject(Subject.ENGLISH)}
          className="group relative flex flex-col items-center justify-center p-8 h-64 rounded-[2.5rem] bg-gradient-to-br from-brand-pink to-rose-500 shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
        >
          <div className="absolute inset-0 bg-white/10 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Languages className="w-20 h-20 text-white mb-4 drop-shadow-md group-hover:-rotate-12 transition-transform duration-300" />
          <span className="text-3xl font-black text-white tracking-wide">English</span>
          <span className="text-rose-100 font-medium mt-2">Words & Letters</span>
        </button>

        {/* Science Card */}
        <button 
          onClick={() => selectSubject(Subject.SCIENCE)}
          className="group relative flex flex-col items-center justify-center p-8 h-64 rounded-[2.5rem] bg-gradient-to-br from-brand-teal to-emerald-600 shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
        >
          <div className="absolute inset-0 bg-white/10 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <FlaskConical className="w-20 h-20 text-white mb-4 drop-shadow-md group-hover:translate-y-[-5px] transition-transform duration-300" />
          <span className="text-3xl font-black text-white tracking-wide">Science</span>
          <span className="text-emerald-100 font-medium mt-2">Nature & World</span>
        </button>

      </div>
    </div>
  );
};

export default App;