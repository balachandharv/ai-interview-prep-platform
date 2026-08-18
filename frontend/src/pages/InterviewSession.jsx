import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useSpeechRecognition, useTimer } from '../hooks';
import { generateMockQuestions, checkAnswerQuality, wordCount } from '../utils/helpers';
import { Mic, Square, Check, ArrowRight, Lightbulb, Clock, Target, AlertTriangle } from 'lucide-react';

export default function InterviewSession() {
  const navigate = useNavigate();
  const location = useLocation();
  const config = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scores, setScores] = useState([]);
  const [difficulty, setDifficulty] = useState(config.difficulty || 'Medium');
  const [consecutiveHigh, setConsecutiveHigh] = useState(0);
  const [consecutiveLow, setConsecutiveLow] = useState(0);

  const { isListening, transcript, startListening, stopListening, resetTranscript } = useSpeechRecognition();
  const timer = useTimer(config.timerEnabled ? (config.timerMinutes || 3) * 60 : 0, true);
  const answerTimer = useTimer(0, false);

  useEffect(() => {
    const allQ = generateMockQuestions();
    const filtered = allQ.filter(q => {
      if (config.categories?.length && !config.categories.includes(q.category)) return false;
      return true;
    });
    setQuestions(filtered.slice(0, config.questionCount || 5));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      answerTimer.reset(0);
      answerTimer.start();
      if (config.timerEnabled) {
        timer.reset((config.timerMinutes || 3) * 60);
        timer.start();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, questions.length]);

  useEffect(() => {
    if (transcript) setAnswer(prev => prev + ' ' + transcript);
  }, [transcript]);

  useEffect(() => {
    if (timer.seconds === 0 && config.timerEnabled && timer.isActive) {
      toast('⏰ Time\'s up!', { style: { background: 'rgba(30,41,59,0.9)', color: '#FBBF24', border: '1px solid rgba(251,191,36,0.3)' } });
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.seconds]);

  const handleSubmit = useCallback(async () => {
    if (!answer.trim()) { toast.error('Please provide an answer', { style: { background: 'rgba(30,41,59,0.9)', color: '#FFF' } }); return; }
    const quality = checkAnswerQuality(answer);
    if (!quality.isValid) {
      if (!window.confirm('Your answer seems too short. Interviewers expect detailed responses. Submit anyway?')) return;
    }

    setIsSubmitting(true);
    timer.stop();
    answerTimer.stop();
    if (isListening) stopListening();

    // Simulate AI evaluation
    await new Promise(r => setTimeout(r, 1500));

    const score = Math.min(10, Math.max(1, 4 + Math.random() * 6));
    const mockFeedback = {
      score: Math.round(score * 10) / 10,
      correctness: Math.round((5 + Math.random() * 5) * 10) / 10,
      completeness: Math.round((4 + Math.random() * 6) * 10) / 10,
      clarity: Math.round((5 + Math.random() * 5) * 10) / 10,
      structure: Math.round((4 + Math.random() * 6) * 10) / 10,
      pointsCovered: ['Good understanding of core concepts', 'Mentioned key trade-offs'],
      pointsMissed: ['Could elaborate on edge cases', 'Missing complexity analysis'],
      sampleAnswer: 'A comprehensive answer would cover the key concepts, provide examples, discuss trade-offs, and conclude with practical applications.',
      tip: 'Try using the STAR method for behavioral questions to structure your response better.',
      timeSpent: answerTimer.seconds,
      timeFlagged: answerTimer.seconds < 30,
    };

    setFeedback(mockFeedback);
    setScores(prev => [...prev, score]);

    // Adaptive difficulty
    if (score >= 8) {
      const newHigh = consecutiveHigh + 1;
      setConsecutiveHigh(newHigh);
      setConsecutiveLow(0);
      if (newHigh >= 3 && difficulty !== 'Hard') {
        const newDiff = difficulty === 'Easy' ? 'Medium' : 'Hard';
        setDifficulty(newDiff);
        setConsecutiveHigh(0);
        toast('🔥 You\'re on a roll! Difficulty increased to ' + newDiff, { style: { background: 'rgba(30,41,59,0.9)', color: '#818CF8', border: '1px solid rgba(129,140,248,0.3)' } });
      }
    } else if (score <= 5) {
      const newLow = consecutiveLow + 1;
      setConsecutiveLow(newLow);
      setConsecutiveHigh(0);
      if (newLow >= 3 && difficulty !== 'Easy') {
        const newDiff = difficulty === 'Hard' ? 'Medium' : 'Easy';
        setDifficulty(newDiff);
        setConsecutiveLow(0);
        toast('Adjusting difficulty to keep you in flow', { style: { background: 'rgba(30,41,59,0.9)', color: '#FBBF24', border: '1px solid rgba(251,191,36,0.3)' } });
      }
    } else {
      setConsecutiveHigh(0);
      setConsecutiveLow(0);
    }

    setIsSubmitting(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer, answerTimer.seconds, consecutiveHigh, consecutiveLow, difficulty, isListening, config.timerEnabled, timer]);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setAnswer('');
      setFeedback(null);
      resetTranscript();
    } else {
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      navigate('/session-results', { state: { scores, avgScore, questions, difficulty } });
    }
  };

  const currentQ = questions[currentIndex];
  if (!currentQ) return <div className="flex items-center justify-center h-[calc(100vh-140px)]"><div className="w-10 h-10 border-4 border-[#818CF8] border-t-transparent rounded-full animate-spin" /></div>;

  const timerColor = timer.seconds > 30 ? '#34D399' : timer.seconds > 10 ? '#FBBF24' : '#FB7185';
  const diffColors = { Easy: '#34D399', Medium: '#FBBF24', Hard: '#FB7185' };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Background Orbs */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-[rgba(148,163,184,0.1)] z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-[#818CF8] to-[#A78BFA] shadow-[0_0_10px_rgba(129,140,248,0.8)]"
          animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="max-w-4xl mx-auto py-4 relative z-10">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4 bg-[rgba(30,41,59,0.3)] p-4 rounded-2xl border border-[rgba(148,163,184,0.05)] backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[rgba(129,140,248,0.1)] flex items-center justify-center text-[#818CF8] font-bold">
              {currentIndex + 1}/{questions.length}
            </div>
            <div>
              <p className="text-sm font-bold text-[#E2E8F0]">Interview Progress</p>
              <p className="text-xs text-[#94A3B8]">Keep going, you're doing great!</p>
            </div>
          </div>
          {config.timerEnabled && (
            <motion.div animate={{ color: timerColor }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[rgba(17,24,39,0.5)] border border-[rgba(148,163,184,0.1)] font-mono font-bold text-xl drop-shadow-md">
              <Clock size={20} /> {timer.formatTime()}
            </motion.div>
          )}
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div key={currentIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="card-flat p-8 mb-6 border-[rgba(129,140,248,0.2)] bg-[rgba(129,140,248,0.05)] shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
          >
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="badge badge-primary bg-[rgba(129,140,248,0.2)] text-[#818CF8] border-[#818CF8] px-3 py-1 text-xs">
                {currentQ.category}
              </span>
              <span className="badge px-3 py-1 text-xs font-bold" style={{ background: `${diffColors[currentQ.difficulty]}20`, color: diffColors[currentQ.difficulty], border: `1px solid ${diffColors[currentQ.difficulty]}40` }}>
                {currentQ.difficulty}
              </span>
            </div>
            <p className="text-[#F1F5F9] text-2xl font-bold leading-relaxed tracking-tight">{currentQ.text}</p>
          </motion.div>
        </AnimatePresence>

        {/* Answer Area */}
        {!feedback && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="relative mb-6">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="input textarea bg-[rgba(30,41,59,0.4)] border border-[rgba(148,163,184,0.1)] rounded-2xl p-6 text-lg text-[#F1F5F9] focus:bg-[rgba(30,41,59,0.6)] focus:border-[#818CF8] transition-all resize-y shadow-inner"
                style={{ minHeight: '220px' }}
                placeholder="Start typing your answer here or click the microphone to speak..."
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-4">
                <span className="text-xs font-semibold text-[#64748B] bg-[rgba(17,24,39,0.5)] px-3 py-1.5 rounded-lg border border-[rgba(148,163,184,0.1)]">
                  {wordCount(answer)} words
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={isListening ? stopListening : startListening}
                  className="relative w-14 h-14 rounded-full flex items-center justify-center cursor-pointer border-none shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-colors"
                  style={{ background: isListening ? '#FB7185' : '#818CF8' }}
                >
                  {isListening && <div className="pulse-ring w-14 h-14 border-[#FB7185]" />}
                  <span className="text-white">{isListening ? <Square size={20} fill="currentColor" /> : <Mic size={24} />}</span>
                </motion.button>
              </div>
            </div>

            {isListening && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 p-4 rounded-xl bg-[rgba(129,140,248,0.1)] border border-[rgba(129,140,248,0.2)] text-[#818CF8] italic mb-6">
                <div className="flex gap-1">
                  <div className="typing-dot bg-[#818CF8]"></div><div className="typing-dot bg-[#818CF8]"></div><div className="typing-dot bg-[#818CF8]"></div>
                </div>
                <span>Listening... {transcript}</span>
              </motion.div>
            )}

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={handleSubmit} disabled={isSubmitting || !answer.trim()}
              className="btn btn-primary btn-lg w-full flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(129,140,248,0.3)] disabled:opacity-50 disabled:shadow-none">
              {isSubmitting ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Evaluating answer...</>
              ) : (
                <>Submit Answer <ArrowRight size={20} /></>
              )}
            </motion.button>
          </motion.div>
        )}

        {/* Feedback Card */}
        <AnimatePresence>
          {feedback && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="space-y-6">
              
              <div className="card-flat p-8 text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(129,140,248,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="text-sm font-bold text-[#94A3B8] uppercase tracking-widest mb-3">Your Score</p>
                <div className="flex items-end justify-center gap-1">
                  <span className={`text-6xl font-extrabold drop-shadow-lg ${feedback.score >= 7 ? 'text-[#34D399]' : feedback.score >= 5 ? 'text-[#FBBF24]' : 'text-[#FB7185]'}`}>
                    {feedback.score}
                  </span>
                  <span className="text-2xl font-bold text-[#64748B] mb-1.5">/10</span>
                </div>
                {feedback.timeFlagged && (
                  <div className="inline-flex items-center gap-2 mt-4 bg-[rgba(251,191,36,0.1)] text-[#FBBF24] px-4 py-2 rounded-lg border border-[rgba(251,191,36,0.2)] text-sm font-medium">
                    <AlertTriangle size={16} /> You answered in under 30 seconds — take more time to think!
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-[rgba(52,211,153,0.05)] border border-[rgba(52,211,153,0.15)] shadow-inner">
                  <p className="text-base font-bold text-[#34D399] mb-4 flex items-center gap-2"><Check size={20} /> Points You Covered</p>
                  <div className="space-y-3">
                    {feedback.pointsCovered.map((p, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-[rgba(52,211,153,0.2)] flex items-center justify-center text-[#34D399] flex-shrink-0 mt-0.5"><Check size={12} /></div>
                        <p className="text-sm text-[#E2E8F0] font-medium leading-relaxed">{p}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[rgba(251,113,133,0.05)] border border-[rgba(251,113,133,0.15)] shadow-inner">
                  <p className="text-base font-bold text-[#FB7185] mb-4 flex items-center gap-2"><Target size={20} /> Key Points Missed</p>
                  <div className="space-y-3">
                    {feedback.pointsMissed.map((p, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-[rgba(251,113,133,0.2)] flex items-center justify-center text-[#FB7185] flex-shrink-0 mt-0.5"><span className="text-xs font-bold leading-none">×</span></div>
                        <p className="text-sm text-[#E2E8F0] font-medium leading-relaxed">{p}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[rgba(129,140,248,0.05)] border border-[rgba(129,140,248,0.15)]">
                <p className="text-base font-bold text-[#818CF8] mb-3 flex items-center gap-2"><Lightbulb size={20} /> Improved Sample Answer</p>
                <p className="text-sm text-[#E2E8F0] leading-relaxed italic border-l-2 border-[#818CF8] pl-4 py-1">{feedback.sampleAnswer}</p>
              </div>

              <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={handleNext}
                className="btn btn-primary btn-lg w-full flex items-center justify-center gap-2 mt-4 shadow-[0_8px_24px_rgba(129,140,248,0.3)]">
                {currentIndex < questions.length - 1 ? <>Next Question <ArrowRight size={20} /></> : <>View Final Results <ArrowRight size={20} /></>}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
