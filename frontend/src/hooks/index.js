import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Web Speech API hook for voice-to-text
 */
export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }
      setTranscript((prev) => prev + finalTranscript + interimTranscript);
    };

    recognition.onerror = (event) => {
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return { isListening, transcript, error, startListening, stopListening, resetTranscript };
}

/**
 * Timer hook for interview sessions
 */
export function useTimer(initialSeconds = 0, countDown = false) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (countDown && prev <= 0) {
            clearInterval(intervalRef.current);
            setIsActive(false);
            return 0;
          }
          return countDown ? prev - 1 : prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive, countDown]);

  const start = useCallback(() => setIsActive(true), []);
  const stop = useCallback(() => setIsActive(false), []);
  const reset = useCallback((newTime) => {
    setSeconds(newTime ?? initialSeconds);
    setIsActive(false);
  }, [initialSeconds]);

  const formatTime = useCallback(() => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [seconds]);

  return { seconds, isActive, start, stop, reset, formatTime };
}

const FILLER_WORDS = ['um', 'uh', 'like', 'you know', 'basically', 'actually', 'literally', 'sort of', 'kind of', 'i mean', 'right', 'so yeah'];

/**
 * Filler word detection hook
 */
export function useFillerDetection() {
  const detectFillers = useCallback((text) => {
    const lowerText = text.toLowerCase();
    const results = {};
    let totalCount = 0;

    FILLER_WORDS.forEach((filler) => {
      const regex = new RegExp(`\\b${filler}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        results[filler] = matches.length;
        totalCount += matches.length;
      }
    });

    return { fillers: results, totalCount, score: Math.max(0, 10 - totalCount) };
  }, []);

  return { detectFillers };
}

/**
 * WebSocket hook for STOMP
 */
export function useWebSocket(url) {
  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);

  const connect = useCallback(async () => {
    try {
      const { Client } = await import('@stomp/stompjs');
      const SockJS = (await import('sockjs-client')).default;

      const client = new Client({
        webSocketFactory: () => new SockJS(url),
        reconnectDelay: 5000,
        onConnect: () => setConnected(true),
        onDisconnect: () => setConnected(false),
      });

      client.activate();
      clientRef.current = client;
    } catch (err) {
      console.error('WebSocket connection failed:', err);
    }
  }, [url]);

  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.deactivate();
      clientRef.current = null;
      setConnected(false);
    }
  }, []);

  const subscribe = useCallback((topic, callback) => {
    if (clientRef.current && connected) {
      return clientRef.current.subscribe(topic, (message) => {
        callback(JSON.parse(message.body));
      });
    }
    return null;
  }, [connected]);

  const publish = useCallback((destination, body) => {
    if (clientRef.current && connected) {
      clientRef.current.publish({ destination, body: JSON.stringify(body) });
    }
  }, [connected]);

  useEffect(() => () => disconnect(), [disconnect]);

  return { connect, disconnect, subscribe, publish, connected };
}

/**
 * Intersection observer hook
 */
export function useInView(options = {}) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (options.triggerOnce) observer.unobserve(entry.target);
        } else if (!options.triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold: options.threshold || 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options.threshold, options.triggerOnce]);

  return [ref, isInView];
}

/**
 * Local storage hook
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedValue, setValue];
}
