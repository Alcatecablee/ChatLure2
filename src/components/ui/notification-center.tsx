import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp, useNotifications } from "@/contexts/AppContext";

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const { dispatch } = useApp();
  const notifications = useNotifications();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle size={16} className="text-green-400" />;
      case "error":
        return <AlertCircle size={16} className="text-red-400" />;
      case "warning":
        return <AlertTriangle size={16} className="text-yellow-400" />;
      case "info":
      default:
        return <Info size={16} className="text-blue-400" />;
    }
  };

  const getColorClasses = (type: string) => {
    switch (type) {
      case "success":
        return "border-green-500/30 bg-green-900/20";
      case "error":
        return "border-red-500/30 bg-red-900/20";
      case "warning":
        return "border-yellow-500/30 bg-yellow-900/20";
      case "info":
      default:
        return "border-blue-500/30 bg-blue-900/20";
    }
  };

  const markAsRead = (id: string) => {
    dispatch({ type: "MARK_NOTIFICATION_READ", payload: id });
  };

  const markAllAsRead = () => {
    notifications.forEach((notification) => {
      if (!notification.isRead) {
        dispatch({ type: "MARK_NOTIFICATION_READ", payload: notification.id });
      }
    });
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Notification Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 top-full mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <h3 className="font-semibold text-white">Notifications</h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      Mark all read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <X size={14} />
                  </Button>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-400">
                    <Bell size={24} className="mx-auto mb-2 opacity-50" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-3 border-l-2 cursor-pointer transition-colors hover:bg-gray-700/50 ${getColorClasses(
                          notification.type,
                        )} ${notification.isRead ? "opacity-70" : ""}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          {getIcon(notification.type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <h4 className="font-medium text-white text-sm">
                                {notification.title}
                              </h4>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-gray-300 text-xs mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                              {new Date(
                                notification.timestamp,
                              ).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
