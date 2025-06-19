import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Eye, Clock, Flame } from "lucide-react";
import { useLiveStalking } from "@/hooks/useLiveStalking";
import { useState, useEffect } from "react";

interface TrendingAlertProps {
  onJoinConversation: (chatId: string) => void;
}

export function TrendingAlert({ onJoinConversation }: TrendingAlertProps) {
  // Component disabled - LIVE banner removed per user request
  return null;
}
