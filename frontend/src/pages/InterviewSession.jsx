import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useSpeechRecognition, useTimer } from '../hooks';
import { generateMockQuestions, checkAnswerQuality, wordCount } from '../utils/helpers';

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
      toast('⏰ Time\'s up!', { style: { background: '#FFFBEB', color: '#F59E0B', border: '1px solid #F59E0B' } });
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.seconds]);

  const handleSubmit = useCallback(async () => {
    if (!answer.trim()) { toast.error('Please provide an answer'); return; }
    const quality = checkAnswerQuality(answer);
    if (!quality.isValid) {
      if (!window.confirm('Your answer seems too short. Interviewers expect detailed responses. Submit anyway?')) return;
    }

    setIsSubmitting(true);
    timer.stop();
    answerTimer.stop();
    if (isListening) stopListening();

    // Simulate AI evaluation (in production, this calls the backend)
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
        toast('🔥 You\'re on a roll! Difficulty increased to ' + newDiff, { style: { background: '#EEF2FF', color: '#6366F1', border: '1px solid #6366F1' } });
      }
    } else if (score <= 5) {
      const newLow = consecutiveLow + 1;
      setConsecutiveLow(newLow);
      setConsecutiveHigh(0);
      if (newLow >= 3 && difficulty !== 'Easy') {
        const newDiff = difficulty === 'Hard' ? 'Medium' : 'Easy';
        setDifficulty(newDiff);
        setConsecutiveLow(0);
        toast('Adjusting difficulty to keep you in flow', { style: { background: '#FFFBEB', color: '#F59E0B', border: '1px solid #F59E0B' } });
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
      // Session complete
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      navigate('/session-results', { state: { scores, avgScore, questions, difficulty } });
    }
  };

  const currentQ = questions[currentIndex];
  if (!currentQ) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-3 border-[#6366F1] border-t-transparent rounded-full animate-spin" /></div>;

  const timerColor = timer.seconds > 30 ? '#10B981' : timer.seconds > 10 ? '#F59E0B' : '#EF4444';
  const diffColors = { Easy: '#10B981', Medium: '#F59E0B', Hard: '#EF4444' };

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFC', fontFamily: 'Inter, sans-serif' }}>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-[#E2E8F0] z-50">
        <motion.div
          className="h-full bg-[#6366F1]"
          animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <span className="text-sm font-semibold text-[#94A3B8]">
            Question {currentIndex + 1} of {questions.length}
          </span>
          {config.timerEnabled && (
            <motion.div
              animate={{ color: timerColor }}
              className="flex items-center gap-2 text-lg font-bold"
            >
              ⏱️ {timer.formatTime()}
            </motion.div>
          )}
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card-flat p-8 mb-6"
          >
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="badge badge-primary">Q{currentIndex + 1}</span>
              <span className="badge badge-primary">{currentQ.category}</span>
              <span className="badge" style={{ background: diffColors[currentQ.difficulty] + '15', color: diffColors[currentQ.difficulty] }}>
                {currentQ.difficulty}
              </span>
              <span className="badge" style={{ background: diffColors[difficulty] + '15', color: diffColors[difficulty] }}>
                Current: {difficulty}
              </span>
            </div>
            <p className="text-[#0F172A] text-xl font-semibold leading-relaxed">{currentQ.text}</p>
          </motion.div>
        </AnimatePresence>

        {/* Answer Area */}
        {!feedback && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="relative mb-4">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="input textarea"
                style={{ minHeight: '180px' }}
                placeholder="Start typing your answer here or click the microphone to speak..."
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-3">
                <span className="text-xs text-[#94A3B8]">{wordCount(answer)} words</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={isListening ? stopListening : startListening}
                  className="relative w-12 h-12 rounded-full flex items-center justify-center cursor-pointer border-none"
                  style={{ background: isListening ? '#EF4444' : '#6366F1' }}
                >
                  {isListening && <div className="pulse-ring w-12 h-12" />}
                  <span className="text-white text-lg">{isListening ? '⏹️' : '🎤'}</span>
                </motion.button>
              </div>
            </div>

            {isListening && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-[#6366F1] italic mb-4">
                🎤 Listening... {transcript}
              </motion.div>
            )}

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={isSubmitting || !answer.trim()}
              className="btn btn-primary btn-lg w-full disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Evaluating your answer...
                </div>
              ) : 'Submit Answer'}
            </motion.button>
          </motion.div>
        )}

        {/* Feedback Card */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              className="space-y-4"
            >
              {/* Score */}
              <div className="card-flat p-6 text-center">
                <p className="text-sm text-[#94A3B8] mb-2">Your Score</p>
                <span className={`text-4xl font-extrabold ${feedback.score >= 7 ? 'text-[#10B981]' : feedback.score >= 5 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
                  {feedback.score}/10
                </span>
                {feedback.timeFlagged && (
                  <p className="text-xs text-[#F59E0B] mt-2">⚡ You answered in under 30 seconds — take more time to think!</p>
                )}
              </div>

              {/* Points Covered */}
              <div className="p-4 rounded-xl" style={{ background: '#ECFDF5' }}>
                <p className="text-sm font-semibold text-[#10B981] mb-2">✅ Points You Covered</p>
                {feedback.pointsCovered.map((p, i) => (
                  <p key={i} className="text-sm text-[#475569] flex items-center gap-2">
                    <span className="text-[#10B981]">✓</span> {p}
                  </p>
                ))}
              </div>

              {/* Points Missed */}
              <div className="p-4 rounded-xl" style={{ background: '#FEF2F2' }}>
                <p className="text-sm font-semibold text-[#EF4444] mb-2">❌ Key Points Missed</p>
                {feedback.pointsMissed.map((p, i) => (
                  <p key={i} className="text-sm text-[#475569] flex items-center gap-2">
                    <span className="text-[#EF4444]">✗</span> {p}
                  </p>
                ))}
              </div>

              {/* Sample Answer */}
              <div className="p-4 rounded-xl" style={{ background: '#EEF2FF' }}>
                <p className="text-sm font-semibold text-[#6366F1] mb-2">Improved Sample Answer</p>
                <p className="text-sm text-[#475569]">{feedback.sampleAnswer}</p>
              </div>

              {/* Pro Tip */}
              <div className="p-4 rounded-xl" style={{ background: '#FFFBEB' }}>
                <p className="text-sm font-semibold text-[#F59E0B] mb-2">🌟 Pro Tip</p>
                <p className="text-sm text-[#475569]">{feedback.tip}</p>
              </div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleNext}
                className="btn btn-primary btn-lg w-full"
              >
                {currentIndex < questions.length - 1 ? 'Next Question →' : 'View Results'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
