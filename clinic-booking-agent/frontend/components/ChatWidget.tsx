"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Phone, Mic, Sparkles, CheckCircle2 } from 'lucide-react';
import Vapi from '@vapi-ai/web';
import { WS_URL, VAPI_PUBLIC_KEY, VAPI_ASSISTANT_ID } from '@/lib/config';

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  initialDateSlot?: { date: string; time: string } | null;
}

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  agent?: string;
  isStreaming?: boolean;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onClose, initialDateSlot }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: "👋 Assalam-o-Alaikum! Main AL-RAFAI CLINIC (Dr. Fatima) ki AI Virtual Assistant hoon.\n\nAap clinic timings (12:00 PM - 6:00 PM Daily), services, address ke baare mein pooch sakte hain ya foran appointment book karwa sakte hain. Main aapki kya madad kar sakti hoon?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agent: 'TriageAgent'
    }
  ]);

  const [input, setInput] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  const socketRef = useRef<WebSocket | null>(null);
  const vapiRef = useRef<Vapi | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const sessionIdRef = useRef<string>(`session-${Math.random().toString(36).substring(2, 9)}`);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Initialize Vapi SDK instance safely
  useEffect(() => {
    if (VAPI_PUBLIC_KEY && !vapiRef.current) {
      try {
        const vapi = new Vapi(VAPI_PUBLIC_KEY);
        vapiRef.current = vapi;

        vapi.on('call-start', () => {
          setIsVoiceActive(true);
          setMessages((prev) => [
            ...prev,
            {
              id: `vapi-start-${Date.now()}`,
              sender: 'bot',
              text: "🎙️ Vapi Voice Call connected! Speak now to ask questions or book an appointment.",
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              agent: 'VapiVoiceAgent'
            }
          ]);
        });

        vapi.on('call-end', () => {
          setIsVoiceActive(false);
          setMessages((prev) => [
            ...prev,
            {
              id: `vapi-end-${Date.now()}`,
              sender: 'bot',
              text: "📞 Voice call ended.",
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              agent: 'VapiVoiceAgent'
            }
          ]);
        });

        vapi.on('message', (msg: any) => {
          if (msg.type === 'transcript') {
            const role = msg.role === 'user' ? 'user' : 'bot';
            const transcriptText = msg.transcript;
            if (transcriptText && msg.transcriptType === 'final') {
              setMessages((prev) => [
                ...prev,
                {
                  id: `vapi-trans-${Date.now()}`,
                  sender: role,
                  text: transcriptText,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  agent: role === 'bot' ? 'VapiVoiceAgent' : undefined
                }
              ]);
            }
          }
        });

        vapi.on('error', (err: any) => {
          console.error("Vapi Voice Error:", err);
          setIsVoiceActive(false);
          setMessages((prev) => [
            ...prev,
            {
              id: `vapi-err-${Date.now()}`,
              sender: 'bot',
              text: `⚠️ Voice Assistant Error: ${err?.message || 'Connection failed'}`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
        });
      } catch (err) {
        console.error("Failed to initialize Vapi Web SDK:", err);
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      connectWebSocket();
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (initialDateSlot && isOpen) {
      const prompt = `I would like to book an appointment for date ${initialDateSlot.date} at ${initialDateSlot.time}.`;
      sendMessage(prompt);
    }
  }, [initialDateSlot, isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connectWebSocket = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) return;

    setIsConnecting(true);
    const wsUrl = `${WS_URL}/ws/chat/${sessionIdRef.current}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnecting(false);
      console.log("Connected to AL-RAFAI AI WebSocket Backend");
    };

    ws.onmessage = (event) => handleWSMessage(event);

    ws.onerror = (err) => {
      setIsConnecting(false);
      console.error("WebSocket error:", err);
    };

    ws.onclose = () => {
      setIsConnecting(false);
      console.log("WebSocket closed");
    };

    socketRef.current = ws;
  };

  const toggleVoiceCall = () => {
    if (!VAPI_PUBLIC_KEY || !VAPI_ASSISTANT_ID) {
      setMessages((prev) => [
        ...prev,
        {
          id: `vapi-unconfig-${Date.now()}`,
          sender: 'bot',
          text: "ℹ️ Vapi Voice Assistant credentials (NEXT_PUBLIC_VAPI_PUBLIC_KEY & NEXT_PUBLIC_VAPI_ASSISTANT_ID) are not set in frontend/.env.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      return;
    }

    if (isVoiceActive) {
      vapiRef.current?.stop();
    } else {
      vapiRef.current?.start(VAPI_ASSISTANT_ID);
    }
  };

  const sendMessage = (textToSend?: string) => {
    const content = textToSend || input;
    if (!content.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Ensure WebSocket is connected
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      const wsUrl = `${WS_URL}/ws/chat/${sessionIdRef.current}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setIsConnecting(false);
        ws.send(JSON.stringify({ content }));
      };

      ws.onmessage = (event) => handleWSMessage(event);

      ws.onerror = (err) => {
        setIsConnecting(false);
        console.error("WebSocket error:", err);
      };

      ws.onclose = () => {
        setIsConnecting(false);
      };

      socketRef.current = ws;
    } else {
      socketRef.current.send(JSON.stringify({ content }));
    }
  };

  const handleWSMessage = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);

      if (data.type === 'stream') {
        const delta = data.delta || '';
        setMessages((prev) => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg && lastMsg.sender === 'bot' && lastMsg.isStreaming) {
            return [
              ...prev.slice(0, -1),
              { ...lastMsg, text: lastMsg.text + delta }
            ];
          } else {
            return [
              ...prev,
              {
                id: `bot-${Date.now()}`,
                sender: 'bot',
                text: delta,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isStreaming: true
              }
            ];
          }
        });
      } else if (data.type === 'complete') {
        setMessages((prev) => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg && lastMsg.sender === 'bot') {
            return [
              ...prev.slice(0, -1),
              {
                ...lastMsg,
                text: data.content || lastMsg.text,
                agent: data.agent,
                isStreaming: false
              }
            ];
          } else {
            return [
              ...prev,
              {
                id: `bot-${Date.now()}`,
                sender: 'bot',
                text: data.content || '',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                agent: data.agent,
                isStreaming: false
              }
            ];
          }
        });
      } else if (data.type === 'error') {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            sender: 'bot',
            text: `⚠️ ${data.error || "An error occurred."}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (err) {
      console.error("Error parsing WS message:", err);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        
        {/* Small floating pill badge above button */}
        <div className="bg-white text-primary border border-border shadow-lg rounded-full px-3.5 py-1 text-xs font-extrabold flex items-center gap-1.5 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
          Chat / Voice Booking
        </div>

        {/* Floating WhatsApp-Style Button */}
        <button
          onClick={onClose}
          title="Open AI Booking Assistant"
          className="relative w-16 h-16 bg-primary hover:bg-primary-dark text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-105 group"
        >
          {/* Animated Pulse Ring */}
          <span className="absolute -inset-1 rounded-full bg-primary/30 animate-ping pointer-events-none" />
          
          <Bot className="w-7 h-7 text-white" />
          <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-accent border-2 border-white rounded-full" />
        </button>

      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[420px] h-[600px] max-h-[85vh] bg-white rounded-3xl border border-border shadow-2xl flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-6 duration-200 origin-bottom-right">
      
      {/* Header - Deep Primary Blue */}
      <div className="p-4 bg-primary text-white flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-white font-bold shadow-xs">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-white">AL-RAFAI AI Assistant</h3>
              <span className="flex items-center gap-1 text-[10px] text-accent-light font-bold px-2 py-0.5 rounded-full bg-white/15">
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" /> Live
              </span>
            </div>
            <p className="text-[11px] text-blue-100 font-medium">Dr. Fatima • 12:00 PM – 6:00 PM Daily</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Close Chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Voice Mode Status Banner */}
      {isVoiceActive && (
        <div className="bg-accent-light border-b border-green-200 px-4 py-2 text-xs text-accent-dark font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Mic className="w-3.5 h-3.5 text-accent animate-pulse" />
            Vapi Voice Assistant Active (Roman Urdu / English)
          </span>
          <span className="text-[10px] text-accent font-bold bg-white px-2 py-0.5 rounded-full border border-green-200">
            Speak Now
          </span>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm whitespace-pre-line leading-relaxed shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-primary text-white font-medium rounded-tr-none'
                  : 'bg-primary-light text-text-dark border border-border rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>

            <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-text-light">
              <span>{msg.timestamp}</span>
              {msg.agent && <span className="text-primary font-semibold">• {msg.agent}</span>}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Direct Call Fallback Banner */}
      {failedAttempts >= 3 && (
        <div className="bg-warm border-t border-border p-3 text-xs text-text-dark flex items-center justify-between">
          <span>Having trouble picking date/time?</span>
          <a
            href="tel:+15552345678"
            className="px-3 py-1 rounded-full bg-white hover:bg-primary-light border border-border text-primary font-bold flex items-center gap-1 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" /> Call Clinic
          </a>
        </div>
      )}

      {/* Quick Reply Chips */}
      <div className="px-3 py-2 bg-warm/60 border-t border-border flex gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => sendMessage("Mujhe Dr. Fatima ke sath appointment book karni hai")}
          className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white hover:bg-primary-light border border-border hover:border-primary text-xs text-text-mid hover:text-primary transition-colors font-semibold shadow-xs"
        >
          📅 Book Appointment
        </button>
        <button
          onClick={() => sendMessage("Clinic ke timings aur address kya hain?")}
          className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white hover:bg-primary-light border border-border hover:border-primary text-xs text-text-mid hover:text-primary transition-colors font-semibold shadow-xs"
        >
          📍 Timings & Location
        </button>
        <button
          onClick={() => sendMessage("Check available slots for today")}
          className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white hover:bg-primary-light border border-border hover:border-primary text-xs text-text-mid hover:text-primary transition-colors font-semibold shadow-xs"
        >
          ⏰ Available Slots
        </button>
      </div>

      {/* Input Form (WhatsApp Style with Mic beside Send) */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="p-3 bg-white border-t border-border flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message in Roman Urdu or English..."
          className="flex-1 bg-warm text-text-dark text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary transition-colors placeholder:text-text-light"
        />

        {/* WhatsApp Style Voice Mic Button */}
        <button
          type="button"
          onClick={toggleVoiceCall}
          disabled={!VAPI_PUBLIC_KEY || !VAPI_ASSISTANT_ID}
          title={
            !VAPI_PUBLIC_KEY || !VAPI_ASSISTANT_ID
              ? "Vapi Voice Assistant unconfigured in .env"
              : isVoiceActive
              ? "End Voice Call"
              : "Start Voice Call"
          }
          className={`p-2.5 rounded-xl border transition-all flex items-center justify-center ${
            !VAPI_PUBLIC_KEY || !VAPI_ASSISTANT_ID
              ? "bg-warm border-border text-text-light cursor-not-allowed opacity-50"
              : isVoiceActive 
              ? "bg-accent text-white border-accent shadow-xs" 
              : "bg-warm border-border text-primary hover:text-primary-dark hover:bg-primary-light"
          }`}
        >
          {isVoiceActive ? (
            <Mic className="w-4 h-4 text-white animate-pulse" />
          ) : (
            <Mic className="w-4 h-4 text-primary" />
          )}
        </button>

        {/* Send Message Button */}
        <button
          type="submit"
          disabled={!input.trim()}
          className="bg-primary hover:bg-primary-dark text-white p-2.5 rounded-xl disabled:opacity-40 transition-opacity flex items-center justify-center shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
