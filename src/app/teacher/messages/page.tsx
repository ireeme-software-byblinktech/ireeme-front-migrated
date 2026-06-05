"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { useMe } from "@/features/auth/queries";
import { Plus, Archive, Phone, Video, Star, MoreVertical, Paperclip, Smile, Mic, Send, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  sentAt: string;
  type: string;
  fileUrls?: string[];
}

interface ConversationMember {
  user: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
}

interface Conversation {
  id: string;
  members: ConversationMember[];
  messages: Message[];
  createdAt: string;
}

interface MessagesResponse {
  data: Message[];
  meta: {
    page: number;
    limit: number;
    hasNextPage: boolean;
  };
}

export default function TeacherMessagesPage() {
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiSearch, setEmojiSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: user } = useMe();

  console.log("[DEBUG] Current user:", user);

  // Get current user ID from token
  const getCurrentUserId = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub;
    } catch {
      return null;
    }
  };

  const currentUserId = getCurrentUserId();

  // Format time like Instagram (e.g., "now", "5m", "1h", "3d", "1w", "Jan 15")
  const formatMessageTime = (date: string): string => {
    const messageDate = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - messageDate.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffSecs < 60) return "now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    if (diffWeeks < 4) return `${diffWeeks}w`;

    // Show date for older messages
    const isCurrentYear = messageDate.getFullYear() === now.getFullYear();
    if (isCurrentYear) {
      return messageDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
    return messageDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" });
  };

  // Comprehensive emoji database with extensive keywords
  const emojis = {
    smileys: {
      label: "Smileys",
      list: ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙", "🥲", "😋", "😛", "😜", "🤪", "😌", "😔", "😑", "😐", "😶", "😏", "😒", "🙄", "😬", "🤥", "", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "", "🤬", "🤡", "😈", "👿", "💀", "☠️", "💩", "🤑", "😲", "😞", "😖", "😢", "😭", "😱", "", "", "😩", "😫", "🥱", "😤", "😡", "😠"],
      keywords: ["happy", "sad", "smile", "cry", "laugh", "angry", "love", "cool", "sick", "joy", "grin", "grief", "depressed", "tired", "sleepy", "dizzy", "silly", "clown", "evil", "skull", "poop", "money", "shocked", "worried", "panicked", "dizzy", "nauseated", "vomit", "sneezing", "swearing", "puke", "fever", "cold", "cough", "sneeze", "yawn", "angry", "rage", "furious", "mad", "upset", "annoyed", "confused", "dumbfounded", "surprised", "astonished", "amazed", "wonder", "awe", "stunned", "shocked", "startled", "scared", "terrified", "nervous", "anxious", "worried", "uneasy", "skeptical", "dubious", "doubtful", "uncertain", "unconvinced", "unimpressed", "cold", "indifferent", "uninterested", "bored", "yawning", "sleepy", "tired", "exhausted", "fatigued"]
    },
    hearts: {
      label: "Hearts",
      list: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "💌", "💋", "💯", "💢", "💥", "💫", "💦", "💨"],
      keywords: ["love", "heart", "kiss", "fire", "broken", "red", "orange", "yellow", "green", "blue", "purple", "black", "white", "brown", "heartbreak", "two hearts", "beating", "decoration", "cupid", "arrow", "pulse", "emotion", "feeling", "affection", "care", "romance", "romantic", "passion", "desire", "attraction", "devoted", "fond", "adore", "treasure", "cherish", "fondness", "precious", "dear", "darling", "sweetheart", "beloved", "soulmate", "crush", "infatuation", "enamored", "captivated", "enchanted", "spellbound", "mesmerized", "bewitched"]
    },
    hand: {
      label: "Hand Gestures",
      list: ["👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🫰", "🤟", "🤘", "🤙", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🤜", "🤛"],
      keywords: ["thumbs", "wave", "clap", "peace", "ok", "good", "bad", "fist", "punch", "hand", "palm", "fingers", "hello", "goodbye", "hi", "bye", "waving", "greeting", "farewell", "welcome", "applause", "praise", "victory", "yes", "no", "cool", "awesome", "excellent", "perfect", "great", "thumbs up", "thumbs down", "dislike", "like", "agree", "disagree", "approve", "disapprove", "two hands", "together", "closed", "prayer", "thanks", "grateful", "gratitude", "appreciation", "thank you", "thank", "salute", "cross fingers", "luck", "lucky", "hopeful", "hope", "wishing", "wish"]
    },
    animals: {
      label: "Animals",
      list: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐽", "🐸", "🐵", "🙈", "🙉", "🙊", "🐒", "🐔", "🐧", "🐦", "🐤", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🪱", "🐛", "🦋", "🐌", "🐞", "🐜", "🪰", "🐢", "🐍", "🐙", "🦑", "🦐", "🦞", "🦟", "🦠", "🐢", "🐠", "🐟", "🐡", "🦈"],
      keywords: ["dog", "cat", "mouse", "hamster", "rabbit", "fox", "bear", "panda", "koala", "tiger", "lion", "cow", "pig", "boar", "frog", "monkey", "ape", "gorilla", "chimp", "chicken", "penguin", "bird", "chick", "duck", "eagle", "owl", "bat", "wolf", "wild boar", "horse", "unicorn", "bee", "worm", "butterfly", "snail", "ladybug", "ladybird", "cricket", "ant", "mosquito", "turtle", "tortoise", "snake", "octopus", "squid", "shrimp", "crab", "lobster", "spider", "scorpion", "microbe", "fish", "tropical", "blowfish", "shark", "whale", "dolphin", "seal", "pet", "livestock", "wild", "domestic", "cute", "adorable", "fluffy", "furry", "creature", "critter", "beast", "fauna", "wildlife", "animal kingdom"]
    },
    food: {
      label: "Food & Drink",
      list: ["🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥑", "🍆", "🍅", "🍄", "🥔", "🥐", "🍞", "🥖", "🥨", "🧀", "🥚", "🍳", "🧈", "🥞", "🥓", "🥩", "🍗", "🍖", "🌭", "🍔", "🍟", "🍕", "🥪", "🥙", "🧆", "🌮", "🌯", "🥗", "🥘", "🥫", "🍝", "🍜", "🍲", "🍛", "🍣", "🍱", "🥟", "🦪", "🍤", "🍙", "🍚", "🍘", "🍥", "🥠", "🥮", "🍢", "🍡", "🍧", "🍨", "🍦", "🍰", "🎂", "🧁", "🍮", "🍭", "🍬", "🍫", "🍿", "🍩", "🍪", "🌰", "🍯", "🥛", "🍼", "☕", "🍵", "🍶", "🍾", "🍷", "🍸", "🍹", "🍺", "🍻", "🥂", "🥃"],
      keywords: ["food", "pizza", "burger", "coffee", "beer", "wine", "cake", "apple", "fruit", "eat", "drink", "nutrition", "meal", "lunch", "dinner", "breakfast", "snack", "dessert", "sweet", "candy", "chocolate", "cookie", "bread", "meat", "fish", "seafood", "sushi", "noodles", "pasta", "rice", "salad", "vegetable", "corn", "potato", "cheese", "egg", "milk", "juice", "tea", "alcohol", "beverage", "beverage", "tasty", "delicious", "yummy", "appetizing", "savory", "salty", "sour", "bitter", "spicy", "hot", "cold", "fresh", "frozen", "cooked", "raw", "organic", "vegan", "vegetarian", "protein", "carbs", "sugar", "fat", "healthy", "unhealthy", "junk", "fast food", "grill", "bake", "fry", "steam", "boil"]
    },
    activities: {
      label: "Activities",
      list: ["⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎳", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🥅", "⛳", "⛸️", "🎣", "🎽", "🎿", "⛷️", "🏂", "🪂", "🛼", "🛹", "🛷", "🥌", "🎯", "🪀", "🪃", "🎪", "🎨", "🎬", "🎤", "🎧", "🎼", "🎹", "🥁", "🎷", "🎺", "🎸", "🎻", "🎲", "♟️", "🎮", "🎰", "🧩"],
      keywords: ["sport", "soccer", "basketball", "baseball", "music", "guitar", "piano", "game", "play", "football", "rugby", "tennis", "volleyball", "hockey", "cricket", "golf", "skiing", "ice skating", "snowboarding", "fishing", "chess", "dice", "cards", "board game", "video game", "arcade", "movie", "theater", "cinema", "actor", "director", "karaoke", "microphone", "headphones", "orchestra", "band", "ensemble", "rock", "pop", "classical", "jazz", "performance", "concert", "show", "musical", "theater", "drama", "comedy", "art", "painting", "sculpture", "drawing", "coloring", "puzzle", "entertainment", "recreation", "leisure", "hobby", "pastime", "activity", "exercise", "workout", "training", "competition", "tournament", "champion", "victory", "defeat", "score", "goal", "win", "lose", "tie", "draw"]
    },
    travel: {
      label: "Travel",
      list: ["🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🛻", "🚚", "🚛", "🚜", "🏍️", "🛵", "🚲", "🛴", "🚨", "🚔", "🚍", "🚘", "🚖", "🚡", "🚠", "🚟", "🚃", "🚋", "🚞", "🚝", "🚄", "🚅", "🚈", "🚂", "🚆", "🚇", "🚊", "🚉", "✈️", "🛫", "🛬", "🛩️", "💺", "🛰️", "🚁", "🛶", "⛵", "🚤", "🛳️"],
      keywords: ["car", "bike", "plane", "train", "ship", "truck", "bus", "travel", "drive", "motorcycle", "scooter", "bicycle", "tricycle", "road", "highway", "street", "traffic", "vehicle", "transportation", "commute", "journey", "trip", "vacation", "holiday", "adventure", "expedition", "voyage", "cruise", "flight", "boarding", "landing", "takeoff", "airport", "station", "port", "destination", "origin", "route", "map", "navigate", "speed", "fast", "slow", "parking", "garage", "gas", "fuel", "engine", "steering", "wheel", "brake", "accelerator", "passenger", "driver", "pilot", "captain", "sailor"]
    },
    objects: {
      label: "Objects",
      list: ["⌚", "📱", "💻", "⌨️", "🖥️", "🖨️", "🖱️", "🖲️", "🕹️", "💽", "💾", "💿", "📀", "🎥", "🎬", "📺", "📷", "📸", "📹", "🎞️", "📽️", "🎦", "📞", "☎️", "📟", "📠", "📻", "🎙️", "🎚️", "🎛️", "⏱️", "⏲️", "⏰", "🕰️", "⌛", "⏳", "📡", "🔋", "🔌", "💡", "🔦", "🕯️", "🧯", "💸", "💵", "💴", "💶", "💷", "💰", "💳", "✉️", "📩", "📨", "📤", "📥", "📦", "📪", "📫", "📬", "📭", "📮", "✏️", "✒️", "🖋️", "🖊️", "🖌️", "🖍️", "📝", "📁", "📂", "📅", "📆", "📇", "📈", "📉", "📊", "📋", "📌", "📍", "📎", "🖇️", "📏", "📐", "✂️"],
      keywords: ["phone", "computer", "camera", "watch", "money", "mail", "book", "pen", "paper", "smartphone", "tablet", "laptop", "desktop", "keyboard", "mouse", "monitor", "printer", "scanner", "controller", "gamepad", "disk", "cd", "dvd", "flash drive", "external hard drive", "calculator", "camera", "video camera", "film", "television", "tv", "radio", "microphone", "headphones", "earbuds", "speaker", "amplifier", "turntable", "record", "cassette", "digital", "analog", "technology", "gadget", "device", "tool", "instrument", "equipment", "machinery", "clock", "timer", "stopwatch", "hourglass", "battery", "charger", "plug", "power", "electricity", "lightbulb", "lamp", "candle", "flashlight", "fire extinguisher", "money", "cash", "credit card", "coin", "dollar", "euro", "yen", "pound", "envelope", "letter", "postcard", "package", "mailbox", "pencil", "pen", "marker", "crayon", "notebook", "notepad", "document", "file", "folder", "calendar", "date", "chart", "graph", "clipboard", "ruler", "scissors", "tape", "clip"]
    },
    nature: {
      label: "Nature",
      list: ["🌋", "⛰️", "🌲", "🌳", "🌴", "🌵", "🌾", "🌿", "☘️", "🍀", "🎍", "🌍", "🌎", "🌏", "💧", "💦", "☔", "☂️", "🌤️", "⛅", "🌥️", "☁️", "🌦️", "🌧️", "⛈️", "🌩️", "🌨️", "❄️", "☃️", "⛄", "🌬️", "🌪️", "🌫️", "🌊", "🔥", "🎆", "🎇", "✨", "🌟", "💫", "⭐", "🌠"],
      keywords: ["tree", "flower", "weather", "rain", "snow", "sun", "cloud", "star", "fire", "mountain", "volcano", "forest", "jungle", "desert", "ocean", "sea", "beach", "lake", "river", "waterfall", "grass", "leaf", "leaves", "fern", "moss", "clover", "four leaf clover", "world", "globe", "earth", "planet", "water", "droplet", "umbrella", "rainbow", "sunrise", "sunset", "sunrise", "day", "night", "moon", "stars", "meteorite", "comet", "shooting star", "aurora", "northern lights", "storm", "thunder", "lightning", "tornado", "wind", "breeze", "gale", "cyclone", "hurricane", "weather", "meteorology", "climate", "seasons", "spring", "summer", "autumn", "fall", "winter", "cold", "hot", "warm", "cool", "freezing", "melting", "nature", "natural", "outdoor", "wilderness", "countryside", "rural", "urban", "cityscape", "landscape", "scenery", "view", "vista"]
    },
  };

  // Flatten emojis for searching
  const allEmojisWithKeywords = Object.entries(emojis).flatMap(([category, data]) =>
    data.list.map((emoji) => ({
      emoji,
      category: data.label,
      keywords: data.keywords || [],
    }))
  );

  // Filter emojis based on search
  const filteredEmojis = emojiSearch.trim()
    ? allEmojisWithKeywords.filter(
        (item) =>
          item.keywords.some((kw) => kw.includes(emojiSearch.toLowerCase())) ||
          item.category.toLowerCase().includes(emojiSearch.toLowerCase())
      )
    : allEmojisWithKeywords;

  const handleEmojiClick = (emoji: string) => {
    setMessageText(messageText + emoji);
    setShowEmojiPicker(false);
  };

  // Fetch conversations
  const { data: conversations = [], isLoading: conversationsLoading } = useQuery({
    queryKey: ["teacher-conversations"],
    queryFn: () => apiClient<Conversation[]>("/api/v1/messages/conversations"),
    enabled: !!user,
  });

  // Fetch available contacts for teacher
  const { data: contacts = [], isLoading: contactsLoading } = useQuery({
    queryKey: ["teacher-contacts"],
    queryFn: () => apiClient<User[]>("/api/v1/messages/contacts/teacher"),
    enabled: !!user,
  });

  // Filter contacts based on search and exclude those already in conversations
  const existingConvUserIds = new Set(
    conversations.flatMap(conv => 
      conv.members
        .filter(m => m.user.firstName !== user?.name)
        .map(m => `${m.user.firstName}${m.user.lastName}`)
    )
  );

  const filteredContacts = contacts.filter(contact => {
    const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    return fullName.includes(searchLower);
  });

  // Fetch messages for selected conversation
  const { data: messagesData } = useQuery({
    queryKey: ["conversation-messages", selectedConvId],
    queryFn: () => apiClient<MessagesResponse>(`/api/v1/messages/messages/${selectedConvId}?page=1&limit=50`),
    enabled: !!selectedConvId,
  });

  const messages = messagesData?.data || [];

  // Start conversation mutation
  const startConvMutation = useMutation({
    mutationFn: (recipientId: string) =>
      apiClient<Conversation>("/api/v1/messages/conversation/start", {
        method: "POST",
        body: JSON.stringify({ recipientId }),
      }),
    onSuccess: (conversation) => {
      setSelectedConvId(conversation.id);
      queryClient.invalidateQueries({ queryKey: ["teacher-conversations"], refetchType: "all" });
      setShowNewChat(false);
      setSearchQuery("");
    },
    onError: (error: any) => {
      console.error("Failed to start conversation:", error);
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (content: string) =>
      apiClient("/api/v1/messages", {
        method: "POST",
        body: JSON.stringify({ convId: selectedConvId, content }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversation-messages", selectedConvId], refetchType: "all" });
      setMessageText("");
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConvId) return;
    await sendMessageMutation.mutateAsync(messageText);
  };

  const getOtherUserName = (conv: Conversation) => {
    if (!user) return "Unknown";
    const other = conv.members.find(m => m.user.firstName !== user.name);
    if (other) {
      return `${other.user.firstName} ${other.user.lastName}`;
    }
    return "Unknown";
  };

  const selectedConversation = selectedConvId 
    ? conversations.find(c => c.id === selectedConvId)
    : null;

  return (
    <div className="flex h-[calc(100vh-100px)] -mt-4 bg-white border border-gray-100 rounded-md overflow-hidden shadow-sm">
      {/* Left Sidebar */}
      <div className="w-[380px] border-r border-gray-100 flex flex-col bg-white">
        <div className="p-5 space-y-4 border-b border-gray-50">
          <div className="relative">
            <input
              type="text"
              placeholder={showNewChat ? "Search contacts..." : "Search conversations..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-md outline-none py-2.5 px-4 pr-10 text-sm"
            />
            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setShowNewChat(!showNewChat);
                setSearchQuery("");
              }}
              className={cn(
                "flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all",
                showNewChat 
                  ? "bg-black text-white" 
                  : "bg-black text-white hover:bg-black/80"
              )}
            >
              <Plus size={18} strokeWidth={2.5} />
              New Chat
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-100 transition-all">
              <Archive size={18} />
              Archive
            </button>
          </div>
        </div>

        {/* New Chat Contacts List */}
        {showNewChat && (
          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
            <div className="p-3 space-y-2 flex-1">
              {contactsLoading ? (
                <div className="p-4 text-center text-gray-400 text-sm">Loading contacts...</div>
              ) : filteredContacts.length === 0 ? (
                <div className="p-4 text-center text-gray-400 text-sm">
                  {searchQuery ? "No contacts found" : "No available contacts"}
                </div>
              ) : (
                filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => startConvMutation.mutateAsync(contact.id)}
                    disabled={startConvMutation.isPending}
                    className="w-full text-left p-3 hover:bg-blue-50 rounded-md transition-all border border-transparent hover:border-blue-200 disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-900 to-stone-700 flex items-center justify-center text-xs font-semibold text-white shrink-0">
                        {contact.firstName?.[0]}{contact.lastName?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {contact.firstName} {contact.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{contact.email}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
            <div className="p-3 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setShowNewChat(false)}
                className="w-full py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Conversations List */}
        {!showNewChat && (
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {conversationsLoading ? (
              <div className="p-4 text-center text-gray-400 text-sm">Loading conversations...</div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-400 text-sm">
                <div className="mb-3 text-base">No conversations yet</div>
                <button
                  onClick={() => setShowNewChat(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Start a new conversation
                </button>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={cn(
                    "p-4 flex gap-3 cursor-pointer hover:bg-gray-50 transition-all relative group border-b border-gray-50 last:border-0",
                    selectedConvId === conv.id ? "bg-gray-100/80" : ""
                  )}
                >
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-stone-900 to-stone-700 flex items-center justify-center text-sm font-semibold text-white">
                      {conv.members[0]?.user.firstName?.[0]}{conv.members[0]?.user.lastName?.[0]}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 truncate text-[15px]">
                        {getOtherUserName(conv)}
                      </h3>
                      <span className="text-[12px] font-medium text-gray-500 tracking-tight ml-2 shrink-0">
                        {formatMessageTime(conv.createdAt)}
                      </span>
                    </div>
                    <p className={cn(
                      "text-[13px] truncate",
                      conv.messages?.length ? "text-gray-600 font-normal" : "text-gray-400 italic"
                    )}>
                      {conv.messages?.[0]?.content || "No messages yet"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Chat Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col bg-[#F9FBFC]">
          {/* Chat Header */}
          <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between shadow-sm z-10">
            <div>
              <h3 className="font-semibold text-gray-900">{getOtherUserName(selectedConversation)}</h3>
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Active</p>
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
          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-white flex flex-col">
            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <p className="text-center">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              <>
                {/* Reverse messages to show oldest first, newest last */}
                {[...messages].reverse().map((msg, idx) => {
                  const isCurrentUser = msg.senderId === currentUserId;
                  const prevMsg = idx > 0 ? [...messages].reverse()[idx - 1] : null;
                  const sameUserAsPrev = prevMsg && prevMsg.senderId === msg.senderId;
                  const showAvatar = !sameUserAsPrev;

                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex gap-2 items-end",
                        isCurrentUser ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      {/* Avatar */}
                      {showAvatar && (
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0",
                            isCurrentUser
                              ? "bg-stone-900"
                              : "bg-gradient-to-br from-stone-800 to-stone-700"
                          )}
                        >
                          {isCurrentUser ? "Y" : "T"}
                        </div>
                      )}
                      {!showAvatar && <div className="w-8 h-8 shrink-0" />}

                      {/* Message Bubble */}
                      <div className={cn("flex flex-col gap-1", isCurrentUser ? "items-end" : "items-start")}>
                        <div
                          className={cn(
                            "px-4 py-2.5 rounded-2xl max-w-xs text-sm break-words",
                            isCurrentUser
                              ? "bg-stone-900 text-white rounded-br-sm shadow-sm"
                              : "bg-gray-100 text-gray-900 rounded-bl-sm shadow-sm"
                          )}
                        >
                          {msg.content}
                        </div>
                        {/* Timestamp - show only for first message in group */}
                        {showAvatar && (
                          <span className="text-xs text-gray-500 px-2 mt-0.5">
                            {formatMessageTime(msg.sentAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Message Input */}
          <div className="relative p-6 bg-white border-t border-gray-100 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-80">
                {/* Search Input */}
                <div className="mb-3 pb-3 border-b border-gray-100">
                  <input
                    type="text"
                    placeholder="Search emojis..."
                    value={emojiSearch}
                    onChange={(e) => setEmojiSearch(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                {/* Emoji Grid */}
                <div className="grid grid-cols-8 gap-2 max-h-64 overflow-y-auto">
                  {filteredEmojis.length > 0 ? (
                    filteredEmojis.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleEmojiClick(item.emoji)}
                        className="text-2xl hover:bg-gray-100 rounded p-1 transition-colors cursor-pointer"
                        title={item.category}
                      >
                        {item.emoji}
                      </button>
                    ))
                  ) : (
                    <div className="col-span-8 text-center text-gray-400 text-sm py-4">
                      No emojis found
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="max-w-4xl mx-auto flex items-center gap-3">
              {/* Emoji Picker Button */}
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2.5 text-gray-400 hover:text-gray-900 transition-colors relative"
              >
                <Smile size={20} strokeWidth={1.5} />
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
              </div>

              <button
                onClick={handleSendMessage}
                disabled={!messageText.trim() || sendMessageMutation.isPending}
                className={cn(
                  "p-3.5 rounded-md text-white shadow-sm transition-all flex items-center justify-center",
                  messageText.trim() ? "bg-black" : "bg-gray-300"
                )}
              >
                <Send size={20} fill={messageText.trim() ? "white" : "none"} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-[#F9FBFC]">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send size={40} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversation selected</h3>
            <p className="text-gray-500">Select a conversation or start a new one to begin messaging</p>
          </div>
        </div>
      )}
    </div>
  );
}
