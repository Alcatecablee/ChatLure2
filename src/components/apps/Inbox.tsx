import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Users,
  Bell,
  Clock,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface InboxProps {
  onBack: () => void;
}

export function Inbox({ onBack }: InboxProps) {
  const notifications = [
    {
      id: 1,
      type: "story",
      title: "New Story Alert",
      message: "Drama in the Park - Chapter 3 just dropped!",
      time: "2m ago",
      icon: <Bell className="w-5 h-5" />,
      color: "bg-blue-500",
      unread: true,
    },
    {
      id: 2,
      type: "friend",
      title: "Friend Request",
      message: "Sarah wants to share stories with you",
      time: "5m ago",
      icon: <Users className="w-5 h-5" />,
      color: "bg-green-500",
      unread: true,
    },
    {
      id: 3,
      type: "reaction",
      title: "Story Reaction",
      message: "25 people loved your comment on 'Coffee Shop Chronicles'",
      time: "15m ago",
      icon: <Heart className="w-5 h-5" />,
      color: "bg-red-500",
      unread: false,
    },
    {
      id: 4,
      type: "update",
      title: "Story Update",
      message: "Office Romance - New character introduced",
      time: "1h ago",
      icon: <MessageCircle className="w-5 h-5" />,
      color: "bg-purple-500",
      unread: false,
    },
    {
      id: 5,
      type: "trending",
      title: "Trending Near You",
      message: "Hot story developing at Central Mall",
      time: "2h ago",
      icon: <MapPin className="w-5 h-5" />,
      color: "bg-orange-500",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="w-full h-full bg-black text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-blue-400 hover:text-blue-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center space-x-2">
          <h1 className="text-lg font-semibold">Inbox</h1>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="bg-red-500">
              {unreadCount}
            </Badge>
          )}
        </div>
        <div className="w-16"></div>
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30"
      >
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-400">
              {unreadCount}
            </div>
            <div className="text-xs text-gray-400">Unread</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">12</div>
            <div className="text-xs text-gray-400">Friends</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">48</div>
            <div className="text-xs text-gray-400">Stories</div>
          </div>
        </div>
      </motion.div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-900/50 transition-colors ${
              notification.unread ? "bg-blue-900/20" : ""
            }`}
          >
            <div className="flex items-start space-x-3">
              <div
                className={`p-2 rounded-full ${notification.color} flex-shrink-0`}
              >
                {notification.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3
                    className={`font-medium ${notification.unread ? "text-white" : "text-gray-300"}`}
                  >
                    {notification.title}
                  </h3>
                  <span className="text-xs text-gray-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {notification.time}
                  </span>
                </div>
                <p
                  className={`text-sm mt-1 ${notification.unread ? "text-gray-200" : "text-gray-400"}`}
                >
                  {notification.message}
                </p>
              </div>
              {notification.unread && (
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-800 space-y-2">
        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          Mark All as Read
        </Button>
        <Button
          variant="outline"
          className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          Filter Notifications
        </Button>
      </div>
    </div>
  );
}
