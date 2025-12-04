import React, { useState, useEffect, useCallback } from 'react';
import { GameIcon } from './Icon';
import { GameContent, GameMode, Subject } from '../types';
import { generateGameContent, getClassicContent } from '../services/geminiService';
import { Sparkles, Trophy, Home, Volume2, ArrowRight } from 'lucide-react';

interface GameProps {
  mode: GameMode;
  subject: Subject;
  onExit: () => void;
  onScore: () => void;
}

export const Game: React.FC<GameProps> = ({ mode, subject, onExit, onScore }) => {
  const [content, setContent] = useState<GameContent | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Theme configuration based on Subject
  const getTheme = () => {
    switch (subject) {
      case Subject.ENGLISH: return { bg: 'bg-brand-pink', text: 'text-brand-pink', light: 'bg-red-50', name: 'English' };
      case Subject.SCIENCE: return { bg: 'bg-brand-teal', text: 'text-brand-teal', light: 'bg-green-50', name: 'Science' };
      default: return { bg: 'bg-brand-blue', text: 'text-brand-blue', light: 'bg-blue-50', name: 'Math' };
    }
  };
  const theme = getTheme();

  const loadNext = useCallback(async () => {
    setFeedback(null);
    setLoading(true);

    if (mode === GameMode.STORY) {
      const data = await generateGameContent(subject);
      if (data) setContent(data);
      else setContent(getClassicContent(subject)); // Fallback
    } else {
      // Classic Mode (Offline/Fast)
      setTimeout(() => {
        setContent(getClassicContent(subject));
      }, 400);
    }
    setLoading(false);
  }, [mode, subject]);

  useEffect(() => {
    loadNext();
  }, [loadNext]);

  // Accessibility: Text-to-Speech
  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    // Try to select a pleasant voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha'));
    if (preferred) utterance.voice = preferred;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (content && !loading) {
      const textToSpeak = content.story ? `${content.story}. ${content.text}` : content.text;
      speak(textToSpeak);
    }
  }, [content, loading]);

  const handleAnswer = (selected: string) => {
    if (!content) return;
    
    // Loose comparison for numbers as strings
    if (selected.toString().toLowerCase() === content.answer.toString().toLowerCase()) {
      setFeedback('correct');
      setScore(s => s + 1);
      setStreak(s => s + 1);
      onScore(); // Update global score
      speak(["Great Job!", "Awesome!", "You did it!", "Super star!"].sort(() => Math.random() - 0.5)[0]);
      setTimeout(loadNext, 1500);
    } else {
      setFeedback('wrong');
      setStreak(0);
      speak("Try again!");
    }
  };

  if (loading || !content) {
    return (
      <div className={`flex flex-col items-center justify-center h-full ${theme.light} animate-pulse`}>
        <Sparkles className={`w-20 h-20 ${theme.text} mb-6 animate-spin`} />
        <p className={`text-3xl font-bold ${theme.text}`}>Thinking...</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full w-full max-w-4xl mx-auto p-4 relative font-sans`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4 glass-panel p-3 md:p-4 rounded-3xl shadow-lg z-10">
        <button onClick={onExit} className="p-3 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
          <Home size={28} />
        </button>

        {/* Subject Label */}
        <div className={`hidden md:block px-4 py-1 rounded-full ${theme.bg} text-white font-bold tracking-widest text-sm shadow-inner`}>
          {theme.name}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
             <div className={`p-2 rounded-full ${theme.bg} text-white`}>
               <Trophy size={20} />
             </div>
             <span className="text-2xl md:text-3xl font-black text-gray-700">{score}</span>
          </div>
          <div className="flex items-center gap-1 text-brand-orange font-bold text-lg md:text-xl">
             🔥 {streak}
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        
        {/* Story Bubble */}
        {(content.story) && (
          <div className="mb-6 w-full max-w-2xl p-6 bg-white rounded-3xl shadow-xl border-b-8 border-gray-100 text-center relative animate-pop">
             <button onClick={() => speak(content.story!)} className={`absolute -top-4 -right-4 ${theme.bg} text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform`}>
               <Volume2 size={24} />
             </button>
            <p className="text-2xl md:text-3xl font-bold text-gray-700 leading-snug">
              {content.story}
            </p>
          </div>
        )}

        {/* Question & Visuals */}
        <div className="w-full max-w-3xl flex flex-col items-center gap-8 mb-8">
          
          {/* MATH SPECIFIC VISUALS */}
          {subject === Subject.MATH && content.mathParams && (
            <div className="flex flex-wrap items-center justify-center gap-4 bg-white/60 p-6 rounded-3xl backdrop-blur-sm">
              <div className="flex flex-wrap gap-2 justify-center max-w-[150px]">
                {Array.from({ length: content.mathParams.num1 }).map((_, i) => (
                  <GameIcon key={`n1-${i}`} type={content.visualType || 'circle'} className="w-10 h-10 animate-bounce-slow" />
                ))}
              </div>
              <div className="text-6xl font-black text-gray-400 opacity-50">{content.mathParams.operator}</div>
              <div className="flex flex-wrap gap-2 justify-center max-w-[150px]">
                {Array.from({ length: content.mathParams.num2 }).map((_, i) => (
                  <GameIcon key={`n2-${i}`} type={content.visualType || 'circle'} className="w-10 h-10 animate-bounce-slow" style={{ animationDelay: '0.5s' }} />
                ))}
              </div>
            </div>
          )}

          {/* NON-MATH VISUALS */}
          {subject !== Subject.MATH && content.visualType && (
            <div className="animate-float">
               <GameIcon type={content.visualType} className="w-32 h-32 md:w-48 md:h-48 drop-shadow-2xl" />
            </div>
          )}

          {/* Question Text */}
          <h2 className="text-4xl md:text-5xl font-black text-gray-800 text-center tracking-wide drop-shadow-sm">
            {content.text}
          </h2>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl px-4">
          {content.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(opt)}
              className={`
                group relative h-24 md:h-32 rounded-3xl text-3xl md:text-4xl font-black shadow-[0_8px_0_0_rgba(0,0,0,0.1)] transition-all transform hover:-translate-y-1 active:translate-y-1 active:shadow-none
                ${feedback === 'correct' && opt === content.answer ? 'bg-green-500 text-white ring-8 ring-green-200 shadow-none' : ''}
                ${feedback === 'wrong' && opt !== content.answer ? 'opacity-50 bg-gray-200 text-gray-400' : 'bg-white hover:bg-gray-50 text-gray-700'}
              `}
            >
              {opt}
              {/* Hover Effect Icon */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <ArrowRight className="w-6 h-6 text-gray-300" />
              </div>
            </button>
          ))}
        </div>

        {/* Celebration Overlay */}
        {feedback === 'correct' && (
          <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
             <div className="text-[150px] animate-bounce filter drop-shadow-2xl">🎉</div>
             <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        )}
      </div>
    </div>
  );
};