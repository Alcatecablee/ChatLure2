import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Users,
  Bell,
  Clock,
  MapPin,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDatabase } from "@/contexts/DatabaseContext";
import { useEffect, useState } from "react";

interface InboxProps {
  onBack: () => void;
}

export function Inbox({ onBack }: InboxProps) {
  const { notifications, unreadCount, markAsRead, currentUser } = useDatabase();
  const [localNotifications, setLocalNotifications] = useState(notifications);

  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
      setLocalNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "story_update":
        return <Bell className="w-5 h-5" />;
      case "friend_request":
        return <Users className="w-5 h-5" />;
      case "like":
        return <Heart className="w-5 h-5" />;
      case "comment":
        return <MessageCircle className="w-5 h-5" />;
      case "system":
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case "story_update":
        return "bg-blue-500";
      case "friend_request":
        return "bg-green-500";
      case "like":
        return "bg-red-500";
      case "comment":
        return "bg-purple-500";
      case "system":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

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

      {/* User Info */}
      {currentUser && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold">
                {currentUser.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-white">
                {currentUser.username}
              </h3>
              <p className="text-sm text-gray-300">
                {currentUser.isPremium ? "Premium Member" : "Free Member"}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20"
      >
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-400">
              {unreadCount}
            </div>
            <div className="text-xs text-gray-400">Unread</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">
              {localNotifications.length}
            </div>
            <div className="text-xs text-gray-400">Total</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">
              {
                localNotifications.filter((n) => n.type === "story_update")
                  .length
              }
            </div>
            <div className="text-xs text-gray-400">Stories</div>
          </div>
        </div>
      </motion.div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {localNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Bell className="w-16 h-16 mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
            <p className="text-sm text-center">
              You'll see updates about stories, friends, and activity here
            </p>
          </div>
        ) : (
          localNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-900/50 transition-colors ${
                notification.isRead ? "" : "bg-blue-900/20"
              }`}
              onClick={() => handleMarkAsRead(notification.id)}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`p-2 rounded-full ${getColorForType(notification.type)} flex-shrink-0`}
                >
                  {getIconForType(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`font-medium ${
                        notification.isRead ? "text-gray-300" : "text-white"
                      }`}
                    >
                      {notification.title}
                    </h3>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTimeAgo(new Date(notification.createdAt))}
                    </span>
                  </div>
                  <p
                    className={`text-sm mt-1 ${
                      notification.isRead ? "text-gray-400" : "text-gray-200"
                    }`}
                  >
                    {notification.message}
                  </p>
                  {notification.data?.location && (
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>{notification.data.location}</span>
                    </div>
                  )}
                </div>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-800 space-y-2">
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={async () => {
            const unreadNotifications = localNotifications.filter(
              (n) => !n.isRead,
            );
            for (const notification of unreadNotifications) {
              await handleMarkAsRead(notification.id);
            }
          }}
          disabled={unreadCount === 0}
        >
          Mark All as Read
        </Button>
        <Button
          variant="outline"
          className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
          onClick={() => {
            // Filter notifications (could open a modal)
            console.log("Filter notifications");
          }}
        >
          Filter Notifications
        </Button>
      </div>
    </div>
  );
}
