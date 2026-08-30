"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Phone, Mic, Square, Loader2, Sparkles, CheckCircle2, AlertCircle, Calendar, MapPin, Clock } from 'lucide-react';
import Vapi from '@vapi-ai/web';
import { WS_URL, VAPI_PUBLIC_KEY, VAPI_ASSISTANT_ID } from '@/lib/config';

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  initialDateSlot?: { date: string; time: string } | null;
}

interface Message {
  id: string;
  sender: 'bot' | 'user' | 'system';
  text: string;
  timestamp: string;
  agent?: string;
  isStreaming?: boolean;
  isToolCall?: boolean;
  toolName?: string;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onClose, initialDateSlot }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: "👋 Assalam-o-Alaikum! Main AL-RAFAI CLINIC (Dr. Fatima) ki AI Virtual Assistant hoon.\n\nAap clinic timings (12:00 PM - 6:00 PM Daily), services, address ke baare mein pooch sakte hain ya foran appointment book karwa sakte hain. Main aapki kya madad kar sakti hoon?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  // Streaming & Tool Call State
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeToolCall, setActiveToolCall] = useState<string | null>(null);
  const [busyToast, setBusyToast] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const vapiRef = useRef<Vapi | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const sessionIdRef = useRef<string>(`session-${Math.random().toString(36).substring(2, 9)}`);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Initialize Vapi SDK instance safely with real-time partial transcript streaming
  useEffect(() => {
    if (VAPI_PUBLIC_KEY && !vapiRef.current) {
      try {
        const vapi = new Vapi(VAPI_PUBLIC_KEY);
        vapiRef.current = vapi;

        vapi.on('call-start', () => {
          setIsConnecting(false);
          setIsVoiceActive(true);
          setMessages((prev) => [
            ...prev,
            {
              id: `vapi-start-${Date.now()}`,
              sender: 'system',
              text: "🎙️ Voice Call connected! Speak naturally in Roman Urdu or English.",
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
        });

        vapi.on('call-end', () => {
          setIsConnecting(false);
          setIsVoiceActive(false);
          setMessages((prev) => [
            ...prev,
            {
              id: `vapi-end-${Date.now()}`,
              sender: 'system',
              text: "📞 Voice call ended.",
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
        });

        vapi.on('message', (msg: any) => {
          if (msg.type === 'transcript') {
            const role = msg.role === 'user' ? 'user' : 'bot';
            const transcriptText = msg.transcript;

            // Handle partial user voice transcript (live real-time speech preview)
            if (msg.transcriptType === 'partial' && role === 'user' && transcriptText) {
              setMessages((prev) => {
                const lastMsg = prev[prev.length - 1];
                if (lastMsg && lastMsg.id.startsWith('voice-partial-')) {
                  return [
                    ...prev.slice(0, -1),
                    { ...lastMsg, text: transcriptText, isStreaming: true }
                  ];
                }
                return [
                  ...prev,
                  {
                    id: `voice-partial-${Date.now()}`,
                    sender: 'user',
                    text: transcriptText,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isStreaming: true
                  }
                ];
              });
            }

            // Handle final transcript
            if (msg.transcriptType === 'final' && transcriptText) {
              setMessages((prev) => {
                const withoutPartial = prev.filter((m) => !m.id.startsWith('voice-partial-'));
                return [
                  ...withoutPartial,
                  {
                    id: `vapi-trans-${Date.now()}`,
                    sender: role,
                    text: transcriptText,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isStreaming: false
                  }
                ];
              });
            }
          }
        });

        vapi.on('error', (err: any) => {
          console.error("Voice Error:", err);
          setIsConnecting(false);
          setIsVoiceActive(false);
          setMessages((prev) => [
            ...prev,
            {
              id: `vapi-err-${Date.now()}`,
              sender: 'system',
              text: `⚠️ Voice Assistant: ${err?.message || 'Connection failed'}`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
        });
      } catch (err) {
        console.error("Failed to initialize Voice SDK:", err);
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
  }, [messages, isAgentTyping, activeToolCall]);

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
          sender: 'system',
          text: "ℹ️ Voice Assistant credentials are not configured in environment.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      return;
    }

    if (isVoiceActive) {
      setIsConnecting(false);
      vapiRef.current?.stop();
    } else {
      setIsConnecting(true);
      vapiRef.current?.start(VAPI_ASSISTANT_ID);
    }
  };

  const sendMessage = (textToSend?: string) => {
    if (isStreaming) {
      setBusyToast("Please wait, the AI assistant is still responding...");
      setTimeout(() => setBusyToast(null), 2500);
      return;
    }

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

    setIsStreaming(true);
    setIsAgentTyping(true);

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
        setIsStreaming(false);
        setIsAgentTyping(false);
        console.error("WebSocket error:", err);
      };

      ws.onclose = () => {
        setIsConnecting(false);
        setIsStreaming(false);
        setIsAgentTyping(false);
      };

      socketRef.current = ws;
    } else {
      socketRef.current.send(JSON.stringify({ content }));
    }
  };

  const handleWSMessage = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);

      // 1. TYPING — Instant ~50ms feedback before LLM tokens generate
      if (data.type === 'typing') {
        setIsAgentTyping(true);
        setIsStreaming(true);
      }

      // 2. TOOL_CALL — Agent is executing a tool
      else if (data.type === 'tool_call') {
        setActiveToolCall(data.tool_name || 'processing');
        setIsAgentTyping(false);
        setIsStreaming(true);

        const toolLabels: Record<string, string> = {
          get_available_slots: '🔍 Checking available appointment slots...',
          book_appointment: '📝 Confirming your appointment...',
          cancel_appointment: '❌ Processing appointment cancellation...',
          reschedule_appointment: '🔄 Rescheduling your appointment...',
          get_clinic_info: '📋 Fetching clinic information...',
          save_patient_details: '💾 Saving patient details...',
          transfer_to_booking: '📅 Checking appointment booking...',
          transfer_to_faq: 'ℹ️ Retrieving clinic details...'
        };

        const label = toolLabels[data.tool_name] || `⚙️ Processing request...`;

        setMessages((prev) => [
          ...prev,
          {
            id: `tool-${Date.now()}`,
            sender: 'system',
            text: label,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isToolCall: true,
            toolName: data.tool_name
          }
        ]);
      }

      // 3. TOOL_DONE — Remove tool call progress indicator
      else if (data.type === 'tool_done') {
        setActiveToolCall(null);
        setMessages((prev) => prev.filter((m) => !m.isToolCall));
      }

      // 4. AGENT_HANDOFF
      else if (data.type === 'agent_handoff') {
        // Silently transition without exposing developer agent names
      }

      // 5. STREAM — Real-time text token delta
      else if (data.type === 'stream') {
        setIsAgentTyping(false);
        setActiveToolCall(null);
        setIsStreaming(true);

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
      }

      // 6. COMPLETE — Turn finalized
      else if (data.type === 'complete') {
        setIsStreaming(false);
        setIsAgentTyping(false);
        setActiveToolCall(null);

        setMessages((prev) => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg && lastMsg.sender === 'bot') {
            return [
              ...prev.slice(0, -1),
              {
                ...lastMsg,
                text: data.content || lastMsg.text,
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
                isStreaming: false
              }
            ];
          }
        });
      }

      // 7. BUSY — Backend guard warning
      else if (data.type === 'busy') {
        setBusyToast(data.message || "Please wait, still responding...");
        setTimeout(() => setBusyToast(null), 2500);
      }

      // 8. ERROR
      else if (data.type === 'error') {
        setIsStreaming(false);
        setIsAgentTyping(false);
        setActiveToolCall(null);

        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            sender: 'system',
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
        
        {/* Floating pill badge above button */}
        <div className="bg-white text-primary border border-border shadow-lg rounded-full px-3.5 py-1 text-xs font-extrabold flex items-center gap-1.5 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
          Chat / Voice Booking
        </div>

        {/* Floating AI Booking Button */}
        <button
          onClick={onClose}
          title="Open AI Booking Assistant"
          aria-label="Open AI Booking Assistant"
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
            aria-label="Close Chat Window"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Voice Mode Status Banner (Calm Medical Blue Palette) */}
      {isVoiceActive && (
        <div className="bg-primary-light border-b border-blue-200 px-4 py-2.5 text-xs text-primary font-bold flex items-center justify-between shadow-inner">
          <span className="flex items-center gap-2">
            <Mic className="w-3.5 h-3.5 text-primary animate-pulse" />
            Voice Assistant Active (Roman Urdu / English)
          </span>
          <span className="text-[10px] text-primary font-extrabold bg-white px-2.5 py-0.5 rounded-full border border-blue-200 shadow-xs">
            Speak Now
          </span>
        </div>
      )}

      {/* Busy Toast Banner */}
      {busyToast && (
        <div className="bg-amber-100 border-b border-amber-200 px-4 py-2 text-xs text-amber-800 font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{busyToast}</span>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white">
        {messages.map((msg) => (
          <React.Fragment key={msg.id}>
            {/* System / Tool Call / Status Message */}
            {msg.sender === 'system' ? (
              <div className="flex justify-center my-1.5">
                <span className="text-[11px] text-text-mid bg-warm border border-border rounded-full px-3.5 py-1 font-medium italic flex items-center gap-1.5 shadow-xs">
                  {msg.isToolCall && (
                    <span className="w-2 h-2 rounded-full bg-primary animate-ping mr-0.5" />
                  )}
                  {msg.text}
                </span>
              </div>
            ) : (
              /* User / Bot Message */
              <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm whitespace-pre-line leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white font-medium rounded-tr-none'
                      : 'bg-primary-light text-text-dark border border-border rounded-tl-none'
                  }`}
                >
                  {msg.text}
                  {/* Blinking live streaming cursor */}
                  {msg.isStreaming && (
                    <span className="inline-block w-1 h-3.5 bg-primary ml-1 animate-pulse align-middle rounded-full" />
                  )}
                </div>

                {/* Clean Timestamp (No Developer Agent Names) */}
                <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-text-light font-medium">
                  <span>{msg.timestamp}</span>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}

        {/* 3-Dot Bouncing Typing Indicator */}
        {isAgentTyping && (
          <div className="flex items-start gap-2">
            <div className="bg-primary-light border border-border rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}

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
          disabled={isStreaming}
          className={`whitespace-nowrap px-3 py-1.5 rounded-full bg-white border border-border text-xs text-text-mid font-semibold shadow-xs transition-all flex items-center gap-1.5 ${
            isStreaming ? 'opacity-40 cursor-not-allowed' : 'hover:bg-primary-light hover:border-primary hover:text-primary'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <span>Book Appointment</span>
        </button>
        <button
          onClick={() => sendMessage("Clinic ke timings aur address kya hain?")}
          disabled={isStreaming}
          className={`whitespace-nowrap px-3 py-1.5 rounded-full bg-white border border-border text-xs text-text-mid font-semibold shadow-xs transition-all flex items-center gap-1.5 ${
            isStreaming ? 'opacity-40 cursor-not-allowed' : 'hover:bg-primary-light hover:border-primary hover:text-primary'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-primary" />
          <span>Timings & Location</span>
        </button>
        <button
          onClick={() => sendMessage("Check available slots for today")}
          disabled={isStreaming}
          className={`whitespace-nowrap px-3 py-1.5 rounded-full bg-white border border-border text-xs text-text-mid font-semibold shadow-xs transition-all flex items-center gap-1.5 ${
            isStreaming ? 'opacity-40 cursor-not-allowed' : 'hover:bg-primary-light hover:border-primary hover:text-primary'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-primary" />
          <span>Available Slots</span>
        </button>
      </div>

      {/* Input Form with Mic beside Send + Streaming Guard */}
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
          disabled={isStreaming}
          aria-label="Type your message for Dr. Fatima's assistant"
          placeholder={isStreaming ? "Dr. Fatima's Assistant is responding..." : "Message in Roman Urdu or English..."}
          className={`flex-1 bg-warm text-text-dark text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary transition-colors placeholder:text-text-light ${
            isStreaming ? 'opacity-60 cursor-not-allowed bg-gray-100' : ''
          }`}
        />

        {/* Voice Button — Mic when idle, Loader when connecting, Red Square when active */}
        <div className="relative flex-shrink-0 flex items-center justify-center">
          {(isVoiceActive || isConnecting) && (
            <>
              <span className={`absolute w-full h-full rounded-xl opacity-30 animate-ping ${
                isConnecting ? 'bg-primary' : 'bg-red-400'
              }`} />
              <span className={`absolute w-full h-full rounded-xl opacity-20 animate-ping [animation-delay:300ms] ${
                isConnecting ? 'bg-primary' : 'bg-red-300'
              }`} />
            </>
          )}
          <button
            type="button"
            onClick={toggleVoiceCall}
            disabled={!VAPI_PUBLIC_KEY || !VAPI_ASSISTANT_ID || isConnecting}
            aria-label={
              isConnecting
                ? "Connecting to voice assistant..."
                : isVoiceActive
                ? "End voice call"
                : "Start voice consultation with assistant"
            }
            title={
              !VAPI_PUBLIC_KEY || !VAPI_ASSISTANT_ID
                ? "Voice Assistant unconfigured in .env"
                : isConnecting
                ? "Connecting to Voice Assistant..."
                : isVoiceActive
                ? "Tap to end call"
                : "Start Voice Call"
            }
            className={`relative z-10 p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-center ${
              !VAPI_PUBLIC_KEY || !VAPI_ASSISTANT_ID
                ? "bg-warm border-border text-text-light cursor-not-allowed opacity-50"
                : isConnecting
                ? "bg-primary-light border-primary text-primary cursor-wait"
                : isVoiceActive
                ? "bg-red-500 hover:bg-red-600 border-red-500 text-white shadow-lg scale-105"
                : "bg-warm border-border text-primary hover:bg-primary-light"
            }`}
          >
            {isConnecting ? (
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
            ) : isVoiceActive ? (
              <Square className="w-4 h-4 text-white fill-white" />
            ) : (
              <Mic className="w-4 h-4 text-primary" />
            )}
          </button>
        </div>

        {/* Send Message Button */}
        <button
          type="submit"
          disabled={!input.trim() || isStreaming}
          aria-label="Send message"
          className={`bg-primary hover:bg-primary-dark text-white p-2.5 rounded-xl transition-all flex items-center justify-center shadow-xs ${
            !input.trim() || isStreaming ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};