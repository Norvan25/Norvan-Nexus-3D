import { useState, useRef, useCallback } from 'react';

interface UseElevenLabsAgentReturn {
  isConnected: boolean;
  isSpeaking: boolean;
  startConversation: () => Promise<void>;
  endConversation: () => void;
  error: string | null;
}

export const useElevenLabsAgent = (): UseElevenLabsAgentReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioQueueRef = useRef<AudioBuffer[]>([]);
  const isPlayingRef = useRef(false);

  const playAudioQueue = useCallback(async () => {
    if (isPlayingRef.current || audioQueueRef.current.length === 0 || !audioContextRef.current) {
      return;
    }

    isPlayingRef.current = true;
    const audioBuffer = audioQueueRef.current.shift();

    if (audioBuffer) {
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);

      source.onended = () => {
        isPlayingRef.current = false;
        playAudioQueue();
      };

      source.start();
      setIsSpeaking(true);
    } else {
      isPlayingRef.current = false;
      setIsSpeaking(false);
    }
  }, []);

  const startConversation = useCallback(async () => {
    try {
      setError(null);
      const agentId = import.meta.env.VITE_ELEVENLABS_AGENT_ID;
      const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;

      if (!agentId || !apiKey) {
        throw new Error('ElevenLabs credentials not configured');
      }

      const response = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
        {
          method: 'GET',
          headers: {
            'xi-api-key': apiKey,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get signed URL');
      }

      const data = await response.json();
      const signedUrl = data.signed_url;

      audioContextRef.current = new AudioContext({ sampleRate: 16000 });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      wsRef.current = new WebSocket(signedUrl);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        console.log('Connected to ElevenLabs agent');

        const mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && wsRef.current?.readyState === WebSocket.OPEN) {
            event.data.arrayBuffer().then((arrayBuffer) => {
              const base64 = btoa(
                new Uint8Array(arrayBuffer).reduce(
                  (data, byte) => data + String.fromCharCode(byte),
                  ''
                )
              );

              wsRef.current?.send(
                JSON.stringify({
                  user_audio_chunk: base64,
                })
              );
            });
          }
        };

        mediaRecorder.start(100);
      };

      wsRef.current.onmessage = async (event) => {
        const message = JSON.parse(event.data);

        if (message.type === 'audio' && message.audio) {
          const audioData = atob(message.audio.chunk);
          const audioArray = new Uint8Array(audioData.length);
          for (let i = 0; i < audioData.length; i++) {
            audioArray[i] = audioData.charCodeAt(i);
          }

          if (audioContextRef.current) {
            const audioBuffer = await audioContextRef.current.decodeAudioData(
              audioArray.buffer
            );
            audioQueueRef.current.push(audioBuffer);
            playAudioQueue();
          }
        }

        if (message.type === 'interruption') {
          audioQueueRef.current = [];
          isPlayingRef.current = false;
          setIsSpeaking(false);
        }
      };

      wsRef.current.onerror = () => {
        setError('Connection error occurred');
        endConversation();
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
        setIsSpeaking(false);
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start conversation');
      console.error('Error starting conversation:', err);
    }
  }, [playAudioQueue]);

  const endConversation = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    audioQueueRef.current = [];
    isPlayingRef.current = false;
    setIsConnected(false);
    setIsSpeaking(false);
  }, []);

  return {
    isConnected,
    isSpeaking,
    startConversation,
    endConversation,
    error,
  };
};
