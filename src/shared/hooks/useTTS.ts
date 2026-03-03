import { useEffect, useState, useCallback, useRef } from 'react';

export function useTTS() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const chunksRef = useRef<string[]>([]);
  const currentChunkIndexRef = useRef<number>(0);
  const currentLangRef = useRef<'es' | 'la'>('es');

  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      if (allVoices.length === 0) return;

      const sortedVoices = [...allVoices].sort((a, b) => {
        if (a.localService && !b.localService) return -1;
        if (!a.localService && b.localService) return 1;
        return 0;
      });
      setVoices(sortedVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
    };
  }, []);

  const detectLanguage = (text: string): 'es' | 'la' => {
    if (
      /^(salve|ave|gloria|dominus|vita|pater|noster|credo|spiritus|sanctificetur|veniat)/i.test(
        text.trim()
      )
    ) {
      return 'la';
    }
    return 'es';
  };

  const splitIntoChunks = (text: string): string[] => {
    // Split by punctuation but keep the punctuation
    // We target ~200-300 chars per chunk for stability
    const maxLength = 250;
    const regex = /([^.?!;:]+[.?!;:]?)/g;
    const matches = text.match(regex) || [text];

    const chunks: string[] = [];
    let currentChunk = '';

    for (const part of matches) {
      if ((currentChunk + part).length > maxLength && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = part;
      } else {
        currentChunk += part;
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    return chunks.filter((c) => c.length > 0);
  };

  const stop = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    chunksRef.current = [];
    currentChunkIndexRef.current = 0;
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  const playChunkRef = useRef<(index: number) => void>(null);

  const playChunk = useCallback(
    (index: number) => {
      if (index >= chunksRef.current.length) {
        console.log('useTTS: All chunks finished');
        setIsPlaying(false);
        setIsPaused(false);
        utteranceRef.current = null;
        return;
      }

      currentChunkIndexRef.current = index;
      const text = chunksRef.current[index];
      const langCode = currentLangRef.current;

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      let voice = voices.find((v) => v.lang.toLowerCase().startsWith(langCode));
      if (!voice && langCode === 'la') {
        voice = voices.find((v) => v.lang.toLowerCase().startsWith('it'));
      }

      if (!voice) {
        console.warn('useTTS: No voice found for', langCode);
        setIsPlaying(false);
        return;
      }

      utterance.voice = voice;
      utterance.lang = voice.lang;
      utterance.rate = 0.85;

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        // Play next chunk
        playChunkRef.current?.(index + 1);
      };

      utterance.onerror = (event) => {
        if (event.error !== 'interrupted') {
          console.error('useTTS: Error in chunk', index, event);
          stop();
        }
      };

      window.speechSynthesis.speak(utterance);
    },
    [voices, stop]
  );

  useEffect(() => {
    playChunkRef.current = playChunk;
  }, [playChunk]);

  const speak = useCallback(
    (text: string, forcedLang?: 'es' | 'la') => {
      console.log('useTTS: speak requested', { textLength: text?.length, forcedLang });

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      window.speechSynthesis.cancel();

      if (!text) {
        stop();
        return;
      }

      currentLangRef.current = forcedLang || detectLanguage(text);
      chunksRef.current = splitIntoChunks(text);
      currentChunkIndexRef.current = 0;

      console.log('useTTS: Split into', chunksRef.current.length, 'chunks');

      // Add a small delay for the first chunk to ensure clean state
      timeoutRef.current = setTimeout(() => {
        playChunk(0);
      }, 50);
    },
    [stop, playChunk]
  );

  const pause = useCallback(() => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, []);

  return { speak, pause, resume, stop, isPlaying, isPaused };
}
