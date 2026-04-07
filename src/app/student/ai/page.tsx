"use client";

import { useState, useRef, useEffect } from "react";
import { StatCard } from "@/components/ui/Card";
import { Sparkles, Share2, MoreVertical, FileText, BookOpen, ClipboardList, PenTool, Image as ImageIcon, Mic, Send, ChevronRight, User, GraduationCap, X, FolderOpen, Check, Plus } from "lucide-react";
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
  const [isNotePickerOpen, setIsNotePickerOpen] = useState(false);
  const [isOperationPickerOpen, setIsOperationPickerOpen] = useState(false);
  const [isQuizConfigOpen, setIsQuizConfigOpen] = useState(false);
  const [quizConfig, setQuizConfig] = useState<{ formats: string[], difficulty: string }>({ formats: ["Multiple Choice"], difficulty: "Medium" });
  const [selectedNoteForAI, setSelectedNoteForAI] = useState<any>(null);
  const [selectedOperation, setSelectedOperation] = useState<any>(null);
  
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
    setSelectedNoteForAI(null); // Clear after sending
    setSelectedOperation(null); // Clear after sending
    setIsTyping(true);

    // Simulate AI Response
    setTimeout(() => {
      let responseText = "";
      
      const lowerText = newUserMsg.text.toLowerCase();
      
      if (attachment) {
        responseText = `Thanks for sharing this ${attachment.type}. I'm analyzing the ${attachment.type === 'image' ? 'visuals' : 'audio content'} now. I'll provide detailed feedback about it once my systems are fully unlocked!`;
      } else if (lowerText.includes("quiz")) {
        responseText = "Here is a 3-question practice quiz based on the material:\n\nQ1: What is the primary focus of the framework?\nA) Static analysis\nB) Synthesizing knowledge\nC) Rote learning\n\nQ2: How are lecture points mapped?\nA) As core services\nB) As isolated modules\nC) As raw data\n\nQ3: What drives maximum retention?\nA) Group study\nB) Focused cycles\nC) Skimming\n\nReply with your answers!";
      } else if (lowerText.includes("summary") || lowerText.includes("summarize")) {
        responseText = "Here is the summary of your selected material:\n\n1. Strategic Synthesis\nThe text outlines deconstructing complex topics into actionable and tactical study units.\n\n2. Focused Retention\nBy leveraging targeted study cycles and eliminating distractions, students can improve information retention.\n\n3. Practical Application\nCore concepts should be viewed as active systems rather than static facts, meaning they must be applied through assignments.\n\nWould you like me to create a quiz based on this summary?";
      } else {
        responseText = `I'm your Campus AI assistant! I've received your request: "${text.trim()}". While I am currently operating in demo mode, eventually I will provide personalized study guides, quizzes, and summaries right here.`;
      }

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

            {/* Action Cards - OPERATION FIRST */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto px-4">
              {actionCards.map((card, i) => (
                <button 
                  key={i} 
                  onClick={() => {
                    setSelectedOperation(card);
                    if (card.title === "Practice Quiz") {
                      setIsQuizConfigOpen(true);
                    } else {
                      setIsNotePickerOpen(true);
                    }
                  }}
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
          {(selectedImage || audioUrl || selectedNoteForAI) && (
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
              {selectedNoteForAI && (
                <div className="relative bg-black text-white rounded-xl p-3 flex items-center gap-3 shadow-lg max-w-full font-medium">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                    {selectedOperation ? selectedOperation.icon : <FileText size={18} />}
                  </div>
                  <div className="flex-1 truncate">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      {selectedOperation ? selectedOperation.title : 'Attached Note'}
                    </p>
                    <p className="text-xs font-bold truncate">{selectedNoteForAI.title}</p>
                  </div>
                  <button 
                    onClick={() => {
                        setSelectedNoteForAI(null);
                        setSelectedOperation(null);
                    }} 
                    className="text-gray-400 hover:text-white font-bold p-1 bg-white/5 rounded-full"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="flex items-end gap-3 bg-white border border-gray-200 rounded-xl p-3 shadow-lg shadow-gray-200/50 transition-all focus-within:border-black focus-within:ring-2 focus-within:ring-black/5 relative z-20">
            <div className="relative flex items-center">
              <button 
                onClick={() => setIsOperationPickerOpen(!isOperationPickerOpen)}
                className="w-10 h-10 text-white bg-black hover:bg-gray-800 rounded-full transition-colors cursor-pointer shrink-0 shadow-sm flex items-center justify-center group relative z-10"
                title="Select Action & Note"
              >
                <Plus size={20} strokeWidth={2} className={cn("transition-transform duration-300", isOperationPickerOpen && "rotate-45")} />
              </button>
              
              {isOperationPickerOpen && (
                <>
                  <div className="fixed inset-0 z-[90]" onClick={() => setIsOperationPickerOpen(false)}></div>
                  <div className="absolute bottom-full left-0 mb-4 w-[280px] bg-black border border-gray-800 rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200 z-[100] shadow-2xl">
                    <div className="px-4 py-3 border-b border-gray-800 flex justify-between items-center bg-white/[0.02]">
                       <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Select Operation</span>
                       <button onClick={() => setIsOperationPickerOpen(false)} className="text-gray-400 hover:text-white transition-colors"><X size={14}/></button>
                    </div>
                    <div className="p-2 space-y-1">
                        {actionCards.map((card, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setSelectedOperation(card);
                              setIsOperationPickerOpen(false);
                              if (card.title === "Practice Quiz") {
                                setIsQuizConfigOpen(true);
                              } else {
                                setIsNotePickerOpen(true);
                              }
                            }}
                            className="w-full flex items-center gap-3 p-3 hover:bg-white/10 transition-colors rounded-lg text-left group"
                          >
                            <div className="shrink-0 w-8 h-8 rounded-md bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                <div className="scale-75">{card.icon}</div>
                            </div>
                            <div className="flex-1">
                                <div className="font-bold text-[13px] text-white tracking-tight">{card.title}</div>
                                <div className="text-[10px] text-gray-400 font-medium leading-tight mt-0.5 line-clamp-1">{card.description}</div>
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
                </>
              )}
            </div>
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

      <QuizConfigModal
        isOpen={isQuizConfigOpen}
        onClose={() => setIsQuizConfigOpen(false)}
        onContinue={() => {
          setIsQuizConfigOpen(false);
          setIsNotePickerOpen(true);
        }}
        quizConfig={quizConfig}
        setQuizConfig={setQuizConfig}
      />
      <NotePickerModal 
        isOpen={isNotePickerOpen}
        onClose={() => {
            setIsNotePickerOpen(false);
            if (!selectedNoteForAI) setSelectedOperation(null);
        }}
        operation={selectedOperation}
        onSelect={(note) => {
          setSelectedNoteForAI(note);
          setIsNotePickerOpen(false);
          let opPrefix = "Can you help me with";
          if (selectedOperation) {
              if (selectedOperation.title === "Practice Quiz") {
                 opPrefix = `I want a ${quizConfig.difficulty} difficulty ${quizConfig.formats.join(' and ')} practice quiz for`;
              } else {
                 opPrefix = `I want to ${selectedOperation.title.toLowerCase()} for`;
              }
          }
          setInput(`${opPrefix}: "${note.title}"?`);
        }}
      />
    </div>
  );
}

// Note Picker Modal
function NotePickerModal({ 
    isOpen, 
    onClose, 
    onSelect,
    operation 
  }: { 
    isOpen: boolean; 
    onClose: () => void; 
    onSelect: (note: any) => void;
    operation?: any;
  }) {
    if (!isOpen) return null;
  
    const notes = [
      { id: "1", title: "Introduction to Calculus", subject: "Math", date: "Nov 20" },
      { id: "2", title: "Newton's Laws of Motion", subject: "Physics", date: "Nov 19" },
      { id: "3", title: "Chemical Bonding", subject: "Chemistry", date: "Nov 18" },
      { id: "4", title: "World War II Overview", subject: "History", date: "Nov 17" }
    ];
  
    return (
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>
        <div className="bg-white rounded-[24px] w-full max-w-xl relative z-10 shadow-2xl overflow-hidden shadow-black/20">
          <div className="bg-black p-6 md:p-8 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
             <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black tracking-tight">Select material</h2>
                  {operation && (
                    <p className="text-blue-400 font-bold text-xs uppercase tracking-wider">For "{operation.title}"</p>
                  )}
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors -mt-2 -mr-2"><X size={20} /></button>
             </div>
             <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[9px] relative z-10">Portal will process content upon selection</p>
          </div>
  
          <div className="p-6 max-h-[350px] overflow-y-auto no-scrollbar space-y-2.5 font-medium border-t border-gray-100">
             {notes.map((note) => (
               <button 
                key={note.id} 
                onClick={() => onSelect(note)}
                className="w-full group flex items-center justify-between p-3.5 bg-gray-50 hover:bg-black hover:text-white transition-all rounded-xl border border-gray-100 hover:border-black shadow-sm"
               >
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center text-gray-900 group-hover:scale-110 transition-transform shrink-0">
                        <FolderOpen size={18} />
                     </div>
                     <div className="text-left">
                        <p className="text-[13px] font-black tracking-tight">{note.title}</p>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-gray-400 mt-0.5">{note.subject} • {note.date}</p>
                     </div>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all bg-white group-hover:border-white shadow-sm shrink-0">
                     <ChevronRight size={16} />
                  </div>
               </button>
             ))}
          </div>
  
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
             <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">IREMEE AI ENGINE</span>
             <button onClick={onClose} className="bg-black text-white px-8 py-2.5 rounded-xl font-bold text-xs hover:bg-gray-800 transition-all">DISMISS</button>
          </div>
        </div>
      </div>
    );
  }

// Quiz Config Modal
function QuizConfigModal({
  isOpen,
  onClose,
  onContinue,
  quizConfig,
  setQuizConfig
}: {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  quizConfig: { formats: string[], difficulty: string };
  setQuizConfig: (config: { formats: string[], difficulty: string }) => void;
}) {
  if (!isOpen) return null;

  const toggleFormat = (f: string) => {
    if (quizConfig.formats.includes(f)) {
      if (quizConfig.formats.length === 1) return; // Must select at least one
      setQuizConfig({ ...quizConfig, formats: quizConfig.formats.filter(x => x !== f) });
    } else {
      setQuizConfig({ ...quizConfig, formats: [...quizConfig.formats, f] });
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="bg-white rounded-[24px] w-full max-w-md relative z-10 shadow-2xl overflow-hidden shadow-black/20">
        
        {/* Dynamic Header */}
        <div className="bg-black p-8 text-white relative overflow-hidden flex flex-col items-center text-center">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
           <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
           
           <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors z-10"><X size={20} /></button>
           
           <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4 relative z-10 shadow-inner">
             <ClipboardList size={32} />
           </div>
           
           <div className="relative z-10 space-y-1 mt-2">
             <h2 className="text-2xl font-black tracking-tight">Quiz Engine Setup</h2>
             <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest leading-relaxed max-w-[250px] mx-auto">
               Select your target domains to generate a custom assessment.
             </p>
           </div>
        </div>

        <div className="p-8 space-y-8">
           {/* Formats - Multi Select */}
           <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-black uppercase tracking-widest text-black flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div> Format Types
                </label>
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Multiple allowed</span>
              </div>
              <div className="flex flex-wrap gap-2">
                 {["Multiple Choice", "True/False", "Short Answer", "Essay", "Fill-in-the-Blank"].map(f => {
                    const isSelected = quizConfig.formats.includes(f);
                    return (
                      <button 
                        key={f} 
                        onClick={() => toggleFormat(f)}
                        className={cn(
                          "px-4 py-2.5 rounded-full border text-[11px] font-bold transition-all flex items-center gap-2 outline-none focus:ring-2 focus:ring-black/5 ring-offset-1", 
                          isSelected 
                            ? "border-black bg-black text-white shadow-md scale-105" 
                            : "border-gray-200 bg-gray-50 text-gray-500 hover:border-black/30 hover:bg-white"
                        )}
                      >
                         {isSelected && <Check size={12} strokeWidth={3} />}
                         {f}
                      </button>
                    )
                 })}
              </div>
           </div>

           <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>

           {/* Difficulty - Single Select */}
           <div className="space-y-4">
              <label className="text-[12px] font-black uppercase tracking-widest text-black flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> Difficulty Level
              </label>
              
              <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100 shadow-inner">
                 {["Easy", "Medium", "Hard"].map(d => {
                    const isSelected = quizConfig.difficulty === d;
                    return (
                      <button 
                        key={d} 
                        onClick={() => setQuizConfig({...quizConfig, difficulty: d})}
                        className={cn(
                          "flex-1 py-3 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all outline-none", 
                          isSelected 
                            ? "bg-white text-black shadow-sm border border-gray-200" 
                            : "text-gray-400 hover:text-black"
                        )}
                      >
                         {d}
                      </button>
                    )
                 })}
              </div>
           </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Ready to compile</span>
           <button 
              onClick={onContinue} 
              className="bg-black text-white px-8 py-3.5 rounded-full font-black text-[11px] uppercase tracking-[0.2em] hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 group flex items-center gap-3"
           >
              Select Material
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                 <ChevronRight size={14} />
              </div>
           </button>
        </div>
      </div>
    </div>
  );
}