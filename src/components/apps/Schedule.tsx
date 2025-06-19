import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Bell,
  Plus,
  MapPin,
  Users,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

interface ScheduleProps {
  onBack: () => void;
}

export function Schedule({ onBack }: ScheduleProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const upcomingReleases = [
    {
      id: 1,
      title: "Coffee Shop Chronicles",
      chapter: "Chapter 6: The Confession",
      releaseDate: "Today, 2:00 PM",
      timeUntil: "2h 15m",
      description: "Sarah finally reveals her secret to Marcus",
      author: "DramaLover23",
      expectedLength: "15-20 min read",
      remindersSet: 245,
      isToday: true,
    },
    {
      id: 2,
      title: "University Drama",
      chapter: "Chapter 2: Roommate Revenge",
      releaseDate: "Tomorrow, 9:00 AM",
      timeUntil: "18h 45m",
      description: "Emma discovers what her roommate has been hiding",
      author: "CampusSecrets",
      expectedLength: "12-15 min read",
      remindersSet: 189,
      isToday: false,
    },
    {
      id: 3,
      title: "Office Romance",
      chapter: "Chapter 4: The Meeting",
      releaseDate: "Wed, 6:00 PM",
      timeUntil: "2d 6h",
      description: "The forbidden office relationship reaches a breaking point",
      author: "WorkplaceTales",
      expectedLength: "18-22 min read",
      remindersSet: 312,
      isToday: false,
    },
    {
      id: 4,
      title: "Neighborhood Secrets",
      chapter: "Chapter 8: Property Lines",
      releaseDate: "Friday, 3:00 PM",
      timeUntil: "4d 3h",
      description: "The HOA drama escalates to legal action",
      author: "SuburbWatch",
      expectedLength: "20-25 min read",
      remindersSet: 156,
      isToday: false,
    },
  ];

  const liveEvents = [
    {
      id: 1,
      title: "Drama at Central Mall",
      location: "Downtown Mall Food Court",
      startTime: "Now",
      duration: "Live",
      viewers: 1247,
      type: "Live Drama",
      description: "Heated argument between ex-lovers",
    },
    {
      id: 2,
      title: "Community Meeting Showdown",
      location: "City Hall, Main Room",
      startTime: "7:00 PM",
      duration: "2 hours",
      viewers: 0,
      type: "Scheduled Event",
      description: "Neighbors clash over new construction project",
    },
    {
      id: 3,
      title: "University Board Meeting",
      location: "State University, Admin Building",
      startTime: "Tomorrow, 10:00 AM",
      duration: "3 hours",
      viewers: 0,
      type: "Scheduled Event",
      description: "Students protest tuition increases",
    },
  ];

  const myReminders = [
    {
      id: 1,
      title: "Coffee Shop Chronicles Ch. 6",
      time: "2:00 PM Today",
      type: "Story Release",
      isActive: true,
    },
    {
      id: 2,
      title: "Weekly Drama Digest",
      time: "Every Sunday 8:00 PM",
      type: "Weekly Summary",
      isActive: true,
    },
    {
      id: 3,
      title: "Community Drama Alert",
      time: "When stories drop near you",
      type: "Location Alert",
      isActive: false,
    },
  ];

  const getTimeColor = (isToday: boolean, timeUntil: string) => {
    if (isToday) return "text-red-400";
    if (timeUntil.includes("h")) return "text-orange-400";
    return "text-gray-400";
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
        <h1 className="text-lg font-semibold">Schedule</h1>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30"
      >
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-purple-400">4</div>
            <div className="text-xs text-gray-400">Releases Today</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">12</div>
            <div className="text-xs text-gray-400">This Week</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">3</div>
            <div className="text-xs text-gray-400">Reminders Set</div>
          </div>
        </div>
      </motion.div>

      {/* Content Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="releases" className="h-full flex flex-col">
          <TabsList className="mx-4 mb-4 bg-gray-900 border-gray-700">
            <TabsTrigger
              value="releases"
              className="data-[state=active]:bg-purple-600"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Releases
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="data-[state=active]:bg-blue-600"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger
              value="reminders"
              className="data-[state=active]:bg-green-600"
            >
              <Bell className="w-4 h-4 mr-2" />
              Reminders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="releases" className="flex-1 overflow-y-auto px-4">
            <h3 className="font-semibold mb-4 text-gray-300">
              Upcoming Story Releases
            </h3>
            {upcomingReleases.map((release, index) => (
              <motion.div
                key={release.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gray-900/50 rounded-lg p-4 mb-3 cursor-pointer hover:bg-gray-800/50 transition-colors border ${
                  release.isToday
                    ? "border-purple-500/50 bg-purple-900/20"
                    : "border-gray-800"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">
                      {release.title}
                    </h3>
                    <p className="text-purple-300 text-sm font-medium mb-2">
                      {release.chapter}
                    </p>
                    <p className="text-gray-300 text-sm mb-3">
                      {release.description}
                    </p>
                  </div>
                  {release.isToday && (
                    <Badge className="bg-red-500 text-white">Today</Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4 text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span
                        className={getTimeColor(
                          release.isToday,
                          release.timeUntil,
                        )}
                      >
                        {release.timeUntil}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-3 h-3" />
                      <span>{release.expectedLength}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Bell className="w-3 h-3" />
                      <span>{release.remindersSet}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
                  <span className="text-xs text-gray-400">
                    by {release.author}
                  </span>
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-xs px-3 py-1"
                  >
                    Set Reminder
                  </Button>
                </div>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="events" className="flex-1 overflow-y-auto px-4">
            <h3 className="font-semibold mb-4 text-gray-300">Live Events</h3>
            {liveEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gray-900/50 rounded-lg p-4 mb-3 cursor-pointer hover:bg-gray-800/50 transition-colors border ${
                  event.startTime === "Now"
                    ? "border-red-500/50 bg-red-900/20"
                    : "border-gray-800"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-white">
                        {event.title}
                      </h3>
                      {event.startTime === "Now" && (
                        <Badge className="bg-red-500 text-white animate-pulse">
                          LIVE
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                      <MapPin className="w-3 h-3" />
                      <span>{event.location}</span>
                    </div>
                    <p className="text-gray-300 text-sm">{event.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4 text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{event.startTime}</span>
                    </div>
                    <span>Duration: {event.duration}</span>
                    {event.viewers > 0 && (
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{event.viewers} watching</span>
                      </div>
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className="border-blue-500 text-blue-400"
                  >
                    {event.type}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent
            value="reminders"
            className="flex-1 overflow-y-auto px-4"
          >
            <h3 className="font-semibold mb-4 text-gray-300">My Reminders</h3>
            {myReminders.map((reminder, index) => (
              <motion.div
                key={reminder.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900/50 rounded-lg p-4 mb-3 border border-gray-800 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      reminder.isActive ? "bg-green-500" : "bg-gray-500"
                    }`}
                  ></div>
                  <div>
                    <h3 className="font-medium text-white">{reminder.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-400 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{reminder.time}</span>
                      <Badge
                        variant="outline"
                        className="border-gray-600 text-gray-400 text-xs"
                      >
                        {reminder.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${
                    reminder.isActive
                      ? "text-green-400 hover:text-green-300"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Bell
                    className={`w-4 h-4 ${reminder.isActive ? "fill-current" : ""}`}
                  />
                </Button>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-800">
        <Button className="w-full bg-purple-600 hover:bg-purple-700 mb-2">
          <Plus className="w-4 h-4 mr-2" />
          Create Custom Reminder
        </Button>
        <Button
          variant="outline"
          className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          <Calendar className="w-4 h-4 mr-2" />
          View Full Calendar
        </Button>
      </div>
    </div>
  );
}
