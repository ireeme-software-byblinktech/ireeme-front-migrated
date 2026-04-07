"use client";

import { useState, useRef, useEffect } from "react";
import { SearchInput } from "@/components/ui/FormElements";
import { Plus, Archive, Phone, Video, Star, MoreVertical, Paperclip, Smile, Mic, Send } from "lucide-react";
import { cn } from "@/lib/utils";

type Attachment = {
  type: 'image' | 'audio';
  url: string;
};

interface Message {
  id: string;
  text: string;
  sender: "me" | "them";
  time: string;
  attachment?: Attachment;
}

interface Chat {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isStarred?: boolean;
  messages: Message[];
}

const EMOJIS = ["😀", "😂", "🥰", "😎", "🤔", "🙌", "👍", "🔥", "💯", "✨", "🎉", "❤️", "🙏", "👀", "🚀"];

const INITIAL_CHATS: Chat[] = [
  {
    id: "1",
    name: "HITAYEZU Frank Duff",
    role: "Mathematics Teacher",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop",
    lastMessage: "Make sure you complete Chapter 4 exercises by tomorrow.",
    time: "2 min ago",
    unreadCount: 2,
    isStarred: true,
    messages: [
      { id: "m1", text: "Good morning Mr. Frank. I had a question about the algebra homework.", sender: "me", time: "10:30 AM" },
      { id: "m2", text: "I'm stuck on problem number 5.", sender: "me", time: "10:31 AM" },
      { id: "m3", text: "Hello! What part of problem 5 is confusing you?", sender: "them", time: "10:45 AM" },
      { id: "m4", text: "Remember to isolate the variable on the left side first.", sender: "them", time: "10:46 AM" },
      { id: "m5", text: "Make sure you complete Chapter 4 exercises by tomorrow.", sender: "them", time: "11:20 AM" },
    ]
  },
  {
    id: "2",
    name: "MUGISHA Grace",
    role: "English Teacher",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop",
    lastMessage: "Your essay was excellent!",
    time: "1 hour ago",
    messages: []
  },
  {
    id: "3",
    name: "AMANI Samuel",
    role: "Physics Teacher",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop",
    lastMessage: "I'll be available for office hours at 3pm.",
    time: "3 hours ago",
    unreadCount: 1,
    messages: []
  },
  {
    id: "4",
    name: "IZERE Joshua",
    role: "Parent",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop",
    lastMessage: "Don't forget to pick up your little sister today.",
    time: "Yesterday",
    isStarred: true,
    messages: []
  }
];

export default function StudentMessagesPage() {
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [selectedChatId, setSelectedChatId] = useState("1");
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showEmojis, setShowEmojis] = useState(false);

  // Media attachments
  const [micActive, setMicActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  // Modals
  const [isCalling, setIsCalling] = useState<'audio' | 'video' | null>(null);

  const selectedChat = chats.find(c => c.id === selectedChatId) || chats[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat.messages, selectedChatId]);

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

  const handleSendMessage = () => {
    if (!messageText.trim() && !selectedImage && !audioUrl) return;

    let attachment: Attachment | undefined = undefined;
    if (selectedImage) attachment = { type: 'image', url: selectedImage };
    else if (audioUrl) attachment = { type: 'audio', url: audioUrl };

    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText.trim(),
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment
    };

    setChats(prevChats => prevChats.map(chat => {
      if (chat.id === selectedChatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: messageText || (attachment ? `Sent an ${attachment.type}` : ""),
          time: "Just now"
        };
      }
      return chat;
    }));

    setMessageText("");
    setSelectedImage(null);
    setAudioUrl(null);

    // Simulate auto-reply from contact after 2 seconds
    setTimeout(() => {
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Thanks for your message! I'll review this shortly and get back to you.`,
        sender: "them",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChats(prevChats => prevChats.map(chat => {
        if (chat.id === selectedChatId) {
          return {
            ...chat,
            messages: [...chat.messages, replyMessage],
            lastMessage: replyMessage.text,
            time: "Just now",
            unreadCount: chat.id === selectedChatId ? 0 : (chat.unreadCount || 0) + 1
          };
        }
        return chat;
      }));
    }, 2000);
  };

  // Mark messages as read when selecting chat
  const handleSelectChat = (id: string) => {
    setSelectedChatId(id);
    setChats(prevChats => prevChats.map(chat => {
      if (chat.id === id) {
        return { ...chat, unreadCount: 0 };
      }
      return chat;
    }));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] relative">
      
      {/* Call Modal Overlay */}
      {isCalling && (
        <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-3xl p-8 max-w-sm w-full flex flex-col items-center">
            <div className="relative mb-6">
              <img src={selectedChat.avatarUrl} alt={selectedChat.name} className="w-28 h-28 rounded-full border-4 border-gray-700 shadow-md object-cover animate-pulse" />
              <div className="absolute inset-0 rounded-full border border-gray-600 animate-ping opacity-75"></div>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-2">{selectedChat.name}</h2>
            <p className="text-gray-400 font-medium mb-12">{isCalling === 'video' ? 'Calling Video...' : 'Ringing...'}</p>
            <div className="flex gap-6">
              <button onClick={() => setIsCalling(null)} className="w-14 h-14 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-md transition-colors text-white">
                <Phone size={24} style={{ transform: 'rotate(135deg)' }} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 -mt-4 bg-white border border-gray-100 rounded-md overflow-hidden shadow-sm">
        {/* Left Sidebar */}
        <div className="w-full md:w-[380px] shrink-0 border-r border-gray-100 hidden md:flex flex-col bg-white">
          <div className="p-5 space-y-4 border-b border-gray-50">
            <SearchInput placeholder="Search conversations..." className="bg-gray-50 border-none rounded-md outline-none" />
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => alert("Creating a new chat session!")}
                className="flex items-center justify-center gap-2 py-2.5 bg-black text-white rounded-md text-sm font-medium hover:bg-black/90 transition-all"
              >
                <Plus size={18} strokeWidth={2.5} />
                New
              </button>
              <button 
                onClick={() => alert("Archive is empty!")}
                className="flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-100 transition-all"
              >
                <Archive size={18} />
                Archive
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                className={cn(
                  "p-4 flex gap-3 cursor-pointer hover:bg-gray-50 transition-all relative group border-b border-gray-50 last:border-0",
                  selectedChatId === chat.id ? "bg-gray-100/80" : ""
                )}
              >
                <div className="relative shrink-0">
                  <img src={chat.avatarUrl} alt={chat.name} className="w-14 h-14 rounded-md object-cover ring-2 ring-white shadow-sm" />
                  {chat.unreadCount ? (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
                      {chat.unreadCount}
                    </span>
                  ) : null}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 truncate text-[15px]">{chat.name}</h3>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {chat.isStarred && <Star size={14} className="fill-yellow-400 text-yellow-400" />}
                      <span className="text-[11px] font-medium text-gray-400 tracking-tight">{chat.time}</span>
                    </div>
                  </div>
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-tight">{chat.role}</p>
                  <p className={cn(
                    "text-[13px] truncate",
                    chat.unreadCount ? "text-gray-900 font-semibold" : "text-gray-500 font-medium"
                  )}>
                    {chat.lastMessage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-[#F9FBFC] min-w-0">
          {/* Chat Header */}
          <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between shadow-sm z-10">
            <div className="flex items-center gap-4">
              <img src={selectedChat.avatarUrl} alt={selectedChat.name} className="w-12 h-12 rounded-md object-cover ring-2 ring-gray-50" />
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{selectedChat.name}</h3>
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider truncate">{selectedChat.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2shrink-0">
              <button onClick={() => setIsCalling('audio')} className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-all">
                <Phone size={20} strokeWidth={1.5} />
              </button>
              <button onClick={() => setIsCalling('video')} className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-all hidden sm:block">
                <Video size={20} strokeWidth={1.5} />
              </button>
              <button 
                onClick={() => setChats(c => c.map(ch => ch.id === selectedChatId ? { ...ch, isStarred: !ch.isStarred } : ch))}
                className={cn("p-2.5 hover:bg-gray-50 rounded-md transition-all", selectedChat.isStarred ? "text-yellow-400" : "text-gray-400 hover:text-gray-900")}
              >
                <Star size={20} strokeWidth={1.5} className={selectedChat.isStarred ? "fill-yellow-400" : ""} />
              </button>
              <button onClick={() => alert("Settings Options Menu")} className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-all hidden sm:block">
                <MoreVertical size={20} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 no-scrollbar bg-slate-50/30">
            {selectedChat.messages.map((m) => (
              <div key={m.id} className={cn(
                "flex flex-col max-w-[85%] md:max-w-[70%] space-y-2",
                m.sender === "me" ? "ml-auto items-end" : "items-start"
              )}>
                <div className={cn(
                  "px-5 py-3.5 rounded-2xl shadow-sm text-[15px] font-medium leading-relaxed transition-all hover:shadow-md",
                  m.sender === "me"
                    ? "bg-black text-white rounded-tr-none"
                    : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                )}>
                  
                  {/* Attachments rendering */}
                  {m.attachment?.type === 'image' && (
                    <img src={m.attachment.url} alt="Uploaded file" className="w-full max-w-[300px] rounded-lg mb-2 object-cover bg-gray-50 border border-gray-200" />
                  )}
                  {m.attachment?.type === 'audio' && (
                    <audio src={m.attachment.url} controls className={cn("h-10 w-full mb-2 max-w-[250px]", m.sender === 'me' && 'invert opacity-90')} />
                  )}
                  
                  {m.text && <p className="whitespace-pre-wrap">{m.text}</p>}
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">
                  {m.time}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} className="h-2" />
          </div>

          {/* Message Input Container */}
          <div className="p-4 sm:p-6 bg-white border-t border-gray-100 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)] relative z-10">
            
            {/* Attachment Previews */}
            {(selectedImage || audioUrl) && (
              <div className="flex gap-4 mb-4 pb-4 border-b border-gray-100">
                {selectedImage && (
                  <div className="relative">
                    <img src={selectedImage} alt="Preview" className="w-16 h-16 object-cover rounded-lg shadow-sm border border-gray-200" />
                    <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-[10px] font-bold w-5 h-5 flex items-center justify-center">X</button>
                  </div>
                )}
                {audioUrl && (
                  <div className="relative bg-gray-50 border border-gray-200 shadow-sm rounded-lg p-2 flex items-center gap-2">
                    <audio src={audioUrl} controls className="h-8 max-w-[200px]" />
                    <button onClick={() => setAudioUrl(null)} className="bg-red-50 text-red-500 rounded p-1 text-xs font-bold">Discard</button>
                  </div>
                )}
              </div>
            )}

            <div className="max-w-4xl mx-auto flex items-end gap-2 sm:gap-3">
              <input type="file" accept="image/*" id="msg-image-upload" className="hidden" onChange={handleImageUpload} />
              
              <button 
                onClick={() => document.getElementById('msg-image-upload')?.click()}
                className="p-2.5 text-gray-400 hover:text-gray-900 transition-colors hidden sm:block shrink-0"
              >
                <Paperclip size={20} strokeWidth={1.5} />
              </button>
              
              <div className="flex-1 relative bg-gray-50 border border-gray-100 rounded-xl flex items-center focus-within:ring-2 focus-within:ring-black/5 focus-within:border-black transition-all">
                {micActive ? (
                  <div className="w-full py-3.5 px-5 text-red-500 font-bold flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    Recording audio...
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full bg-transparent border-none py-3.5 px-4 pr-12 text-[14px] font-medium focus:ring-0 outline-none placeholder:text-gray-400"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                )}
                
                {!micActive && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <button onClick={() => setShowEmojis(!showEmojis)} className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors">
                      <Smile size={20} strokeWidth={1.5} />
                    </button>
                    {showEmojis && (
                      <div className="absolute bottom-full mb-3 right-0 bg-white border border-gray-100 shadow-xl rounded-xl p-3 z-50 grid grid-cols-5 gap-1.5 w-[220px]">
                        {EMOJIS.map((emoji, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setMessageText(prev => prev + emoji);
                              setShowEmojis(false);
                            }}
                            className="text-xl hover:bg-gray-100 p-1.5 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <button 
                onClick={toggleRecording}
                className={`p-3.5 rounded-xl transition-colors shrink-0 ${
                  micActive 
                    ? 'text-white bg-red-500 hover:bg-red-600 shadow-md animate-pulse' 
                    : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100 border border-transparent'
                }`}
              >
                <Mic size={20} strokeWidth={1.5} />
              </button>

              <button
                onClick={handleSendMessage}
                disabled={!messageText.trim() && !selectedImage && !audioUrl && !micActive}
                className={cn(
                  "p-3.5 rounded-xl text-white shadow-sm transition-all flex items-center justify-center shrink-0 min-w-[50px]",
                  (messageText.trim() || selectedImage || audioUrl) && !micActive ? "bg-black hover:bg-gray-900" : "bg-gray-300 cursor-not-allowed"
                )}>
                <Send size={20} fill={(messageText.trim() || selectedImage || audioUrl) && !micActive ? "white" : "none"} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
