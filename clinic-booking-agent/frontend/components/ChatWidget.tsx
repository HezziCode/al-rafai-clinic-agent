"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Phone, Mic, CheckCircle2, User, Clock, Sparkles } from 'lucide-react';
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
      <button
        onClick={onClose}
        title="Chat with AI Assistant"
        className="fixed bottom-6 right-6 z-50 bg-[#4A90D9] hover:bg-[#2C6FAC] text-white h-14 rounded-full shadow-lg shadow-[#4A90D9]/30 flex items-center justify-start p-4 transition-all duration-300 ease-out hover:scale-105 group overflow-hidden max-w-[56px] hover:max-w-[240px]"
      >
        <div className="relative flex-shrink-0">
          <Bot className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#27AE60] border-2 border-white rounded-full" />
        </div>
        <span className="whitespace-nowrap text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out delay-75 pl-3 pr-1">
          Chat with AI Assistant
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[420px] h-[600px] max-h-[85vh] bg-white rounded-2xl border border-[#E0EAF4] shadow-2xl shadow-[#4A90D9]/15 flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-6 duration-300 ease-out origin-bottom-right">
      
      {/* Header */}
      <div className="p-4 bg-[#EAF3FB] border-b border-[#E0EAF4] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-[#BDD7F5] flex items-center justify-center text-[#4A90D9] font-bold shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#1A1A2E]">AL-RAFAI AI Assistant</h3>
              <span className="flex items-center gap-1 text-[10px] text-[#5A6A7A] font-semibold px-2 py-0.5 rounded-full bg-white border border-[#E0EAF4]">
                <span className="w-1.5 h-1.5 bg-[#27AE60] rounded-full" /> Online
              </span>
            </div>
            <p className="text-[11px] text-[#5A6A7A]">Dr. Fatima • 12:00 PM – 6:00 PM Daily</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white hover:bg-[#F0F6FF] border border-[#E0EAF4] text-[#5A6A7A] hover:text-[#1A1A2E] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Voice Mode Status Banner */}
      {isVoiceActive && (
        <div className="bg-[#EAF3FB] border-b border-[#BDD7F5] px-4 py-2 text-xs text-[#2C6FAC] flex items-center justify-between">
          <span className="flex items-center gap-2 font-medium">
            <Mic className="w-3.5 h-3.5 text-[#4A90D9] animate-pulse" />
            Vapi Voice Assistant Active (Roman Urdu / English)
          </span>
          <span className="text-[10px] text-[#4A90D9] font-semibold bg-white px-2 py-0.5 rounded-full border border-[#BDD7F5]">
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
                  ? 'bg-[#4A90D9] text-white font-medium rounded-tr-none'
                  : 'bg-[#F0F6FF] text-[#1A1A2E] border border-[#E0EAF4] rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>

            <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-[#5A6A7A]">
              <span>{msg.timestamp}</span>
              {msg.agent && <span className="text-[#4A90D9] font-medium">• {msg.agent}</span>}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Direct Call Fallback Banner */}
      {failedAttempts >= 3 && (
        <div className="bg-[#FFF9E6] border-t border-[#FFE7A3] p-3 text-xs text-[#8A6D3B] flex items-center justify-between">
          <span>Having trouble picking date/time?</span>
          <a
            href="tel:+15552345678"
            className="px-3 py-1 rounded-full bg-white hover:bg-[#FFF4D1] border border-[#FFE7A3] text-[#8A6D3B] font-semibold flex items-center gap-1 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" /> Call +1 (555) 234-5678
          </a>
        </div>
      )}

      {/* Quick Reply Chips */}
      <div className="px-3 py-2 bg-[#F8FAFC] border-t border-[#E0EAF4] flex gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => sendMessage("Mujhe Dr. Fatima ke sath appointment book karni hai")}
          className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white hover:bg-[#EAF3FB] border border-[#E0EAF4] hover:border-[#BDD7F5] text-xs text-[#5A6A7A] hover:text-[#4A90D9] transition-colors shadow-xs"
        >
          📅 Book Appointment
        </button>
        <button
          onClick={() => sendMessage("Clinic ke timings aur address kya hain?")}
          className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white hover:bg-[#EAF3FB] border border-[#E0EAF4] hover:border-[#BDD7F5] text-xs text-[#5A6A7A] hover:text-[#4A90D9] transition-colors shadow-xs"
        >
          📍 Timings & Location
        </button>
        <button
          onClick={() => sendMessage("Check available slots for today")}
          className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white hover:bg-[#EAF3FB] border border-[#E0EAF4] hover:border-[#BDD7F5] text-xs text-[#5A6A7A] hover:text-[#4A90D9] transition-colors shadow-xs"
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
        className="p-3 bg-white border-t border-[#E0EAF4] flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message in Roman Urdu or English..."
          className="flex-1 bg-[#F0F6FF] text-[#1A1A2E] text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[#E0EAF4] focus:outline-none focus:border-[#4A90D9] transition-colors placeholder:text-[#5A6A7A]"
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
              ? "bg-[#F0F6FF] border-[#E0EAF4] text-[#A0AEC0] cursor-not-allowed"
              : isVoiceActive 
              ? "bg-[#EAF3FB] border-[#4A90D9] text-[#4A90D9] shadow-xs" 
              : "bg-[#F0F6FF] border-[#E0EAF4] text-[#5A6A7A] hover:text-[#4A90D9] hover:bg-[#EAF3FB]"
          }`}
        >
          {isVoiceActive ? (
            <Mic className="w-4 h-4 text-[#4A90D9] animate-pulse" />
          ) : (
            <Mic className="w-4 h-4 text-[#4A90D9]" />
          )}
        </button>

        {/* Send Message Button */}
        <button
          type="submit"
          disabled={!input.trim()}
          className="bg-[#4A90D9] hover:bg-[#2C6FAC] text-white p-2.5 rounded-xl disabled:opacity-40 transition-opacity flex items-center justify-center shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
