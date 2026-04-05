"use client";

import { useState, useRef, useEffect } from "react";
import { SearchInput } from "@/components/ui/FormElements";
import { Plus, Archive, Phone, Video, Star, MoreVertical, Paperclip, Smile, Mic, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: "me" | "them";
  time: string;
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

const INITIAL_CHATS: Chat[] = [
  {
    id: "1",
    name: "IZERE Joshua",
    role: "Parent of Mathematics Student",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop",
    lastMessage: "Your child has shown significant improvement in algebra.",
    time: "2 min ago",
    unreadCount: 2,
    isStarred: true,
    messages: [
      { id: "m1", text: "Hello Mrs. Johnson, I wanted to update you on Alice's recent progress in Mathematics.", sender: "me", time: "10:30 AM" },
      { id: "m2", text: "She has shown significant improvement in her algebra skills and scored 95% on the recent quiz.", sender: "me", time: "10:31 AM" },
      { id: "m3", text: "That's wonderful to hear! Thank you so much for keeping me informed.", sender: "them", time: "10:45 AM" },
      { id: "m4", text: "Alice has been working very hard at home. We're proud of her progress.", sender: "them", time: "10:46 AM" },
      { id: "m5", text: "Thank you for the update on Alice's progress.", sender: "them", time: "11:20 AM" },
    ]
  },
  {
    id: "2",
    name: "AMANI Samuel",
    role: "Physics Teacher",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop",
    lastMessage: "Can we schedule a meeting to discuss the upcoming project?",
    time: "1 hour ago",
    messages: []
  },
  {
    id: "3",
    name: "HITAYEZU Frank Duff",
    role: "Mathematics Teacher",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop",
    lastMessage: "The homework assignment is due next week.",
    time: "3 hours ago",
    unreadCount: 1,
    messages: []
  },
  {
    id: "4",
    name: "MUGISHA Grace",
    role: "English Teacher",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop",
    lastMessage: "Your child is doing great in class!",
    time: "Yesterday",
    isStarred: true,
    messages: []
  }
];

export default function TeacherMessagesPage() {
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [selectedChatId, setSelectedChatId] = useState("1");
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedChat = chats.find(c => c.id === selectedChatId) || chats[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat.messages, selectedChatId]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChats(prevChats => prevChats.map(chat => {
      if (chat.id === selectedChatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: messageText,
          time: "Just now"
        };
      }
      return chat;
    }));

    setMessageText("");
  };

  return (
    <div className="flex h-[calc(100vh-100px)] -mt-4 bg-white border border-gray-100 rounded-md overflow-hidden shadow-sm">
      {/* Left Sidebar */}
      <div className="w-[380px] border-r border-gray-100 flex flex-col bg-white">
        <div className="p-5 space-y-4 border-b border-gray-50">
          <SearchInput placeholder="Search conversations..." className="bg-gray-50 border-none rounded-md outline-none" />
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 py-2.5 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-all">
              <Plus size={18} strokeWidth={2.5} />
              New
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-100 transition-all">
              <Archive size={18} />
              Archive
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChatId(chat.id)}
              className={cn(
                "p-4 flex gap-3 cursor-pointer hover:bg-gray-50 transition-all relative group border-b border-gray-50 last:border-0",
                selectedChatId === chat.id ? "bg-gray-100/80" : ""
              )}
            >
              <div className="relative shrink-0">
                <img src={chat.avatarUrl} alt={chat.name} className="w-14 h-14 rounded-md object-cover ring-2 ring-white shadow-sm" />
                {chat.unreadCount && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
                    {chat.unreadCount}
                  </span>
                )}
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
      <div className="flex-1 flex flex-col bg-[#F9FBFC]">
        {/* Chat Header */}
        <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-4">
            <img src={selectedChat.avatarUrl} alt={selectedChat.name} className="w-12 h-12 rounded-md object-cover ring-2 ring-gray-50" />
            <div>
              <h3 className="font-semibold text-gray-900">{selectedChat.name}</h3>
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{selectedChat.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {[Phone, Video, Star, MoreVertical].map((Icon, i) => (
              <button key={i} className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-all">
                <Icon size={20} strokeWidth={1.5} />
              </button>
            ))}
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar bg-slate-50/30">
          {selectedChat.messages.map((m) => (
            <div key={m.id} className={cn(
              "flex flex-col max-w-[70%] space-y-2",
              m.sender === "me" ? "ml-auto items-end" : "items-start"
            )}>
              <div className={cn(
                "px-5 py-3.5 rounded-md shadow-sm text-[15px] font-medium leading-relaxed transition-all hover:shadow-md",
                m.sender === "me"
                  ? "bg-stone-900 text-white"
                  : "bg-white text-gray-800 border border-gray-100"
              )}>
                {m.text}
              </div>
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest px-1">
                {m.time}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <button className="p-2.5 text-gray-400 hover:text-gray-900 transition-colors">
              <Paperclip size={20} strokeWidth={1.5} />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full bg-gray-50 border-none rounded-md py-3.5 px-5 pr-12 text-sm font-medium focus:ring-0 outline-none transition-all placeholder:text-gray-400"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-900 transition-colors">
                <Smile size={20} strokeWidth={1.5} />
              </button>
            </div>
            <button className="p-2.5 text-gray-400 hover:text-gray-900 transition-colors">
              <Mic size={20} strokeWidth={1.5} />
            </button>
            <button
              onClick={handleSendMessage}
              className={cn(
                "p-3.5 rounded-md text-white shadow-sm transition-all flex items-center justify-center",
                messageText.trim() ? "bg-black" : "bg-gray-300"
              )}>
              <Send size={20} fill={messageText.trim() ? "white" : "none"} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
