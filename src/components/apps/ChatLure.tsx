import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Search,
  MoreVertical,
  Phone,
  Video,
  Crown,
  Lock,
  Eye,
  TrendingUp,
} from "lucide-react";
import { ChatLurePremium } from "./ChatLurePremium";
import { useBatteryContext } from "@/contexts/BatteryContext";
import { useLiveStalking } from "@/hooks/useLiveStalking";
import { LiveStalkingBar } from "@/components/live/LiveStalkingBar";
import { TrendingAlert } from "@/components/live/TrendingAlert";

interface Message {
  id: string;
  text: string;
  sender: "user" | "contact";
  timestamp: Date;
  status?: "sent" | "delivered" | "read";
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  online: boolean;
  typing?: boolean;
  messages: Message[];
  storyType: "drama" | "romance" | "mystery" | "scandal";
}

interface ChatLureAppProps {
  onBack: () => void;
}

export function ChatLureApp({ onBack }: ChatLureAppProps) {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [showPremium, setShowPremium] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const { drainBattery, battery } = useBatteryContext();
  const { liveSessions, joinSession, leaveSession, getTrendingChats } =
    useLiveStalking();
  const [chats, setChats] = useState<Chat[]>([
    {
      id: "1",
      name: "Sarah Miller",
      avatar: "👩‍💼",
      lastMessage: "I can't believe what I just found out...",
      timestamp: "now",
      unreadCount: 3,
      online: true,
      typing: false,
      storyType: "scandal",
      messages: [
        {
          id: "1",
          text: "Hey, are you free to talk?",
          sender: "contact",
          timestamp: new Date(Date.now() - 300000),
          status: "read",
        },
        {
          id: "2",
          text: "Yeah what's up?",
          sender: "user",
          timestamp: new Date(Date.now() - 240000),
          status: "read",
        },
        {
          id: "3",
          text: "I just saw Marcus leaving Jessica's apartment...",
          sender: "contact",
          timestamp: new Date(Date.now() - 180000),
          status: "read",
        },
        {
          id: "4",
          text: "WHAT?! But isn't he with Emma?",
          sender: "user",
          timestamp: new Date(Date.now() - 120000),
          status: "read",
        },
        {
          id: "5",
          text: "That's what I thought too...",
          sender: "contact",
          timestamp: new Date(Date.now() - 60000),
          status: "read",
        },
        {
          id: "6",
          text: "I can't believe what I just found out...",
          sender: "contact",
          timestamp: new Date(),
          status: "delivered",
        },
      ],
    },
    {
      id: "2",
      name: "Alex Chen",
      avatar: "👨‍💻",
      lastMessage: "The meeting is tomorrow at 9am",
      timestamp: "2m ago",
      unreadCount: 0,
      online: false,
      storyType: "mystery",
      messages: [
        {
          id: "1",
          text: "Did you get the package?",
          sender: "contact",
          timestamp: new Date(Date.now() - 7200000),
          status: "read",
        },
        {
          id: "2",
          text: "What package?",
          sender: "user",
          timestamp: new Date(Date.now() - 7140000),
          status: "read",
        },
        {
          id: "3",
          text: "The one I sent to your office",
          sender: "contact",
          timestamp: new Date(Date.now() - 7080000),
          status: "read",
        },
        {
          id: "4",
          text: "I didn't receive anything...",
          sender: "user",
          timestamp: new Date(Date.now() - 7020000),
          status: "read",
        },
        {
          id: "5",
          text: "That's strange... it had important documents",
          sender: "contact",
          timestamp: new Date(Date.now() - 6960000),
          status: "read",
        },
        {
          id: "6",
          text: "The meeting is tomorrow at 9am",
          sender: "contact",
          timestamp: new Date(Date.now() - 120000),
          status: "delivered",
        },
      ],
    },
    {
      id: "3",
      name: "Emma Rodriguez",
      avatar: "👩‍🎨",
      lastMessage: "Can we talk? It's urgent",
      timestamp: "5m ago",
      unreadCount: 2,
      online: true,
      typing: true,
      storyType: "drama",
      messages: [
        {
          id: "1",
          text: "I need to tell you something",
          sender: "contact",
          timestamp: new Date(Date.now() - 600000),
          status: "read",
        },
        {
          id: "2",
          text: "What is it?",
          sender: "user",
          timestamp: new Date(Date.now() - 540000),
          status: "read",
        },
        {
          id: "3",
          text: "It's about Marcus... I think he's cheating",
          sender: "contact",
          timestamp: new Date(Date.now() - 480000),
          status: "read",
        },
        {
          id: "4",
          text: "Are you sure?",
          sender: "user",
          timestamp: new Date(Date.now() - 420000),
          status: "read",
        },
        {
          id: "5",
          text: "I found messages on his phone",
          sender: "contact",
          timestamp: new Date(Date.now() - 360000),
          status: "read",
        },
        {
          id: "6",
          text: "Can we talk? It's urgent",
          sender: "contact",
          timestamp: new Date(Date.now() - 300000),
          status: "delivered",
        },
      ],
    },
    {
      id: "4",
      name: "David Park",
      avatar: "👨‍⚕️",
      lastMessage: "The test results came back...",
      timestamp: "10m ago",
      unreadCount: 1,
      online: false,
      storyType: "mystery",
      messages: [
        {
          id: "1",
          text: "I got your message about the appointment",
          sender: "contact",
          timestamp: new Date(Date.now() - 1800000),
          status: "read",
        },
        {
          id: "2",
          text: "Yes, when can we schedule it?",
          sender: "user",
          timestamp: new Date(Date.now() - 1740000),
          status: "read",
        },
        {
          id: "3",
          text: "How about this Friday at 2pm?",
          sender: "contact",
          timestamp: new Date(Date.now() - 1680000),
          status: "read",
        },
        {
          id: "4",
          text: "That works for me",
          sender: "user",
          timestamp: new Date(Date.now() - 1620000),
          status: "read",
        },
        {
          id: "5",
          text: "The test results came back...",
          sender: "contact",
          timestamp: new Date(Date.now() - 600000),
          status: "delivered",
        },
      ],
    },
  ]);

  // Simulate typing and new messages
  useEffect(() => {
    const interval = setInterval(() => {
      setChats((prevChats) =>
        prevChats.map((chat) => {
          // Randomly trigger typing
          if (Math.random() < 0.1 && !chat.typing) {
            return { ...chat, typing: true };
          }
          // Stop typing and sometimes add new message
          if (chat.typing && Math.random() < 0.3) {
            return { ...chat, typing: false };
          }
          return chat;
        }),
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getStoryEmoji = (type: string) => {
    switch (type) {
      case "drama":
        return "🎭";
      case "romance":
        return "💕";
      case "mystery":
        return "🔍";
      case "scandal":
        return "🔥";
      default:
        return "💬";
    }
  };

  if (showPremium) {
    return (
      <ChatLurePremium
        onBack={() => setShowPremium(false)}
        onUpgrade={() => {
          setIsPremiumUser(true);
          setShowPremium(false);
        }}
      />
    );
  }

  if (selectedChat) {
    return (
      <ChatView
        chat={selectedChat}
        onBack={() => setSelectedChat(null)}
        onPremiumRequired={() => setShowPremium(true)}
        isPremiumUser={isPremiumUser}
      />
    );
  }

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className="w-full h-full bg-gray-100 flex flex-col"
    >
      {/* Header */}
      <div className="bg-ios-green px-4 pt-16 pb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-black/10"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div className="flex items-center space-x-2">
            <img
              src="https://cdn.builder.io/api/v1/assets/9af82e6ddd6549809662cfc01aa22662/favico-c760c4?format=webp&width=800"
              alt="ChatLure Logo"
              className="w-6 h-6 rounded"
            />
            <h1 className="text-lg font-semibold text-white">ChatLure</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Search size={20} className="text-white" />
            <button onClick={() => setShowPremium(true)}>
              <Crown
                size={20}
                className={isPremiumUser ? "text-yellow-400" : "text-white"}
              />
            </button>
            <MoreVertical size={20} className="text-white" />
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 bg-white">
        {chats.map((chat, index) => {
          const isPremiumChat = chat.storyType === "scandal" && !isPremiumUser;
          return (
            <motion.button
              key={chat.id}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              onClick={() => {
                if (isPremiumChat) {
                  setShowPremium(true);
                } else {
                  drainBattery(1); // Opening a conversation drains 1% battery
                  setSelectedChat(chat);
                }
              }}
              className={`w-full flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${isPremiumChat ? "opacity-60" : ""}`}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
                  {chat.avatar}
                </div>
                {chat.online && !isPremiumChat && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-ios-green rounded-full border-2 border-white"></div>
                )}
                {isPremiumChat && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Lock size={10} className="text-black" />
                  </div>
                )}
              </div>

              <div className="flex-1 ml-3 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold text-gray-900 truncate">
                      {chat.name}
                    </span>
                    <span className="text-xs">
                      {getStoryEmoji(chat.storyType)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {chat.timestamp}
                      </span>
                      {liveSessions[chat.id] &&
                        liveSessions[chat.id].viewerCount > 0 && (
                          <div className="flex items-center space-x-1 bg-red-500/10 rounded-full px-2 py-1">
                            <Eye size={10} className="text-red-500" />
                            <span className="text-red-500 text-xs font-bold">
                              {liveSessions[chat.id].viewerCount > 1000
                                ? `${(liveSessions[chat.id].viewerCount / 1000).toFixed(1)}k`
                                : liveSessions[chat.id].viewerCount}
                            </span>
                          </div>
                        )}
                      {liveSessions[chat.id]?.trendingRank && (
                        <div className="bg-orange-500/20 rounded-full px-1.5 py-0.5 flex items-center space-x-1">
                          <TrendingUp size={8} className="text-orange-500" />
                          <span className="text-orange-500 text-xs font-bold">
                            #{liveSessions[chat.id].trendingRank}
                          </span>
                        </div>
                      )}
                    </div>
                    {chat.unreadCount > 0 && (
                      <div className="bg-ios-green text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-600 truncate">
                    {chat.typing ? (
                      <span className="text-ios-blue italic">typing...</span>
                    ) : (
                      chat.lastMessage
                    )}
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Story Mode Indicator */}
      <div className="bg-ios-blue/10 p-3 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-2xl">👁️</span>
          <span className="text-sm text-ios-blue font-medium">
            You're secretly watching real conversations unfold...
          </span>
        </div>
      </div>

      {/* Trending Alert */}
      <TrendingAlert
        onJoinConversation={(chatId) => {
          const chat = chats.find((c) => c.id === chatId);
          if (chat) {
            joinSession(chatId);
            drainBattery(1);
            setSelectedChat(chat);
          }
        }}
      />
    </motion.div>
  );
}

interface ChatViewProps {
  chat: Chat;
  onBack: () => void;
  onPremiumRequired: () => void;
  isPremiumUser: boolean;
}

function ChatView({
  chat,
  onBack,
  onPremiumRequired,
  isPremiumUser,
}: ChatViewProps) {
  const [messages, setMessages] = useState(chat.messages);
  const [isTyping, setIsTyping] = useState(false);
  const { drainBattery } = useBatteryContext();
  const { joinSession, leaveSession } = useLiveStalking();

  // Join live session when entering chat
  useEffect(() => {
    joinSession(chat.id);
    return () => leaveSession(chat.id);
  }, [chat.id, joinSession, leaveSession]);

  // Simulate new messages arriving
  useEffect(() => {
    const timer = setTimeout(
      () => {
        if (Math.random() < 0.3) {
          setIsTyping(true);
          setTimeout(
            () => {
              const newMessage: Message = {
                id: Date.now().toString(),
                text: getRandomMessage(chat.storyType),
                sender: "contact",
                timestamp: new Date(),
                status: "delivered",
              };
              setMessages((prev) => [...prev, newMessage]);
              setIsTyping(false);
              drainBattery(0.5); // Each new message drains 0.5% battery
            },
            2000 + Math.random() * 3000,
          );
        }
      },
      5000 + Math.random() * 10000,
    );

    return () => clearTimeout(timer);
  }, [messages, chat.storyType]);

  const getRandomMessage = (storyType: string): string => {
    const messages = {
      scandal: [
        "I have photos...",
        "This is going to ruin everything",
        "Should I tell Emma?",
        "I can't keep this secret anymore",
        "Wait, there's more...",
      ],
      drama: [
        "I'm shaking right now",
        "How could he do this to me?",
        "My whole world is falling apart",
        "I trusted him completely",
        "What am I supposed to do now?",
      ],
      mystery: [
        "Something's not right here",
        "I found something strange",
        "We need to be careful",
        "Don't trust anyone",
        "Meet me at the usual place",
      ],
      romance: [
        "I can't stop thinking about you",
        "Last night was amazing",
        "When can I see you again?",
        "This has to stay between us",
        "I've never felt this way before",
      ],
    };
    const typeMessages =
      messages[storyType as keyof typeof messages] || messages.drama;
    return typeMessages[Math.floor(Math.random() * typeMessages.length)];
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className="w-full h-full bg-gray-100 flex flex-col"
    >
      {/* Live Stalking Bar */}
      <LiveStalkingBar
        chatId={chat.id}
        onReaction={() => {
          // Could add haptic feedback or sound here
        }}
      />

      {/* Chat Header */}
      <div className="bg-ios-green px-4 pt-16 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-black/10 mr-3"
            >
              <ArrowLeft size={20} className="text-white" />
            </button>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg mr-3">
                {chat.avatar}
              </div>
              <div>
                <h2 className="text-white font-semibold">{chat.name}</h2>
                <p className="text-white/80 text-xs">
                  {chat.online ? "online" : "last seen recently"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Video size={20} className="text-white" />
            <Phone size={20} className="text-white" />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl ${
                  message.sender === "user"
                    ? "bg-ios-blue text-white"
                    : "bg-white text-gray-900 shadow-sm"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <div className="flex items-center justify-end mt-1 space-x-1">
                  <span
                    className={`text-xs ${
                      message.sender === "user"
                        ? "text-white/70"
                        : "text-gray-500"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </span>
                  {message.sender === "user" && (
                    <span className="text-xs text-white/70">
                      {message.status === "read" ? "✓✓" : "✓"}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white rounded-2xl px-4 py-2 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Voyeur Mode Indicator / Premium Prompt */}
      <div className="bg-black/80 backdrop-blur-sm p-3 border-t border-gray-200">
        {!isPremiumUser && messages.length > 3 ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onPremiumRequired}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg py-2"
          >
            <Crown className="text-yellow-400" size={16} />
            <span className="text-sm text-white font-medium">
              Unlock Premium Stories - $4.99/month
            </span>
          </motion.button>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <span className="text-lg">👁️</span>
            <span className="text-sm text-white font-medium">
              {isPremiumUser
                ? "Premium Voyeur Mode"
                : "Watching in secret mode - tap to reveal more..."}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
