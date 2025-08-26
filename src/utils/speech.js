// Simple Web Speech API hook for speech-to-text
import { useCallback, useEffect, useRef, useState } from "react";

function getSpeechRecognition() {
  const SpeechRecognition =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);
  return SpeechRecognition || null;
}

export function useSpeechRecognition(options = {}) {
  const {
    lang = (typeof navigator !== "undefined" && navigator.language) || "en-US",
    interimResults = true,
    continuous = false,
    maxAlternatives = 1,
  } = options;

  const Recognition = getSpeechRecognition();
  const supported = !!Recognition;

  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!supported) return;
    const recognition = new Recognition();
    recognition.lang = lang;
    recognition.interimResults = interimResults;
    recognition.continuous = continuous;
    recognition.maxAlternatives = maxAlternatives;

    recognition.onresult = (event) => {
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0]?.transcript || "";
        if (result.isFinal) {
          finalText += text;
        } else {
          // For interim results, append but do not commit as final
          finalText += text;
        }
      }
      setTranscript((prev) => {
        // Prefer most recent aggregate when available
        return finalText.trim() ? finalText : prev;
      });
    };

    recognition.onerror = (e) => {
      setError(e?.error || "speech_error");
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        recognition.stop();
      } catch {}
      recognitionRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supported, lang, interimResults, continuous, maxAlternatives]);

  const start = useCallback(() => {
    if (!recognitionRef.current) return;
    setTranscript("");
    setError(null);
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch (e) {
      // start can throw if already started
      setError(e?.message || "start_failed");
    }
  }, []);

  const stop = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch {}
  }, []);

  const reset = useCallback(() => {
    setTranscript("");
    setError(null);
  }, []);

  return { supported, listening, transcript, error, start, stop, reset };
}
