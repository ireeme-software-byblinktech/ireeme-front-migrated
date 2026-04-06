"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Sparkles, Share2, MoreVertical, FileText, BookOpen, ClipboardList, PenTool, Image as ImageIcon, Mic, Send, ChevronRight, User } from "lucide-react";
import { cn } from "@/lib/utils";

const suggestions = [
  "Help me understand the basics of algebra",
  "Generate a practice quiz for World War II",
  "Create a study schedule for my upcoming exams",
  "Summarize this textbook chapter for me",
];

const actionCards = [
  {
    title: "Generate Summary",
    description: "Create quick summaries of your study materials and notes",
    icon: <FileText className="w-6 h-6 text-white" />,
    bgColor: "bg-slate-700",
  },
  {
    title: "Study Plan",
    description: "Generate structured study schedules to prepare for exams",
    icon: <BookOpen className="w-6 h-6 text-white" />,
    bgColor: "bg-slate-700",
  },
  {
    title: "Practice Quiz",
    description: "Test your knowledge with AI-generated quizzes",
    icon: <ClipboardList className="w-6 h-6 text-white" />,
    bgColor: "bg-slate-700",
  },
  {
    title: "Writing Assistant",
    description: "Get feedback on paragraphs, essays, and assignments",
    icon: <PenTool className="w-6 h-6 text-white" />,
    bgColor: "bg-slate-700",
  },
];

type Attachment = {
  type: 'image' | 'audio';
  url: string;
};

type Message = { id: string; role: 'user' | 'ai'; text: string; time: string; attachment?: Attachment };

export default function StudentAIPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const toggleRecording = async () => {
    if (micActive) {
      if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
      setMicActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setMicActive(true);
      } catch (err) {
        alert("Microphone permission denied or unavailable.");
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
    }
  };

  const handleSend = (text: string) => {
    if (!text.trim() && !selectedImage && !audioUrl) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    let attachment: Attachment | undefined = undefined;
    if (selectedImage) attachment = { type: 'image', url: selectedImage };
    else if (audioUrl) attachment = { type: 'audio', url: audioUrl };
    
    const newUserMsg: Message = { 
      id: Date.now().toString(), 
      role: "user", 
      text: text.trim(), 
      time: timeString,
      attachment 
    };
    
    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    setSelectedImage(null);
    setAudioUrl(null);
    setIsTyping(true);

    // Simulate AI Response
    setTimeout(() => {
      const responseText = attachment 
        ? `Thanks for sharing this ${attachment.type}. I'm analyzing the ${attachment.type === 'image' ? 'visuals' : 'audio content'} now. I'll provide detailed feedback about it once my systems are fully unlocked!`
        : `I'm your Campus AI assistant! I've received your request: "${text.trim()}". While I am currently operating in demo mode, eventually I will provide personalized study guides, quizzes, and summaries right here.`;

      const newAiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: "ai", 
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      setMessages((prev) => [...prev, newAiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const resetChat = () => {
    if (window.confirm("Start a new chat session?")) {
      setMessages([]);
    }
  };

  const alertSystem = (message: string) => {
    alert(message);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-5xl mx-auto relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMessages([])}
            className="p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
            title="Dashboard Home"
          >
            <Sparkles size={24} className="text-gray-900" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Campus AI
            </h1>
            <p className="text-sm text-gray-500 font-medium">Your intelligent learning companion</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => alertSystem("Sharing functionality simulated!")}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Share2 size={20} strokeWidth={1.5} />
          </button>
          <button 
            onClick={() => alertSystem("Settings menu simulated!")}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <MoreVertical size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Main Flow Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-56">
        
        {messages.length === 0 ? (
          /* Empty State - Welcome & Options */
          <div className="space-y-12">
            <div className="flex flex-col items-center text-center space-y-6 pt-8">
              <button 
                onClick={resetChat}
                className="w-20 h-20 bg-black rounded-xl flex items-center justify-center relative shadow-sm hover:bg-gray-900 transition-transform hover:scale-105 active:scale-95"
              >
                <Sparkles size={40} className="text-white" />
                <div className="absolute top-2 right-2 w-4 h-4 text-white hover:text-gray-300 font-bold">+</div>
              </button>
              <div className="space-y-2">
                <h2 className="text-4xl font-semibold text-gray-900 tracking-tight">Welcome to Campus AI</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Your personal <span className="font-medium text-gray-900">AI study assistant</span> ready to help with <br />
                  <span className="font-medium text-gray-900">homework</span>, exam preparation, notes, and more
                </p>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto px-4">
              {actionCards.map((card, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSend(`Could you help me ${card.title.toLowerCase()}?`)}
                  className="group p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex gap-4 cursor-pointer rounded-xl bg-white text-left w-full shadow-sm"
                >
                  <div className="w-12 h-12 rounded-md flex items-center justify-center shrink-0 shadow-sm bg-black group-hover:scale-110 transition-transform">
                    {card.icon}
                  </div>
                  <div className="space-y-1 mt-1">
                    <h3 className="font-medium text-gray-900 text-lg group-hover:text-blue-600 transition-colors">{card.title}</h3>
                    <p className="text-sm text-gray-500 leading-snug">{card.description}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Suggested Prompts */}
            <div className="max-w-4xl mx-auto px-4 space-y-3">
              {suggestions.map((text, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(text)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-md text-left transition-all border border-gray-100 hover:border-gray-200 hover:shadow-sm"
                >
                  <span className="text-gray-700 font-medium text-sm">{text}</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Active Chat State */
          <div className="max-w-4xl mx-auto px-4 space-y-8 pt-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-4 w-full ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center shadow-sm ${
                  msg.role === 'user' ? 'bg-gray-200' : 'bg-black'
                }`}>
                  {msg.role === 'ai' ? <Sparkles size={20} className="text-white" /> : <User size={20} className="text-gray-600" />}
                </div>

                {/* Bubble */}
                <div className={`max-w-[80%] md:max-w-[70%] rounded-2xl p-5 ${
                  msg.role === 'user' 
                    ? 'bg-black text-white rounded-tr-none shadow-md' 
                    : 'bg-white text-gray-900 rounded-tl-none border border-gray-200 shadow-sm'
                }`}>
                  {msg.attachment?.type === 'image' && (
                    <img src={msg.attachment.url} alt="Attachment" className="max-w-[400px] w-full rounded-lg mb-3 object-cover shadow-sm bg-gray-50 border border-gray-100/20" />
                  )}
                  {msg.attachment?.type === 'audio' && (
                    <div className="mb-3">
                      <audio src={msg.attachment.url} controls className={cn("h-10 w-full max-w-[300px]", msg.role === 'user' && "opacity-90 invert")} />
                    </div>
                  )}
                  {msg.text && (
                    <p className="text-[15px] leading-relaxed font-medium whitespace-pre-wrap">{msg.text}</p>
                  )}
                  <span className={`text-xs block mt-3 font-bold opacity-60`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-black shrink-0 flex items-center justify-center shadow-sm">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none p-5 flex items-center gap-2 shadow-sm min-h-[60px]">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: "0.15s"}}></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: "0.3s"}}></div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Persistent Chat Input */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pt-12">
        <div className="max-w-4xl mx-auto relative group flex flex-col gap-3">
          
          {/* Previews */}
          {(selectedImage || audioUrl) && (
            <div className="flex flex-wrap gap-4 px-2">
              {selectedImage && (
                <div className="relative group">
                  <img src={selectedImage} alt="Preview" className="w-24 h-24 object-cover rounded-xl border-4 border-white shadow-md shadow-gray-200/60" />
                  <button onClick={() => setSelectedImage(null)} className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-xs shadow-lg transition-transform hover:scale-110">X</button>
                </div>
              )}
              {audioUrl && (
                <div className="relative bg-white border border-gray-200 shadow-md shadow-gray-200/60 rounded-xl p-2 flex items-center gap-3">
                  <audio src={audioUrl} controls className="h-10 w-[240px]" />
                  <button onClick={() => setAudioUrl(null)} className="bg-red-50 hover:bg-red-100 text-red-500 rounded-md px-3 py-2 text-xs font-bold transition-colors">Discard</button>
                </div>
              )}
            </div>
          )}

          <div className="flex items-end gap-3 bg-white border border-gray-200 rounded-xl p-3 shadow-lg shadow-gray-200/50 transition-all focus-within:border-black focus-within:ring-2 focus-within:ring-black/5">
            <input type="file" accept="image/*" id="image-upload" className="hidden" onChange={handleImageUpload} />
            <button 
              onClick={() => document.getElementById('image-upload')?.click()}
              className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Upload Image"
            >
              <ImageIcon size={22} strokeWidth={1.5} />
            </button>
            <button 
              onClick={toggleRecording}
              className={`p-3 rounded-lg transition-colors shrink-0 ${
                micActive 
                  ? 'text-white bg-red-500 hover:bg-red-600 shadow-md animate-pulse' 
                  : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title="Voice Note"
            >
              <Mic size={22} strokeWidth={1.5} />
            </button>
            
            {micActive ? (
              <div className="flex-1 py-3 text-red-500 font-bold flex items-center gap-2">
                Recording audio... Click mic to finish.
              </div>
            ) : (
              <textarea
                rows={1}
                placeholder={selectedImage || audioUrl ? "Add an optional message..." : "Ask me anything..."}
                className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-[15px] py-3 resize-none max-h-40 font-medium placeholder:text-gray-400"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            )}
            
            <button 
              onClick={() => handleSend(input)}
              disabled={!input.trim() && !selectedImage && !audioUrl && !micActive}
              className={cn(
                "p-3.5 rounded-lg transition-all shadow-sm flex items-center gap-2 shrink-0 border",
                (input.trim() || selectedImage || audioUrl) && !micActive
                  ? "bg-black hover:bg-gray-900 text-white border-black cursor-pointer" 
                  : "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed"
              )}>
              <span className="font-bold text-sm hidden sm:inline">Send</span>
              <Send size={18} className={(input.trim() || selectedImage || audioUrl) && !micActive ? "translate-x-0.5 transition-transform" : ""} />
            </button>
          </div>
          <div className="mt-2 flex flex-col sm:flex-row items-center justify-between px-2 gap-2">
            <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-gray-400 font-bold uppercase tracking-wider">
              <span>Press <strong className="text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">Enter</strong> to send</span>
              <span className="hidden sm:inline"><strong className="text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">Shift + Enter</strong> for new line</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}