"use client";

import { useState } from "react";
import { Card } from "@/components/ui";
import { Sparkles, Share2, MoreVertical, FileText, BookOpen, ClipboardList, PenTool, Image as ImageIcon, Mic, Send, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const suggestions = [
  "Create a lesson plan for teaching photosynthesis",
  "Generate an assignment on World War II",
  "Create study notes for algebra basics",
  "Summarize this chapter for my students",
];

const actionCards = [
  {
    title: "Generate Summary",
    description: "Create summaries of teaching materials and resources",
    icon: <FileText className="w-6 h-6 text-white" />,
    bgColor: "bg-slate-700",
  },
  {
    title: "Create Lesson",
    description: "Generate comprehensive lesson plans for your classes",
    icon: <BookOpen className="w-6 h-6 text-white" />,
    bgColor: "bg-slate-700",
  },
  {
    title: "Create Quiz",
    description: "Generate quizzes or assignments based on your content",
    icon: <ClipboardList className="w-6 h-6 text-white" />,
    bgColor: "bg-slate-700",
  },
  {
    title: "Write Content",
    description: "Draft educational content, articles, or explanations",
    icon: <PenTool className="w-6 h-6 text-white" />,
    bgColor: "bg-slate-700",
  },
];

export default function TeacherAIPage() {
  const [input, setInput] = useState("");

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
            <Sparkles size={24} className="text-gray-900" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Teacher AI Assistant
            </h1>
            <p className="text-sm text-gray-500 font-medium">Your intelligent teaching companion</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Share2 size={20} strokeWidth={1.5} />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <MoreVertical size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-12 pb-48">
        {/* Welcome Section */}
        <div className="flex flex-col items-center text-center space-y-6 pt-8">
          <div className="w-20 h-20 bg-black rounded-xl flex items-center justify-center relative shadow-sm">
            <Sparkles size={40} className="text-white" />
            <div className="absolute top-2 right-2 w-4 h-4 text-white">+</div>
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-semibold text-gray-900 tracking-tight">Welcome to Teacher AI Assistant</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Your personal <span className="font-medium text-gray-900">AI teaching assistant</span> ready to help with <br />
              <span className="font-medium text-gray-900">lesson plans</span>, notes, assignments, and more
            </p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto px-4">
          {actionCards.map((card, i) => (
            <Card key={i} className="group p-6 hover:shadow-md transition-all duration-300 border border-gray-100 flex gap-4 cursor-pointer rounded-md">
              <div className={cn("w-12 h-12 rounded-md flex items-center justify-center shrink-0 shadow-sm bg-black")}>
                {card.icon}
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-gray-900 text-lg">{card.title}</h3>
                <p className="text-sm text-gray-500 leading-snug">{card.description}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Suggested Prompts */}
        <div className="max-w-4xl mx-auto px-4 space-y-3">
          {suggestions.map((text, i) => (
            <button
              key={i}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-md text-left transition-colors border border-gray-50 hover:border-gray-200 group"
            >
              <span className="text-gray-600 font-medium text-sm">{text}</span>
              <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Persistent Chat Input */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 p-6 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto relative group">
          <div className="flex items-end gap-3 bg-gray-50 border border-gray-100 rounded-md p-3 transition-all shadow-sm">
            <button className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
              <ImageIcon size={22} strokeWidth={1.5} />
            </button>
            <button className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
              <Mic size={22} strokeWidth={1.5} />
            </button>
            <textarea
              rows={1}
              placeholder="Ask me anything..."
              className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-md py-2.5 resize-none max-h-40 font-medium placeholder:text-gray-400"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className={cn(
              "p-3 rounded-md transition-all shadow-sm flex items-center gap-2",
              input.trim() ? "bg-black text-white hover:bg-gray-900" : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}>
              <span className="font-medium text-sm">Send</span>
              <Send size={18} />
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between px-2">
            <div className="flex gap-4 text-[11px] text-gray-400 font-medium uppercase tracking-wider">
              <span>Press <strong className="text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded-sm font-semibold">Enter</strong> to send</span>
              <span><strong className="text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded-sm font-semibold">Shift + Enter</strong> for new line</span>
            </div>
            <span className="text-[11px] text-gray-400 font-medium">{input.length} characters</span>
          </div>
        </div>
      </div>
    </div>
  );
}
