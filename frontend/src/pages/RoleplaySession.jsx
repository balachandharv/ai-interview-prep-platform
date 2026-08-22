import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeechRecognition } from '../hooks';
import { Mic, Square, Send, X, AlertTriangle, Wifi, WifiOff, Loader } from 'lucide-react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { roleplayAPI } from '../services/api';

// Connection states — never expose ambiguous state to user
const CONN_STATE = {
  INITIALIZING: 'initializing',   // Creating session in DB
  CONNECTING: 'connecting',       // STOMP handshake in progress
  CONNECTED: 'connected',         // Live
  RECONNECTING: 'reconnecting',   // Lost connection, retrying
  ERROR: 'error',                 // Unrecoverable — show user action
};

export default function RoleplaySession() {
  const navigate = useNavigate();
  const location = useLocation();
  const { persona, companyMode } = location.state || {};

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(CONN_STATE.INITIALIZING);
  const [errorMessage, setErrorMessage] = useState(null);

  // sessionId comes from backend after HTTP /roleplay/start — NOT generated client-side
  const [sessionId, setSessionId] = useState(null);

  const stompClientRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition();
  const maxQuestions = 8;

  // Step 1: Create session in DB via HTTP before opening WebSocket
  useEffect(() => {
    if (!persona) return;

    const greeting = {
      role: 'ai',
      text: `Hello! I'm ${persona.name}, ${persona.role} at ${persona.company}. Thank you for joining us today. I'll be conducting this ${persona.style?.toLowerCase() || 'professional'} interview. Let's get started.\n\nCan you please start by telling me a little about yourself and your background?`,
      timestamp: new Date().toISOString(),
    };
    setMessages([greeting]);
    setQuestionCount(1);

    // Call backend to register session — this is required before WebSocket messages can be sent
    roleplayAPI.start({ personaId: persona.backendId || persona.id })
      .then((res) => {
        const backendSessionId = res.data.sessionId;
        setSessionId(backendSessionId);
        setConnectionStatus(CONN_STATE.CONNECTING);
      })
      .catch((err) => {
        console.error('Failed to create roleplay session:', err);
        setConnectionStatus(CONN_STATE.ERROR);
        setErrorMessage('Failed to initialize session. Please go back and try again.');
      });
  }, [persona]);

  // Step 2: Open STOMP connection only after sessionId is available from backend
  useEffect(() => {
    if (!sessionId || connectionStatus === CONN_STATE.ERROR) return;

    const token = sessionStorage.getItem('token');
    if (!token) {
      setConnectionStatus(CONN_STATE.ERROR);
      setErrorMessage('Session expired. Please log in again.');
      return;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws'),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      setConnectionStatus(CONN_STATE.CONNECTED);
      setErrorMessage(null);

      client.subscribe(`/topic/roleplay/${sessionId}`, (message) => {
        const response = JSON.parse(message.body);
        const aiMsg = { role: 'ai', text: response.message, timestamp: new Date().toISOString() };
        setMessages(prev => [...prev, aiMsg]);
        setIsAIThinking(false);
      });

      client.subscribe(`/topic/roleplay/${sessionId}/typing`, (message) => {
        const payload = JSON.parse(message.body);
        setIsAIThinking(payload.isTyping);
      });
    };

    client.onDisconnect = () => {
      // Only set reconnecting if we were previously connected (not on intentional deactivate)
      if (stompClientRef.current) {
        setConnectionStatus(CONN_STATE.RECONNECTING);
      }
    };

    client.onStompError = (frame) => {
      console.error('STOMP error:', frame.headers['message'], frame.body);
      setIsAIThinking(false);
      setConnectionStatus(CONN_STATE.ERROR);
      setErrorMessage(`Connection error: ${frame.headers['message'] || 'Unknown STOMP error'}`);
    };

    client.onWebSocketError = (event) => {
      console.error('WebSocket error:', event);
      setConnectionStatus(CONN_STATE.RECONNECTING);
    };

    client.activate();
    stompClientRef.current = client;

    return () => {
      // On unmount: clear ref first so onDisconnect doesn't set RECONNECTING
      stompClientRef.current = null;
      client.deactivate();
    };
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (transcript) setInput(prev => prev + ' ' + transcript);
  }, [transcript]);

  const handleSend = useCallback(() => {
    if (!input.trim() || isAIThinking) return;

    // Block sending when not connected — never silently fall back to mock
    if (connectionStatus !== CONN_STATE.CONNECTED) {
      setErrorMessage(
        connectionStatus === CONN_STATE.RECONNECTING
          ? 'Reconnecting to server... please wait.'
          : 'Not connected. Please wait for connection to be established.'
      );
      return;
    }

    const userMsg = { role: 'user', text: input.trim(), timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setIsAIThinking(true);
    setErrorMessage(null);

    if (isListening) stopListening();

    const newCount = questionCount + 1;
    setQuestionCount(newCount);

    stompClientRef.current.publish({
      destination: `/app/roleplay/${sessionId}/message`,
      body: JSON.stringify({ message: input.trim() }),
    });

    setInput('');

    if (newCount >= maxQuestions) {
      setTimeout(() => handleEndSession([...messages, userMsg], newCount), 2000);
    }
  }, [input, isAIThinking, connectionStatus, questionCount, messages, sessionId, isListening, stopListening]);

  const handleEndSession = useCallback(async (finalMessages = messages, count = questionCount) => {
    // Mark session complete in backend before navigating to results
    if (sessionId) {
      try {
        await roleplayAPI.complete(sessionId);
      } catch (err) {
        console.warn('Failed to mark session complete:', err);
        // Non-blocking: results page can still show transcript
      }
    }
    navigate('/roleplay-results', {
      state: { persona, messages: finalMessages, questionCount: count, sessionId },
    });
  }, [sessionId, messages, questionCount, persona, navigate]);

  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  if (!persona) {
    return (
      <div className="text-center py-20">
        <p className="text-[#94A3B8]">No persona selected. <a href="/roleplay" className="text-[#818CF8]">Go back</a></p>
      </div>
    );
  }

  const isLoading = connectionStatus === CONN_STATE.INITIALIZING || connectionStatus === CONN_STATE.CONNECTING;
  const canSend = !isAIThinking && connectionStatus === CONN_STATE.CONNECTED && input.trim().length > 0;

  // Connection status indicator
  const ConnectionBadge = () => {
    const badges = {
      [CONN_STATE.INITIALIZING]: { color: '#F59E0B', text: 'Initializing...', icon: <Loader size={12} className="animate-spin" /> },
      [CONN_STATE.CONNECTING]:   { color: '#F59E0B', text: 'Connecting...', icon: <Loader size={12} className="animate-spin" /> },
      [CONN_STATE.CONNECTED]:    { color: '#34D399', text: 'Live', icon: <Wifi size={12} /> },
      [CONN_STATE.RECONNECTING]: { color: '#F59E0B', text: 'Reconnecting...', icon: <Loader size={12} className="animate-spin" /> },
      [CONN_STATE.ERROR]:        { color: '#EF4444', text: 'Connection Error', icon: <WifiOff size={12} /> },
    };
    const b = badges[connectionStatus] || badges[CONN_STATE.ERROR];
    return (
      <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border"
        style={{ color: b.color, background: `${b.color}15`, borderColor: `${b.color}30` }}>
        {b.icon} {b.text}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 flex" style={{ fontFamily: 'Inter, sans-serif', background: 'var(--bg-primary)' }}>
      {/* Left Panel - AI Interviewer */}
      <div className="w-[35%] hidden lg:flex flex-col border-r border-[rgba(148,163,184,0.1)] bg-[rgba(15,23,42,0.8)] backdrop-blur-xl p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#818CF8] opacity-5 rounded-full filter blur-3xl pointer-events-none" />

        <div className={`rounded-3xl p-8 text-center relative z-10 transition-all duration-500 ${isAIThinking ? 'shadow-[0_0_30px_rgba(129,140,248,0.2)]' : ''}`}
          style={{ background: 'rgba(30,41,59,0.5)', border: `1px solid ${isAIThinking ? 'rgba(129,140,248,0.4)' : 'rgba(148,163,184,0.1)'}` }}>
          <div className="text-7xl mb-6 relative inline-block">
            {persona.avatar}
            <div className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-4 border-[#1E293B] transition-colors ${connectionStatus === CONN_STATE.CONNECTED ? 'bg-[#34D399]' : 'bg-[#F59E0B]'}`} />
          </div>
          <h2 className="text-2xl font-extrabold text-[#F1F5F9]">{persona.name}</h2>
          <p className="text-sm font-medium text-[#818CF8] mt-1">{persona.role} @ {persona.company}</p>
          {companyMode && <span className="inline-block mt-4 px-3 py-1 rounded-full bg-[rgba(129,140,248,0.1)] text-[#818CF8] text-xs font-bold border border-[rgba(129,140,248,0.2)]">Round 1: Technical</span>}
        </div>

        <div className="mt-8 flex-1 relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Interview Progress</span>
            <span className="text-sm font-bold text-[#F1F5F9]">{questionCount}<span className="text-[#64748B]">/{maxQuestions}</span></span>
          </div>
          <div className="h-2 w-full bg-[rgba(30,41,59,0.5)] rounded-full overflow-hidden border border-[rgba(148,163,184,0.1)]">
            <motion.div animate={{ width: `${(questionCount / maxQuestions) * 100}%` }} className="h-full bg-gradient-to-r from-[#818CF8] to-[#A78BFA] shadow-[0_0_10px_rgba(129,140,248,0.8)]" />
          </div>
        </div>

        {isAIThinking && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 rounded-2xl bg-[rgba(129,140,248,0.1)] border border-[rgba(129,140,248,0.2)] relative z-10">
            <div className="flex items-center justify-center gap-3">
              <div className="flex gap-1"><div className="typing-dot bg-[#818CF8]" /><div className="typing-dot bg-[#818CF8]" /><div className="typing-dot bg-[#818CF8]" /></div>
              <span className="text-sm font-medium text-[#818CF8]">{persona.name} is thinking...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Right Panel - Chat */}
      <div className="flex-1 flex flex-col relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(129,140,248,0.02)] to-transparent pointer-events-none" />

        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 bg-[rgba(15,23,42,0.9)] backdrop-blur-md border-b border-[rgba(148,163,184,0.1)] z-10">
          <div className="flex items-center gap-3 lg:hidden">
            <span className="text-2xl">{persona.avatar}</span>
            <div>
              <p className="text-sm font-bold text-[#F1F5F9]">{persona.name}</p>
              <p className="text-xs text-[#818CF8]">{persona.company}</p>
            </div>
          </div>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <ConnectionBadge />
            <span className="text-xs font-bold text-[#64748B] bg-[rgba(30,41,59,0.5)] px-3 py-1.5 rounded-lg border border-[rgba(148,163,184,0.1)]">Q{questionCount}/{maxQuestions}</span>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowEndConfirm(true)}
              className="px-4 py-1.5 rounded-lg text-xs font-bold transition-colors"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              End Interview
            </motion.button>
          </div>
        </div>

        {/* Connection initializing overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[rgba(15,23,42,0.7)] backdrop-blur-sm">
            <div className="text-center">
              <Loader size={40} className="animate-spin text-[#818CF8] mx-auto mb-4" />
              <p className="text-[#F1F5F9] font-semibold">Setting up your interview session...</p>
              <p className="text-[#64748B] text-sm mt-1">Connecting to AI interviewer</p>
            </div>
          </div>
        )}

        {/* Error banner */}
        <AnimatePresence>
          {errorMessage && connectionStatus !== CONN_STATE.RECONNECTING && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="mx-4 mt-3 p-3 rounded-xl flex items-center gap-3 z-10"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <AlertTriangle size={16} className="text-[#EF4444] flex-shrink-0" />
              <p className="text-sm text-[#EF4444]">{errorMessage}</p>
            </motion.div>
          )}
          {connectionStatus === CONN_STATE.RECONNECTING && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="mx-4 mt-3 p-3 rounded-xl flex items-center gap-3 z-10"
              style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <Loader size={16} className="text-[#F59E0B] flex-shrink-0 animate-spin" />
              <p className="text-sm text-[#F59E0B]">Connection lost. Reconnecting automatically... Your conversation is preserved.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 z-10 custom-scrollbar">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i} initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.4, type: 'spring', bounce: 0.4 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-2xl p-5 ${msg.role === 'user' ? 'bg-[#818CF8] text-white rounded-br-none shadow-[0_8px_24px_rgba(129,140,248,0.3)]' : 'bg-[rgba(30,41,59,0.6)] text-[#E2E8F0] border border-[rgba(148,163,184,0.1)] rounded-bl-none shadow-lg'}`}>
                  <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <p className={`text-[10px] mt-2 text-right ${msg.role === 'user' ? 'text-indigo-200' : 'text-[#64748B]'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isAIThinking && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
              <div className="bg-[rgba(30,41,59,0.6)] border border-[rgba(148,163,184,0.1)] rounded-2xl rounded-bl-none p-5 flex items-center gap-3">
                <div className="flex gap-1.5"><div className="w-2 h-2 rounded-full bg-[#818CF8] animate-bounce" /><div className="w-2 h-2 rounded-full bg-[#818CF8] animate-bounce" style={{ animationDelay: '0.2s' }} /><div className="w-2 h-2 rounded-full bg-[#818CF8] animate-bounce" style={{ animationDelay: '0.4s' }} /></div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Input */}
        <div className="p-4 bg-[rgba(15,23,42,0.9)] backdrop-blur-md border-t border-[rgba(148,163,184,0.1)] z-10 relative">
          <div className="flex items-end gap-3 max-w-5xl mx-auto">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }} onClick={isListening ? stopListening : startListening}
              className="w-12 h-12 rounded-full flex items-center justify-center border-none cursor-pointer relative shadow-[0_4px_12px_rgba(0,0,0,0.3)] flex-shrink-0 transition-colors"
              style={{ background: isListening ? '#FB7185' : 'rgba(30,41,59,0.8)' }}>
              {isListening && <div className="pulse-ring w-12 h-12 border-[#FB7185]" />}
              <span className="text-[#F1F5F9]">{isListening ? <Square size={18} fill="currentColor" /> : <Mic size={20} />}</span>
            </motion.button>
            <div className="flex-1 relative">
              <textarea
                value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
                className="input w-full bg-[rgba(30,41,59,0.6)] border border-[rgba(148,163,184,0.2)] rounded-2xl py-3 px-4 text-[#F1F5F9] focus:bg-[rgba(30,41,59,0.9)] focus:border-[#818CF8] custom-scrollbar" rows={1}
                style={{ resize: 'none', minHeight: '48px', maxHeight: '120px' }}
                placeholder={connectionStatus === CONN_STATE.CONNECTED ? 'Type your response or press enter...' : 'Waiting for connection...'}
                disabled={isAIThinking || connectionStatus !== CONN_STATE.CONNECTED || questionCount >= maxQuestions}
              />
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSend} disabled={!canSend}
              className="w-12 h-12 rounded-2xl flex items-center justify-center border-none cursor-pointer bg-[#818CF8] text-white shadow-[0_4px_12px_rgba(129,140,248,0.4)] disabled:opacity-50 disabled:shadow-none flex-shrink-0">
              <Send size={18} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* End Confirm Dialog */}
      <AnimatePresence>
        {showEndConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay z-50 fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="modal-content bg-[rgba(15,23,42,0.95)] border border-[rgba(148,163,184,0.1)] p-8 rounded-3xl max-w-md w-full shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              <div className="w-12 h-12 rounded-full bg-[rgba(239,68,68,0.1)] flex items-center justify-center mb-4 text-[#EF4444]">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#F1F5F9] mb-2">End Interview Early?</h3>
              <p className="text-[#94A3B8] text-sm mb-8 leading-relaxed">
                Are you sure you want to end this interview? You've answered <span className="text-[#F1F5F9] font-bold">{questionCount}</span> out of <span className="text-[#F1F5F9] font-bold">{maxQuestions}</span> questions.
              </p>
              <div className="flex gap-4">
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowEndConfirm(false)} className="flex-1 py-3 rounded-xl font-bold text-sm bg-[rgba(30,41,59,0.5)] text-[#E2E8F0] hover:bg-[rgba(30,41,59,0.8)] transition-colors border border-[rgba(148,163,184,0.1)]">Cancel</motion.button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => handleEndSession()}
                  className="flex-1 py-3 rounded-xl font-bold text-sm bg-[#EF4444] text-white shadow-[0_4px_12px_rgba(239,68,68,0.4)] hover:bg-[#DC2626] transition-colors">End Session</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


