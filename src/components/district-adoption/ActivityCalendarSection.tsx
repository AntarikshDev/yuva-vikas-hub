import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Calendar, CheckCircle, Clock, AlertTriangle, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { activityCalendarTemplate } from '@/data/jharkhandCensusData';

interface ActivityItem {
  id: string;
  day: number;
  activity: string;
  duration: number;
  category: string;
  isCompleted: boolean;
  notes: string;
  completedDate?: string;
}

interface EventCalendar {
  eventId: string;
  eventName: string;
  eventType: 'mela' | 'sabha';
  startDate: string;
  activities: ActivityItem[];
}

interface ActivityCalendarSectionProps {
  canEdit: boolean;
}

export const ActivityCalendarSection: React.FC<ActivityCalendarSectionProps> = ({ canEdit }) => {
  const [selectedEventId, setSelectedEventId] = useState<string>('event-1');
  
  // Mock event calendars
  const [eventCalendars, setEventCalendars] = useState<EventCalendar[]>([
    {
      eventId: 'event-1',
      eventName: 'Rozgar Mela - Ranchi (Kanke)',
      eventType: 'mela',
      startDate: '2024-02-01',
      activities: activityCalendarTemplate.map((t, i) => ({
        id: `act-${i}`,
        ...t,
        isCompleted: i < 3,
        notes: '',
        completedDate: i < 3 ? '2024-02-0' + (t.day + 1) : undefined
      }))
    },
    {
      eventId: 'event-2',
      eventName: 'Rozgar Sabha - Hazaribagh (Bishnugarh)',
      eventType: 'sabha',
      startDate: '2024-02-05',
      activities: activityCalendarTemplate.map((t, i) => ({
        id: `act-${i}`,
        ...t,
        isCompleted: i < 2,
        notes: '',
        completedDate: i < 2 ? '2024-02-0' + (t.day + 5) : undefined
      }))
    }
  ]);

  const selectedCalendar = eventCalendars.find(c => c.eventId === selectedEventId);
  const completedCount = selectedCalendar?.activities.filter(a => a.isCompleted).length || 0;
  const totalActivities = selectedCalendar?.activities.length || 0;
  const progressPercent = totalActivities > 0 ? (completedCount / totalActivities) * 100 : 0;

  const toggleActivityComplete = (activityId: string) => {
    setEventCalendars(prev => prev.map(cal => {
      if (cal.eventId === selectedEventId) {
        return {
          ...cal,
          activities: cal.activities.map(act => {
            if (act.id === activityId) {
              const newCompleted = !act.isCompleted;
              if (newCompleted) {
                toast.success(`Activity "${act.activity}" marked as completed`);
              }
              return {
                ...act,
                isCompleted: newCompleted,
                completedDate: newCompleted ? new Date().toISOString().split('T')[0] : undefined
              };
            }
            return act;
          })
        };
      }
      return cal;
    }));
  };

  const updateActivityNotes = (activityId: string, notes: string) => {
    setEventCalendars(prev => prev.map(cal => {
      if (cal.eventId === selectedEventId) {
        return {
          ...cal,
          activities: cal.activities.map(act => 
            act.id === activityId ? { ...act, notes } : act
          )
        };
      }
      return cal;
    }));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'preparation': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'outreach': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'event': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'followup': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'planning': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      case 'migration': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (activity: ActivityItem) => {
    if (activity.isCompleted) return <CheckCircle className="h-5 w-5 text-green-500" />;
    const today = new Date();
    const startDate = new Date(selectedCalendar?.startDate || today);
    const activityDate = new Date(startDate);
    activityDate.setDate(activityDate.getDate() + activity.day - 1);
    
    if (activityDate < today) return <AlertTriangle className="h-5 w-5 text-red-500" />;
    return <Clock className="h-5 w-5 text-amber-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Event Selector & Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              18-Day Activity Calendar
            </CardTitle>
            <CardDescription>Track activities from desk work to candidate migration</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedEventId} onValueChange={setSelectedEventId}>
              <SelectTrigger>
                <SelectValue placeholder="Select event" />
              </SelectTrigger>
              <SelectContent>
                {eventCalendars.map(cal => (
                  <SelectItem key={cal.eventId} value={cal.eventId}>
                    {cal.eventName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-4xl font-bold">{completedCount}/{totalActivities}</p>
              <p className="text-sm text-muted-foreground">Activities Completed</p>
              <Progress value={progressPercent} className="mt-3 h-3" />
              <p className="text-sm mt-2 font-medium">{Math.round(progressPercent)}% Complete</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gantt-style Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
          <CardDescription>
            Started: {selectedCalendar?.startDate ? new Date(selectedCalendar.startDate).toLocaleDateString() : '-'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Day headers */}
          <div className="mb-4 overflow-x-auto">
            <div className="flex gap-1 min-w-[900px]">
              {Array.from({ length: 18 }, (_, i) => i + 1).map(day => (
                <div 
                  key={day} 
                  className="w-12 h-8 flex items-center justify-center text-xs font-medium bg-muted rounded"
                >
                  D{day}
                </div>
              ))}
            </div>
          </div>

          {/* Activities */}
          <div className="space-y-3">
            {selectedCalendar?.activities.map((activity) => {
              const startCol = activity.day;
              const endCol = activity.day + activity.duration - 1;
              
              return (
                <div key={activity.id} className="flex items-start gap-4">
                  {/* Activity Info */}
                  <div className="w-64 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={activity.isCompleted}
                        onCheckedChange={() => toggleActivityComplete(activity.id)}
                        disabled={!canEdit}
                      />
                      <div className="flex-1">
                        <p className={`font-medium text-sm ${activity.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                          {activity.activity}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-xs ${getCategoryColor(activity.category)}`}>
                            {activity.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Day {startCol}{endCol > startCol ? `-${endCol}` : ''}
                          </span>
                        </div>
                      </div>
                      {getStatusIcon(activity)}
                    </div>
                  </div>

                  {/* Gantt Bar */}
                  <div className="flex-1 overflow-x-auto">
                    <div className="flex gap-1 min-w-[900px]">
                      {Array.from({ length: 18 }, (_, i) => i + 1).map(day => {
                        const isInRange = day >= startCol && day <= endCol;
                        const isStart = day === startCol;
                        const isEnd = day === endCol;
                        
                        return (
                          <div
                            key={day}
                            className={`w-12 h-8 flex items-center justify-center text-xs ${
                              isInRange 
                                ? `${activity.isCompleted ? 'bg-green-500' : 'bg-primary'} text-white ${isStart ? 'rounded-l' : ''} ${isEnd ? 'rounded-r' : ''}`
                                : 'bg-muted/30'
                            }`}
                          >
                            {isInRange && isStart && <ChevronRight className="h-4 w-4" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Activity Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedCalendar?.activities.map((activity) => (
          <Card key={activity.id} className={activity.isCompleted ? 'border-green-500/50' : ''}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between mb-2">
                <Badge className={getCategoryColor(activity.category)}>
                  Day {activity.day}-{activity.day + activity.duration - 1}
                </Badge>
                {getStatusIcon(activity)}
              </div>
              <h4 className={`font-semibold ${activity.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                {activity.activity}
              </h4>
              {activity.completedDate && (
                <p className="text-xs text-muted-foreground mt-1">
                  Completed: {new Date(activity.completedDate).toLocaleDateString()}
                </p>
              )}
              <Textarea
                placeholder="Add notes..."
                className="mt-3 text-sm h-20"
                value={activity.notes}
                onChange={(e) => updateActivityNotes(activity.id, e.target.value)}
                disabled={!canEdit}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Legend */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { label: 'Preparation', category: 'preparation' },
              { label: 'Outreach', category: 'outreach' },
              { label: 'Event', category: 'event' },
              { label: 'Follow-up', category: 'followup' },
              { label: 'Planning', category: 'planning' },
              { label: 'Migration', category: 'migration' }
            ].map(item => (
              <div key={item.category} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${getCategoryColor(item.category)}`}></div>
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
