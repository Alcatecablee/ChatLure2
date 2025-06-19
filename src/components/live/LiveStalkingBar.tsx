import { motion, AnimatePresence } from "framer-motion";
import { Eye, TrendingUp, Users, Flame } from "lucide-react";
import { useLiveStalking } from "@/hooks/useLiveStalking";

interface LiveStalkingBarProps {
  chatId: string;
  onReaction?: (emoji: string) => void;
}

export function LiveStalkingBar({ chatId, onReaction }: LiveStalkingBarProps) {
  const { liveSessions, addReaction } = useLiveStalking();
  const session = liveSessions[chatId];

  if (!session) return null;

  const handleReaction = (emoji: string) => {
    addReaction(chatId, emoji);
    onReaction?.(emoji);
  };

  const quickReactions = ["😱", "🔥", "👀", "💀", "🤯", "👑"];

  // Component disabled - LIVE banner removed per user request
  return null;
}
