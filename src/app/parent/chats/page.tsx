"use client";

import { useState } from "react";
import { Search, Plus, Archive, Phone, Video, Star, MoreVertical, Paperclip, Smile, Mic, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

interface Chat {
  id: string;
  name: string;
  role: string;
  lastMessage: string;
  timestamp: string;
  unread?: number;
  avatar?: string;
  online?: boolean;
}

const CHATS: Chat[] = [
  {
    id: "1",
    name: "IZERE Joshua",
    role: "Mathematics Teacher",
    lastMessage: "Your child has shown significant improvement in algebra.",
    timestamp: "2 min ago",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "AMANI Samuel",
    role: "Physics Teacher",
    lastMessage: "Can we schedule a meeting to discuss the upcoming project?",
    timestamp: "1 hour ago",
  },
  {
    id: "3",
    name: "HITAYEZU Frank Duff",
    role: "Mathematics Teacher",
    lastMessage: "The homework assignment is due next week.",
    timestamp: "3 hours ago",
    unread: 1,
  },
  {
    id: "4",
    name: "MUGISHA Grace",
    role: "English Teacher",
    lastMessage: "Your child is doing great in class!",
    timestamp: "Yesterday",
  },
];

const MESSAGES: Message[] = [
  {
    id: "1",
    sender: "IZERE Joshua",
    text: "Hello Mrs. Johnson, I wanted to update you on Alice's recent progress in Mathematics.",
    timestamp: "10:30 AM",
    isMe: false,
  },
  {
    id: "2",
    sender: "IZERE Joshua",
    text: "She has shown significant improvement in her algebra skills and scored 95% on the recent quiz.",
    timestamp: "10:31 AM",
    isMe: false,
  },
  {
    id: "3",
    sender: "Me",
    text: "That's wonderful to hear! Thank you so much for keeping me informed.",
    timestamp: "10:45 AM",
    isMe: true,
  },
  {
    id: "4",
    sender: "Me",
    text: "Alice has been working very hard at home. We're proud of her progress.",
    timestamp: "10:46 AM",
    isMe: true,
  },
  {
    id: "5",
    sender: "Me",
    text: "Thank you for the update on Alice's progress.",
    timestamp: "11:20 AM",
    isMe: true,
  },
];

export default function ChatsPage() {
  const [activeChat, setActiveChat] = useState(CHATS[0]);
  const [message, setMessage] = useState("");

  return (
    <div className="h-[calc(100vh-140px)] flex bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Sidebar */}
      <div className="w-[350px] border-r border-gray-100 flex flex-col">
        <div className="p-6 pb-2">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-black text-white rounded-lg text-sm font-bold">
              <Plus size={16} /> New
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-700">
              <Archive size={16} /> Archive
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {CHATS.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={cn(
                "p-4 flex gap-3 cursor-pointer transition-colors border-l-4",
                activeChat.id === chat.id ? "bg-gray-50 border-black" : "border-transparent hover:bg-gray-50/50"
              )}
            >
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                  {chat.avatar ? (
                    <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-blue-600 font-bold text-lg">{chat.name[0]}</span>
                  )}
                </div>
                {chat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-black text-sm truncate">{chat.name}</h4>
                  <span className={cn("text-[10px] font-bold", chat.unread ? "text-red-500" : "text-gray-400")}>{chat.timestamp}</span>
                </div>
                <p className="text-[10px] font-bold text-gray-400 mb-1">{chat.role}</p>
                <p className="text-[11px] text-gray-500 line-clamp-2 leading-tight">
                  {chat.lastMessage}
                </p>
              </div>
              {chat.unread && (
                <div className="flex-shrink-0 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                  {chat.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50/30">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
              <span className="text-blue-600 font-bold">{activeChat.name[0]}</span>
            </div>
            <div>
              <h4 className="font-bold text-black text-sm">{activeChat.name}</h4>
              <p className="text-[10px] font-bold text-gray-400">{activeChat.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-gray-500">
            <button className="hover:text-black transition-colors"><Phone size={20} /></button>
            <button className="hover:text-black transition-colors"><Video size={20} /></button>
            <button className="hover:text-black transition-colors"><Star size={20} /></button>
            <button className="hover:text-black transition-colors"><MoreVertical size={20} /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {MESSAGES.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "max-w-[70%] flex flex-col gap-1",
                msg.isMe ? "self-end items-end" : "self-start items-start"
              )}
            >
              <div
                className={cn(
                  "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                  msg.isMe
                    ? "bg-black text-white rounded-tr-none"
                    : "bg-white border border-gray-100 text-gray-900 rounded-tl-none shadow-sm"
                )}
              >
                {msg.text}
                <div className={cn("text-[9px] mt-1 font-bold", msg.isMe ? "text-gray-400" : "text-gray-400")}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-6 bg-white border-t border-gray-100">
          <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2">
            <button className="text-gray-400 hover:text-gray-600"><Paperclip size={20} /></button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-transparent border-none focus:outline-none text-sm py-2"
            />
            <div className="flex items-center gap-3">
              <button className="text-gray-400 hover:text-gray-600"><Smile size={20} /></button>
              <button className="text-gray-400 hover:text-gray-600"><Mic size={20} /></button>
              <button className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
